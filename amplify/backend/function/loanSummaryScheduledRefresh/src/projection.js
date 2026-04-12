import dayjs from "dayjs";

const EXCLUDED_SUMMARY_STATUSES = new Set([
  "DRAFT",
  "REVIEW",
  "REJECTED",
  "IN_REVIEW",
]);
const PAYMENT_EXCLUDED_STATUSES = new Set(["REVERSED", "VOIDED", "FAILED"]);
const EXCLUDED_PENALTY_STATUSES = new Set([
  "VOIDED",
  "CANCELLED",
  "REVERSED",
]);
const DEFAULT_REPAYMENT_ORDER = ["penalty", "fees", "interest", "principal"];
const EPSILON = 0.009;

const normalizeLifecycleStatus = (value) =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

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
    label: "voided",
    filterKey: "voided",
    rank: 60,
  },
});

const round2 = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;
  return Math.round((numericValue + Number.EPSILON) * 100) / 100;
};

export const normalizeMoneyValue = (value) => {
  if (value == null) return 0;
  const numericValue =
    typeof value === "string"
      ? Number(value.replace(/,/g, "").trim())
      : Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

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

const safeParseJson = (value) => {
  if (!value) return null;
  if (typeof value === "object") return value;
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const parseLoanComputationRecord = (loan) => {
  const raw = loan?.loanComputationRecord ?? loan?.draftRecord;
  const parsed = safeParseJson(raw);
  if (!parsed || typeof parsed !== "object") return {};

  const nested = parsed.draftRecord;
  if (nested) {
    const inner = safeParseJson(nested);
    if (inner && typeof inner === "object") return inner;
    if (typeof nested === "object") return nested;
  }

  return parsed;
};

export const formatBorrowerName = (borrower) => {
  if (!borrower) return "";
  return (
    [borrower.firstname, borrower.othername, borrower.businessName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    borrower.uniqueIdNumber ||
    ""
  );
};

export const formatEmployeeName = (employee) => {
  if (!employee) return "N/A";
  return (
    [employee.firstName, employee.lastName].filter(Boolean).join(" ") ||
    employee.email ||
    "N/A"
  );
};

const isValidPayment = (payment) => {
  const status = (
    payment?.paymentStatusEnum ||
    payment?.status ||
    ""
  ).toUpperCase();
  return !PAYMENT_EXCLUDED_STATUSES.has(status);
};

const isActivePenalty = (penalty) => {
  const status = (penalty?.penaltyStatus || penalty?.status || "").toUpperCase();
  return !EXCLUDED_PENALTY_STATUSES.has(status);
};

const resolveRepaymentOrder = (loanProduct) => {
  const raw = loanProduct?.repaymentOrder;
  if (!raw) return DEFAULT_REPAYMENT_ORDER;

  const parsed =
    Array.isArray(raw) ? raw : safeParseJson(raw) ?? String(raw).split(",");

  if (!Array.isArray(parsed) || parsed.length === 0) {
    return DEFAULT_REPAYMENT_ORDER;
  }

  const cleaned = parsed
    .map((value) => String(value).trim().toLowerCase())
    .filter((value) => DEFAULT_REPAYMENT_ORDER.includes(value));

  return cleaned.length > 0 ? cleaned : DEFAULT_REPAYMENT_ORDER;
};

const hasPersistedAllocations = (payment) =>
  [
    payment?.amountAllocatedToPrincipal,
    payment?.amountAllocatedToInterest,
    payment?.amountAllocatedToFees,
    payment?.amountAllocatedToPenalty,
  ].some((value) => value != null && Number.isFinite(Number(value)));

const deriveAllocations = (paymentAmount, outstanding, order) => {
  const allocations = { principal: 0, interest: 0, fees: 0, penalty: 0 };
  let remaining = round2(paymentAmount);

  const outstandingByBucket = {
    principal: round2(outstanding.principal),
    interest: round2(outstanding.interest),
    fees: round2(outstanding.fees),
    penalty: round2(outstanding.penalty),
  };

  for (const bucket of order) {
    if (remaining <= 0) break;
    const available = Math.max(0, outstandingByBucket[bucket] || 0);
    const used = Math.min(remaining, available);
    allocations[bucket] = round2(allocations[bucket] + used);
    remaining = round2(remaining - used);
  }

  return { ...allocations, unallocated: round2(remaining) };
};

const resolvePersistedInstallments = (loan) => {
  const items = loan?.installments?.items;
  if (!Array.isArray(items) || items.length === 0) return null;

  const valid = items.filter(
    (installment) =>
      installment?.dueDate &&
      (installment?.totalDue != null || installment?.principalDue != null),
  );

  if (valid.length === 0) return null;

  return valid
    .slice()
    .sort((left, right) => new Date(left.dueDate) - new Date(right.dueDate))
    .map((installment) => ({
      dueDate: installment.dueDate,
      openingBalance: round2(
        (installment.principalDue || 0) + (installment.principalPaid || 0),
      ),
      principalDue: round2(installment.principalDue || 0),
      interestDue: round2(installment.interestDue || 0),
      feesDue: round2(installment.feesDue || 0),
      penaltyDue: round2(installment.penaltyDue || 0),
      totalDue: round2(installment.totalDue || 0),
      principalPaid: round2(installment.principalPaid || 0),
      interestPaid: round2(installment.interestPaid || 0),
      feesPaid: round2(installment.feesPaid || 0),
      penaltyPaid: round2(installment.penaltyPaid || 0),
      totalPaid: round2(installment.totalPaid || 0),
      status: installment.status || "",
      id: installment.id,
    }));
};

const durationUnitMap = {
  days: "day",
  weeks: "week",
  months: "month",
  years: "year",
};

const mapRepaymentFrequency = (frequency) => {
  switch (frequency) {
    case "daily":
      return "DAILY";
    case "weekly":
      return "WEEKLY";
    case "biweekly":
      return "BIWEEKLY";
    case "monthly":
    case "bimonthly":
      return "MONTHLY";
    case "quarterly":
    case "every_4_months":
      return "QUARTERLY";
    case "semi_annual":
      return "SEMIANNUALLY";
    case "every_9_months":
    case "yearly":
      return "ANNUALLY";
    case "lump_sum":
      return "LUMP_SUM";
    default:
      return "MONTHLY";
  }
};

const mapInterestCalculationMethod = (method) => {
  if (!method) return "FLAT";
  if (method === "flat") return "FLAT";
  if (String(method).startsWith("compound")) return "COMPOUND";
  return "SIMPLE";
};

const frequencyToInterval = (repaymentFrequency) => {
  switch (repaymentFrequency) {
    case "DAILY":
      return { unit: "day", count: 1 };
    case "WEEKLY":
      return { unit: "week", count: 1 };
    case "BIWEEKLY":
      return { unit: "week", count: 2 };
    case "MONTHLY":
      return { unit: "month", count: 1 };
    case "QUARTERLY":
      return { unit: "month", count: 3 };
    case "SEMIANNUALLY":
      return { unit: "month", count: 6 };
    case "ANNUALLY":
      return { unit: "year", count: 1 };
    default:
      return { unit: "month", count: 1 };
  }
};

const getAnnualRateFromInterestPeriod = ({ interestRate, interestPeriod }) => {
  const rate = Number(interestRate);
  if (!Number.isFinite(rate) || rate < 0) return null;
  const annualized = rate / 100;

  switch (interestPeriod) {
    case "per_day":
      return annualized * 365;
    case "per_week":
      return annualized * 52;
    case "per_month":
      return annualized * 12;
    case "per_year":
      return annualized;
    case "per_loan":
      return null;
    default:
      return annualized;
  }
};

const buildInstallmentDates = ({
  startDate,
  maturityDate,
  repaymentFrequency,
  repaymentFrequencyType,
  customPaymentDays,
  customPaymentDates,
}) => {
  const start = dayjs(startDate);
  const maturity = dayjs(maturityDate);
  if (!start.isValid() || !maturity.isValid()) return [];

  if (repaymentFrequency === "LUMP_SUM") {
    return [maturity.format("YYYY-MM-DD")];
  }

  if (repaymentFrequencyType === "setDays") {
    const dayMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    const wantedDays = Array.isArray(customPaymentDays) ? customPaymentDays : [];
    const wanted = new Set(
      wantedDays.map((value) => dayMap[value]).filter(Number.isInteger),
    );
    if (wanted.size === 0) return [];

    const dates = [];
    let cursor = start.add(1, "day");
    while (cursor.isBefore(maturity) || cursor.isSame(maturity, "day")) {
      if (wanted.has(cursor.day())) {
        dates.push(cursor.format("YYYY-MM-DD"));
      }
      cursor = cursor.add(1, "day");
    }
    return dates;
  }

  if (repaymentFrequencyType === "setDates") {
    const wantedDates = Array.isArray(customPaymentDates) ? customPaymentDates : [];
    const wanted = wantedDates
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value >= 1 && value <= 31);
    if (wanted.length === 0) return [];

    const dates = [];
    let cursor = start.startOf("month");
    while (cursor.isBefore(maturity) || cursor.isSame(maturity, "month")) {
      for (const dayNumber of wanted) {
        const candidate = cursor.date(dayNumber);
        if (candidate.month() !== cursor.month()) continue;
        if (
          candidate.isAfter(start) &&
          (candidate.isBefore(maturity) || candidate.isSame(maturity, "day"))
        ) {
          dates.push(candidate.format("YYYY-MM-DD"));
        }
      }
      cursor = cursor.add(1, "month");
    }

    dates.sort((left, right) => new Date(left) - new Date(right));
    return dates;
  }

  const { unit, count } = frequencyToInterval(repaymentFrequency);
  const dates = [];
  let cursor = start.add(count, unit);
  while (cursor.isBefore(maturity) || cursor.isSame(maturity, "day")) {
    dates.push(cursor.format("YYYY-MM-DD"));
    cursor = cursor.add(count, unit);
  }
  return dates;
};

const generateLumpSumSchedule = ({
  principal,
  startDate,
  maturityDate,
  duration,
  durationInterval,
  interestRate,
  interestPeriod,
  interestType,
  interestMethod,
}) => {
  const start = dayjs(startDate);
  const maturity = dayjs(maturityDate);

  if (interestPeriod === "per_loan") {
    let totalInterest = 0;
    if (interestType === "fixed") {
      totalInterest = Number(interestRate);
    } else {
      totalInterest = principal * (Number(interestRate) / 100);
    }

    totalInterest = round2(totalInterest);
    const totalDue = round2(principal + totalInterest);

    return {
      supported: true,
      schedulePreview: {
        installments: [
          {
            dueDate: maturity.format("YYYY-MM-DD"),
            openingBalance: round2(principal),
            principalDue: round2(principal),
            interestDue: totalInterest,
            feesDue: 0,
            totalDue,
            balanceAfter: 0,
          },
        ],
        totals: {
          totalPrincipal: round2(principal),
          totalInterest,
          totalFees: 0,
          totalPayable: totalDue,
          numberOfInstallments: 1,
        },
      },
    };
  }

  let stepUnit = durationUnitMap[durationInterval] || "month";
  let stepCount = 1;
  const dates = [];
  let cursor = start.add(stepCount, stepUnit);
  let safety = 0;

  while ((cursor.isBefore(maturity) || cursor.isSame(maturity, "day")) && safety < 1000) {
    dates.push(cursor.format("YYYY-MM-DD"));
    cursor = cursor.add(stepCount, stepUnit);
    safety += 1;
  }

  const lastDate = dates.length > 0 ? dates[dates.length - 1] : null;
  if (!lastDate || !dayjs(lastDate).isSame(maturity, "day")) {
    if (!lastDate || dayjs(lastDate).isBefore(maturity)) {
      dates.push(maturity.format("YYYY-MM-DD"));
    }
  }

  const inputRate = Number(interestRate) / 100;
  const installments = [];
  let currentBalance = principal;
  let previousDate = dayjs(startDate);

  for (let index = 0; index < dates.length; index += 1) {
    const date = dates[index];
    const currentDate = dayjs(date);
    const isLast = index === dates.length - 1;

    let durationInUnits = 0;
    if (interestPeriod === "per_month") {
      durationInUnits = currentDate.diff(previousDate, "month", true);
    } else if (interestPeriod === "per_week") {
      durationInUnits = currentDate.diff(previousDate, "week", true);
    } else if (interestPeriod === "per_year") {
      durationInUnits = currentDate.diff(previousDate, "year", true);
    } else {
      durationInUnits = currentDate.diff(previousDate, "day");
    }

    const segmentRate =
      interestMethod === "COMPOUND"
        ? Math.pow(1 + inputRate, durationInUnits) - 1
        : inputRate * durationInUnits;
    const interestForPeriod = round2(
      (interestMethod === "COMPOUND" ? currentBalance : principal) * segmentRate,
    );

    const openingBalance = currentBalance;
    let principalRepaid = 0;
    let interestPaid = 0;
    let totalPayment = 0;

    if (isLast) {
      totalPayment = round2(openingBalance + interestForPeriod);
      interestPaid = interestForPeriod;
      principalRepaid = round2(totalPayment - interestPaid);
    }

    let balanceAfter = round2(openingBalance + interestForPeriod - totalPayment);
    if (balanceAfter < 0) balanceAfter = 0;

    installments.push({
      dueDate: date,
      openingBalance: round2(openingBalance),
      principalDue: principalRepaid,
      interestDue: interestForPeriod,
      feesDue: 0,
      totalDue: isLast ? totalPayment : 0,
      balanceAfter,
    });

    currentBalance = balanceAfter;
    previousDate = currentDate;
  }

  return {
    supported: true,
    schedulePreview: {
      installments,
      totals: {
        totalPrincipal: round2(
          installments.reduce((sum, item) => sum + item.principalDue, 0),
        ),
        totalInterest: round2(
          installments.reduce((sum, item) => sum + item.interestDue, 0),
        ),
        totalPayable: round2(
          installments.reduce((sum, item) => sum + item.totalDue, 0),
        ),
        numberOfInstallments: installments.length,
      },
    },
  };
};

const generatePerLoanSchedule = ({ principal, interestRate, installmentDates }) => {
  const numberOfInstallments = installmentDates.length;
  const totalInterest = principal * (interestRate / 100);
  const interestPerInstallment = totalInterest / numberOfInstallments;
  const principalPerInstallment = principal / numberOfInstallments;
  const installments = [];
  let outstanding = principal;

  for (let index = 0; index < numberOfInstallments; index += 1) {
    const principalDue = round2(principalPerInstallment);
    const interestDue = round2(interestPerInstallment);
    const balanceAfter = round2(outstanding - principalDue);

    installments.push({
      dueDate: installmentDates[index],
      openingBalance: round2(outstanding),
      principalDue,
      interestDue,
      feesDue: 0,
      totalDue: round2(principalDue + interestDue),
      balanceAfter: balanceAfter < 0 ? 0 : balanceAfter,
    });

    outstanding = Math.max(0, outstanding - principalDue);
  }

  const last = installments[installments.length - 1];
  const principalDiff = round2(
    principal - installments.reduce((sum, item) => sum + item.principalDue, 0),
  );
  const interestDiff = round2(
    totalInterest - installments.reduce((sum, item) => sum + item.interestDue, 0),
  );
  last.principalDue = round2(last.principalDue + principalDiff);
  last.interestDue = round2(last.interestDue + interestDiff);
  last.totalDue = round2(last.principalDue + last.interestDue);
  last.balanceAfter = 0;

  return {
    installments,
    totals: {
      totalPrincipal: round2(principal),
      totalInterest: round2(totalInterest),
      totalFees: 0,
      totalPayable: round2(principal + totalInterest),
      numberOfInstallments,
    },
  };
};

const generateFixedAmountSchedule = ({
  principal,
  interestRate,
  installmentDates,
  interestPeriod,
  startDate,
  maturityDate,
}) => {
  const numberOfInstallments = installmentDates.length;
  let totalInterest = 0;

  if (interestPeriod === "per_loan") {
    totalInterest = interestRate;
  } else if (interestPeriod === "per_year") {
    totalInterest = interestRate * dayjs(maturityDate).diff(dayjs(startDate), "year", true);
  } else if (interestPeriod === "per_month") {
    totalInterest = interestRate * dayjs(maturityDate).diff(dayjs(startDate), "month", true);
  } else if (interestPeriod === "per_week") {
    totalInterest = interestRate * dayjs(maturityDate).diff(dayjs(startDate), "week", true);
  } else if (interestPeriod === "per_day") {
    totalInterest = interestRate * dayjs(maturityDate).diff(dayjs(startDate), "day");
  } else {
    totalInterest = interestRate;
  }

  const interestPerInstallment = totalInterest / numberOfInstallments;
  const principalPerInstallment = principal / numberOfInstallments;
  const installments = [];
  let outstanding = principal;

  for (let index = 0; index < numberOfInstallments; index += 1) {
    const principalDue = round2(principalPerInstallment);
    const interestDue = round2(interestPerInstallment);
    const balanceAfter = round2(outstanding - principalDue);
    installments.push({
      dueDate: installmentDates[index],
      openingBalance: round2(outstanding),
      principalDue,
      interestDue,
      feesDue: 0,
      totalDue: round2(principalDue + interestDue),
      balanceAfter: balanceAfter < 0 ? 0 : balanceAfter,
    });
    outstanding = Math.max(0, outstanding - principalDue);
  }

  const last = installments[installments.length - 1];
  const principalDiff = round2(
    principal - installments.reduce((sum, item) => sum + item.principalDue, 0),
  );
  const interestDiff = round2(
    totalInterest - installments.reduce((sum, item) => sum + item.interestDue, 0),
  );
  last.principalDue = round2(last.principalDue + principalDiff);
  last.interestDue = round2(last.interestDue + interestDiff);
  last.totalDue = round2(last.principalDue + last.interestDue);
  last.balanceAfter = 0;

  return {
    installments,
    totals: {
      totalPrincipal: round2(principal),
      totalInterest: round2(totalInterest),
      totalFees: 0,
      totalPayable: round2(principal + totalInterest),
      numberOfInstallments,
    },
  };
};

const generateFlatRateSchedule = ({
  principal,
  interestRate,
  installmentDates,
  interestPeriod,
  startDate,
  maturityDate,
}) => {
  const numberOfInstallments = installmentDates.length;
  const annualRate = getAnnualRateFromInterestPeriod({
    interestRate,
    interestPeriod,
  });

  let durationInYears;
  if (interestPeriod === "per_year") {
    durationInYears = dayjs(maturityDate).diff(dayjs(startDate), "year", true);
  } else if (interestPeriod === "per_month") {
    durationInYears = dayjs(maturityDate).diff(dayjs(startDate), "month", true) / 12;
  } else if (interestPeriod === "per_week") {
    durationInYears = dayjs(maturityDate).diff(dayjs(startDate), "week", true) / 52;
  } else {
    durationInYears = dayjs(maturityDate).diff(dayjs(startDate), "day") / 365;
  }

  const totalInterest = principal * annualRate * durationInYears;
  const interestPerInstallment = totalInterest / numberOfInstallments;
  const principalPerInstallment = principal / numberOfInstallments;
  const installments = [];
  let outstanding = principal;

  for (let index = 0; index < numberOfInstallments; index += 1) {
    const principalDue = round2(principalPerInstallment);
    const interestDue = round2(interestPerInstallment);
    const balanceAfter = round2(outstanding - principalDue);
    installments.push({
      dueDate: installmentDates[index],
      openingBalance: round2(outstanding),
      principalDue,
      interestDue,
      feesDue: 0,
      totalDue: round2(principalDue + interestDue),
      balanceAfter: balanceAfter < 0 ? 0 : balanceAfter,
    });
    outstanding = Math.max(0, outstanding - principalDue);
  }

  const last = installments[installments.length - 1];
  const principalDiff = round2(
    principal - installments.reduce((sum, item) => sum + item.principalDue, 0),
  );
  const interestDiff = round2(
    totalInterest - installments.reduce((sum, item) => sum + item.interestDue, 0),
  );
  last.principalDue = round2(last.principalDue + principalDiff);
  last.interestDue = round2(last.interestDue + interestDiff);
  last.totalDue = round2(last.principalDue + last.interestDue);
  last.balanceAfter = 0;

  return {
    installments,
    totals: {
      totalPrincipal: round2(principal),
      totalInterest: round2(totalInterest),
      totalFees: 0,
      totalPayable: round2(principal + totalInterest),
      numberOfInstallments,
    },
  };
};

const generateReducingBalanceSchedule = ({
  principal,
  interestRate,
  installmentDates,
  interestPeriod,
  interestMethod,
  repaymentFrequency,
  repaymentFrequencyType,
  startDate,
  maturityDate,
  rawInterestMethod,
}) => {
  const numberOfInstallments = installmentDates.length;
  const inputRate = interestRate / 100;
  const interestPeriodToAnnualFreq = {
    per_year: 1,
    per_month: 12,
    per_week: 52,
    per_day: 365,
  };
  const repaymentFreqToAnnualFreq = {
    DAILY: 365,
    WEEKLY: 52,
    BIWEEKLY: 26,
    MONTHLY: 12,
    QUARTERLY: 4,
    SEMIANNUALLY: 2,
    ANNUALLY: 1,
  };
  const calculatePeriodYears = (start, end, currentInterestPeriod) => {
    const startDateRef = dayjs(start);
    const endDateRef = dayjs(end);
    if (currentInterestPeriod === "per_month") {
      return endDateRef.diff(startDateRef, "month", true) / 12;
    }
    if (currentInterestPeriod === "per_week") {
      return endDateRef.diff(startDateRef, "week", true) / 52;
    }
    if (currentInterestPeriod === "per_year") {
      return endDateRef.diff(startDateRef, "year", true);
    }
    return endDateRef.diff(startDateRef, "day") / 365;
  };

  let ratePerPeriod;
  if (interestMethod === "COMPOUND") {
    const interestFrequency = interestPeriodToAnnualFreq[interestPeriod];
    const repaymentFrequencyCount = repaymentFreqToAnnualFreq[repaymentFrequency];
    const isStandardInterval =
      (!repaymentFrequencyType || repaymentFrequencyType === "interval") &&
      repaymentFrequencyCount;

    if (isStandardInterval && interestFrequency) {
      ratePerPeriod = Math.pow(1 + inputRate, interestFrequency / repaymentFrequencyCount) - 1;
    } else {
      const periodYears =
        repaymentFrequency === "LUMP_SUM"
          ? calculatePeriodYears(startDate, maturityDate, interestPeriod)
          : calculatePeriodYears(startDate, maturityDate, interestPeriod) /
            (numberOfInstallments || 1);
      ratePerPeriod = interestFrequency
        ? Math.pow(1 + inputRate, interestFrequency * periodYears) - 1
        : inputRate;
    }
  } else {
    const repaymentFrequencyCount = repaymentFreqToAnnualFreq[repaymentFrequency];
    const isStandardInterval =
      (!repaymentFrequencyType || repaymentFrequencyType === "interval") &&
      repaymentFrequencyCount;

    const periodYears = isStandardInterval
      ? 1 / repaymentFrequencyCount
      : repaymentFrequency === "LUMP_SUM"
        ? calculatePeriodYears(startDate, maturityDate, interestPeriod)
        : calculatePeriodYears(
            startDate,
            dayjs(startDate)
              .add(frequencyToInterval(repaymentFrequency).count, frequencyToInterval(repaymentFrequency).unit)
              .format("YYYY-MM-DD"),
            interestPeriod,
          );

    const annualRate = getAnnualRateFromInterestPeriod({
      interestRate,
      interestPeriod,
    }) || 0;
    ratePerPeriod = annualRate * periodYears;
  }

  const safeRate = Number.isFinite(ratePerPeriod) ? ratePerPeriod : 0;
  const isEqualPrincipal = rawInterestMethod === "reducing_balance_equal_principal";
  let payment = 0;
  let fixedPrincipal = 0;

  if (isEqualPrincipal) {
    fixedPrincipal = round2(principal / numberOfInstallments);
  } else if (safeRate <= 0) {
    payment = principal / numberOfInstallments;
  } else {
    payment =
      (principal * safeRate * Math.pow(1 + safeRate, numberOfInstallments)) /
      (Math.pow(1 + safeRate, numberOfInstallments) - 1);
  }

  const installments = [];
  let outstanding = principal;
  for (let index = 0; index < numberOfInstallments; index += 1) {
    const interestDue = round2(outstanding * safeRate);
    let principalDue;

    if (isEqualPrincipal) {
      principalDue = index === numberOfInstallments - 1 ? round2(outstanding) : fixedPrincipal;
    } else {
      principalDue = index === numberOfInstallments - 1
        ? round2(outstanding)
        : round2(payment - interestDue);
    }

    const totalDue = round2(principalDue + interestDue);
    const balanceAfter = round2(outstanding - principalDue);
    installments.push({
      dueDate: installmentDates[index],
      openingBalance: round2(outstanding),
      principalDue,
      interestDue,
      feesDue: 0,
      totalDue,
      balanceAfter: balanceAfter < 0 ? 0 : balanceAfter,
    });

    outstanding = Math.max(0, outstanding - principalDue);
  }

  const last = installments[installments.length - 1];
  const principalDiff = round2(
    principal - installments.reduce((sum, item) => sum + item.principalDue, 0),
  );
  last.principalDue = round2(last.principalDue + principalDiff);
  last.totalDue = round2(last.principalDue + last.interestDue);
  last.balanceAfter = 0;

  return {
    installments,
    totals: {
      totalPrincipal: round2(principal),
      totalInterest: round2(
        installments.reduce((sum, item) => sum + item.interestDue, 0),
      ),
      totalFees: 0,
      totalPayable: round2(
        installments.reduce((sum, item) => sum + item.totalDue, 0),
      ),
      numberOfInstallments,
    },
  };
};

const generateSchedulePreviewFromDraftValues = (draftValues) => {
  const values = draftValues || {};
  const principal = Number(values?.principalAmount);
  const duration = Number(
    values?.termDuration ?? values?.loanDuration ?? values?.duration ?? 0,
  );
  const durationInterval = values?.durationPeriod ?? values?.durationInterval;
  const startDate =
    values?.disbursementDate ?? values?.loanStartDate ?? values?.startDate;
  const repaymentFrequencyType = values?.repaymentFrequencyType;
  const repaymentFrequency =
    repaymentFrequencyType === "lumpSum"
      ? "LUMP_SUM"
      : mapRepaymentFrequency(values?.repaymentFrequency ?? values?.paymentFrequency);
  const interestCalculationMethod = mapInterestCalculationMethod(
    values?.interestMethod ?? values?.interestCalculationMethod,
  );
  const maturityDate =
    values?.maturityDate ||
    (startDate && duration && durationInterval
      ? dayjs(startDate)
          .add(duration, durationUnitMap[durationInterval] || durationInterval)
          .format("YYYY-MM-DD")
      : null);

  if (!principal || principal <= 0) {
    return { supported: false, reason: "Principal Amount is required", schedulePreview: null };
  }
  if (!startDate) {
    return { supported: false, reason: "Loan Start Date is required", schedulePreview: null };
  }
  if (!maturityDate) {
    return {
      supported: false,
      reason: "Loan maturity date could not be determined",
      schedulePreview: null,
    };
  }

  const interestType = values?.interestType || "percentage";
  const interestPeriod = values?.interestPeriod || "per_month";
  const rawInterestRate = Number(values?.interestRate);

  if (!Number.isFinite(rawInterestRate) || rawInterestRate < 0) {
    return { supported: false, reason: "Interest Rate is required", schedulePreview: null };
  }

  const installmentDates = buildInstallmentDates({
    startDate,
    maturityDate,
    repaymentFrequency,
    repaymentFrequencyType,
    customPaymentDays: values?.customPaymentDays,
    customPaymentDates: values?.customPaymentDates,
  });

  if (repaymentFrequency === "LUMP_SUM") {
    const result = generateLumpSumSchedule({
      principal,
      startDate,
      maturityDate,
      duration,
      durationInterval,
      interestRate: rawInterestRate,
      interestPeriod,
      interestType,
      interestMethod: interestCalculationMethod,
    });
    if (result.supported) {
      return {
        supported: true,
        reason: null,
        schedulePreview: {
          generatedAt: new Date().toISOString(),
          interestCalculationMethod,
          repaymentFrequency,
          startDate,
          maturityDate,
          ...result.schedulePreview,
        },
      };
    }
  }

  if (!installmentDates.length) {
    return {
      supported: false,
      reason: "Could not generate repayment dates for the selected configuration",
      schedulePreview: null,
    };
  }

  let result;
  if (interestType === "fixed") {
    result = generateFixedAmountSchedule({
      principal,
      interestRate: rawInterestRate,
      installmentDates,
      interestPeriod,
      startDate,
      maturityDate,
    });
  } else if (interestPeriod === "per_loan") {
    result = generatePerLoanSchedule({ principal, interestRate: rawInterestRate, installmentDates });
  } else if (interestCalculationMethod === "FLAT") {
    result = generateFlatRateSchedule({
      principal,
      interestRate: rawInterestRate,
      installmentDates,
      interestPeriod,
      startDate,
      maturityDate,
    });
  } else {
    result = generateReducingBalanceSchedule({
      principal,
      interestRate: rawInterestRate,
      installmentDates,
      interestPeriod,
      interestMethod: interestCalculationMethod,
      repaymentFrequency,
      repaymentFrequencyType,
      startDate,
      maturityDate,
      rawInterestMethod: values?.interestMethod ?? values?.interestCalculationMethod,
    });
  }

  return {
    supported: true,
    reason: null,
    schedulePreview: {
      generatedAt: new Date().toISOString(),
      interestCalculationMethod,
      repaymentFrequency,
      startDate,
      maturityDate,
      installments: result.installments,
      totals: result.totals,
    },
  };
};

const deriveScheduleFromComputationRecord = (loan) => {
  const record = parseLoanComputationRecord(loan);
  if (!record || typeof record !== "object") return null;

  const normalizedRateInterval = (() => {
    const raw = String(loan?.rateInterval || record?.rateInterval || "").toLowerCase();
    if (raw.includes("day")) return "per_day";
    if (raw.includes("week")) return "per_week";
    if (raw.includes("year") || raw.includes("annual")) return "per_year";
    if (raw.includes("loan")) return "per_loan";
    return raw ? "per_month" : null;
  })();

  const values = {
    principalAmount: loan.principal ?? record.principalAmount,
    interestRate: loan.interestRate ?? record.interestRate,
    interestMethod:
      loan.loanProduct?.interestCalculationMethod ??
      loan.interestCalculationMethod ??
      record.interestMethod ??
      record.interestCalculationMethod,
    interestType: record.interestType ?? "percentage",
    interestPeriod: record.interestPeriod ?? normalizedRateInterval ?? "per_month",
    loanStartDate: loan.startDate ?? record.loanStartDate ?? record.startDate,
    startDate: loan.startDate ?? record.startDate ?? record.loanStartDate,
    disbursementDate: record.disbursementDate ?? loan.startDate ?? record.loanStartDate,
    maturityDate: loan.maturityDate ?? record.maturityDate,
    termDuration: loan.duration ?? record.termDuration ?? record.loanDuration ?? record.duration,
    loanDuration: loan.duration ?? record.loanDuration ?? record.termDuration ?? record.duration,
    duration: loan.duration ?? record.duration ?? record.loanDuration,
    durationPeriod: loan.durationInterval ?? record.durationPeriod ?? record.durationInterval,
    durationInterval: loan.durationInterval ?? record.durationInterval ?? record.durationPeriod,
    repaymentFrequency: loan.paymentFrequency ?? record.repaymentFrequency ?? record.paymentFrequency,
    paymentFrequency: loan.paymentFrequency ?? record.paymentFrequency ?? record.repaymentFrequency,
    repaymentFrequencyType: record.repaymentFrequencyType,
    customPaymentDays: record.customPaymentDays,
    customPaymentDates: record.customPaymentDates,
    ...record,
  };

  try {
    const result = generateSchedulePreviewFromDraftValues(values);
    if (!result?.supported || !result?.schedulePreview?.installments?.length) {
      return null;
    }

    return result.schedulePreview.installments.map((installment, index) => ({
      id: installment.id || `derived-${index + 1}`,
      dueDate: installment.dueDate,
      openingBalance: round2(installment.openingBalance || 0),
      principalDue: round2(installment.principalDue || 0),
      interestDue: round2(installment.interestDue || 0),
      feesDue: round2(installment.feesDue || 0),
      penaltyDue: round2(installment.penaltyDue || 0),
      totalDue: round2(
        installment.totalDue ||
          (installment.principalDue || 0) +
            (installment.interestDue || 0) +
            (installment.feesDue || 0) +
            (installment.penaltyDue || 0),
      ),
      principalPaid: round2(installment.principalPaid || 0),
      interestPaid: round2(installment.interestPaid || 0),
      feesPaid: round2(installment.feesPaid || 0),
      penaltyPaid: round2(installment.penaltyPaid || 0),
      totalPaid: round2(installment.totalPaid || 0),
      status:
        installment.status ||
        (dayjs(installment.dueDate).isBefore(dayjs(), "day") ? "DUE" : "UPCOMING"),
    }));
  } catch (error) {
    console.error("[loanSummaryProjection] Failed to derive schedule:", error);
    return null;
  }
};

const resolveLoanSchedule = (loan) =>
  resolvePersistedInstallments(loan) || deriveScheduleFromComputationRecord(loan) || [];

const resolvePenaltyEvents = (loan) => {
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
        penalty.penaltyName ||
        penalty.penaltyType ||
        penalty.penaltyCategory ||
        "Penalty",
      status: penalty.penaltyStatus || penalty.status || "",
      notes: penalty.notes || penalty.penaltyDescription || "",
    }))
    .filter((penalty) => penalty.amount > 0 && penalty.date)
    .sort((left, right) => new Date(left.date) - new Date(right.date));
};

const buildStatementLedger = (loan) => {
  if (!loan) {
    return { rows: [], scheduleSource: "none", reconciliation: null, totals: {} };
  }

  const repaymentOrder = resolveRepaymentOrder(loan.loanProduct);
  const persistedInstallments = resolvePersistedInstallments(loan);
  let schedule = resolveLoanSchedule(loan);
  let scheduleSource = persistedInstallments ? "persisted" : "derived";

  if (!schedule || schedule.length === 0) {
    scheduleSource = "none";
    schedule = [];
  }

  const penaltyEvents = resolvePenaltyEvents(loan);
  const assessedPenalty = round2(
    penaltyEvents.reduce((sum, penalty) => sum + penalty.amount, 0),
  );

  {
    let running = round2(loan.principal || 0);
    for (const installment of schedule) {
      installment._openingBalance = running;
      running = round2(Math.max(0, running - installment.principalDue));
    }
  }

  const validPayments = (loan?.payments?.items || [])
    .filter(isValidPayment)
    .slice()
    .sort((left, right) => new Date(left.paymentDate || 0) - new Date(right.paymentDate || 0));

  const totalScheduledInterest = round2(
    schedule.reduce((sum, installment) => sum + (installment.interestDue || 0), 0),
  );
  const totalScheduledFees = round2(
    schedule.reduce((sum, installment) => sum + (installment.feesDue || 0), 0),
  );
  const totalScheduledPenalty = round2(
    schedule.reduce((sum, installment) => sum + (installment.penaltyDue || 0), 0),
  );

  const balanceState = {
    principal: round2(loan.principal || 0),
    interest: totalScheduledInterest,
    fees: totalScheduledFees,
    penalty: totalScheduledPenalty,
  };

  const runningTotal = () =>
    round2(
      balanceState.principal +
        balanceState.interest +
        balanceState.fees +
        balanceState.penalty,
    );

  const events = [];
  schedule.forEach((installment, index) => {
    events.push({
      _date: new Date(installment.dueDate || 0),
      _type: "installment",
      data: { ...installment, _instNum: index + 1 },
    });
  });
  penaltyEvents.forEach((penalty) => {
    events.push({ _date: new Date(penalty.date || 0), _type: "penalty", data: penalty });
  });
  validPayments.forEach((payment) => {
    events.push({ _date: new Date(payment.paymentDate || 0), _type: "payment", data: payment });
  });

  const typeOrder = { installment: 0, penalty: 1, payment: 2 };
  events.sort((left, right) => {
    const dateDifference = left._date - right._date;
    if (dateDifference !== 0) return dateDifference;
    return (typeOrder[left._type] || 0) - (typeOrder[right._type] || 0);
  });

  let totalPaymentsApplied = 0;
  let totalPrincipalPaid = 0;
  let totalInterestPaid = 0;
  let totalFeesPaid = 0;
  let totalPenaltyPaid = 0;
  const rows = [];

  for (const event of events) {
    if (event._type === "installment") {
      const installment = event.data;
      rows.push({
        rowType: "installment",
        key: `inst-${installment.id || installment._instNum}`,
        date: installment.dueDate,
        installmentNumber: installment._instNum,
        openingBalance: round2(installment._openingBalance),
        principalDue: round2(installment.principalDue || 0),
        interestDue: round2(installment.interestDue || 0),
        feesDue: round2(installment.feesDue || 0),
        penaltyDue: round2(installment.penaltyDue || 0),
        totalDue: round2(
          installment.totalDue ||
            installment.principalDue +
              installment.interestDue +
              installment.feesDue +
              installment.penaltyDue ||
            0,
        ),
        principalPaid: round2(installment.principalPaid || 0),
        interestPaid: round2(installment.interestPaid || 0),
        feesPaid: round2(installment.feesPaid || 0),
        penaltyPaid: round2(installment.penaltyPaid || 0),
        totalPaid: round2(installment.totalPaid || 0),
        status: installment.status || "",
        runningBalance: runningTotal(),
      });
      continue;
    }

    if (event._type === "penalty") {
      const penalty = event.data;
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
      continue;
    }

    const payment = event.data;
    const amount = round2(payment.amount || 0);
    const allocations = hasPersistedAllocations(payment)
      ? {
          principal: round2(Number(payment.amountAllocatedToPrincipal) || 0),
          interest: round2(Number(payment.amountAllocatedToInterest) || 0),
          fees: round2(Number(payment.amountAllocatedToFees) || 0),
          penalty: round2(Number(payment.amountAllocatedToPenalty) || 0),
          unallocated: 0,
        }
      : deriveAllocations(amount, balanceState, repaymentOrder);

    balanceState.principal = round2(
      Math.max(0, balanceState.principal - allocations.principal),
    );
    balanceState.interest = round2(
      Math.max(0, balanceState.interest - allocations.interest),
    );
    balanceState.fees = round2(Math.max(0, balanceState.fees - allocations.fees));
    balanceState.penalty = round2(
      Math.max(0, balanceState.penalty - allocations.penalty),
    );

    totalPaymentsApplied = round2(totalPaymentsApplied + amount);
    totalPrincipalPaid = round2(totalPrincipalPaid + allocations.principal);
    totalInterestPaid = round2(totalInterestPaid + allocations.interest);
    totalFeesPaid = round2(totalFeesPaid + allocations.fees);
    totalPenaltyPaid = round2(totalPenaltyPaid + allocations.penalty);

    rows.push({
      rowType: "payment",
      key: `pmt-${payment.id}`,
      date: payment.paymentDate,
      amount,
      paymentMethod: payment.paymentMethod || "",
      referenceNumber: payment.referenceNumber || "",
      paymentStatusEnum: payment.paymentStatusEnum || payment.status || "",
      allocPrincipal: allocations.principal,
      allocInterest: allocations.interest,
      allocFees: allocations.fees,
      allocPenalty: allocations.penalty,
      allocUnallocated: allocations.unallocated,
      allocDerived: !hasPersistedAllocations(payment),
      runningBalance: runningTotal(),
      balancePrincipal: balanceState.principal,
      balanceInterest: balanceState.interest,
      balanceFees: balanceState.fees,
      balancePenalty: balanceState.penalty,
    });
  }

  const scheduledPrincipal = round2(
    schedule.reduce((sum, installment) => sum + (installment.principalDue || 0), 0),
  );
  const totalScheduled = round2(
    scheduledPrincipal +
      totalScheduledInterest +
      totalScheduledFees +
      totalScheduledPenalty +
      assessedPenalty,
  );

  return {
    schedule,
    rows,
    scheduleSource,
    reconciliation: {
      derivedBalance: runningTotal(),
      snapshotBalance: null,
      diff: null,
      hasWarning: false,
      principalBalance: balanceState.principal,
      interestBalance: balanceState.interest,
      feesBalance: balanceState.fees,
      penaltyBalance: balanceState.penalty,
    },
    totals: {
      scheduledPrincipal,
      scheduledInterest: totalScheduledInterest,
      scheduledFees: totalScheduledFees,
      scheduledPenalty: totalScheduledPenalty,
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
      totalRemaining: runningTotal(),
    },
  };
};

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
  return round2(
    normalizeMoneyValue(installment.principalDue) +
      normalizeMoneyValue(installment.interestDue) +
      normalizeMoneyValue(installment.feesDue) +
      normalizeMoneyValue(installment.penaltyDue),
  );
};

const getSortedSchedule = (loan) =>
  [...(loan?.derivedStatement?.schedule || [])].sort(
    (left, right) => new Date(left?.dueDate || 0).getTime() - new Date(right?.dueDate || 0).getTime(),
  );

export const getTotalPaid = (loan) =>
  loan?.totalPaidComputed != null ? loan.totalPaidComputed : computeTotalPaid(loan?.payments);

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
    .filter(isValidPayment)
    .sort(
      (left, right) =>
        new Date(right?.paymentDate || right?.createdAt || 0).getTime() -
        new Date(left?.paymentDate || left?.createdAt || 0).getTime(),
    );

  return payments.length ? toDateOnly(payments[0]?.paymentDate || payments[0]?.createdAt) : null;
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
    cumulativeDue = round2(cumulativeDue + dueAmount);

    if (!firstFutureInstallmentDueDate && dueDate >= today) {
      firstFutureInstallmentDueDate = dueDateOnly;
    }

    const installmentOutstanding = cumulativeDue > totalPaid + EPSILON;
    if (installmentOutstanding && !firstOutstandingDueDate) {
      firstOutstandingDueDate = dueDateOnly;
    }

    if (dueDate < today) {
      dueBeforeToday = round2(dueBeforeToday + dueAmount);
      if (installmentOutstanding) {
        missedInstallmentCount += 1;
      }
    }
  });

  return {
    missedInstallmentCount,
    arrearsAmount: round2(Math.max(0, dueBeforeToday - totalPaid)),
    nextDueDate: firstOutstandingDueDate || firstFutureInstallmentDueDate,
    firstFutureInstallmentDueDate,
  };
};

export const isLoanSummaryCandidate = (loan) => {
  const rawStatus = normalizeLifecycleStatus(loan?.status);
  return rawStatus && !EXCLUDED_SUMMARY_STATUSES.has(rawStatus);
};

export const resolveDisplayStatusMeta = (loan, metrics, referenceDate = new Date()) => {
  const rawStatus = String(loan?.status || "").toUpperCase();
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

export const computeNextStatusTransitionAt = (loan, metrics, referenceDate = new Date()) => {
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
  const derivedStatement = normalizedLoan?.derivedStatement || buildStatementLedger(normalizedLoan);
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
  const displayStatus = resolveDisplayStatusMeta(baseLoan, scheduleMetrics, referenceDate);

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
    nextStatusTransitionAt: computeNextStatusTransitionAt(baseLoan, scheduleMetrics, referenceDate),
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