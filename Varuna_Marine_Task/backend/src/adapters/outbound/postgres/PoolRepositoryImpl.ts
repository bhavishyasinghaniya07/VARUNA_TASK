import { PoolRepository } from "../../../core/ports/PoolRepository";
import { Pool, PoolMember } from "../../../core/domain/Pool";
import { DatabasePool } from "../../../infrastructure/db/pool";

export class PoolRepositoryImpl implements PoolRepository {
  constructor(private db: DatabasePool) {}

  async save(pool: Pool): Promise<Pool> {
    const result = await this.db.query(
      "INSERT INTO pools (year) VALUES ($1) RETURNING *",
      [pool.year]
    );
    const poolId = result.rows[0].id;

    for (const member of pool.members) {
      await this.db.query(
        "INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after) VALUES ($1, $2, $3, $4)",
        [poolId, member.shipId, member.cbBefore, member.cbAfter]
      );
    }

    return {
      ...pool,
      id: poolId.toString(),
      createdAt: result.rows[0].created_at,
    };
  }

  async findByYear(year: number): Promise<Pool[]> {
    const poolsResult = await this.db.query("SELECT * FROM pools WHERE year = $1", [year]);
    const pools: Pool[] = [];

    for (const poolRow of poolsResult.rows) {
      const membersResult = await this.db.query(
        "SELECT * FROM pool_members WHERE pool_id = $1",
        [poolRow.id]
      );
      const members: PoolMember[] = membersResult.rows.map((row: any) => ({
        shipId: row.ship_id,
        cbBefore: parseFloat(row.cb_before),
        cbAfter: parseFloat(row.cb_after),
      }));

      pools.push({
        id: poolRow.id.toString(),
        year: poolRow.year,
        members,
        createdAt: poolRow.created_at,
      });
    }

    return pools;
  }
}

