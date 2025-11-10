import { Request, Response } from "express";
import { BankEntryRepository } from "../../../../core/ports/BankEntryRepository";
import { ComplianceBalanceRepository } from "../../../../core/ports/ComplianceBalanceRepository";
import { BankSurplus } from "../../../../core/application/BankSurplus";
import { ApplyBanked } from "../../../../core/application/ApplyBanked";

export class BankingController {
  constructor(
    private bankEntryRepository: BankEntryRepository,
    private complianceBalanceRepository: ComplianceBalanceRepository,
    private bankSurplus: BankSurplus,
    private applyBanked: ApplyBanked
  ) {}

  async getBankRecords(req: Request, res: Response) {
    try {
      const shipId = req.query.shipId as string;
      const year = parseInt(req.query.year as string);

      if (!shipId || !year) {
        return res.status(400).json({ error: "shipId and year are required" });
      }

      const records = await this.bankEntryRepository.findByShipAndYear(shipId, year);
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to get bank records" });
    }
  }

  async bankSurplus(req: Request, res: Response) {
    try {
      const { shipId, year } = req.body;

      if (!shipId || !year) {
        return res.status(400).json({ error: "shipId and year are required" });
      }

      const cb = await this.complianceBalanceRepository.findByShipAndYear(shipId, year);
      
      if (!cb) {
        return res.status(404).json({ error: "Compliance balance not found" });
      }

      const bankEntry = this.bankSurplus.execute(cb);
      
      if (!bankEntry) {
        return res.status(400).json({ error: "Cannot bank negative or zero compliance balance" });
      }

      const saved = await this.bankEntryRepository.save(bankEntry);
      res.json(saved);
    } catch (error) {
      res.status(500).json({ error: "Failed to bank surplus" });
    }
  }

  async applyBanked(req: Request, res: Response) {
    try {
      const { shipId, year, amountGco2eq } = req.body;

      if (!shipId || !year || amountGco2eq === undefined) {
        return res.status(400).json({ error: "shipId, year, and amountGco2eq are required" });
      }

      const cb = await this.complianceBalanceRepository.findByShipAndYear(shipId, year);
      if (!cb) {
        return res.status(404).json({ error: "Compliance balance not found" });
      }

      const bankEntries = await this.bankEntryRepository.findByShipAndYear(shipId, year);
      const appliedAmount = await this.bankEntryRepository.getAppliedAmount(shipId, year);
      const application = { shipId, year, amountGco2eq };
      
      const adjustedCB = this.applyBanked.execute(cb, bankEntries, appliedAmount, application);

      await this.bankEntryRepository.saveApplication(application);
      await this.complianceBalanceRepository.save(adjustedCB);
      res.json(adjustedCB);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to apply banked surplus" });
    }
  }
}

