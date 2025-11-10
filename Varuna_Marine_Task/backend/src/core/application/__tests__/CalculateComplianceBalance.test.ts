import { CalculateComplianceBalance } from "../CalculateComplianceBalance";
import { Route } from "../../domain/Route";

describe("CalculateComplianceBalance", () => {
  it("should calculate compliance balance correctly", () => {
    const useCase = new CalculateComplianceBalance();
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
        isBaseline: false,
      },
    ];

    const cb = useCase.execute(routes, "SHIP001", 2024);

    expect(cb.shipId).toBe("SHIP001");
    expect(cb.year).toBe(2024);
    // Calculation: (89.3368 - 91.0) × (5000 × 41000) / 1000000 = -340.956 t CO₂eq
    expect(cb.cbGco2eq).toBeCloseTo(-340.956, 2);
  });

  it("should handle empty routes", () => {
    const useCase = new CalculateComplianceBalance();
    const routes: Route[] = [];

    const cb = useCase.execute(routes, "SHIP001", 2024);

    expect(cb.cbGco2eq).toBe(0);
  });
});

