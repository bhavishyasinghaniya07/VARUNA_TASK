import { useState, useEffect } from "react";
import { ComplianceBalance } from "../../../core/domain/ComplianceBalance";
import { BankEntry } from "../../../core/domain/BankEntry";
import { AdjustedComplianceBalance } from "../../../core/domain/ComplianceBalance";
import { ComplianceApiClient } from "../../infrastructure/api/ComplianceApiClient";
import { BankingApiClient } from "../../infrastructure/api/BankingApiClient";

const complianceRepository = new ComplianceApiClient();
const bankingRepository = new BankingApiClient();

export default function BankingTab() {
  const [shipId, setShipId] = useState("SHIP001");
  const [year, setYear] = useState(2024);
  const [cb, setCb] = useState<ComplianceBalance | null>(null);
  const [adjustedCB, setAdjustedCB] = useState<AdjustedComplianceBalance | null>(null);
  const [bankRecords, setBankRecords] = useState<BankEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applyAmount, setApplyAmount] = useState("");

  useEffect(() => {
    loadData();
  }, [shipId, year]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [cbData, adjustedCBData, records] = await Promise.all([
        complianceRepository.getComplianceBalance(shipId, year).catch(() => null),
        complianceRepository.getAdjustedComplianceBalance(shipId, year).catch(() => null),
        bankingRepository.getBankRecords(shipId, year).catch(() => []),
      ]);

      setCb(cbData);
      setAdjustedCB(adjustedCBData);
      setBankRecords(records);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleBank = async () => {
    try {
      setLoading(true);
      setError(null);
      await bankingRepository.bankSurplus(shipId, year);
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to bank surplus");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setLoading(true);
      setError(null);
      const amount = parseFloat(applyAmount);
      if (isNaN(amount) || amount <= 0) {
        setError("Invalid amount");
        return;
      }
      await bankingRepository.applyBanked(shipId, year, amount);
      setApplyAmount("");
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to apply banked surplus");
    } finally {
      setLoading(false);
    }
  };

  const availableBanked = bankRecords.reduce((sum, record) => sum + record.amountGco2eq, 0);
  const canBank = cb && cb.cbGco2eq > 0;
  const canApply = availableBanked > 0 && cb && cb.cbGco2eq < 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Banking</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ship ID</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={shipId}
              onChange={(e) => setShipId(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            />
          </div>
        </div>
        <button
          onClick={loadData}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Load Data
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && <div className="text-center py-8">Loading...</div>}

      {cb && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">CB Before</h3>
            <p className={`text-2xl font-bold ${cb.cbGco2eq >= 0 ? "text-green-600" : "text-red-600"}`}>
              {cb.cbGco2eq.toFixed(4)} t CO₂eq
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Available Banked</h3>
            <p className="text-2xl font-bold text-blue-600">
              {availableBanked.toFixed(4)} t CO₂eq
            </p>
          </div>
          {adjustedCB && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">CB After</h3>
              <p className={`text-2xl font-bold ${adjustedCB.cbGco2eq >= 0 ? "text-green-600" : "text-red-600"}`}>
                {adjustedCB.cbGco2eq.toFixed(4)} t CO₂eq
              </p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Bank Surplus</h2>
          <p className="text-sm text-gray-600 mb-4">
            Bank positive compliance balance for future use.
          </p>
          <button
            onClick={handleBank}
            disabled={!canBank || loading}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Bank Surplus
          </button>
          {!canBank && cb && (
            <p className="text-sm text-red-600 mt-2">CB must be positive to bank</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Apply Banked Surplus</h2>
          <p className="text-sm text-gray-600 mb-4">
            Apply banked surplus to offset deficit.
          </p>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            placeholder="Amount (t CO₂eq)"
            value={applyAmount}
            onChange={(e) => setApplyAmount(e.target.value)}
            disabled={!canApply || loading}
          />
          <button
            onClick={handleApply}
            disabled={!canApply || loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Apply Banked
          </button>
          {!canApply && (
            <p className="text-sm text-red-600 mt-2">
              {availableBanked === 0 ? "No banked surplus available" : "CB must be negative to apply"}
            </p>
          )}
        </div>
      </div>

      {bankRecords.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Bank Records</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ship ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount (t CO₂eq)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bankRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.shipId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.amountGco2eq.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.createdAt ? new Date(record.createdAt).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

