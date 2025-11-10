import { Pool } from "../domain/Pool";

export interface PoolingRepository {
  createPool(year: number, shipIds: string[]): Promise<Pool>;
}

