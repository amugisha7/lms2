import { isValidPayment } from "../../Models/Loans/LoanStatements/statementHelpers";
import { parseReportDate, safeNum } from "./reportUtils";
import {
  TAX_EXPENSE_CATEGORIES,
  isTaxCategory,
} from "../../Models/Expenses/expenseCategories";

// Two top-level report intents. Standard = one primary period with an optional
// single comparison column. Trend = primary range split into N buckets by a
// grouping unit.
export const REPORT_MODES = Object.freeze({
  STANDARD: "standard",
  TREND: "trend",
});

// Comparison column for Standard mode. PREVIOUS_PERIOD is the immediately
// preceding range of equal length; PREVIOUS_YEAR is the same calendar window
// shifted -1 year; CUSTOM lets the user pick an arbitrary second range.
export const COMPARE_TO = Object.freeze({
  NONE: "none",
  PREVIOUS_PERIOD: "previous_period",
  PREVIOUS_YEAR: "previous_year",
  CUSTOM: "custom",
});

// Bucket unit for Trend mode.
export const GROUP_BY = Object.freeze({
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
  QUARTER: "quarter",
  YEAR: "year",
});

export const BASIS_MODES = Object.freeze({
  CASH: "cash",
  ACCRUAL: "accrual",
});

// Soft cap on column count in Trend mode. Prevents pathological grids (e.g.
// "Day" over a year). The UI surfaces a warning when this clips the result.
export const TREND_MAX_COLUMNS = 36;

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

const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

const yy = (date) => String(date.getFullYear()).slice(-2);

// Trend column labels are deliberately compact — the columns are already
// ordered, so the label only needs to identify the bucket, not the full range.
const formatTrendLabel = (from, to, groupBy) => {
  switch (groupBy) {
    case GROUP_BY.DAY:
      return formatPeriodEdge(from);
    case GROUP_BY.WEEK:
      // Range form, since "week of …" is ambiguous across calendar systems.
      return `${from.getDate()} ${MONTH_ABBR[from.getMonth()]} - ${to.getDate()} ${MONTH_ABBR[to.getMonth()]} ${yy(to)}`;
    case GROUP_BY.MONTH:
      return `${MONTH_ABBR[from.getMonth()]} ${yy(from)}`;
    case GROUP_BY.QUARTER: {
      const q = Math.floor(from.getMonth() / 3) + 1;
      return `Q${q} ${yy(from)}`;
    }
    case GROUP_BY.YEAR:
      return String(from.getFullYear());
    default:
      return formatPeriodLabel(from, to);
  }
};

// Standard-mode comparison column resolvers. Each returns [from, to] or null.
const getPreviousPeriodRange = (primaryFrom, primaryTo) => {
  const priorEnd = endOfDayLocal(addDays(primaryFrom, -1));
  // primaryFrom is midnight, primaryTo is end-of-day → the rounded ms diff is
  // already the inclusive day count (e.g. Feb 1 → Feb 28 ≈ 27.9999 → 28).
  const dayCount = Math.round(
    (primaryTo - primaryFrom) / (24 * 60 * 60 * 1000),
  );
  const priorStart = startOfDayLocal(addDays(priorEnd, -(dayCount - 1)));
  return [priorStart, priorEnd];
};

const getPreviousYearRange = (primaryFrom, primaryTo) => {
  const priorStart = startOfDayLocal(new Date(primaryFrom));
  priorStart.setFullYear(priorStart.getFullYear() - 1);
  const priorEnd = endOfDayLocal(new Date(primaryTo));
  priorEnd.setFullYear(priorEnd.getFullYear() - 1);
  return [priorStart, priorEnd];
};

const buildStandardPeriods = ({
  primaryFrom,
  primaryTo,
  compareTo,
  compareStartDate,
  compareEndDate,
}) => {
  const periods = [
    {
      key: "primary",
      from: primaryFrom,
      to: primaryTo,
      label: formatPeriodLabel(primaryFrom, primaryTo),
    },
  ];

  let comparison = null;
  if (compareTo === COMPARE_TO.PREVIOUS_PERIOD) {
    comparison = getPreviousPeriodRange(primaryFrom, primaryTo);
  } else if (compareTo === COMPARE_TO.PREVIOUS_YEAR) {
    comparison = getPreviousYearRange(primaryFrom, primaryTo);
  } else if (compareTo === COMPARE_TO.CUSTOM) {
    const cFrom = parseReportDate(compareStartDate);
    const cTo = parseReportDate(compareEndDate, { endOfDay: true });
    if (cFrom && cTo && cFrom <= cTo) {
      comparison = [startOfDayLocal(cFrom), endOfDayLocal(cTo)];
    }
  }

  if (comparison) {
    const [from, to] = comparison;
    periods.push({
      key: "compare",
      from,
      to,
      label: formatPeriodLabel(from, to),
    });
  }

  return { periods, truncated: false };
};

// Returns the calendar-unit end date for the bucket containing `from`.
const unitEnd = (from, groupBy) => {
  if (groupBy === GROUP_BY.DAY) return new Date(from);
  if (groupBy === GROUP_BY.WEEK) return addDays(from, 6);
  if (groupBy === GROUP_BY.MONTH) {
    return new Date(from.getFullYear(), from.getMonth() + 1, 0);
  }
  if (groupBy === GROUP_BY.QUARTER) {
    const qStartMonth = Math.floor(from.getMonth() / 3) * 3;
    return new Date(from.getFullYear(), qStartMonth + 3, 0);
  }
  if (groupBy === GROUP_BY.YEAR) {
    return new Date(from.getFullYear(), 11, 31);
  }
  return new Date(from);
};

const buildTrendPeriods = ({
  primaryFrom,
  primaryTo,
  groupBy,
  maxColumns,
}) => {
  const periods = [];
  let cursor = startOfDayLocal(primaryFrom);
  let truncated = false;

  while (cursor <= primaryTo) {
    if (periods.length >= maxColumns) {
      truncated = true;
      break;
    }
    const rawEnd = unitEnd(cursor, groupBy);
    const clippedEnd = endOfDayLocal(rawEnd > primaryTo ? primaryTo : rawEnd);
    const from = new Date(cursor);
    periods.push({
      key: `bucket_${periods.length}`,
      from,
      to: clippedEnd,
      label: formatTrendLabel(from, clippedEnd, groupBy),
    });
    cursor = startOfDayLocal(addDays(rawEnd, 1));
  }

  return { periods, truncated };
};

// Single entry point for both modes. Returns { periods, truncated } so the
// caller can warn when Trend grouping clipped at TREND_MAX_COLUMNS.
export const buildPeriods = ({
  mode = REPORT_MODES.STANDARD,
  startDate,
  endDate,
  compareTo = COMPARE_TO.NONE,
  compareStartDate = null,
  compareEndDate = null,
  groupBy = GROUP_BY.MONTH,
  maxColumns = TREND_MAX_COLUMNS,
} = {}) => {
  const start = parseReportDate(startDate);
  const end = parseReportDate(endDate, { endOfDay: true });
  if (!start || !end || start > end) {
    return { periods: [], truncated: false };
  }
  const primaryFrom = startOfDayLocal(start);
  const primaryTo = endOfDayLocal(end);

  if (mode === REPORT_MODES.TREND) {
    return buildTrendPeriods({
      primaryFrom,
      primaryTo,
      groupBy,
      maxColumns,
    });
  }
  return buildStandardPeriods({
    primaryFrom,
    primaryTo,
    compareTo,
    compareStartDate,
    compareEndDate,
  });
};

const inPeriod = (date, period) => {
  if (!date || !period) return false;
  const t = date instanceof Date ? date.getTime() : new Date(date).getTime();
  if (Number.isNaN(t)) return false;
  return t >= period.from.getTime() && t <= period.to.getTime();
};

// Tax detection uses an exact-match against the controlled
// TAX_EXPENSE_CATEGORIES list. The legacy keyword fallback is kept so
// historical Expense rows entered as "tax" / "VAT" / etc. (free text) still
// classify correctly.
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

// cutoff = min(stopInterestAt, writeOffDate, period.to)
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

      if (interestCutoff) {
        scheduleRows.forEach((row) => {
          const dueDate = parseReportDate(row?.dueDate);
          if (!dueDate) return;
          if (!inPeriod(dueDate, period)) return;
          if (dueDate > interestCutoff) return;
          if (isAccrualSuspendedAt(summary, dueDate)) return;
          bucket.interestOnLoans += safeNum(row.interestDue);
          bucket.feesCollected += safeNum(row.feesDue);
          bucket.penaltiesCollected += safeNum(row.penaltyDue);
        });
      }

      loanFees.forEach((fee) => {
        const date = parseReportDate(fee?.loanFeesDate || fee?.createdAt);
        if (!date) return;
        if (!inPeriod(date, period)) return;
        bucket.feesCollected += safeNum(fee.amount);
      });

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
