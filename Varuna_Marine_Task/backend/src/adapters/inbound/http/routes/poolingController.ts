import { Request, Response } from "express";
import { PoolRepository } from "../../../../core/ports/PoolRepository";
import { ComplianceBalanceRepository } from "../../../../core/ports/ComplianceBalanceRepository";
import { CreatePool } from "../../../../core/application/CreatePool";

export class PoolingController {
  constructor(
    private poolRepository: PoolRepository,
    private complianceBalanceRepository: ComplianceBalanceRepository,
    private createPool: CreatePool
  ) {}

  async createPool(req: Request, res: Response) {
    try {
      const { year, shipIds } = req.body;

      if (!year || !shipIds || !Array.isArray(shipIds)) {
        return res.status(400).json({ error: "year and shipIds array are required" });
      }

      const adjustedCBs = await Promise.all(
        shipIds.map((shipId: string) =>
          this.complianceBalanceRepository.findAdjusted(shipId, year)
        )
      );

      const missing = adjustedCBs.findIndex((cb) => !cb);
      if (missing >= 0) {
        return res.status(404).json({ error: `Compliance balance not found for shipId: ${shipIds[missing]}` });
      }

      const pool = this.createPool.execute(year, shipIds, adjustedCBs as any);
      const saved = await this.poolRepository.save(pool);

      res.json(saved);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create pool" });
    }
  }
}

