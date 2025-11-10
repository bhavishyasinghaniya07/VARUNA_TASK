import { Route, RouteComparison } from "../domain/Route";
import { COMPLIANCE_THRESHOLD } from "../domain/constants";

export class CompareRoutes {
  execute(routes: Route[]): RouteComparison[] {
    const baseline = routes.find((r) => r.isBaseline);
    if (!baseline) {
      return [];
    }

    const comparisons: RouteComparison[] = [];

    for (const route of routes) {
      if (route.id === baseline.id) {
        continue;
      }

      const percentDiff = ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
      const compliant = route.ghgIntensity <= COMPLIANCE_THRESHOLD * (1 - 0.02);

      comparisons.push({
        route,
        baseline,
        percentDiff,
        compliant,
      });
    }

    return comparisons;
  }
}

