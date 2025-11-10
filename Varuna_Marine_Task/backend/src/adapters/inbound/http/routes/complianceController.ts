import { Request, Response } from "express";
import { ComplianceBalanceRepository } from "../../../../core/ports/ComplianceBalanceRepository";
import { RouteRepository } from "../../../../core/ports/RouteRepository";
import { CalculateComplianceBalance } from "../../../../core/application/CalculateComplianceBalance";

export class ComplianceController {
  constructor(
    private complianceBalanceRepository: ComplianceBalanceRepository,
    private routeRepository: RouteRepository,
    private calculateComplianceBalance: CalculateComplianceBalance
  ) {}

  async getComplianceBalance(req: Request, res: Response) {
    try {
      const shipId = req.query.shipId as string;
      const year = parseInt(req.query.year as string);

      if (!shipId || !year) {
        return res.status(400).json({ error: "shipId and year are required" });
      }

      let cb = await this.complianceBalanceRepository.findByShipAndYear(shipId, year);
      
      if (!cb) {
        const routes = await this.routeRepository.findAll();
        cb = this.calculateComplianceBalance.execute(routes, shipId, year);
        cb = await this.complianceBalanceRepository.save(cb);
      }

      res.json(cb);
    } catch (error) {
      res.status(500).json({ error: "Failed to get compliance balance" });
    }
  }

  async getAdjustedComplianceBalance(req: Request, res: Response) {
    try {
      const shipId = req.query.shipId as string;
      const year = parseInt(req.query.year as string);

      if (!shipId || !year) {
        return res.status(400).json({ error: "shipId and year are required" });
      }

      const adjustedCB = await this.complianceBalanceRepository.findAdjusted(shipId, year);
      
      if (!adjustedCB) {
        return res.status(404).json({ error: "Compliance balance not found" });
      }

      res.json(adjustedCB);
    } catch (error) {
      res.status(500).json({ error: "Failed to get adjusted compliance balance" });
    }
  }
}

