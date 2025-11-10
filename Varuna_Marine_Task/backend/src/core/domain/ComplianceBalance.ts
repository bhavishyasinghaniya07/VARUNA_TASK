export interface ComplianceBalance {
  id?: string;
  shipId: string;
  year: number;
  cbGco2eq: number;
  createdAt?: Date;
}

export interface AdjustedComplianceBalance extends ComplianceBalance {
  appliedBanked: number;
  availableBanked: number;
}

