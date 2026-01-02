import dayjs from "dayjs";

const round2 = (num) => {
  const n = Number(num);
  if (!Number.isFinite(n)) return 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
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
      return "MONTHLY";
    case "bimonthly":
      return "MONTHLY";
    case "quarterly":
      return "QUARTERLY";
    case "every_4_months":
      return "QUARTERLY";
    case "semi_annual":
      return "SEMIANNUALLY";
    case "every_9_months":
      return "ANNUALLY";
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

const getAnnualRateFromInterestPeriod = ({
  interestType,
  interestRate,
  interestPeriod,
}) => {
  const rate = Number(interestRate);
  if (!Number.isFinite(rate) || rate < 0) return null;
  if (interestType !== "percentage") return null;

  const r = rate / 100;
  switch (interestPeriod) {
    case "per_day":
      return r * 365;
    case "per_week":
      return r * 52;
    case "per_month":
      return r * 12;
    case "per_year":
      return r;
    case "per_loan":
      return null;
    default:
      return r;
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
    const wantedDays = Array.isArray(customPaymentDays)
      ? customPaymentDays
      : [];
    const dayMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    const wanted = new Set(
      wantedDays.map((d) => dayMap[d]).filter((d) => Number.isInteger(d))
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
    const wantedDates = Array.isArray(customPaymentDates)
      ? customPaymentDates
      : [];
    const wanted = wantedDates
      .map((d) => Number(d))
      .filter((d) => Number.isInteger(d) && d >= 1 && d <= 31);
    if (wanted.length === 0) return [];

    const dates = [];
    let cursor = start.startOf("month");
    while (cursor.isBefore(maturity) || cursor.isSame(maturity, "month")) {
      for (const dayNum of wanted) {
        const candidate = cursor.date(dayNum);
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
    dates.sort((a, b) => new Date(a) - new Date(b));
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

/**
 * Pure computation: takes (unsaved) calculator values and returns a schedule preview.
 * No API calls.
 */
export const generateSchedulePreviewFromDraftValues = (draftValues) => {
  const values = draftValues || {};

  const principal = Number(values?.principalAmount);
  const duration = Number(
    values?.termDuration ?? values?.loanDuration ?? values?.duration ?? 0
  );
  const durationInterval = values?.durationPeriod ?? values?.durationInterval;
  const startDate =
    values?.disbursementDate ?? values?.loanStartDate ?? values?.startDate;

  const repaymentFrequency = mapRepaymentFrequency(
    values?.repaymentFrequency ?? values?.paymentFrequency
  );

  const interestCalculationMethod = mapInterestCalculationMethod(
    values?.interestMethod ?? values?.interestCalculationMethod
  );

  const maturityDate =
    values?.maturityDate ||
    (startDate && duration && durationInterval
      ? dayjs(startDate)
          .add(duration, durationUnitMap[durationInterval] || durationInterval)
          .format("YYYY-MM-DD")
      : null);

  if (!principal || principal <= 0) {
    return {
      supported: false,
      reason: "Principal Amount is required",
      schedulePreview: null,
    };
  }

  if (!startDate) {
    return {
      supported: false,
      reason: "Loan Start Date is required",
      schedulePreview: null,
    };
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
    return {
      supported: false,
      reason: "Interest Rate is required",
      schedulePreview: null,
    };
  }

  const installmentDates = buildInstallmentDates({
    startDate,
    maturityDate,
    repaymentFrequency,
    repaymentFrequencyType: values?.repaymentFrequencyType,
    customPaymentDays: values?.customPaymentDays,
    customPaymentDates: values?.customPaymentDates,
  });

  if (!installmentDates.length) {
    return {
      supported: false,
      reason:
        "Could not generate repayment dates for the selected configuration",
      schedulePreview: null,
    };
  }

  const n = installmentDates.length;
  const installments = [];
  let outstanding = principal;

  if (interestCalculationMethod === "FLAT") {
    const annualRate =
      getAnnualRateFromInterestPeriod({
        interestType,
        interestRate: rawInterestRate,
        interestPeriod,
      }) ?? 0;

    let totalInterest = 0;
    if (interestType === "fixed") {
      if (interestPeriod === "per_loan") {
        totalInterest = rawInterestRate;
      } else {
        const durationInYears =
          dayjs(maturityDate).diff(dayjs(startDate), "day") / 365;
        totalInterest =
          rawInterestRate * (interestPeriod === "per_year" ? durationInYears : 1);
        if (interestPeriod === "per_month")
          totalInterest = rawInterestRate * durationInYears * 12;
        if (interestPeriod === "per_week")
          totalInterest = rawInterestRate * durationInYears * 52;
        if (interestPeriod === "per_day")
          totalInterest = rawInterestRate * durationInYears * 365;
      }
    } else {
      const durationInYears =
        dayjs(maturityDate).diff(dayjs(startDate), "day") / 365;
      totalInterest = principal * annualRate * durationInYears;
    }

    const interestPer = totalInterest / n;
    const principalPer = principal / n;

    for (let i = 0; i < n; i += 1) {
      const principalDue = round2(principalPer);
      const interestDue = round2(interestPer);
      const balanceAfter = round2(outstanding - principalDue);
      installments.push({
        dueDate: installmentDates[i],
        principalDue,
        interestDue,
        feesDue: 0,
        totalDue: round2(principalDue + interestDue),
        balanceAfter: balanceAfter < 0 ? 0 : balanceAfter,
      });
      outstanding = Math.max(0, outstanding - principalDue);
    }

    const principalSum = round2(
      installments.reduce((s, x) => s + x.principalDue, 0)
    );
    const interestSum = round2(
      installments.reduce((s, x) => s + x.interestDue, 0)
    );

    const principalDiff = round2(principal - principalSum);
    const interestDiff = round2(totalInterest - interestSum);

    const last = installments[installments.length - 1];
    last.principalDue = round2(last.principalDue + principalDiff);
    last.interestDue = round2(last.interestDue + interestDiff);
    last.totalDue = round2(last.principalDue + last.interestDue);
    last.balanceAfter = 0;
  } else {
    const annualRate = getAnnualRateFromInterestPeriod({
      interestType,
      interestRate: rawInterestRate,
      interestPeriod,
    });

    if (interestType !== "percentage" || annualRate === null) {
      return {
        supported: false,
        reason:
          "Only percentage-based SIMPLE/COMPOUND schedules are supported for this configuration",
        schedulePreview: null,
      };
    }

    const { unit, count } =
      repaymentFrequency === "LUMP_SUM"
        ? { unit: "year", count: 1 }
        : frequencyToInterval(repaymentFrequency);

    const start = dayjs(startDate);
    const next = start.add(count, unit);
    const periodYears = Math.max(1 / 365, next.diff(start, "day") / 365);

    const r = annualRate * periodYears;
    const safeR = Number.isFinite(r) ? r : 0;

    let pmt = 0;
    if (safeR <= 0) {
      pmt = principal / n;
    } else {
      pmt =
        (principal * safeR * Math.pow(1 + safeR, n)) /
        (Math.pow(1 + safeR, n) - 1);
    }

    outstanding = principal;

    for (let i = 0; i < n; i += 1) {
      const interestDue = round2(outstanding * safeR);
      let principalDue = round2(pmt - interestDue);
      if (principalDue < 0) principalDue = 0;
      let balanceAfter = round2(outstanding - principalDue);
      if (i === n - 1) {
        principalDue = round2(outstanding);
        balanceAfter = 0;
      }
      installments.push({
        dueDate: installmentDates[i],
        principalDue,
        interestDue,
        feesDue: 0,
        totalDue: round2(principalDue + interestDue),
        balanceAfter,
      });
      outstanding = Math.max(0, outstanding - principalDue);
    }
  }

  const totals = {
    totalPrincipal: round2(installments.reduce((s, x) => s + x.principalDue, 0)),
    totalInterest: round2(installments.reduce((s, x) => s + x.interestDue, 0)),
    totalPayable: round2(installments.reduce((s, x) => s + x.totalDue, 0)),
  };

  return {
    supported: true,
    reason: null,
    schedulePreview: {
      generatedAt: new Date().toISOString(),
      installments,
      totals,
    },
  };
};
