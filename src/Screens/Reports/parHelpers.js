/**
 * PAR (Portfolio at Risk) calculation helpers.
 *
 * PAR N = (outstanding balance of loans with DPD > N) / (total qualifying portfolio balance)
 *
 * Denominator: total outstanding balance of active (non-voided, non-CLOSED, non-WRITTEN_OFF)
 *              loans in scope.
 *
 * Written-off and voided loans are excluded from both numerator and denominator.
 * Closed loans are excluded (they no longer carry active risk exposure).
 *
 * These helpers reuse agingHelpers.computeDaysPastDue / getAgingBucketKey.
 */

import { safeNum } from "./reportUtils";
import { computeDaysPastDue } from "./agingHelpers";

// Statuses excluded from PAR calculation
const PAR_EXCLUDED_STATUSES = new Set([
  "VOIDED",
  "WRITTEN_OFF",
  "CLOSED",
]);

export function isParEligible(s) {
  return !PAR_EXCLUDED_STATUSES.has(s?.displayStatus) &&
         !PAR_EXCLUDED_STATUSES.has(s?.lifecycleStatus);
}

/**
 * Computes PAR metrics for the given thresholds.
 *
 * @param {Array} summaries - LoanSummary rows
 * @param {number[]} thresholds - e.g. [30, 60, 90]
 * @param {Date} today - reference date
 * @returns {{ denominator, par: { [threshold]: { balance, count, pct } } }}
 */
export function computePAR(summaries, thresholds = [30, 60, 90], today = new Date()) {
  const eligible = summaries.filter(isParEligible);

  const denominator = eligible.reduce(
    (sum, s) => sum + safeNum(s.loanBalanceAmount),
    0,
  );

  const par = {};
  for (const threshold of thresholds) {
    const atRisk = eligible.filter((s) => {
      const dpd = computeDaysPastDue(s, today);
      // dpd null → current, dpd <= 0 → current
      return dpd !== null && dpd > threshold;
    });

    const balance = atRisk.reduce(
      (sum, s) => sum + safeNum(s.loanBalanceAmount),
      0,
    );
    const count = atRisk.length;
    const pct = denominator > 0 ? (balance / denominator) * 100 : 0;

    par[threshold] = { balance, count, pct, loans: atRisk };
  }

  return { denominator, eligible, par };
}

/**
 * Builds a branch-level PAR table for admin users.
 * @param {Array} summaries - LoanSummary rows (already PAR-eligible)
 * @param {number[]} thresholds
 * @param {Array} branches - Branch list for name lookup
 * @param {Date} today
 */
export function computeBranchPAR(summaries, thresholds = [30, 60, 90], branches = [], today = new Date()) {
  const branchMap = {};

  const eligible = summaries.filter(isParEligible);

  eligible.forEach((s) => {
    const bid = s.branchID || "unknown";
    if (!branchMap[bid]) {
      const branch = branches.find((b) => b.id === bid);
      branchMap[bid] = {
        branchId: bid,
        branchName: branch?.name || bid,
        totalBalance: 0,
        par: {},
      };
      thresholds.forEach((t) => {
        branchMap[bid].par[t] = { balance: 0, count: 0, pct: 0 };
      });
    }

    const bal = safeNum(s.loanBalanceAmount);
    branchMap[bid].totalBalance += bal;

    const dpd = computeDaysPastDue(s, today);
    thresholds.forEach((t) => {
      if (dpd !== null && dpd > t) {
        branchMap[bid].par[t].balance += bal;
        branchMap[bid].par[t].count += 1;
      }
    });
  });

  // Compute branch-level percentages
  Object.values(branchMap).forEach((branch) => {
    thresholds.forEach((t) => {
      branch.par[t].pct =
        branch.totalBalance > 0
          ? (branch.par[t].balance / branch.totalBalance) * 100
          : 0;
    });
  });

  return Object.values(branchMap).sort(
    (a, b) => b.par[30].pct - a.par[30].pct,
  );
}
