import { Route } from "../domain/Route";

export interface RouteRepository {
  findAll(): Promise<Route[]>;
  findById(id: string): Promise<Route | null>;
  findByRouteId(routeId: string): Promise<Route | null>;
  update(route: Route): Promise<Route>;
  create(route: Omit<Route, "id">): Promise<Route>;
}

