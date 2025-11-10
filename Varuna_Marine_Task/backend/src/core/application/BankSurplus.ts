import { BankEntry } from "../domain/BankEntry";
import { ComplianceBalance } from "../domain/ComplianceBalance";

export class BankSurplus {
  execute(cb: ComplianceBalance): BankEntry | null {
    if (cb.cbGco2eq <= 0) {
      return null;
    }

    return {
      shipId: cb.shipId,
      year: cb.year,
      amountGco2eq: cb.cbGco2eq,
    };
  }
}

