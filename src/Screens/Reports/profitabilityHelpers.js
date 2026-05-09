/**
 * profitabilityHelpers.js
 *
 * Pure calculation helpers for the Profitability Report.
 * No React imports, no API calls. All functions are deterministic
 * and testable in isolation.
 */

import { safeNum, parseReportDate, isDateWithinWindow } from "./reportUtils";
import { isValidPayment } from "../../Models/Loans/LoanStatements/statementHelpers";

// ---------------------------------------------------------------------------
// Default assumption values (client-side modeling only, not persisted to schema)
// ---------------------------------------------------------------------------
export const DEFAULT_ASSUMPTIONS = {
  originationCostPerLoan: 0,
  servicingCostPerLoanPerMonth: 0,
  fundingCostRatePct: 0,
  creditCostFactorPct: 0,
};

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

/**
 * Returns the number of full or partial calendar months between two date strings.
 * Returns at least 1.
 */
export function monthsInRange(startDate, endDate) {
  const start = parseReportDate(startDate);
  const end = parseReportDate(endDate);
  if (!start || !end) return 1;
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  return Math.max(1, years * 12 + months + 1);
}

// ---------------------------------------------------------------------------
// Realized income
// ---------------------------------------------------------------------------

/**
 * Compute realized income components for one loan using its payment records.
 * Only valid payments whose paymentDate falls inside [startDate, endDate] are counted.
 *
 * @param {Array} payments - raw payment items from the GraphQL response
 * @param {string|null} startDate - YYYY-MM-DD start of window
 * @param {string|null} endDate   - YYYY-MM-DD end of window
 * @returns {{ interest: number, fees: number, penalties: number, total: number, paymentRows: Array }}
 */
export function computeLoanRealizedIncome(payments, startDate, endDate) {
  let interest = 0;
  let fees = 0;
  let penalties = 0;
  const paymentRows = [];

  for (const p of payments || []) {
    if (!isValidPayment(p)) continue;
    if (!isDateWithinWindow(p.paymentDate, startDate, endDate)) continue;

    const i = safeNum(p.amountAllocatedToInterest);
    const f = safeNum(p.amountAllocatedToFees);
    const pen = safeNum(p.amountAllocatedToPenalty);

    interest += i;
    fees += f;
    penalties += pen;

    paymentRows.push({
      paymentDate: p.paymentDate,
      interest: i,
      fees: f,
      penalties: pen,
    });
  }

  return {
    interest,
    fees,
    penalties,
    total: interest + fees + penalties,
    paymentRows,
  };
}

// ---------------------------------------------------------------------------
// Modeled costs
// ---------------------------------------------------------------------------

/**
 * Compute client-side modeled costs for one loan.
 *
 * Formulas (all transparent and inspectable):
 *   origination  = originationCostPerLoan                               (one-time)
 *   servicing    = servicingCostPerLoanPerMonth × months in range        (for active/overdue)
 *   funding      = (fundingCostRatePct / 100) × balance × (months / 12) (annualised)
 *   credit       = (creditCostFactorPct / 100) × arrearsAmount           (arrears-based)
 *
 * @param {object} loanRow - a LoanSummary-derived row with loanBalanceAmount and arrearsAmount
 * @param {object} assumptions - cost assumption values
 * @param {string|null} startDate
 * @param {string|null} endDate
 * @returns {{ origination, servicing, funding, credit, total }}
 */
export function computeLoanModeledCost(loanRow, assumptions, startDate, endDate) {
  const {
    originationCostPerLoan = 0,
    servicingCostPerLoanPerMonth = 0,
    fundingCostRatePct = 0,
    creditCostFactorPct = 0,
  } = assumptions || {};

  const months = monthsInRange(startDate, endDate);
  const balance = safeNum(loanRow?.loanBalanceAmount ?? loanRow?.principalAmount);
  const arrears = safeNum(loanRow?.arrearsAmount);

  const origination = safeNum(originationCostPerLoan);
  const servicing = safeNum(servicingCostPerLoanPerMonth) * months;
  const funding = (safeNum(fundingCostRatePct) / 100) * balance * (months / 12);
  const credit = (safeNum(creditCostFactorPct) / 100) * arrears;
  const total = origination + servicing + funding + credit;

  return { origination, servicing, funding, credit, total };
}

// ---------------------------------------------------------------------------
// Profitability band
// ---------------------------------------------------------------------------

/**
 * Assigns a qualitative profitability band to a loan based on its margin.
 * Margin = netProfit / realizedIncome × 100.
 *
 * Bands:
 *   Negative  – net profit is below zero
 *   No Income – no realized income in range
 *   Marginal  – margin 0–9 %
 *   Low       – margin 10–39 %
 *   Medium    – margin 40–69 %
 *   High      – margin 70 %+
 */
export function profitabilityBand(netProfit, realizedIncome) {
  if (netProfit < 0) return "Negative";
  if (realizedIncome <= 0) return "No Income";
  const margin = (netProfit / realizedIncome) * 100;
  if (margin >= 70) return "High";
  if (margin >= 40) return "Medium";
  if (margin >= 10) return "Low";
  return "Marginal";
}

// ---------------------------------------------------------------------------
// Monthly trend
// ---------------------------------------------------------------------------

/**
 * Build monthly trend rows from an array of per-loan profitability rows.
 * Each row should have paymentRows[] (with paymentDate, interest, fees, penalties)
 * and modeledCost (total).
 *
 * Modeled costs are distributed evenly across the months in the range.
 *
 * @param {Array} loanProfitRows - enriched loan rows
 * @param {string|null} startDate
 * @param {string|null} endDate
 * @returns {Array<{ month, label, interest, fees, penalties, realizedIncome, modeledCost, netProfit }>}
 */
export function buildMonthlyTrend(loanProfitRows, startDate, endDate) {
  const monthMap = {};

  // Collect realized income by payment month
  for (const loan of loanProfitRows || []) {
    for (const p of loan.paymentRows || []) {
      const d = parseReportDate(p.paymentDate);
      if (!d) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!monthMap[key]) monthMap[key] = { interest: 0, fees: 0, penalties: 0 };
      monthMap[key].interest += safeNum(p.interest);
      monthMap[key].fees += safeNum(p.fees);
      monthMap[key].penalties += safeNum(p.penalties);
    }
  }

  // Ensure every month in the date window appears (even if no income)
  const start = parseReportDate(startDate);
  const end = parseReportDate(endDate);
  const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  if (start && end) {
    const cur = new Date(start.getFullYear(), start.getMonth(), 1);
    const endBoundary = new Date(end.getFullYear(), end.getMonth(), 1);
    while (cur <= endBoundary) {
      const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}`;
      if (!monthMap[key]) monthMap[key] = { interest: 0, fees: 0, penalties: 0 };
      cur.setMonth(cur.getMonth() + 1);
    }
  }

  // Distribute modeled costs evenly
  const totalModeledCost = (loanProfitRows || []).reduce(
    (acc, r) => acc + safeNum(r.modeledCost),
    0,
  );
  const months = Math.max(Object.keys(monthMap).length, 1);
  const costPerMonth = totalModeledCost / months;

  return Object.keys(monthMap)
    .sort()
    .map((key) => {
      const entry = monthMap[key];
      const [yearStr, monthStr] = key.split("-");
      const label = `${MONTH_LABELS[parseInt(monthStr, 10) - 1]} ${yearStr}`;
      const realizedIncome = entry.interest + entry.fees + entry.penalties;
      const modeledCost = costPerMonth;
      return {
        month: key,
        label,
        interest: entry.interest,
        fees: entry.fees,
        penalties: entry.penalties,
        realizedIncome,
        modeledCost,
        netProfit: realizedIncome - modeledCost,
      };
    });
}

// ---------------------------------------------------------------------------
// Rollup builder
// ---------------------------------------------------------------------------

/**
 * Build a ranked rollup array grouped by a given key extractor.
 * Sorted descending by netProfit.
 *
 * @param {Array} loanRows - enriched loan-level profitability rows
 * @param {Function} keyFn - (row) => grouping key string
 * @param {string} labelField - name of the label property in the output
 */
export function buildRollup(loanRows, keyFn, labelField) {
  const map = {};
  for (const row of loanRows || []) {
    const key = keyFn(row) || "Unknown";
    if (!map[key]) {
      map[key] = {
        [labelField]: key,
        loanCount: 0,
        outstandingBalance: 0,
        interestCollected: 0,
        feesCollected: 0,
        penaltiesCollected: 0,
        realizedIncome: 0,
        modeledCost: 0,
        netProfit: 0,
      };
    }
    const e = map[key];
    e.loanCount += 1;
    e.outstandingBalance += safeNum(row.loanBalanceAmount);
    e.interestCollected += safeNum(row.interestCollected);
    e.feesCollected += safeNum(row.feesCollected);
    e.penaltiesCollected += safeNum(row.penaltiesCollected);
    e.realizedIncome += safeNum(row.realizedIncome);
    e.modeledCost += safeNum(row.modeledCost);
    e.netProfit += safeNum(row.netProfit);
  }
  return Object.values(map).sort((a, b) => b.netProfit - a.netProfit);
}
