import axios from "axios";
import { ComplianceRepository } from "../../../core/ports/ComplianceRepository";
import { ComplianceBalance, AdjustedComplianceBalance } from "../../../core/domain/ComplianceBalance";

export class ComplianceApiClient implements ComplianceRepository {
  private baseUrl = "/api";

  async getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance> {
    const response = await axios.get<ComplianceBalance>(`${this.baseUrl}/compliance/cb`, {
      params: { shipId, year },
    });
    return response.data;
  }

  async getAdjustedComplianceBalance(shipId: string, year: number): Promise<AdjustedComplianceBalance> {
    const response = await axios.get<AdjustedComplianceBalance>(`${this.baseUrl}/compliance/adjusted-cb`, {
      params: { shipId, year },
    });
    return response.data;
  }
}

