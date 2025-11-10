import { RouteRepository } from "../ports/RouteRepository";

export class SetBaseline {
  constructor(private routeRepository: RouteRepository) {}

  async execute(routeId: string): Promise<void> {
    await this.routeRepository.setBaseline(routeId);
  }
}

