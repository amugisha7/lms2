import { generateSchedulePreviewFromDraftValues } from "../Loans/loanComputations";

const normalizeDurationUnit = (durationUnit) => {
  const value = String(durationUnit || "months").toLowerCase();
  if (["day", "days"].includes(value)) return "days";
  if (["week", "weeks"].includes(value)) return "weeks";
  if (["year", "years"].includes(value)) return "years";
  return "months";
};

const normalizeRepaymentFrequency = (repaymentFrequency) => {
  const value = String(repaymentFrequency || "MONTHLY").toLowerCase();
  switch (value) {
    case "daily":
      return "daily";
    case "weekly":
      return "weekly";
    case "biweekly":
      return "biweekly";
    case "quarterly":
      return "quarterly";
    case "semiannually":
    case "semi_annual":
      return "semi_annual";
    case "annually":
    case "yearly":
      return "yearly";
    case "lump_sum":
    case "lumpsum":
      return "lump_sum";
    default:
      return "monthly";
  }
};

const normalizeInterestMethod = (interestMethod) => {
  const value = String(interestMethod || "FLAT").toUpperCase();
  if (value === "FLAT") return "flat";
  if (value === "COMPOUND") return "compound";
  return "simple";
};

export const calculateSchedule = (params = {}) => {
  const result = generateSchedulePreviewFromDraftValues({
    principalAmount: params.principal,
    interestRate: params.interestRate,
    termDuration: params.duration,
    durationPeriod: normalizeDurationUnit(params.durationUnit),
    loanStartDate: params.startDate,
    repaymentFrequency: normalizeRepaymentFrequency(
      params.repaymentFrequency,
    ),
    interestMethod: normalizeInterestMethod(params.interestMethod),
    interestPeriod: params.interestPeriod || "per_month",
    interestType: params.interestType || "percentage",
    maturityDate: params.maturityDate,
  });

  return result?.schedulePreview?.installments || [];
};

export default {
  calculateSchedule,
};
