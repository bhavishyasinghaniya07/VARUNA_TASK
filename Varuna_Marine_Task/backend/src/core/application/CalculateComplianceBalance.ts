import { ComplianceBalance } from "../domain/ComplianceBalance";
import { Route } from "../domain/Route";
import { TARGET_GHG_INTENSITY_2025, ENERGY_PER_TONNE_FUEL_MJ } from "../domain/constants";

export class CalculateComplianceBalance {
  execute(routes: Route[], shipId: string, year: number): ComplianceBalance {
    const yearRoutes = routes.filter((r) => r.year === year);
    
    let totalEnergyMJ = 0;
    let weightedGhgIntensity = 0;

    for (const route of yearRoutes) {
      const energyMJ = route.fuelConsumption * ENERGY_PER_TONNE_FUEL_MJ;
      totalEnergyMJ += energyMJ;
      weightedGhgIntensity += route.ghgIntensity * energyMJ;
    }

    const averageGhgIntensity = totalEnergyMJ > 0 
      ? weightedGhgIntensity / totalEnergyMJ 
      : 0;

    const cbGco2eq = (TARGET_GHG_INTENSITY_2025 - averageGhgIntensity) * totalEnergyMJ;

    return {
      shipId,
      year,
      cbGco2eq: cbGco2eq / 1000000,
    };
  }
}

