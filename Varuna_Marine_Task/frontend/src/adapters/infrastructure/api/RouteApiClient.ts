import axios from "axios";
import { RouteRepository } from "../../../core/ports/RouteRepository";
import { Route, RouteComparison } from "../../../core/domain/Route";

export class RouteApiClient implements RouteRepository {
  private baseUrl = "/api";

  async findAll(): Promise<Route[]> {
    const response = await axios.get<Route[]>(`${this.baseUrl}/routes`);
    return response.data;
  }

  async setBaseline(routeId: string): Promise<void> {
    await axios.post(`${this.baseUrl}/routes/${routeId}/baseline`);
  }

  async getComparison(): Promise<RouteComparison[]> {
    const response = await axios.get<RouteComparison[]>(`${this.baseUrl}/routes/comparison`);
    return response.data;
  }
}

