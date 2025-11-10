import { BankEntry } from "../domain/BankEntry";
import { ComplianceBalance, AdjustedComplianceBalance } from "../domain/ComplianceBalance";

export interface BankingRepository {
  getBankRecords(shipId: string, year: number): Promise<BankEntry[]>;
  bankSurplus(shipId: string, year: number): Promise<BankEntry>;
  applyBanked(shipId: string, year: number, amountGco2eq: number): Promise<AdjustedComplianceBalance>;
}

