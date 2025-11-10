import { Route, RouteComparison } from "../domain/Route";

export interface RouteRepository {
  findAll(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  getComparison(): Promise<RouteComparison[]>;
}

