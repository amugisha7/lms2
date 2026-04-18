/**
 * Pure statement helpers for LoanStatements.
 *
 * No React imports. No API calls. All functions are deterministic
 * and testable in isolation.
 */
import dayjs from "dayjs";
import { generateSchedulePreviewFromDraftValues } from "../loanComputations";

// ---------------------------------------------------------------------------
// Internal rounding
// ---------------------------------------------------------------------------
const round2 = (n) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.round((x + Number.EPSILON) * 100) / 100;
};

// ---------------------------------------------------------------------------
// Parse helpers
// ---------------------------------------------------------------------------

/**
 * Safely parse a JSON string or return the object unchanged.
 */
export function safeParseJson(value) {
  if (!value) return null;
  if (typeof value === "object") return value;
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function parseLoanComputationEnvelope(loan) {
  const raw = loan?.loanComputationRecord ?? loan?.draftRecord;
  const parsed = safeParseJson(raw);
  return parsed && typeof parsed === "object" ? parsed : {};
}

/**
 * Extract the computation record from a loan, unwrapping nested draftRecord
 * layers the same way loanComputations.js does.
 */
export function parseLoanComputationRecord(loan) {
  const parsed = parseLoanComputationEnvelope(loan);
  if (!parsed || typeof parsed !== "object") return {};

  // Handle doubly-nested draftRecord
  const nested = parsed.draftRecord;
  if (nested) {
    const inner = safeParseJson(nested);
    if (inner && typeof inner === "object") return inner;
    if (typeof nested === "object") return nested;
  }
  return parsed;
}

const hasMeaningfulValue = (value) => {
  if (value == null) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
};

const pickFirstMeaningful = (...values) =>
  values.find((value) => hasMeaningfulValue(value));

const normalizeBooleanSetting = (value) => {
  if (typeof value === "boolean") return value;
  const normalized = String(value || "").trim().toLowerCase();
  if (["yes", "true", "1"].includes(normalized)) return true;
  if (["no", "false", "0"].includes(normalized)) return false;
  return false;
};

function resolveStatementTermSettings(loan) {
  const computationEnvelope = parseLoanComputationEnvelope(loan);
  const computationRecord = parseLoanComputationRecord(loan);
  const termsSnapshot = safeParseJson(computationEnvelope?.termsSnapshot);
  const loanProduct = loan?.loanProduct || {};

  return {
    repaymentOrder: pickFirstMeaningful(
      computationRecord?.repaymentOrder,
      computationEnvelope?.repaymentOrder,
      termsSnapshot?.repaymentOrder,
      loanProduct?.repaymentOrder,
    ),
    extendLoanAfterMaturity: normalizeBooleanSetting(
      pickFirstMeaningful(
        computationRecord?.extendLoanAfterMaturity,
        computationEnvelope?.extendLoanAfterMaturity,
        termsSnapshot?.extendLoanAfterMaturity,
        loanProduct?.extendLoanAfterMaturity,
      ),
    ),
    interestTypeMaturity:
      pickFirstMeaningful(
        computationRecord?.interestTypeMaturity,
        computationEnvelope?.interestTypeMaturity,
        termsSnapshot?.interestTypeMaturity,
        loanProduct?.interestTypeMaturity,
      ) || "percentage",
    calculateInterestOn:
      pickFirstMeaningful(
        computationRecord?.calculateInterestOn,
        computationEnvelope?.calculateInterestOn,
        termsSnapshot?.calculateInterestOn,
        loanProduct?.calculateInterestOn,
      ) || "Overdue Principal Amount",
    loanInterestRateAfterMaturity: pickFirstMeaningful(
      computationRecord?.loanInterestRateAfterMaturity,
      computationEnvelope?.loanInterestRateAfterMaturity,
      termsSnapshot?.loanInterestRateAfterMaturity,
      loanProduct?.loanInterestRateAfterMaturity,
    ),
    recurringPeriodAfterMaturityUnit: pickFirstMeaningful(
      computationRecord?.recurringPeriodAfterMaturityUnit,
      computationEnvelope?.recurringPeriodAfterMaturityUnit,
      termsSnapshot?.recurringPeriodAfterMaturityUnit,
      loanProduct?.recurringPeriodAfterMaturityUnit,
    ),
  };
}

// ---------------------------------------------------------------------------
// Borrower/entity display helpers
// ---------------------------------------------------------------------------

export function formatBorrowerName(borrower) {
  if (!borrower) return "";
  return (
    [borrower.firstname, borrower.othername, borrower.businessName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    borrower.uniqueIdNumber ||
    ""
  );
}

export function formatEmployeeName(employee) {
  if (!employee) return "N/A";
  return (
    [employee.firstName, employee.lastName].filter(Boolean).join(" ") ||
    employee.email ||
    "N/A"
  );
}

// ---------------------------------------------------------------------------
// Payment validity
// ---------------------------------------------------------------------------

const EXCLUDED_STATUSES = new Set(["REVERSED", "VOIDED", "FAILED"]);
const EXCLUDED_PENALTY_STATUSES = new Set([
  "VOIDED",
  "CANCELLED",
  "REVERSED",
]);

/**
 * Returns true if a payment should be included in statement totals.
 */
export function isValidPayment(payment) {
  const st = (
    payment?.paymentStatusEnum ||
    payment?.status ||
    ""
  ).toUpperCase();
  return !EXCLUDED_STATUSES.has(st);
}

function isActivePenalty(penalty) {
  const st = (penalty?.penaltyStatus || penalty?.status || "").toUpperCase();
  return !EXCLUDED_PENALTY_STATUSES.has(st);
}

// ---------------------------------------------------------------------------
// Repayment order
// ---------------------------------------------------------------------------

const DEFAULT_REPAYMENT_ORDER = ["penalty", "fees", "interest", "principal"];
const AFTER_MATURITY_PREFIX = "Maturity Date Installment Only - ";
const CLOSED_LIFECYCLE_STATUSES = new Set([
  "CLOSED",
  "CLEARED",
  "PAID",
  "VOIDED",
  "WRITTEN_OFF",
]);

/**
 * Resolve the effective repayment order from a loan product's repaymentOrder
 * field (which may be a JSON string array or a comma-separated string).
 * Falls back to the default order.
 */
export function resolveRepaymentOrder(loanProduct) {
  const raw = loanProduct?.repaymentOrder ?? loanProduct;
  if (!raw) return DEFAULT_REPAYMENT_ORDER;

  const arr =
    Array.isArray(raw) ? raw : safeParseJson(raw) ?? String(raw).split(",");

  if (!Array.isArray(arr) || arr.length === 0) return DEFAULT_REPAYMENT_ORDER;

  const cleaned = arr
    .map((s) => String(s).trim().toLowerCase())
    .filter((s) =>
      ["penalty", "fees", "interest", "principal"].includes(s)
    );

  return cleaned.length > 0 ? cleaned : DEFAULT_REPAYMENT_ORDER;
}

function toDayjsDate(value) {
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.startOf("day") : null;
}

function normalizeAfterMaturityPeriod(unit) {
  const raw = String(unit || "").trim().toLowerCase();

  if (!raw) return null;
  if (raw === "daily") return { kind: "interval", unit: "day", count: 1, label: "Daily" };
  if (raw === "weekly") return { kind: "interval", unit: "week", count: 1, label: "Weekly" };
  if (raw === "every 2 weeks") {
    return { kind: "interval", unit: "week", count: 2, label: "Every 2 weeks" };
  }
  if (raw === "monthly") return { kind: "interval", unit: "month", count: 1, label: "Monthly" };
  if (raw === "every 2 months") {
    return { kind: "interval", unit: "month", count: 2, label: "Every 2 Months" };
  }
  if (raw === "every 3 months") {
    return { kind: "interval", unit: "month", count: 3, label: "Every 3 Months" };
  }
  if (raw === "every 4 months") {
    return { kind: "interval", unit: "month", count: 4, label: "Every 4 Months" };
  }
  if (raw === "every 6 months") {
    return { kind: "interval", unit: "month", count: 6, label: "Every 6 Months" };
  }
  if (raw === "every 9 months") {
    return { kind: "interval", unit: "month", count: 9, label: "Every 9 Months" };
  }
  if (raw === "yearly") return { kind: "interval", unit: "year", count: 1, label: "Yearly" };
  if (raw === "one-off / lump-sum") {
    return { kind: "one-off", unit: null, count: 1, label: "One-off / Lump-Sum" };
  }

  return null;
}

function buildMaturityInstallmentSnapshot(schedule, maturityDate) {
  const maturityDay = toDayjsDate(maturityDate);
  if (!maturityDay || !Array.isArray(schedule) || schedule.length === 0) {
    return { principal: 0, interest: 0, fees: 0, penalty: 0 };
  }

  let matches = schedule.filter((inst) => {
    const dueDate = toDayjsDate(inst?.dueDate);
    return dueDate && dueDate.isSame(maturityDay, "day");
  });

  if (matches.length === 0) {
    const datedInstallments = schedule
      .map((inst) => ({ inst, dueDate: toDayjsDate(inst?.dueDate) }))
      .filter(({ dueDate }) => dueDate && (dueDate.isBefore(maturityDay, "day") || dueDate.isSame(maturityDay, "day")))
      .sort((left, right) => right.dueDate.valueOf() - left.dueDate.valueOf());

    const fallbackDate = datedInstallments[0]?.dueDate;
    if (fallbackDate) {
      matches = datedInstallments
        .filter(({ dueDate }) => dueDate.isSame(fallbackDate, "day"))
        .map(({ inst }) => inst);
    }
  }

  return matches.reduce(
    (accumulator, installment) => ({
      principal: round2(accumulator.principal + Number(installment?.principalDue || 0)),
      interest: round2(accumulator.interest + Number(installment?.interestDue || 0)),
      fees: round2(accumulator.fees + Number(installment?.feesDue || 0)),
      penalty: round2(accumulator.penalty + Number(installment?.penaltyDue || 0)),
    }),
    { principal: 0, interest: 0, fees: 0, penalty: 0 },
  );
}

function resolveAfterMaturityBaseAmount({
  calculateInterestOn,
  balanceState,
  maturitySnapshot,
  principalReleased,
}) {
  const rawMetric = String(calculateInterestOn || "Overdue Principal Amount").trim();
  const usesMaturitySnapshot = rawMetric.startsWith(AFTER_MATURITY_PREFIX);
  const metric = usesMaturitySnapshot
    ? rawMetric.slice(AFTER_MATURITY_PREFIX.length).trim()
    : rawMetric;
  const buckets = usesMaturitySnapshot
    ? maturitySnapshot
    : {
        principal: round2(balanceState?.principal || 0),
        interest: round2(balanceState?.interest || 0),
        fees: round2(balanceState?.fees || 0),
        penalty: round2(balanceState?.penalty || 0),
      };

  switch (metric) {
    case "Overdue Principal Amount":
      return round2(buckets.principal);
    case "Overdue Interest Amount":
      return round2(buckets.interest);
    case "Overdue (Principal + Interest) Amount":
      return round2(buckets.principal + buckets.interest);
    case "Overdue (Principal + Interest + Fees) Amount":
      return round2(buckets.principal + buckets.interest + buckets.fees);
    case "Overdue (Principal + Interest + Penalty) Amount":
      return round2(buckets.principal + buckets.interest + buckets.penalty);
    case "Overdue (Principal + Interest + Fees + Penalty) Amount":
      return round2(
        buckets.principal + buckets.interest + buckets.fees + buckets.penalty,
      );
    case "Overdue (Interest + Fees) Amount":
      return round2(buckets.interest + buckets.fees);
    case "Total Principal Amount Released":
      return round2(principalReleased);
    case "Total Principal Balance Amount":
      return round2(balanceState?.principal || 0);
    default:
      return round2(buckets.principal);
  }
}

function resolveAfterMaturityEndDate({
  loan,
  validPayments,
  maturityDate,
  recurringPeriod,
}) {
  const stopDate = toDayjsDate(loan?.stopDate);
  if (stopDate) return stopDate;

  const extensionPeriods = Number(loan?.extensionPeriod);
  if (
    Number.isFinite(extensionPeriods) &&
    extensionPeriods > 0 &&
    recurringPeriod?.kind === "interval"
  ) {
    return maturityDate.add(
      recurringPeriod.count * extensionPeriods,
      recurringPeriod.unit,
    );
  }

  const normalizedStatus = String(loan?.status || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
  if (CLOSED_LIFECYCLE_STATUSES.has(normalizedStatus) && validPayments.length > 0) {
    const lastPayment = validPayments[validPayments.length - 1];
    const lastPaymentDate = toDayjsDate(
      lastPayment?.paymentDate || lastPayment?.createdAt,
    );
    if (lastPaymentDate) return lastPaymentDate;
  }

  return dayjs().startOf("day");
}

function buildAfterMaturityEvents({ loan, schedule, validPayments, settings }) {
  if (!settings?.extendLoanAfterMaturity) {
    return [];
  }

  const rate = Number(settings.loanInterestRateAfterMaturity);
  if (!Number.isFinite(rate) || rate <= 0) {
    return [];
  }

  const maturityDate =
    toDayjsDate(loan?.maturityDate) ||
    toDayjsDate(schedule?.[schedule.length - 1]?.dueDate);
  if (!maturityDate) {
    return [];
  }

  const recurringPeriod = normalizeAfterMaturityPeriod(
    settings.recurringPeriodAfterMaturityUnit,
  );
  if (!recurringPeriod) {
    return [];
  }

  const accrualEndDate = resolveAfterMaturityEndDate({
    loan,
    validPayments,
    maturityDate,
    recurringPeriod,
  });
  if (!accrualEndDate || !accrualEndDate.isAfter(maturityDate, "day")) {
    return [];
  }

  const maturitySnapshot = buildMaturityInstallmentSnapshot(schedule, maturityDate);
  const accrualDates = [];

  if (recurringPeriod.kind === "one-off") {
    const firstChargeDate = maturityDate.add(1, "day");
    if (
      firstChargeDate.isBefore(accrualEndDate, "day") ||
      firstChargeDate.isSame(accrualEndDate, "day")
    ) {
      accrualDates.push(firstChargeDate);
    }
  } else {
    let cursor = maturityDate.add(recurringPeriod.count, recurringPeriod.unit);
    while (cursor.isBefore(accrualEndDate, "day") || cursor.isSame(accrualEndDate, "day")) {
      accrualDates.push(cursor);
      cursor = cursor.add(recurringPeriod.count, recurringPeriod.unit);
    }
  }

  return accrualDates.map((date, index) => ({
    id: `after-maturity-${index + 1}`,
    date: date.format("YYYY-MM-DD"),
    description: "Post-Maturity Interest",
    cadenceLabel: recurringPeriod.label,
    calculateInterestOn: settings.calculateInterestOn,
    interestTypeMaturity: settings.interestTypeMaturity,
    loanInterestRateAfterMaturity: rate,
    maturitySnapshot,
  }));
}

// ---------------------------------------------------------------------------
// Payment allocation derivation
// ---------------------------------------------------------------------------

/**
 * Check whether a payment already has persisted allocation amounts.
 * We consider allocations persisted when at least one of the four fields is a
 * finite number (not null / undefined / empty string).
 */
function hasPersistedAllocations(payment) {
  return [
    payment.amountAllocatedToPrincipal,
    payment.amountAllocatedToInterest,
    payment.amountAllocatedToFees,
    payment.amountAllocatedToPenalty,
  ].some((v) => v != null && Number.isFinite(Number(v)));
}

/**
 * Derive payment allocations in-order against the current outstanding amounts.
 *
 * @param {number} paymentAmount  - Total payment amount
 * @param {{principal, interest, fees, penalty}} outstanding - Current outstanding balances
 * @param {string[]} order - Repayment order array e.g. ['penalty','fees','interest','principal']
 * @returns {{principal, interest, fees, penalty, unallocated}}
 */
function deriveAllocations(paymentAmount, outstanding, order) {
  const alloc = { principal: 0, interest: 0, fees: 0, penalty: 0 };
  let remaining = round2(paymentAmount);

  const outstandingMap = {
    principal: round2(outstanding.principal),
    interest: round2(outstanding.interest),
    fees: round2(outstanding.fees),
    penalty: round2(outstanding.penalty),
  };

  for (const bucket of order) {
    if (remaining <= 0) break;
    const available = Math.max(0, outstandingMap[bucket] || 0);
    const used = Math.min(remaining, available);
    alloc[bucket] = round2(alloc[bucket] + used);
    remaining = round2(remaining - used);
  }

  return { ...alloc, unallocated: round2(remaining) };
}

// ---------------------------------------------------------------------------
// Schedule resolution
// ---------------------------------------------------------------------------

/**
 * Build a normalized schedule from persisted installments when they are
 * complete enough: must have at least one installment with principalDue,
 * interestDue, totalDue and dueDate set.
 *
 * Returns an array of installment objects or null if unusable.
 */
function resolvePersistedInstallments(loan) {
  const items = loan?.installments?.items;
  if (!Array.isArray(items) || items.length === 0) return null;

  const valid = items.filter(
    (inst) =>
      inst.dueDate &&
      (inst.totalDue != null || inst.principalDue != null)
  );

  if (valid.length === 0) return null;

  return valid
    .slice()
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .map((inst) => ({
      dueDate: inst.dueDate,
      openingBalance: round2(
        (inst.principalDue || 0) + (inst.principalPaid || 0)
      ), // approximation – replaced during ledger build
      principalDue: round2(inst.principalDue || 0),
      interestDue: round2(inst.interestDue || 0),
      feesDue: round2(inst.feesDue || 0),
      penaltyDue: round2(inst.penaltyDue || 0),
      totalDue: round2(inst.totalDue || 0),
      principalPaid: round2(inst.principalPaid || 0),
      interestPaid: round2(inst.interestPaid || 0),
      feesPaid: round2(inst.feesPaid || 0),
      penaltyPaid: round2(inst.penaltyPaid || 0),
      totalPaid: round2(inst.totalPaid || 0),
      status: inst.status || "",
      id: inst.id,
    }));
}

/**
 * Derive a schedule by re-running the computation router using the loan's
 * stored terms (from loanComputationRecord / draftRecord).
 * Returns an array of installment-like objects or null if computation fails.
 */
function deriveScheduleFromComputationRecord(loan) {
  const rec = parseLoanComputationRecord(loan);
  if (!rec || typeof rec !== "object") return null;

  const normalizedRateInterval = (() => {
    const raw = String(loan?.rateInterval || rec?.rateInterval || "").toLowerCase();
    if (raw.includes("day")) return "per_day";
    if (raw.includes("week")) return "per_week";
    if (raw.includes("year") || raw.includes("annual")) return "per_year";
    if (raw.includes("loan")) return "per_loan";
    return raw ? "per_month" : null;
  })();

  // Merge in the top-level loan fields that the computation router expects.
  const values = {
    principalAmount: loan.principal ?? rec.principalAmount,
    interestRate: loan.interestRate ?? rec.interestRate,
    interestMethod:
      loan.loanProduct?.interestCalculationMethod ??
      loan.interestCalculationMethod ??
      rec.interestMethod ??
      rec.interestCalculationMethod,
    interestType: rec.interestType ?? "percentage",
    interestPeriod: rec.interestPeriod ?? normalizedRateInterval ?? "per_month",
    loanStartDate: loan.startDate ?? rec.loanStartDate ?? rec.startDate,
    startDate: loan.startDate ?? rec.startDate ?? rec.loanStartDate,
    disbursementDate:
      rec.disbursementDate ?? loan.startDate ?? rec.loanStartDate,
    maturityDate: loan.maturityDate ?? rec.maturityDate,
    termDuration:
      loan.duration ?? rec.termDuration ?? rec.loanDuration ?? rec.duration,
    loanDuration:
      loan.duration ?? rec.loanDuration ?? rec.termDuration ?? rec.duration,
    duration: loan.duration ?? rec.duration ?? rec.loanDuration,
    durationPeriod:
      loan.durationInterval ??
      rec.durationPeriod ??
      rec.durationInterval,
    durationInterval:
      loan.durationInterval ??
      rec.durationInterval ??
      rec.durationPeriod,
    repaymentFrequency:
      loan.paymentFrequency ??
      rec.repaymentFrequency ??
      rec.paymentFrequency,
    paymentFrequency:
      loan.paymentFrequency ??
      rec.paymentFrequency ??
      rec.repaymentFrequency,
    repaymentFrequencyType: rec.repaymentFrequencyType,
    customPaymentDays: rec.customPaymentDays,
    customPaymentDates: rec.customPaymentDates,
    ...rec,
  };

  try {
    const result = generateSchedulePreviewFromDraftValues(values);
    if (!result?.supported || !result?.schedulePreview?.installments?.length) {
      return null;
    }
    return result.schedulePreview.installments.map((inst, index) => ({
      id: inst.id || `derived-${index + 1}`,
      dueDate: inst.dueDate,
      openingBalance: round2(inst.openingBalance || 0),
      principalDue: round2(inst.principalDue || 0),
      interestDue: round2(inst.interestDue || 0),
      feesDue: round2(inst.feesDue || 0),
      penaltyDue: round2(inst.penaltyDue || 0),
      totalDue: round2(
        inst.totalDue ||
          (inst.principalDue || 0) +
            (inst.interestDue || 0) +
            (inst.feesDue || 0) +
            (inst.penaltyDue || 0)
      ),
      principalPaid: round2(inst.principalPaid || 0),
      interestPaid: round2(inst.interestPaid || 0),
      feesPaid: round2(inst.feesPaid || 0),
      penaltyPaid: round2(inst.penaltyPaid || 0),
      totalPaid: round2(inst.totalPaid || 0),
      status:
        inst.status ||
        (dayjs(inst.dueDate).isBefore(dayjs(), "day") ? "DUE" : "UPCOMING"),
    }));
  } catch (err) {
    console.error("[statementHelpers] deriveScheduleFromComputationRecord failed:", err);
    return null;
  }
}

export function resolveLoanSchedule(loan) {
  return resolvePersistedInstallments(loan) || deriveScheduleFromComputationRecord(loan) || [];
}

function resolvePenaltyEvents(loan) {
  const items = loan?.penalties?.items;
  if (!Array.isArray(items) || items.length === 0) return [];

  return items
    .filter(Boolean)
    .filter(isActivePenalty)
    .map((penalty, index) => ({
      id: penalty.id || `penalty-${index + 1}`,
      date: penalty.penaltyDate || penalty.createdAt || penalty.updatedAt,
      amount: round2(penalty.amount || 0),
      description:
        penalty.penaltyName || penalty.penaltyType || penalty.penaltyCategory || "Penalty",
      status: penalty.penaltyStatus || penalty.status || "",
      notes: penalty.notes || penalty.penaltyDescription || "",
    }))
    .filter((penalty) => penalty.amount > 0 && penalty.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

// ---------------------------------------------------------------------------
// Main ledger builder
// ---------------------------------------------------------------------------

/**
 * Build the combined chronological statement ledger.
 *
 * Each row is one of:
 *  { rowType: 'installment', date, installmentNumber, dueAmounts, cumulativeScheduledPaid, balance }
 *  { rowType: 'penalty', date, amount, description, runningBalance }
 *  { rowType: 'payment', date, amount, allocations, runningBalance, paymentRef }
 *
 * Returns:
 * {
 *   rows: LedgerRow[],
 *   scheduleSource: 'persisted' | 'derived' | 'none',
 *   reconciliation: { derivedBalance, snapshotBalance, diff, hasWarning },
 *   totals: { scheduledPrincipal, scheduledInterest, totalPaid, ... }
 * }
 */
export function buildStatementLedger(loan) {
  if (!loan) {
    return {
      rows: [],
      scheduleSource: "none",
      reconciliation: null,
      totals: {},
    };
  }

  const statementSettings = resolveStatementTermSettings(loan);
  const repaymentOrder = resolveRepaymentOrder(statementSettings.repaymentOrder);

  // 1. Resolve schedule
  const persistedInstallments = resolvePersistedInstallments(loan);
  let schedule = resolveLoanSchedule(loan);
  let scheduleSource = persistedInstallments ? "persisted" : "derived";

  if (!schedule || schedule.length === 0) {
    scheduleSource = "none";
    schedule = [];
  }

  const penaltyEvents = resolvePenaltyEvents(loan);
  const assessedPenalty = round2(
    penaltyEvents.reduce((sum, penalty) => sum + penalty.amount, 0)
  );

  // 2. Compute running opening balances for schedule rows
  //    (some persisted installments have imprecise openingBalance)
  {
    const principal = round2(loan.principal || 0);
    let running = principal;
    for (const inst of schedule) {
      inst._openingBalance = running;
      running = round2(Math.max(0, running - inst.principalDue));
    }
  }

  // 3. Normalize and sort valid payments chronologically
  const rawPayments = loan?.payments?.items ?? [];
  const validPayments = rawPayments
    .filter(isValidPayment)
    .slice()
    .sort((a, b) => {
      const da = new Date(a.paymentDate || 0);
      const db = new Date(b.paymentDate || 0);
      return da - db;
    });
  const afterMaturityEvents = buildAfterMaturityEvents({
    loan,
    schedule,
    validPayments,
    settings: statementSettings,
  });

  // 4. Build chronological ledger with running balances
  //    Track: principal, interest, fees, penalty outstanding separately
  const principal = round2(loan.principal || 0);

  // Aggregate scheduled amounts to initialize outstanding buckets
  const totalScheduledInterest = round2(
    schedule.reduce((s, i) => s + (i.interestDue || 0), 0)
  );
  const totalScheduledFees = round2(
    schedule.reduce((s, i) => s + (i.feesDue || 0), 0)
  );
  const totalScheduledPenalty = round2(
    schedule.reduce((s, i) => s + (i.penaltyDue || 0), 0)
  );

  // Current outstanding trackers (reduce as payments are applied)
  const balanceState = {
    principal,
    interest: totalScheduledInterest,
    fees: totalScheduledFees,
    penalty: totalScheduledPenalty,
  };

  const runningTotal = () =>
    round2(
      balanceState.principal +
        balanceState.interest +
        balanceState.fees +
        balanceState.penalty
    );

  // 5. Merge all events on a timeline
  const events = [];

  let instNum = 0;
  for (const inst of schedule) {
    instNum++;
    events.push({
      _date: new Date(inst.dueDate || 0),
      _type: "installment",
      data: { ...inst, _instNum: instNum },
    });
  }
  for (const penalty of penaltyEvents) {
    events.push({
      _date: new Date(penalty.date || 0),
      _type: "penalty",
      data: penalty,
    });
  }
  for (const extension of afterMaturityEvents) {
    events.push({
      _date: new Date(extension.date || 0),
      _type: "extension",
      data: extension,
    });
  }
  for (const p of validPayments) {
    events.push({ _date: new Date(p.paymentDate || 0), _type: "payment", data: p });
  }

  // Sort chronologically; installments before same-day payments
  const typeOrder = { installment: 0, extension: 1, penalty: 2, payment: 3 };
  events.sort((a, b) => {
    const dt = a._date - b._date;
    if (dt !== 0) return dt;
    return (typeOrder[a._type] || 0) - (typeOrder[b._type] || 0);
  });

  // 6. Walk timeline and produce rows
  const rows = [];
  let totalPaymentsApplied = 0;
  let totalPrincipalPaid = 0;
  let totalInterestPaid = 0;
  let totalFeesPaid = 0;
  let totalPenaltyPaid = 0;
  let totalAfterMaturityInterest = 0;

  for (const ev of events) {
    if (ev._type === "installment") {
      const inst = ev.data;
      rows.push({
        rowType: "installment",
        key: `inst-${inst.id || inst._instNum}`,
        date: inst.dueDate,
        installmentNumber: inst._instNum,
        openingBalance: round2(inst._openingBalance),
        principalDue: round2(inst.principalDue || 0),
        interestDue: round2(inst.interestDue || 0),
        feesDue: round2(inst.feesDue || 0),
        penaltyDue: round2(inst.penaltyDue || 0),
        totalDue: round2(inst.totalDue || inst.principalDue + inst.interestDue + inst.feesDue + inst.penaltyDue || 0),
        principalPaid: round2(inst.principalPaid || 0),
        interestPaid: round2(inst.interestPaid || 0),
        feesPaid: round2(inst.feesPaid || 0),
        penaltyPaid: round2(inst.penaltyPaid || 0),
        totalPaid: round2(inst.totalPaid || 0),
        status: inst.status || "",
        runningBalance: runningTotal(),
      });
    } else if (ev._type === "penalty") {
      const penalty = ev.data;
      balanceState.penalty = round2(balanceState.penalty + penalty.amount);

      rows.push({
        rowType: "penalty",
        key: `penalty-${penalty.id}`,
        date: penalty.date,
        amount: penalty.amount,
        penaltyDue: penalty.amount,
        totalDue: penalty.amount,
        description: penalty.description,
        status: penalty.status,
        notes: penalty.notes,
        runningBalance: runningTotal(),
      });
    } else if (ev._type === "extension") {
      const extension = ev.data;
      const baseAmount = resolveAfterMaturityBaseAmount({
        calculateInterestOn: extension.calculateInterestOn,
        balanceState,
        maturitySnapshot: extension.maturitySnapshot,
        principalReleased: principal,
      });

      if (baseAmount <= 0) {
        continue;
      }

      const chargeAmount =
        String(extension.interestTypeMaturity || "percentage").toLowerCase() === "fixed"
          ? round2(extension.loanInterestRateAfterMaturity)
          : round2((baseAmount * Number(extension.loanInterestRateAfterMaturity || 0)) / 100);

      if (chargeAmount <= 0) {
        continue;
      }

      balanceState.interest = round2(balanceState.interest + chargeAmount);
      totalAfterMaturityInterest = round2(totalAfterMaturityInterest + chargeAmount);

      rows.push({
        rowType: "extension",
        key: extension.id,
        date: extension.date,
        description: extension.description,
        status: extension.cadenceLabel,
        interestDue: chargeAmount,
        totalDue: chargeAmount,
        runningBalance: runningTotal(),
      });
    } else if (ev._type === "payment") {
      const p = ev.data;
      const amount = round2(p.amount || 0);

      let alloc;
      if (hasPersistedAllocations(p)) {
        alloc = {
          principal: round2(Number(p.amountAllocatedToPrincipal) || 0),
          interest: round2(Number(p.amountAllocatedToInterest) || 0),
          fees: round2(Number(p.amountAllocatedToFees) || 0),
          penalty: round2(Number(p.amountAllocatedToPenalty) || 0),
          unallocated: 0,
        };
      } else {
        alloc = deriveAllocations(amount, balanceState, repaymentOrder);
      }

      // Apply allocations to balance state
      balanceState.principal = round2(
        Math.max(0, balanceState.principal - alloc.principal)
      );
      balanceState.interest = round2(
        Math.max(0, balanceState.interest - alloc.interest)
      );
      balanceState.fees = round2(
        Math.max(0, balanceState.fees - alloc.fees)
      );
      balanceState.penalty = round2(
        Math.max(0, balanceState.penalty - alloc.penalty)
      );

      totalPaymentsApplied = round2(totalPaymentsApplied + amount);
      totalPrincipalPaid = round2(totalPrincipalPaid + alloc.principal);
      totalInterestPaid = round2(totalInterestPaid + alloc.interest);
      totalFeesPaid = round2(totalFeesPaid + alloc.fees);
      totalPenaltyPaid = round2(totalPenaltyPaid + alloc.penalty);

      rows.push({
        rowType: "payment",
        key: `pmt-${p.id}`,
        date: p.paymentDate,
        amount,
        paymentMethod: p.paymentMethod || "",
        referenceNumber: p.referenceNumber || "",
        paymentStatusEnum: p.paymentStatusEnum || p.status || "",
        allocPrincipal: alloc.principal,
        allocInterest: alloc.interest,
        allocFees: alloc.fees,
        allocPenalty: alloc.penalty,
        allocUnallocated: alloc.unallocated,
        allocDerived: !hasPersistedAllocations(p),
        runningBalance: runningTotal(),
        balancePrincipal: balanceState.principal,
        balanceInterest: balanceState.interest,
        balanceFees: balanceState.fees,
        balancePenalty: balanceState.penalty,
      });
    }
  }

  // 7. Totals
  const scheduledPrincipal = round2(
    schedule.reduce((s, i) => s + (i.principalDue || 0), 0)
  );
  const scheduledInterest = round2(totalScheduledInterest + totalAfterMaturityInterest);
  const scheduledFees = totalScheduledFees;
  const scheduledPenalty = totalScheduledPenalty;
  const totalScheduled = round2(
    scheduledPrincipal +
      scheduledInterest +
      scheduledFees +
      scheduledPenalty +
      assessedPenalty
  );

  // 8. Reconciliation
  const snapshotBalance = null;
  const derivedBalance = runningTotal();
  const diff = null;
  const reconciliation = {
    derivedBalance,
    snapshotBalance,
    diff,
    hasWarning: false,
    principalBalance: balanceState.principal,
    interestBalance: balanceState.interest,
    feesBalance: balanceState.fees,
    penaltyBalance: balanceState.penalty,
  };

  return {
    schedule,
    rows,
    scheduleSource,
    reconciliation,
    totals: {
      scheduledPrincipal,
      scheduledInterest,
      afterMaturityInterest: totalAfterMaturityInterest,
      scheduledFees,
      scheduledPenalty,
      assessedPenalty,
      totalScheduled,
      totalPaymentsApplied,
      totalPrincipalPaid,
      totalInterestPaid,
      totalFeesPaid,
      totalPenaltyPaid,
      remainingPrincipal: balanceState.principal,
      remainingInterest: balanceState.interest,
      remainingFees: balanceState.fees,
      remainingPenalty: balanceState.penalty,
      totalRemaining: derivedBalance,
    },
  };
}
