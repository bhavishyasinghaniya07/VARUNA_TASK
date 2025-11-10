import axios from "axios";
import { BankingRepository } from "../../../core/ports/BankingRepository";
import { BankEntry } from "../../../core/domain/BankEntry";
import { AdjustedComplianceBalance } from "../../../core/domain/ComplianceBalance";

export class BankingApiClient implements BankingRepository {
  private baseUrl = "/api";

  async getBankRecords(shipId: string, year: number): Promise<BankEntry[]> {
    const response = await axios.get<BankEntry[]>(`${this.baseUrl}/banking/records`, {
      params: { shipId, year },
    });
    return response.data;
  }

  async bankSurplus(shipId: string, year: number): Promise<BankEntry> {
    const response = await axios.post<BankEntry>(`${this.baseUrl}/banking/bank`, {
      shipId,
      year,
    });
    return response.data;
  }

  async applyBanked(shipId: string, year: number, amountGco2eq: number): Promise<AdjustedComplianceBalance> {
    const response = await axios.post<AdjustedComplianceBalance>(`${this.baseUrl}/banking/apply`, {
      shipId,
      year,
      amountGco2eq,
    });
    return response.data;
  }
}

