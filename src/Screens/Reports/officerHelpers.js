/**
 * officerHelpers.js — shared officer aggregation logic.
 *
 * Centralised so future dashboard widgets can reuse without importing
 * the full report component.
 *
 * Active loan definition:
 *   CURRENT, CURRENT_WITH_MISSED_PAYMENT, OVERDUE.
 *   VOIDED, CLOSED, and WRITTEN_OFF are excluded from active workload.
 */

import { LOAN_DISPLAY_STATUS } from "../../Models/Loans/loanSummaryProjection";

export const OFFICER_ACTIVE_STATUSES = new Set([
  LOAN_DISPLAY_STATUS.CURRENT.code,
  LOAN_DISPLAY_STATUS.MISSED_PAYMENT.code,
  LOAN_DISPLAY_STATUS.OVERDUE.code,
]);

export const DELINQUENT_STATUSES = new Set([
  LOAN_DISPLAY_STATUS.MISSED_PAYMENT.code,
  LOAN_DISPLAY_STATUS.OVERDUE.code,
]);

export function safeNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Aggregate LoanSummary rows by loan officer.
 *
 * Only active loans (CURRENT / MISSED / OVERDUE) are counted in workload.
 * Returns an array sorted by outstanding balance descending.
 *
 * @param {Array} summaries - LoanSummary rows
 * @returns {Array<OfficerRow>}
 */
export function groupByOfficer(summaries) {
  const map = {};

  summaries.forEach((s) => {
    const status = s?.displayStatus;
    if (!OFFICER_ACTIVE_STATUSES.has(status)) return; // exclude CLOSED / VOIDED / WRITTEN_OFF

    const id = s.loanOfficerID || s.loanOfficerDisplayName || "Unknown";
    const name = s.loanOfficerDisplayName || s.loanOfficerID || "Unknown";

    if (!map[id]) {
      map[id] = {
        officerId: id,
        officerName: name,
        activeCount: 0,
        totalBalance: 0,
        totalArrears: 0,
        delinquentCount: 0,
        overdueCount: 0,
      };
    }

    const row = map[id];
    row.activeCount++;
    row.totalBalance += safeNum(s.loanBalanceAmount);
    row.totalArrears += safeNum(s.arrearsAmount);

    if (DELINQUENT_STATUSES.has(status)) row.delinquentCount++;
    if (status === LOAN_DISPLAY_STATUS.OVERDUE.code) row.overdueCount++;
  });

  return Object.values(map)
    .map((r) => ({ ...r, avgBalance: r.activeCount ? r.totalBalance / r.activeCount : 0 }))
    .sort((a, b) => b.totalBalance - a.totalBalance);
}
