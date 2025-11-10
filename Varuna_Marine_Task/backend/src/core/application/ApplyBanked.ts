import { ComplianceBalance, AdjustedComplianceBalance } from "../domain/ComplianceBalance";
import { BankEntry } from "../domain/BankEntry";
import { BankApplication } from "../domain/BankEntry";

export class ApplyBanked {
  execute(
    cb: ComplianceBalance,
    bankEntries: BankEntry[],
    appliedAmount: number,
    application: BankApplication
  ): AdjustedComplianceBalance {
    const totalBanked = bankEntries.reduce((sum, entry) => sum + entry.amountGco2eq, 0);
    const availableBanked = totalBanked - appliedAmount;
    
    if (application.amountGco2eq > availableBanked) {
      throw new Error(`Insufficient banked surplus. Available: ${availableBanked}, Requested: ${application.amountGco2eq}`);
    }

    if (cb.cbGco2eq >= 0) {
      throw new Error(`Cannot apply banked surplus to positive compliance balance`);
    }

    const applied = Math.min(application.amountGco2eq, Math.abs(cb.cbGco2eq));
    const newAppliedAmount = appliedAmount + applied;
    const cbAfter = cb.cbGco2eq + applied;

    const adjustedCB: ComplianceBalance = {
      ...cb,
      cbGco2eq: cbAfter,
    };

    return {
      ...adjustedCB,
      appliedBanked: newAppliedAmount,
      availableBanked: totalBanked - newAppliedAmount,
    };
  }
}

