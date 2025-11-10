import { Pool } from "../domain/Pool";

export interface PoolRepository {
  save(pool: Pool): Promise<Pool>;
  findByYear(year: number): Promise<Pool[]>;
}

