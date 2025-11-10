import { BankEntry, BankApplication } from "../domain/BankEntry";

export interface BankEntryRepository {
  findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
  save(entry: BankEntry): Promise<BankEntry>;
  update(entry: BankEntry): Promise<BankEntry>;
  saveApplication(application: BankApplication): Promise<BankApplication>;
  getAppliedAmount(shipId: string, year: number): Promise<number>;
}

