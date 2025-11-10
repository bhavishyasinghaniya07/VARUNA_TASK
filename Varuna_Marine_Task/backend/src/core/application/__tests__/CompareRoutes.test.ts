import { CompareRoutes } from "../CompareRoutes";
import { Route } from "../../domain/Route";

describe("CompareRoutes", () => {
  it("should compare routes with baseline", () => {
    const useCase = new CompareRoutes();
    const routes: Route[] = [
      {
        id: "1",
        routeId: "R001",
        vesselType: "Container",
        fuelType: "HFO",
        year: 2024,
        ghgIntensity: 91.0,
        fuelConsumption: 5000,
        distance: 12000,
        totalEmissions: 4500,
        isBaseline: true,
      },
      {
        id: "2",
        routeId: "R002",
        vesselType: "BulkCarrier",
        fuelType: "LNG",
        year: 2024,
        ghgIntensity: 88.0,
        fuelConsumption: 4800,
        distance: 11500,
        totalEmissions: 4200,
        isBaseline: false,
      },
    ];

    const comparisons = useCase.execute(routes);

    expect(comparisons).toHaveLength(1);
    expect(comparisons[0].baseline.routeId).toBe("R001");
    expect(comparisons[0].route.routeId).toBe("R002");
    expect(comparisons[0].percentDiff).toBeCloseTo(-3.3, 1);
  });
});

