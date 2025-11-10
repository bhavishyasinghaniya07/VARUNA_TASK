import { ComplianceBalance, AdjustedComplianceBalance } from "../domain/ComplianceBalance";

export interface ComplianceRepository {
  getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance>;
  getAdjustedComplianceBalance(shipId: string, year: number): Promise<AdjustedComplianceBalance>;
}

