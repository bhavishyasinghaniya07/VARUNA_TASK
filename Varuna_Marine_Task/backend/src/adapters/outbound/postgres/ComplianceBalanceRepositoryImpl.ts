import { ComplianceBalanceRepository } from "../../../core/ports/ComplianceBalanceRepository";
import { ComplianceBalance, AdjustedComplianceBalance } from "../../../core/domain/ComplianceBalance";
import { DatabasePool } from "../../../infrastructure/db/pool";
import { BankEntryRepository } from "../../../core/ports/BankEntryRepository";

export class ComplianceBalanceRepositoryImpl implements ComplianceBalanceRepository {
  constructor(
    private db: DatabasePool,
    private bankEntryRepository: BankEntryRepository
  ) {}

  async findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null> {
    const result = await this.db.query(
      "SELECT * FROM ship_compliance WHERE ship_id = $1 AND year = $2",
      [shipId, year]
    );
    if (result.rows.length === 0) return null;
    return this.mapRowToCB(result.rows[0]);
  }

  async save(cb: ComplianceBalance): Promise<ComplianceBalance> {
    const existing = await this.findByShipAndYear(cb.shipId, cb.year);
    
    if (existing) {
      await this.db.query(
        "UPDATE ship_compliance SET cb_gco2eq = $1 WHERE ship_id = $2 AND year = $3",
        [cb.cbGco2eq, cb.shipId, cb.year]
      );
      return { ...cb, id: existing.id };
    } else {
      const result = await this.db.query(
        "INSERT INTO ship_compliance (ship_id, year, cb_gco2eq) VALUES ($1, $2, $3) RETURNING *",
        [cb.shipId, cb.year, cb.cbGco2eq]
      );
      return this.mapRowToCB(result.rows[0]);
    }
  }

  async findAdjusted(shipId: string, year: number): Promise<AdjustedComplianceBalance | null> {
    const cb = await this.findByShipAndYear(shipId, year);
    if (!cb) return null;

    const bankEntries = await this.bankEntryRepository.findByShipAndYear(shipId, year);
    const appliedBanked = await this.bankEntryRepository.getAppliedAmount(shipId, year);
    const totalBanked = bankEntries.reduce((sum, entry) => sum + entry.amountGco2eq, 0);
    const availableBanked = totalBanked - appliedBanked;

    return {
      ...cb,
      appliedBanked,
      availableBanked,
    };
  }

  private mapRowToCB(row: any): ComplianceBalance {
    return {
      id: row.id.toString(),
      shipId: row.ship_id,
      year: row.year,
      cbGco2eq: parseFloat(row.cb_gco2eq),
      createdAt: row.created_at,
    };
  }
}

