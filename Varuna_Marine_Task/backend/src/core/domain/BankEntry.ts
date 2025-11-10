export interface BankEntry {
  id?: string;
  shipId: string;
  year: number;
  amountGco2eq: number;
  appliedAmountGco2eq?: number;
  createdAt?: Date;
}

export interface BankApplication {
  id?: string;
  shipId: string;
  year: number;
  amountGco2eq: number;
  createdAt?: Date;
}

