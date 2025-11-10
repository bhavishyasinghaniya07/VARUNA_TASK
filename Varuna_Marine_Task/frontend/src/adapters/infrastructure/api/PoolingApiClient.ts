import axios from "axios";
import { PoolingRepository } from "../../../core/ports/PoolingRepository";
import { Pool } from "../../../core/domain/Pool";

export class PoolingApiClient implements PoolingRepository {
  private baseUrl = "/api";

  async createPool(year: number, shipIds: string[]): Promise<Pool> {
    const response = await axios.post<Pool>(`${this.baseUrl}/pools`, {
      year,
      shipIds,
    });
    return response.data;
  }
}

