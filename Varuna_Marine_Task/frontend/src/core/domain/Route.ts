export type VesselType = "Container" | "BulkCarrier" | "Tanker" | "RoRo";
export type FuelType = "HFO" | "LNG" | "MGO" | "MDO";

export interface Route {
  id: string;
  routeId: string;
  vesselType: VesselType;
  fuelType: FuelType;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

export interface RouteComparison {
  route: Route;
  baseline: Route;
  percentDiff: number;
  compliant: boolean;
}

