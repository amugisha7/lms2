/**
 * Balance Sheet helpers — point-in-time asset snapshot for the active branch.
 *
 * ASSETS computed:
 *   Cash & Bank   – account opening balances + deposits + repayments received
 *                   + other income – withdrawals – loan disbursements – expenses
 *                   – account-level penalties & fees (matching calculateCurrentBalance direction)
 *   Gross Loan Portfolio – outstanding principal per active loan as of the date
 *                          (original principal minus principal already repaid)
 *   Provisions    – PAR-based loan loss reserve (same tiers as ProvisionsReport defaults)
 *   Receivables   – scheduled interest / fees / penalties charged but not yet collected
 *
 * No liability data is available in the schema; the report notes this in the footer.
 */

import { safeNum, parseReportDate } from "./reportUtils";
import { isValidPayment } from "../../Models/Loans/LoanStatements/statementHelpers";

// ─── Comparison-date options ──────────────────────────────────────────────────

export const BS_COMPARE_TO = Object.freeze({
  NONE: "none",
  PREV_MONTH: "prev_month",
  PREV_YEAR: "prev_year",
  CUSTOM: "custom",
});

// ─── Provision rate tiers ─────────────────────────────────────────────────────
// Matches ProvisionsReport default matrix.

const PROVISION_TIERS = [
  { maxDays: 0,    rate: 0.01 },
  { maxDays: 30,   rate: 0.05 },
  { maxDays: 60,   rate: 0.15 },
  { maxDays: 90,   rate: 0.35 },
  { maxDays: 180,  rate: 0.60 },
  { maxDays: null, rate: 1.00 },
];

function provisionRate(dpd) {
  for (const tier of PROVISION_TIERS) {
    if (tier.maxDays === null || dpd <= tier.maxDays) return tier.rate;
  }
  return 1.0;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

const onOrBefore = (rawDate, asOf) => {
  const d = parseReportDate(rawDate);
  return d !== null && d <= asOf;
};

const msPerDay = 86_400_000;

/**
 * Compute days past due for a loan as of asOfDate.
 * Uses schedule rows vs cumulative principal repaid to find the first missed installment.
 * Returns 0 when the loan is current or has no schedule data.
 */
function dpdAsOf(summary, asOfDate) {
  const scheduleRows = (summary.reportSourceScheduleRows || [])
    .map((row) => ({ ...row, _due: parseReportDate(row.dueDate) }))
    .filter((row) => row._due && row._due <= asOfDate)
    .sort((a, b) => a._due - b._due);

  if (scheduleRows.length === 0) return 0;

  const validPayments = (summary.reportSourcePayments || []).filter(
    (p) => isValidPayment(p) && onOrBefore(p.paymentDate, asOfDate),
  );
  const principalRepaid = validPayments.reduce(
    (s, p) => s + safeNum(p.amountAllocatedToPrincipal),
    0,
  );

  let cumulativeExpected = 0;
  let firstMissedDate = null;
  const EPSILON = 0.01;

  for (const row of scheduleRows) {
    cumulativeExpected += safeNum(row.principalDue);
    if (!firstMissedDate && principalRepaid < cumulativeExpected - EPSILON) {
      firstMissedDate = row._due;
    }
  }

  if (!firstMissedDate) return 0;

  const asOfMidnight = new Date(asOfDate);
  asOfMidnight.setHours(0, 0, 0, 0);
  const missedMidnight = new Date(firstMissedDate);
  missedMidnight.setHours(0, 0, 0, 0);

  return Math.max(0, Math.floor((asOfMidnight - missedMidnight) / msPerDay));
}

/**
 * Cash & Bank balance as of date: mirrors calculateCurrentBalance in Accounts.jsx
 * but subtracts loan disbursements so cash is separated from the loan portfolio.
 *
 * Formula per account:
 *   opening + deposits − withdrawals − disbursements + payments − penalties − loan_fees
 * Plus branch-level:
 *   + other incomes − expenses
 */
function computeCashAsOf(accounts, expenses, otherIncomes, asOfDate) {
  let total = 0;

  accounts.forEach((account) => {
    let bal = safeNum(account.openingBalance);

    (account.moneyTransactions?.items || []).forEach((tx) => {
      if (!onOrBefore(tx.transactionDate, asOfDate)) return;
      const amt = Math.abs(safeNum(tx.amount));
      if (tx.transactionType === "deposit") bal += amt;
      else bal -= amt;
    });

    (account.loans?.items || []).forEach(({ loan } = {}) => {
      if (!loan || !onOrBefore(loan.createdAt, asOfDate)) return;
      bal -= Math.abs(safeNum(loan.principal));
    });

    (account.payments?.items || []).forEach((p) => {
      if (!onOrBefore(p.paymentDate, asOfDate)) return;
      bal += Math.abs(safeNum(p.amount));
    });

    (account.penalties?.items || []).forEach((pen) => {
      if (!onOrBefore(pen.penaltyDate || pen.createdAt, asOfDate)) return;
      bal -= Math.abs(safeNum(pen.amount));
    });

    (account.loanFees?.items || []).forEach((fee) => {
      if (!onOrBefore(fee.loanFeesDate || fee.createdAt, asOfDate)) return;
      bal -= Math.abs(safeNum(fee.amount));
    });

    total += bal;
  });

  expenses.forEach((exp) => {
    if (!exp?.amount || !onOrBefore(exp.transactionDate, asOfDate)) return;
    total -= Math.abs(safeNum(exp.amount));
  });

  otherIncomes.forEach((inc) => {
    if (!inc?.amount || !onOrBefore(inc.incomeDate, asOfDate)) return;
    total += Math.abs(safeNum(inc.amount));
  });

  return total;
}

const EXCLUDED_LIFECYCLE = new Set(["DRAFT", "REVIEW", "REJECTED", "IN_REVIEW", "VOIDED"]);

/**
 * Compute loan portfolio metrics as of asOfDate using reportSource data on each summary.
 */
function computeLoanMetrics(loanSummaries, asOfDate) {
  let grossLoanPortfolio = 0;
  let provisions = 0;
  let interestCharged = 0, interestCollected = 0;
  let feesCharged = 0, feesCollected = 0;
  let penaltiesCharged = 0, penaltiesCollected = 0;
  let activeLoansCount = 0;
  let par30Outstanding = 0;
  let par90Outstanding = 0;

  loanSummaries.forEach((summary) => {
    const status = String(summary?.lifecycleStatus || "").toUpperCase().replace(/\s+/g, "_");
    if (EXCLUDED_LIFECYCLE.has(status)) return;

    const startDate = parseReportDate(summary.startDate);
    if (!startDate || startDate > asOfDate) return;

    const principal = safeNum(summary.principal);

    const validPayments = (summary.reportSourcePayments || []).filter(
      (p) => isValidPayment(p) && onOrBefore(p.paymentDate, asOfDate),
    );

    const principalRepaid = validPayments.reduce(
      (s, p) => s + safeNum(p.amountAllocatedToPrincipal),
      0,
    );
    const outstanding = Math.max(0, principal - principalRepaid);

    // Receivables from schedule rows
    (summary.reportSourceScheduleRows || []).forEach((row) => {
      if (!onOrBefore(row.dueDate, asOfDate)) return;
      interestCharged += safeNum(row.interestDue);
      feesCharged += safeNum(row.feesDue);
    });

    // Collected from payments
    validPayments.forEach((p) => {
      interestCollected += safeNum(p.amountAllocatedToInterest);
      feesCollected += safeNum(p.amountAllocatedToFees);
      penaltiesCollected += safeNum(p.amountAllocatedToPenalty);
    });

    // Penalties charged
    (summary.reportSourcePenalties || []).forEach((pen) => {
      if (!onOrBefore(pen.penaltyDate || pen.createdAt, asOfDate)) return;
      penaltiesCharged += safeNum(pen.amount);
    });

    if (outstanding <= 0) return;

    activeLoansCount++;
    grossLoanPortfolio += outstanding;

    const dpd = dpdAsOf(summary, asOfDate);
    const rate = provisionRate(dpd);
    provisions += outstanding * rate;

    if (dpd >= 30) par30Outstanding += outstanding;
    if (dpd >= 90) par90Outstanding += outstanding;
  });

  const interestReceivable = Math.max(0, interestCharged - interestCollected);
  const feesReceivable = Math.max(0, feesCharged - feesCollected);
  const penaltiesReceivable = Math.max(0, penaltiesCharged - penaltiesCollected);
  const totalReceivables = interestReceivable + feesReceivable + penaltiesReceivable;
  const netLoanPortfolio = Math.max(0, grossLoanPortfolio - provisions);

  const par30Pct = grossLoanPortfolio > 0 ? (par30Outstanding / grossLoanPortfolio) * 100 : 0;
  const par90Pct = grossLoanPortfolio > 0 ? (par90Outstanding / grossLoanPortfolio) * 100 : 0;
  const provisionCoveragePct = grossLoanPortfolio > 0 ? (provisions / grossLoanPortfolio) * 100 : 0;

  return {
    grossLoanPortfolio,
    provisions,
    netLoanPortfolio,
    interestReceivable,
    feesReceivable,
    penaltiesReceivable,
    totalReceivables,
    activeLoansCount,
    par30Outstanding,
    par90Outstanding,
    par30Pct,
    par90Pct,
    provisionCoveragePct,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Compute a full balance sheet snapshot as of asOfDate.
 * asOfDate must be a Date object (typically end-of-day).
 * Returns null when asOfDate is invalid.
 */
export function computeBalanceSheet({
  accounts = [],
  expenses = [],
  otherIncomes = [],
  loanSummaries = [],
  asOfDate,
} = {}) {
  if (!(asOfDate instanceof Date) || isNaN(asOfDate.getTime())) return null;

  const cashAndBank = computeCashAsOf(accounts, expenses, otherIncomes, asOfDate);
  const lm = computeLoanMetrics(loanSummaries, asOfDate);

  const totalAssets = cashAndBank + lm.netLoanPortfolio + lm.totalReceivables;

  return {
    asOfDate,
    cashAndBank,
    grossLoanPortfolio: lm.grossLoanPortfolio,
    provisions: lm.provisions,
    netLoanPortfolio: lm.netLoanPortfolio,
    interestReceivable: lm.interestReceivable,
    feesReceivable: lm.feesReceivable,
    penaltiesReceivable: lm.penaltiesReceivable,
    totalReceivables: lm.totalReceivables,
    totalAssets,
    activeLoansCount: lm.activeLoansCount,
    par30Pct: lm.par30Pct,
    par90Pct: lm.par90Pct,
    provisionCoveragePct: lm.provisionCoveragePct,
  };
}

/**
 * Resolve the comparison date from the user's selection.
 * Returns a Date (end-of-day) or null when comparison is disabled.
 */
export function getComparisonDate(primaryDate, compareOption, customDateStr) {
  if (!primaryDate || compareOption === BS_COMPARE_TO.NONE) return null;

  let raw = null;

  if (compareOption === BS_COMPARE_TO.PREV_MONTH) {
    raw = new Date(primaryDate);
    raw.setMonth(raw.getMonth() - 1);
  } else if (compareOption === BS_COMPARE_TO.PREV_YEAR) {
    raw = new Date(primaryDate);
    raw.setFullYear(raw.getFullYear() - 1);
  } else if (compareOption === BS_COMPARE_TO.CUSTOM) {
    raw = parseReportDate(customDateStr, { endOfDay: true });
  }

  if (raw) raw.setHours(23, 59, 59, 999);
  return raw || null;
}
