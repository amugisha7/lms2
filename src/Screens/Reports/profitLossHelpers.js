import { isValidPayment } from "../../Models/Loans/LoanStatements/statementHelpers";
import { parseReportDate, safeNum } from "./reportUtils";
import {
  TAX_EXPENSE_CATEGORIES,
  isTaxCategory,
} from "../../Models/Expenses/expenseCategories";

export const COMPARE_MODES = Object.freeze({
  NONE: "none",
  MONTHLY: "monthly",
  QUARTERLY: "quarterly",
  YEARLY: "yearly",
});

export const BASIS_MODES = Object.freeze({
  CASH: "cash",
  ACCRUAL: "accrual",
});

const MONTH_ABBR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ordinalSuffix = (n) => {
  const v = Math.abs(n) % 100;
  if (v >= 11 && v <= 13) return "th";
  switch (v % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const formatPeriodEdge = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  const d = date.getDate();
  return `${d}${ordinalSuffix(d)} ${MONTH_ABBR[date.getMonth()]} ${String(
    date.getFullYear(),
  ).slice(-2)}`;
};

export const formatPeriodLabel = (from, to) =>
  `${formatPeriodEdge(from)} - ${formatPeriodEdge(to)}`;

const startOfDayLocal = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDayLocal = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const getPriorPeriod = (cursorStart, compareMode) => {
  if (
    !(cursorStart instanceof Date) ||
    Number.isNaN(cursorStart.getTime()) ||
    compareMode === COMPARE_MODES.NONE
  ) {
    return null;
  }

  const priorEnd = new Date(cursorStart);
  priorEnd.setDate(priorEnd.getDate() - 1);
  priorEnd.setHours(23, 59, 59, 999);

  const priorStart = new Date(priorEnd);
  priorStart.setHours(0, 0, 0, 0);

  if (compareMode === COMPARE_MODES.MONTHLY) {
    priorStart.setDate(1);
  } else if (compareMode === COMPARE_MODES.QUARTERLY) {
    priorStart.setMonth(priorStart.getMonth() - 2);
    priorStart.setDate(1);
  } else if (compareMode === COMPARE_MODES.YEARLY) {
    priorStart.setMonth(0, 1);
  } else {
    return null;
  }

  return [priorStart, priorEnd];
};

export const buildPeriods = ({
  startDate,
  endDate,
  compareMode = COMPARE_MODES.NONE,
  comparePeriods = 0,
} = {}) => {
  const start = parseReportDate(startDate);
  const end = parseReportDate(endDate, { endOfDay: true });
  if (!start || !end) return [];

  const primaryFrom = startOfDayLocal(start);
  const primaryTo = endOfDayLocal(end);

  const periods = [
    {
      key: "primary",
      from: primaryFrom,
      to: primaryTo,
      label: formatPeriodLabel(primaryFrom, primaryTo),
    },
  ];

  if (compareMode === COMPARE_MODES.NONE) return periods;

  let cursor = new Date(primaryFrom);
  const count = Math.max(0, Math.floor(Number(comparePeriods) || 0));

  for (let i = 0; i < count; i += 1) {
    const result = getPriorPeriod(cursor, compareMode);
    if (!result) break;
    const [pFrom, pTo] = result;
    periods.push({
      key: `compare_${i + 1}`,
      from: pFrom,
      to: pTo,
      label: formatPeriodLabel(pFrom, pTo),
    });
    cursor = new Date(pFrom);
  }

  return periods;
};

const inPeriod = (date, period) => {
  if (!date || !period) return false;
  const t = date instanceof Date ? date.getTime() : new Date(date).getTime();
  if (Number.isNaN(t)) return false;
  return t >= period.from.getTime() && t <= period.to.getTime();
};

// Tax detection now uses an exact-match against the controlled
// TAX_EXPENSE_CATEGORIES list rather than keyword sniffing. The legacy keyword
// fallback is kept so historical Expense rows entered as "tax" / "VAT" / etc.
// (free text) still classify correctly.
const LEGACY_TAX_KEYWORDS = ["tax", "vat", "withholding"];

const isTaxExpense = (expense) => {
  if (isTaxCategory(expense?.category)) return true;
  if (isTaxCategory(expense?.type)) return true;
  const fields = [expense?.category, expense?.type]
    .filter(Boolean)
    .map((v) => String(v).toLowerCase());
  return fields.some((field) =>
    LEGACY_TAX_KEYWORDS.some((kw) => field.includes(kw)),
  );
};

// Re-export so callers (forms, reports) can reach the canonical category list
// through one module.
export { TAX_EXPENSE_CATEGORIES };

const EXCLUDED_PENALTY_STATUSES = new Set([
  "VOIDED",
  "CANCELLED",
  "REVERSED",
]);

const isActivePenalty = (penalty) => {
  const status = String(
    penalty?.penaltyStatus || penalty?.status || "",
  ).toUpperCase();
  return !EXCLUDED_PENALTY_STATUSES.has(status);
};

const EXCLUDED_LOAN_FEE_STATUSES = new Set([
  "VOIDED",
  "CANCELLED",
  "REVERSED",
]);

const isActiveLoanFee = (fee) => {
  const status = String(
    fee?.loanFeesStatus || fee?.status || "",
  ).toUpperCase();
  return !EXCLUDED_LOAN_FEE_STATUSES.has(status);
};

// Computes the effective last date a loan accrues interest, given the period
// boundary. Returns a Date or null when interest cannot accrue at all in the
// period.
//
//   cutoff = min(stopInterestAt, writeOffDate, period.to)
//
// resumedAt is honored: if the pause was resumed before `period.to`, only
// installments BEFORE the original stop date are excluded (handled in the
// caller via `isAccrualSuspendedAt`).
export const computeInterestAccrualCutoff = (loanSummary, period) => {
  if (!period) return null;

  const candidates = [period.to.getTime()];

  const writeOffDate = parseReportDate(loanSummary?.reportSourceWriteOffDate);
  if (writeOffDate) candidates.push(writeOffDate.getTime());

  const stop = loanSummary?.reportSourceStopInterest;
  if (stop?.stoppedAt && !stop?.resumedAt) {
    const stoppedAt = parseReportDate(stop.stoppedAt);
    if (stoppedAt) candidates.push(stoppedAt.getTime());
  }

  const earliest = Math.min(...candidates.filter(Number.isFinite));
  if (!Number.isFinite(earliest)) return null;
  const cutoff = new Date(earliest);
  if (cutoff < period.from) return null;
  return cutoff;
};

// True when interest accrual is paused for the loan at the given date — i.e.
// the date falls inside an active stopInterest interval (between stoppedAt and
// resumedAt, or after stoppedAt if not yet resumed).
export const isAccrualSuspendedAt = (loanSummary, date) => {
  const stop = loanSummary?.reportSourceStopInterest;
  if (!stop?.stoppedAt) return false;
  const stoppedAt = parseReportDate(stop.stoppedAt);
  if (!stoppedAt) return false;
  const at = date instanceof Date ? date : parseReportDate(date);
  if (!at) return false;
  if (at < stoppedAt) return false;

  if (stop.resumedAt) {
    const resumedAt = parseReportDate(stop.resumedAt);
    if (resumedAt && at >= resumedAt) return false;
  }

  const writeOff = parseReportDate(loanSummary?.reportSourceWriteOffDate);
  if (writeOff && at >= writeOff) return true;

  return true;
};

const expenseLabel = (expense) => {
  const raw = expense?.category || expense?.type || "Uncategorized";
  const trimmed = String(raw).trim();
  return trimmed || "Uncategorized";
};

const createEmptyBucket = () => ({
  interestOnLoans: 0,
  feesCollected: 0,
  penaltiesCollected: 0,
  otherIncome: 0,
  operatingExpensesByCategory: {},
  operatingExpensesTotal: 0,
  taxExpense: 0,
});

const aggregateCashRevenue = ({ loanSummaries, periods, buckets }) => {
  loanSummaries.forEach((summary) => {
    // Prefer derived payment rows (allocations from the statement ledger). They
    // already exclude reversed/voided/failed payments and contain reliable
    // interest/fees/penalty splits even when those fields aren't persisted on
    // the Payment record. Fall back to raw payments when rows aren't available
    // (e.g. older summary shapes in tests).
    const derivedRows = Array.isArray(summary?.reportSourcePaymentRows)
      ? summary.reportSourcePaymentRows
      : null;

    if (derivedRows && derivedRows.length > 0) {
      derivedRows.forEach((row) => {
        const date = parseReportDate(row?.date);
        if (!date) return;
        periods.forEach((period) => {
          if (!inPeriod(date, period)) return;
          const bucket = buckets[period.key];
          bucket.interestOnLoans += safeNum(row.allocInterest);
          bucket.feesCollected += safeNum(row.allocFees);
          bucket.penaltiesCollected += safeNum(row.allocPenalty);
        });
      });
      return;
    }

    const payments = Array.isArray(summary?.reportSourcePayments)
      ? summary.reportSourcePayments
      : [];
    payments.filter(isValidPayment).forEach((payment) => {
      const date = parseReportDate(payment?.paymentDate);
      if (!date) return;
      periods.forEach((period) => {
        if (!inPeriod(date, period)) return;
        const bucket = buckets[period.key];
        bucket.interestOnLoans += safeNum(payment.amountAllocatedToInterest);
        bucket.feesCollected += safeNum(payment.amountAllocatedToFees);
        bucket.penaltiesCollected += safeNum(payment.amountAllocatedToPenalty);
      });
    });
  });
};

const aggregateAccrualRevenue = ({ loanSummaries, periods, buckets }) => {
  loanSummaries.forEach((summary) => {
    const scheduleRows = Array.isArray(summary?.reportSourceScheduleRows)
      ? summary.reportSourceScheduleRows
      : [];
    const penalties = Array.isArray(summary?.reportSourcePenalties)
      ? summary.reportSourcePenalties.filter(isActivePenalty)
      : [];
    const loanFees = Array.isArray(summary?.reportSourceLoanFees)
      ? summary.reportSourceLoanFees.filter(isActiveLoanFee)
      : [];

    periods.forEach((period) => {
      const bucket = buckets[period.key];
      const interestCutoff = computeInterestAccrualCutoff(summary, period);

      // Interest accrued: schedule installments whose due date falls within
      // the period AND is before the interest cutoff, AND not inside a paused
      // interval.
      if (interestCutoff) {
        scheduleRows.forEach((row) => {
          const dueDate = parseReportDate(row?.dueDate);
          if (!dueDate) return;
          if (!inPeriod(dueDate, period)) return;
          if (dueDate > interestCutoff) return;
          if (isAccrualSuspendedAt(summary, dueDate)) return;
          bucket.interestOnLoans += safeNum(row.interestDue);
          // Scheduled fees and penalties booked into the schedule are also
          // recognized on the due date — distinct from ad-hoc fees/penalty
          // records below, which carry their own dates.
          bucket.feesCollected += safeNum(row.feesDue);
          bucket.penaltiesCollected += safeNum(row.penaltyDue);
        });
      }

      // Ad-hoc fees charged in the period (LoanFees records).
      loanFees.forEach((fee) => {
        const date = parseReportDate(fee?.loanFeesDate || fee?.createdAt);
        if (!date) return;
        if (!inPeriod(date, period)) return;
        bucket.feesCollected += safeNum(fee.amount);
      });

      // Ad-hoc penalties charged in the period (Penalty records).
      penalties.forEach((penalty) => {
        const date = parseReportDate(
          penalty?.penaltyDate || penalty?.createdAt,
        );
        if (!date) return;
        if (!inPeriod(date, period)) return;
        bucket.penaltiesCollected += safeNum(penalty.amount);
      });
    });
  });
};

export const computeProfitLoss = ({
  loanSummaries = [],
  expenses = [],
  otherIncomes = [],
  periods = [],
  basis = BASIS_MODES.CASH,
} = {}) => {
  if (!Array.isArray(periods) || periods.length === 0) {
    return { periods: [], expenseCategories: [], periodTotals: [], basis };
  }

  const buckets = {};
  periods.forEach((period) => {
    buckets[period.key] = createEmptyBucket();
  });

  if (basis === BASIS_MODES.ACCRUAL) {
    aggregateAccrualRevenue({ loanSummaries, periods, buckets });
  } else {
    aggregateCashRevenue({ loanSummaries, periods, buckets });
  }

  otherIncomes.forEach((income) => {
    const date = parseReportDate(income?.incomeDate);
    if (!date) return;
    periods.forEach((period) => {
      if (!inPeriod(date, period)) return;
      buckets[period.key].otherIncome += safeNum(income.amount);
    });
  });

  expenses.forEach((expense) => {
    const date = parseReportDate(expense?.transactionDate);
    if (!date) return;
    const tax = isTaxExpense(expense);
    const label = expenseLabel(expense);
    periods.forEach((period) => {
      if (!inPeriod(date, period)) return;
      const bucket = buckets[period.key];
      const amount = safeNum(expense.amount);
      if (tax) {
        bucket.taxExpense += amount;
      } else {
        bucket.operatingExpensesByCategory[label] =
          (bucket.operatingExpensesByCategory[label] || 0) + amount;
        bucket.operatingExpensesTotal += amount;
      }
    });
  });

  const expenseCategories = new Set();
  periods.forEach((period) => {
    Object.keys(buckets[period.key].operatingExpensesByCategory).forEach(
      (category) => expenseCategories.add(category),
    );
  });

  const periodTotals = periods.map((period) => {
    const bucket = buckets[period.key];
    const revenueFromLoans =
      bucket.interestOnLoans +
      bucket.feesCollected +
      bucket.penaltiesCollected;
    const totalRevenue = revenueFromLoans + bucket.otherIncome;
    const totalExpenses = bucket.operatingExpensesTotal;
    const netOperatingIncome = totalRevenue - totalExpenses;
    const netIncomeBeforeTaxes = netOperatingIncome;
    const netIncomeAfterTaxes = netIncomeBeforeTaxes - bucket.taxExpense;
    return {
      periodKey: period.key,
      interestOnLoans: bucket.interestOnLoans,
      feesCollected: bucket.feesCollected,
      penaltiesCollected: bucket.penaltiesCollected,
      otherIncome: bucket.otherIncome,
      operatingExpensesByCategory: { ...bucket.operatingExpensesByCategory },
      operatingExpensesTotal: bucket.operatingExpensesTotal,
      taxExpense: bucket.taxExpense,
      revenueFromLoans,
      totalRevenue,
      totalExpenses,
      netOperatingIncome,
      netIncomeBeforeTaxes,
      netIncomeAfterTaxes,
    };
  });

  return {
    periods,
    expenseCategories: Array.from(expenseCategories).sort((a, b) =>
      a.localeCompare(b),
    ),
    periodTotals,
    basis,
  };
};

const fetchAllByBranch = async ({
  client,
  query,
  resultKey,
  branchId,
}) => {
  const items = [];
  let nextToken = null;
  do {
    const result = await client.graphql({
      query,
      variables: {
        branchID: branchId,
        limit: 1000,
        nextToken,
      },
    });
    const page = result?.data?.[resultKey] || {};
    const batch = Array.isArray(page.items) ? page.items.filter(Boolean) : [];
    items.push(...batch);
    nextToken = page.nextToken || null;
  } while (nextToken);
  return items;
};

export const fetchAllExpensesByBranch = async ({
  client,
  branchId,
  query,
}) =>
  branchId
    ? fetchAllByBranch({
        client,
        query,
        resultKey: "expensesByBranchID",
        branchId,
      })
    : [];

export const fetchAllOtherIncomesByBranch = async ({
  client,
  branchId,
  query,
}) =>
  branchId
    ? fetchAllByBranch({
        client,
        query,
        resultKey: "otherIncomesByBranchID",
        branchId,
      })
    : [];
