import { ComplianceBalance, AdjustedComplianceBalance } from "../domain/ComplianceBalance";

export interface ComplianceBalanceRepository {
  findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null>;
  save(cb: ComplianceBalance): Promise<ComplianceBalance>;
  findAdjusted(shipId: string, year: number): Promise<AdjustedComplianceBalance | null>;
}

