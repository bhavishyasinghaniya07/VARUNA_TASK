import { Pool, PoolMember } from "../domain/Pool";
import { AdjustedComplianceBalance } from "../domain/ComplianceBalance";

export class CreatePool {
  execute(
    year: number,
    shipIds: string[],
    adjustedCBs: AdjustedComplianceBalance[]
  ): Pool {
    const members: PoolMember[] = adjustedCBs
      .filter((cb) => shipIds.includes(cb.shipId))
      .map((cb) => ({
        shipId: cb.shipId,
        cbBefore: cb.cbGco2eq,
        cbAfter: cb.cbGco2eq,
      }));

    const totalCb = members.reduce((sum, m) => sum + m.cbBefore, 0);

    if (totalCb < 0) {
      throw new Error(`Pool sum is negative: ${totalCb}. Cannot create pool.`);
    }

    const sortedMembers = [...members].sort((a, b) => b.cbBefore - a.cbBefore);
    const deficits = sortedMembers.filter((m) => m.cbBefore < 0);
    const surpluses = sortedMembers.filter((m) => m.cbBefore > 0);

    for (const deficit of deficits) {
      let remainingDeficit = Math.abs(deficit.cbBefore);

      for (const surplus of surpluses) {
        if (remainingDeficit <= 0) break;
        if (surplus.cbAfter <= 0) continue;

        const transfer = Math.min(remainingDeficit, surplus.cbAfter);
        surplus.cbAfter -= transfer;
        deficit.cbAfter += transfer;
        remainingDeficit -= transfer;
      }
    }

    for (const member of members) {
      const updated = sortedMembers.find((m) => m.shipId === member.shipId);
      if (updated) {
        member.cbAfter = updated.cbAfter;
      }

      if (member.cbBefore < 0 && member.cbAfter < member.cbBefore) {
        throw new Error(`Deficit ship ${member.shipId} cannot exit worse. Before: ${member.cbBefore}, After: ${member.cbAfter}`);
      }

      if (member.cbBefore > 0 && member.cbAfter < 0) {
        throw new Error(`Surplus ship ${member.shipId} cannot exit negative. Before: ${member.cbBefore}, After: ${member.cbAfter}`);
      }
    }

    return {
      year,
      members,
    };
  }
}

