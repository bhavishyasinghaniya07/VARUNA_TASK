import { useState, useEffect } from "react";
import { AdjustedComplianceBalance } from "../../../core/domain/ComplianceBalance";
import { Pool, PoolMember } from "../../../core/domain/Pool";
import { ComplianceApiClient } from "../../infrastructure/api/ComplianceApiClient";
import { PoolingApiClient } from "../../infrastructure/api/PoolingApiClient";

const complianceRepository = new ComplianceApiClient();
const poolingRepository = new PoolingApiClient();

const AVAILABLE_SHIPS = ["SHIP001", "SHIP002", "SHIP003", "SHIP004", "SHIP005"];

export default function PoolingTab() {
  const [year, setYear] = useState(2024);
  const [selectedShipIds, setSelectedShipIds] = useState<string[]>([]);
  const [adjustedCBs, setAdjustedCBs] = useState<Map<string, AdjustedComplianceBalance>>(new Map());
  const [pool, setPool] = useState<Pool | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAdjustedCBs();
  }, [year, selectedShipIds]);

  const loadAdjustedCBs = async () => {
    if (selectedShipIds.length === 0) {
      setAdjustedCBs(new Map());
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const cbMap = new Map<string, AdjustedComplianceBalance>();
      for (const shipId of selectedShipIds) {
        try {
          const cb = await complianceRepository.getAdjustedComplianceBalance(shipId, year);
          cbMap.set(shipId, cb);
        } catch (err) {
          console.warn(`Failed to load CB for ${shipId}:`, err);
        }
      }
      setAdjustedCBs(cbMap);
    } catch (err: any) {
      setError(err.message || "Failed to load compliance balances");
    } finally {
      setLoading(false);
    }
  };

  const handleShipToggle = (shipId: string) => {
    setSelectedShipIds((prev) =>
      prev.includes(shipId) ? prev.filter((id) => id !== shipId) : [...prev, shipId]
    );
    setPool(null);
  };

  const handleCreatePool = async () => {
    try {
      setLoading(true);
      setError(null);

      if (selectedShipIds.length === 0) {
        setError("Please select at least one ship");
        return;
      }

      const createdPool = await poolingRepository.createPool(year, selectedShipIds);
      setPool(createdPool);
    } catch (err: any) {
      setError(err.message || "Failed to create pool");
    } finally {
      setLoading(false);
    }
  };

  const totalCb = Array.from(adjustedCBs.values()).reduce((sum, cb) => sum + cb.cbGco2eq, 0);
  const canCreatePool = selectedShipIds.length > 0 && totalCb >= 0 && adjustedCBs.size === selectedShipIds.length;

  const validatePool = (): string | null => {
    if (selectedShipIds.length === 0) return "Please select at least one ship";
    if (adjustedCBs.size !== selectedShipIds.length) return "Loading compliance balances...";
    if (totalCb < 0) return "Pool sum is negative. Cannot create pool.";

    for (const cb of adjustedCBs.values()) {
      if (cb.cbGco2eq < 0) {
        const availableBanked = cb.availableBanked || 0;
        if (Math.abs(cb.cbGco2eq) > availableBanked + totalCb) {
          return `Ship ${cb.shipId} deficit cannot be covered by pool`;
        }
      }
    }

    return null;
  };

  const validationError = validatePool();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Pooling</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Ships</label>
          <div className="space-y-2">
            {AVAILABLE_SHIPS.map((shipId) => (
              <label key={shipId} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedShipIds.includes(shipId)}
                  onChange={() => handleShipToggle(shipId)}
                />
                <span>{shipId}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className={`p-4 rounded-md ${totalCb >= 0 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            <p className="text-sm font-medium">
              Pool Sum:{" "}
              <span className={totalCb >= 0 ? "text-green-700" : "text-red-700"}>
                {totalCb.toFixed(4)} t CO₂eq
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={handleCreatePool}
          disabled={!canCreatePool || loading || !!validationError}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Create Pool
        </button>

        {validationError && (
          <p className="text-sm text-red-600 mt-2">{validationError}</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && <div className="text-center py-8">Loading...</div>}

      {selectedShipIds.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Pool Members</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ship ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CB Before
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CB After
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedShipIds.map((shipId) => {
                  const cb = adjustedCBs.get(shipId);
                  const poolMember = pool?.members.find((m) => m.shipId === shipId);
                  const cbBefore = cb?.cbGco2eq || 0;
                  const cbAfter = poolMember?.cbAfter || cbBefore;
                  const change = cbAfter - cbBefore;

                  return (
                    <tr key={shipId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {shipId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={cbBefore >= 0 ? "text-green-600" : "text-red-600"}>
                          {cbBefore.toFixed(4)} t CO₂eq
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={cbAfter >= 0 ? "text-green-600" : "text-red-600"}>
                          {cbAfter.toFixed(4)} t CO₂eq
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={change >= 0 ? "text-green-600" : "text-red-600"}>
                          {change >= 0 ? "+" : ""}
                          {change.toFixed(4)} t CO₂eq
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

