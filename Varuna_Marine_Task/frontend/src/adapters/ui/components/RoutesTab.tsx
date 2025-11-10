import { useState, useEffect } from "react";
import { Route as RouteDomain, VesselType, FuelType } from "../../../core/domain/Route";
import { RouteApiClient } from "../../infrastructure/api/RouteApiClient";
import { GetRoutes } from "../../../core/application/GetRoutes";
import { SetBaseline } from "../../../core/application/SetBaseline";

const routeRepository = new RouteApiClient();
const getRoutes = new GetRoutes(routeRepository);
const setBaseline = new SetBaseline(routeRepository);

export default function RoutesTab() {
  const [routes, setRoutes] = useState<RouteDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    vesselType: string;
    fuelType: string;
    year: string;
  }>({
    vesselType: "",
    fuelType: "",
    year: "",
  });

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const data = await getRoutes.execute();
      setRoutes(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load routes");
    } finally {
      setLoading(false);
    }
  };

  const handleSetBaseline = async (routeId: string) => {
    try {
      await setBaseline.execute(routeId);
      await loadRoutes();
    } catch (err: any) {
      setError(err.message || "Failed to set baseline");
    }
  };

  const filteredRoutes = routes.filter((route) => {
    if (filters.vesselType && route.vesselType !== filters.vesselType) return false;
    if (filters.fuelType && route.fuelType !== filters.fuelType) return false;
    if (filters.year && route.year.toString() !== filters.year) return false;
    return true;
  });

  const uniqueVesselTypes = Array.from(new Set(routes.map((r) => r.vesselType)));
  const uniqueFuelTypes = Array.from(new Set(routes.map((r) => r.fuelType)));
  const uniqueYears = Array.from(new Set(routes.map((r) => r.year))).sort();

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Routes</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vessel Type</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={filters.vesselType}
              onChange={(e) => setFilters({ ...filters, vesselType: e.target.value })}
            >
              <option value="">All</option>
              {uniqueVesselTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={filters.fuelType}
              onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
            >
              <option value="">All</option>
              {uniqueFuelTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            >
              <option value="">All</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vessel Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuel Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GHG Intensity (gCO₂e/MJ)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuel Consumption (t)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distance (km)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Emissions (t)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoutes.map((route) => (
                <tr key={route.id} className={route.isBaseline ? "bg-blue-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {route.routeId}
                    {route.isBaseline && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Baseline
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.vesselType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.fuelType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.ghgIntensity.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.fuelConsumption.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.distance.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.totalEmissions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {!route.isBaseline && (
                      <button
                        onClick={() => handleSetBaseline(route.routeId)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Set Baseline
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

