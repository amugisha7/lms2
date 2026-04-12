import {
  buildStatementLedger,
  formatBorrowerName,
  formatEmployeeName,
} from "./LoanStatements/statementHelpers";

export const LOAN_DISPLAY_STATUS = Object.freeze({
  CURRENT: {
    code: "CURRENT",
    label: "Current",
    filterKey: "current",
    rank: 10,
  },
  MISSED_PAYMENT: {
    code: "CURRENT_WITH_MISSED_PAYMENT",
    label: "Current with missed payment",
    filterKey: "missed_payment",
    rank: 20,
  },
  OVERDUE: {
    code: "OVERDUE",
    label: "Overdue",
    filterKey: "overdue",
    rank: 30,
  },
  CLOSED: {
    code: "CLOSED",
    label: "Closed",
    filterKey: "closed",
    rank: 40,
  },
  WRITTEN_OFF: {
    code: "WRITTEN_OFF",
    label: "Written Off",
    filterKey: "written_off",
    rank: 50,
  },
  VOIDED: {
    code: "VOIDED",
    label: "Voided",
    filterKey: "voided",
    rank: 60,
  },
});

const normalizeLifecycleStatus = (value) =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

export const isExcludedSummaryLifecycleStatus = (status) => {
  const normalizedStatus = normalizeLifecycleStatus(status);
  return !!normalizedStatus && EXCLUDED_SUMMARY_STATUSES.has(normalizedStatus);
};

export const isLoanSummaryVisible = (summary) =>
  !isExcludedSummaryLifecycleStatus(summary?.lifecycleStatus);

const EXCLUDED_SUMMARY_STATUSES = new Set([
  "DRAFT",
  "REVIEW",
  "REJECTED",
  "IN_REVIEW",
]);
const PAYMENT_EXCLUDED_STATUSES = new Set(["REVERSED", "VOIDED", "FAILED"]);
const EPSILON = 0.009;

const startOfDay = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

const toDateOnly = (value) => {
  const date = startOfDay(value);
  return date ? date.toISOString().slice(0, 10) : null;
};

const toIsoStartOfDay = (value, offsetDays = 0) => {
  const date = startOfDay(value);
  if (!date) return null;
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString();
};

const normalizeSearchText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

export const normalizeMoneyValue = (value) => {
  if (value == null) return 0;
  const numericValue =
    typeof value === "string"
      ? Number(value.replace(/,/g, "").trim())
      : Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const roundMoney = (value) =>
  Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;

const normalizeLoanCollections = (loan) => ({
  ...loan,
  payments: {
    ...(loan?.payments || {}),
    items: (loan?.payments?.items || []).filter(Boolean),
  },
  penalties: {
    ...(loan?.penalties || {}),
    items: (loan?.penalties?.items || []).filter(Boolean),
  },
});

export const computeTotalPaid = (payments) => {
  if (!payments?.items?.length) return 0;

  return payments.items
    .filter((payment) => {
      const status = (
        payment.paymentStatusEnum ||
        payment.status ||
        ""
      ).toUpperCase();
      return !PAYMENT_EXCLUDED_STATUSES.has(status);
    })
    .reduce((sum, payment) => sum + normalizeMoneyValue(payment?.amount), 0);
};

export const computeMaturityDate = (loan) => {
  if (loan?.maturityDate) return loan.maturityDate;

  const { startDate, duration, durationInterval } = loan || {};
  if (!startDate || !duration || !durationInterval) return null;

  const maturity = new Date(startDate);
  if (Number.isNaN(maturity.getTime())) return null;

  const durationValue = Number(duration);
  const interval = String(durationInterval).toLowerCase();

  if (interval.includes("day")) maturity.setDate(maturity.getDate() + durationValue);
  else if (interval.includes("week")) maturity.setDate(maturity.getDate() + durationValue * 7);
  else if (interval.includes("month") || interval.includes("quarter")) {
    const monthsToAdd = interval.includes("quarter") ? durationValue * 3 : durationValue;
    maturity.setMonth(maturity.getMonth() + monthsToAdd);
  } else if (interval.includes("year") || interval.includes("annual")) {
    maturity.setFullYear(maturity.getFullYear() + durationValue);
  } else {
    return null;
  }

  return maturity.toISOString().slice(0, 10);
};

export const daysUntil = (dateStr, referenceDate = new Date()) => {
  const target = startOfDay(dateStr);
  const reference = startOfDay(referenceDate);
  if (!target || !reference) return null;
  return Math.round((target.getTime() - reference.getTime()) / 86400000);
};

const getInstallmentDueAmount = (installment) => {
  if (!installment) return 0;

  if (installment.totalDue != null) {
    return normalizeMoneyValue(installment.totalDue);
  }

  return roundMoney(
    normalizeMoneyValue(installment.principalDue) +
      normalizeMoneyValue(installment.interestDue) +
      normalizeMoneyValue(installment.feesDue) +
      normalizeMoneyValue(installment.penaltyDue),
  );
};

const getSortedSchedule = (loan) =>
  [...(loan?.derivedStatement?.schedule || [])].sort(
    (left, right) =>
      new Date(left?.dueDate || 0).getTime() - new Date(right?.dueDate || 0).getTime(),
  );

export const getTotalPaid = (loan) =>
  loan?.totalPaidComputed != null
    ? loan.totalPaidComputed
    : computeTotalPaid(loan?.payments);

export const getBalance = (loan) => {
  if (loan?.amountDueComputed != null) return loan.amountDueComputed;
  return normalizeMoneyValue(loan?.principal) - getTotalPaid(loan);
};

export const getPrincipalBalance = (loan) => {
  if (loan?.loanBalanceComputed != null) return loan.loanBalanceComputed;
  return Math.max(normalizeMoneyValue(loan?.principal) - getTotalPaid(loan), 0);
};

const getLastPaymentDate = (loan) => {
  const payments = [...(loan?.payments?.items || [])]
    .filter(Boolean)
    .filter((payment) => {
      const status = (
        payment.paymentStatusEnum ||
        payment.status ||
        ""
      ).toUpperCase();
      return !PAYMENT_EXCLUDED_STATUSES.has(status);
    })
    .sort(
      (left, right) =>
        new Date(right?.paymentDate || right?.createdAt || 0).getTime() -
        new Date(left?.paymentDate || left?.createdAt || 0).getTime(),
    );

  return payments.length
    ? toDateOnly(payments[0]?.paymentDate || payments[0]?.createdAt)
    : null;
};

const computeScheduleMetrics = (loan, referenceDate = new Date()) => {
  const schedule = getSortedSchedule(loan);
  const today = startOfDay(referenceDate) || startOfDay(new Date());
  const totalPaid = getTotalPaid(loan);
  let cumulativeDue = 0;
  let dueBeforeToday = 0;
  let missedInstallmentCount = 0;
  let firstOutstandingDueDate = null;
  let firstFutureInstallmentDueDate = null;

  schedule.forEach((installment) => {
    const dueDate = startOfDay(installment?.dueDate);
    if (!dueDate) return;

    const dueDateOnly = dueDate.toISOString().slice(0, 10);
    const dueAmount = getInstallmentDueAmount(installment);
    cumulativeDue = roundMoney(cumulativeDue + dueAmount);

    if (!firstFutureInstallmentDueDate && dueDate >= today) {
      firstFutureInstallmentDueDate = dueDateOnly;
    }

    const installmentOutstanding = cumulativeDue > totalPaid + EPSILON;
    if (installmentOutstanding && !firstOutstandingDueDate) {
      firstOutstandingDueDate = dueDateOnly;
    }

    if (dueDate < today) {
      dueBeforeToday = roundMoney(dueBeforeToday + dueAmount);
      if (installmentOutstanding) {
        missedInstallmentCount += 1;
      }
    }
  });

  return {
    missedInstallmentCount,
    arrearsAmount: roundMoney(Math.max(0, dueBeforeToday - totalPaid)),
    nextDueDate: firstOutstandingDueDate || firstFutureInstallmentDueDate,
    firstFutureInstallmentDueDate,
  };
};

export const isLoanSummaryCandidate = (loan) => {
  const rawStatus = normalizeLifecycleStatus(loan?.status);
  return rawStatus && !EXCLUDED_SUMMARY_STATUSES.has(rawStatus);
};

export const resolveDisplayStatusMeta = (loan, metrics, referenceDate = new Date()) => {
  const rawStatus = normalizeLifecycleStatus(loan?.status);

  if (rawStatus === "WRITTEN_OFF") return LOAN_DISPLAY_STATUS.WRITTEN_OFF;
  if (rawStatus === "VOIDED") return LOAN_DISPLAY_STATUS.VOIDED;
  if (["CLOSED", "CLEARED", "PAID"].includes(rawStatus)) {
    return LOAN_DISPLAY_STATUS.CLOSED;
  }

  const maturityDate = computeMaturityDate(loan);
  const daysToMaturity = daysUntil(maturityDate, referenceDate);
  if (daysToMaturity != null && daysToMaturity < 0) {
    return LOAN_DISPLAY_STATUS.OVERDUE;
  }

  if ((metrics?.missedInstallmentCount || 0) > 0) {
    return LOAN_DISPLAY_STATUS.MISSED_PAYMENT;
  }

  return LOAN_DISPLAY_STATUS.CURRENT;
};

export const computeNextStatusTransitionAt = (
  loan,
  metrics,
  referenceDate = new Date(),
) => {
  const displayStatus = resolveDisplayStatusMeta(loan, metrics, referenceDate);
  if (
    [
      LOAN_DISPLAY_STATUS.CLOSED.code,
      LOAN_DISPLAY_STATUS.WRITTEN_OFF.code,
      LOAN_DISPLAY_STATUS.VOIDED.code,
    ].includes(displayStatus.code)
  ) {
    return null;
  }

  const candidates = [];
  const maturityTransitionAt = toIsoStartOfDay(computeMaturityDate(loan), 1);
  if (maturityTransitionAt) {
    candidates.push(maturityTransitionAt);
  }

  if (metrics?.firstFutureInstallmentDueDate) {
    candidates.push(toIsoStartOfDay(metrics.firstFutureInstallmentDueDate, 1));
  }

  const now = new Date(referenceDate);
  const futureCandidate = candidates
    .filter(Boolean)
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()) && date.getTime() > now.getTime())
    .sort((left, right) => left.getTime() - right.getTime())[0];

  if (futureCandidate) {
    return futureCandidate.toISOString();
  }

  const tomorrow = startOfDay(referenceDate) || startOfDay(new Date());
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString();
};

export const attachDerivedLoanData = (loan, options = {}) => {
  const referenceDate = options.referenceDate || new Date();
  const normalizedLoan = normalizeLoanCollections(loan);
  const derivedStatement =
    normalizedLoan?.derivedStatement || buildStatementLedger(normalizedLoan);
  const totalPaidComputed = derivedStatement?.totals?.totalPaymentsApplied || 0;
  const amountDueComputed = derivedStatement?.totals?.totalRemaining || 0;
  const loanBalanceComputed = derivedStatement?.totals?.remainingPrincipal || 0;

  const baseLoan = {
    ...normalizedLoan,
    derivedStatement,
    totalPaidComputed,
    amountDueComputed,
    loanBalanceComputed,
  };

  const scheduleMetrics = computeScheduleMetrics(baseLoan, referenceDate);
  const displayStatus = resolveDisplayStatusMeta(
    baseLoan,
    scheduleMetrics,
    referenceDate,
  );

  return {
    ...baseLoan,
    arrearsAmountComputed: scheduleMetrics.arrearsAmount,
    missedInstallmentCountComputed: scheduleMetrics.missedInstallmentCount,
    nextDueDateComputed: scheduleMetrics.nextDueDate,
    firstFutureInstallmentDueDate: scheduleMetrics.firstFutureInstallmentDueDate,
    lastPaymentDateComputed: getLastPaymentDate(baseLoan),
    uiStatusCode: displayStatus.code,
    uiStatusLabel: displayStatus.label,
    uiStatusFilterKey: displayStatus.filterKey,
    displayStatusRank: displayStatus.rank,
    displayStatusComputedAt: new Date(referenceDate).toISOString(),
    nextStatusTransitionAt: computeNextStatusTransitionAt(
      baseLoan,
      scheduleMetrics,
      referenceDate,
    ),
  };
};

export const buildLoanSummaryRecord = (loan, options = {}) => {
  const derivedLoan = attachDerivedLoanData(loan, options);
  if (!isLoanSummaryCandidate(derivedLoan)) {
    return null;
  }

  const borrowerDisplayName = formatBorrowerName(derivedLoan.borrower);
  const institutionId =
    options.defaultInstitutionId ||
    derivedLoan?.institutionID ||
    derivedLoan?.branch?.institution?.id ||
    null;
  const currencyCode =
    options.defaultCurrencyCode ||
    derivedLoan?.loanCurrency ||
    derivedLoan?.branch?.institution?.currencyCode ||
    null;

  return {
    id: options.summaryId || derivedLoan.id,
    loanID: derivedLoan.id,
    refreshScope: "LOAN_SUMMARY",
    institutionID: institutionId,
    branchID: derivedLoan.branchID || derivedLoan.branch?.id || null,
    borrowerID: derivedLoan.borrowerID || derivedLoan.borrower?.id || null,
    borrowerDisplayName: borrowerDisplayName || null,
    borrowerDisplayNameNormalized: normalizeSearchText(borrowerDisplayName),
    borrowerPhone:
      derivedLoan?.borrower?.phoneNumber ||
      derivedLoan?.borrower?.otherPhoneNumber ||
      null,
    loanNumber: derivedLoan.loanNumber || null,
    loanOfficerID:
      derivedLoan.createdByEmployeeID || derivedLoan.createdByEmployee?.id || null,
    loanOfficerDisplayName: formatEmployeeName(derivedLoan.createdByEmployee),
    loanProductID: derivedLoan.loanProductID || derivedLoan.loanProduct?.id || null,
    loanProductName: derivedLoan.loanProduct?.name || null,
    principalAmount: normalizeMoneyValue(derivedLoan.principal),
    totalPaidAmount: getTotalPaid(derivedLoan),
    amountDueAmount: getBalance(derivedLoan),
    loanBalanceAmount: getPrincipalBalance(derivedLoan),
    arrearsAmount: derivedLoan.arrearsAmountComputed || 0,
    missedInstallmentCount: derivedLoan.missedInstallmentCountComputed || 0,
    nextDueDate: derivedLoan.nextDueDateComputed || null,
    lastPaymentDate: derivedLoan.lastPaymentDateComputed || null,
    startDate: derivedLoan.startDate || null,
    maturityDateEffective: computeMaturityDate(derivedLoan),
    lifecycleStatus: derivedLoan.status || null,
    displayStatus: derivedLoan.uiStatusCode,
    displayStatusRank: derivedLoan.displayStatusRank,
    displayStatusComputedAt: derivedLoan.displayStatusComputedAt,
    nextStatusTransitionAt: derivedLoan.nextStatusTransitionAt,
    currencyCode,
  };
};