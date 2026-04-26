/**
 * concentrationHelpers.js — shared portfolio concentration aggregation.
 *
 * Segment fallback order:
 *   1. loanProductName   (from LoanSummary — always available)
 *   2. "Unclassified"    (loanPurpose and borrower typeOfBusiness/employerName
 *                        are not projected into LoanSummary; enriching from raw
 *                        borrower records would require N+1 queries at portfolio
 *                        scale, so they are surfaced as a drill-down enhancement
 *                        note rather than auto-fetched.)
 *
 * Exposure metric: loanBalanceAmount (outstanding balance).
 */

export function safeNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Aggregate summaries by a grouper function and return ranked rows.
 *
 * @param {Array} summaries - LoanSummary records (VOIDED excluded by caller)
 * @param {Function} keyFn  - (summary) => string groupKey
 * @param {Function} labelFn - (summary) => string displayLabel
 * @returns {Array<{ key, label, count, balance, pct }>} sorted descending by balance
 */
export function buildConcentrationGroups(summaries, keyFn, labelFn) {
  const totalBalance = summaries.reduce((acc, s) => acc + safeNum(s.loanBalanceAmount), 0);
  const map = {};

  summaries.forEach((s) => {
    const key = keyFn(s) || "Unclassified";
    const label = labelFn(s) || key;
    if (!map[key]) map[key] = { key, label, count: 0, balance: 0 };
    map[key].count++;
    map[key].balance += safeNum(s.loanBalanceAmount);
  });

  return Object.values(map)
    .map((r) => ({
      ...r,
      pct: totalBalance > 0 ? (r.balance / totalBalance) * 100 : 0,
    }))
    .sort((a, b) => b.balance - a.balance);
}

/**
 * Resolve the "sector-like" label for a LoanSummary record.
 * Falls back through the priority chain defined in the prompt.
 * loanPurpose and borrower fields are not in LoanSummary, so they cannot be
 * resolved without raw loan/borrower reads. For now the fallback lands on
 * loanProductName which IS available in LoanSummary.
 */
export function resolveSectorLabel(s) {
  // None of loanPurpose / typeOfBusiness / employerName / employmentDepartment
  // are projected into LoanSummary. loanProductName is the closest available proxy.
  return s.loanProductName || "Unclassified";
}
