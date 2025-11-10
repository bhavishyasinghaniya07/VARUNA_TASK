import { BankEntryRepository } from "../../../core/ports/BankEntryRepository";
import { BankEntry } from "../../../core/domain/BankEntry";
import { DatabasePool } from "../../../infrastructure/db/pool";

export class BankEntryRepositoryImpl implements BankEntryRepository {
  constructor(private db: DatabasePool) {}

  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
    const result = await this.db.query(
      "SELECT * FROM bank_entries WHERE ship_id = $1 AND year = $2 ORDER BY created_at",
      [shipId, year]
    );
    return result.rows.map(this.mapRowToBankEntry);
  }

  async save(entry: BankEntry): Promise<BankEntry> {
    const result = await this.db.query(
      "INSERT INTO bank_entries (ship_id, year, amount_gco2eq) VALUES ($1, $2, $3) RETURNING *",
      [entry.shipId, entry.year, entry.amountGco2eq]
    );
    return this.mapRowToBankEntry(result.rows[0]);
  }

  async update(entry: BankEntry): Promise<BankEntry> {
    if (!entry.id) {
      throw new Error("BankEntry id is required for update");
    }
    await this.db.query(
      "UPDATE bank_entries SET amount_gco2eq = $1 WHERE id = $2",
      [entry.amountGco2eq, entry.id]
    );
    return entry;
  }

  async saveApplication(application: BankApplication): Promise<BankApplication> {
    const result = await this.db.query(
      "INSERT INTO bank_applications (ship_id, year, amount_gco2eq) VALUES ($1, $2, $3) RETURNING *",
      [application.shipId, application.year, application.amountGco2eq]
    );
    return {
      id: result.rows[0].id.toString(),
      shipId: result.rows[0].ship_id,
      year: result.rows[0].year,
      amountGco2eq: parseFloat(result.rows[0].amount_gco2eq),
      createdAt: result.rows[0].created_at,
    };
  }

  async getAppliedAmount(shipId: string, year: number): Promise<number> {
    const result = await this.db.query(
      "SELECT COALESCE(SUM(amount_gco2eq), 0) as total FROM bank_applications WHERE ship_id = $1 AND year = $2",
      [shipId, year]
    );
    return parseFloat(result.rows[0].total);
  }

  private mapRowToBankEntry(row: any): BankEntry {
    return {
      id: row.id.toString(),
      shipId: row.ship_id,
      year: row.year,
      amountGco2eq: parseFloat(row.amount_gco2eq),
      appliedAmountGco2eq: row.applied_amount_gco2eq ? parseFloat(row.applied_amount_gco2eq) : 0,
      createdAt: row.created_at,
    };
  }
}

