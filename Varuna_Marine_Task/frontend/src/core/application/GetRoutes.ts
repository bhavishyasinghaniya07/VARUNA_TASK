import { Route } from "../domain/Route";
import { RouteRepository } from "../ports/RouteRepository";

export class GetRoutes {
  constructor(private routeRepository: RouteRepository) {}

  async execute(): Promise<Route[]> {
    return this.routeRepository.findAll();
  }
}

