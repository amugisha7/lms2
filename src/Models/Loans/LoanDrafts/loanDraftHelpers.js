import { generateClient } from "aws-amplify/api";
import dayjs from "dayjs";

// NOTE: Draft GraphQL operations must be custom-written here.

const nowIso = () => new Date().toISOString();

const safeJsonStringify = (value) => {
  try {
    return JSON.stringify(value ?? {});
  } catch (err) {
    // Fallback: store a minimal shape rather than crashing the workflow
    return JSON.stringify({ __stringifyError: true });
  }
};

const parseAwsJson = (value) => {
  if (!value) return null;
  if (typeof value === "object") return value;
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const round2 = (num) => {
  const n = Number(num);
  if (!Number.isFinite(n)) return 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
};

const sha256Hex = async (text) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
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

const durationUnitMap = {
  days: "day",
  weeks: "week",
  months: "month",
  years: "year",
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

  // Fixed interest is handled separately.
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
      // Not an annualized concept.
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
        // Skip invalid rollovers (e.g., Feb 30 becomes Mar 2)
        if (candidate.month() !== cursor.month()) continue;
        if (candidate.isAfter(start) && (candidate.isBefore(maturity) || candidate.isSame(maturity, "day"))) {
          dates.push(candidate.format("YYYY-MM-DD"));
        }
      }
      cursor = cursor.add(1, "month");
    }
    dates.sort((a, b) => new Date(a) - new Date(b));
    return dates;
  }

  // Default: interval-based
  const { unit, count } = frequencyToInterval(repaymentFrequency);
  const dates = [];
  let cursor = start.add(count, unit);
  while (cursor.isBefore(maturity) || cursor.isSame(maturity, "day")) {
    dates.push(cursor.format("YYYY-MM-DD"));
    cursor = cursor.add(count, unit);
  }
  return dates;
};

export const generateSchedulePreviewFromDraftRecord = async (draftRecord) => {
  const values = draftRecord || {};

  const principal = Number(values?.principalAmount);
  const duration = Number(values?.termDuration ?? values?.loanDuration ?? values?.duration ?? 0);
  const durationInterval = values?.durationPeriod ?? values?.durationInterval;
  const startDate = values?.disbursementDate ?? values?.loanStartDate ?? values?.startDate;

  const repaymentFrequencyType = values?.repaymentFrequencyType;
  const repaymentFrequency =
    repaymentFrequencyType === "lumpSum"
      ? "LUMP_SUM"
      : mapRepaymentFrequency(values?.repaymentFrequency ?? values?.paymentFrequency);

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
    return { supported: false, reason: "Principal Amount is required", schedulePreview: null, scheduleHash: null };
  }

  if (!startDate) {
    return { supported: false, reason: "Loan Start Date is required", schedulePreview: null, scheduleHash: null };
  }

  if (!maturityDate) {
    return { supported: false, reason: "Loan maturity date could not be determined", schedulePreview: null, scheduleHash: null };
  }

  const interestType = values?.interestType || "percentage";
  const interestPeriod = values?.interestPeriod || "per_month";
  const rawInterestRate = Number(values?.interestRate);
  if (!Number.isFinite(rawInterestRate) || rawInterestRate < 0) {
    return { supported: false, reason: "Interest Rate is required", schedulePreview: null, scheduleHash: null };
  }

  const installmentDates = buildInstallmentDates({
    startDate,
    maturityDate,
    repaymentFrequency,
    repaymentFrequencyType,
    customPaymentDays: values?.customPaymentDays,
    customPaymentDates: values?.customPaymentDates,
  });

  if (!installmentDates.length) {
    return { supported: false, reason: "Could not generate repayment dates for the selected configuration", schedulePreview: null, scheduleHash: null };
  }

  const scheduleTermsForHash = {
    principal,
    duration,
    durationInterval,
    startDate,
    maturityDate,
    repaymentFrequency,
    repaymentFrequencyType,
    customPaymentDays: values?.customPaymentDays,
    customPaymentDates: values?.customPaymentDates,
    interestCalculationMethod,
    interestType,
    interestRate: rawInterestRate,
    interestPeriod,
  };

  const scheduleHash = await sha256Hex(JSON.stringify(scheduleTermsForHash));

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

    // For fixed interest in FLAT: treat interestRate as an amount per interestPeriod.
    // We distribute it evenly by installment count.
    let totalInterest = 0;
    if (interestType === "fixed") {
      if (interestPeriod === "per_loan") {
        totalInterest = rawInterestRate;
      } else {
        if (interestPeriod === "per_year") {
          totalInterest = rawInterestRate * dayjs(maturityDate).diff(dayjs(startDate), "year", true);
        } else if (interestPeriod === "per_month") {
          totalInterest = rawInterestRate * dayjs(maturityDate).diff(dayjs(startDate), "month", true);
        } else if (interestPeriod === "per_week") {
          totalInterest = rawInterestRate * dayjs(maturityDate).diff(dayjs(startDate), "week", true);
        } else if (interestPeriod === "per_day") {
          totalInterest = rawInterestRate * dayjs(maturityDate).diff(dayjs(startDate), "day");
        } else {
          totalInterest = rawInterestRate;
        }
      }
    } else {
      let durationInYears;
      if (interestPeriod === "per_month") {
        durationInYears = dayjs(maturityDate).diff(dayjs(startDate), "month", true) / 12;
      } else if (interestPeriod === "per_week") {
        durationInYears = dayjs(maturityDate).diff(dayjs(startDate), "week", true) / 52;
      } else if (interestPeriod === "per_year") {
        durationInYears = dayjs(maturityDate).diff(dayjs(startDate), "year", true);
      } else {
        durationInYears = dayjs(maturityDate).diff(dayjs(startDate), "day") / 365;
      }
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

    // Adjust last installment to eliminate rounding drift
    const principalSum = round2(installments.reduce((s, x) => s + x.principalDue, 0));
    const interestSum = round2(installments.reduce((s, x) => s + x.interestDue, 0));

    const principalDiff = round2(principal - principalSum);
    const interestDiff = round2(totalInterest - interestSum);

    const last = installments[installments.length - 1];
    last.principalDue = round2(last.principalDue + principalDiff);
    last.interestDue = round2(last.interestDue + interestDiff);
    last.totalDue = round2(last.principalDue + last.interestDue);
    last.balanceAfter = 0;

  } else {
    // SIMPLE / COMPOUND
    // Percentage-based: amortized equal installments using periodic rate.
    // Fixed-amount: distribute total fixed interest across installments so a schedule is always generated.
    if (interestType === "fixed") {
      let totalInterest = 0;
      if (interestPeriod === "per_loan") {
        totalInterest = rawInterestRate;
      } else {
        const durationInYears =
          dayjs(maturityDate).diff(dayjs(startDate), "day") / 365;
        if (interestPeriod === "per_year") {
          totalInterest = rawInterestRate * durationInYears;
        } else if (interestPeriod === "per_month") {
          totalInterest = rawInterestRate * durationInYears * 12;
        } else if (interestPeriod === "per_week") {
          totalInterest = rawInterestRate * durationInYears * 52;
        } else if (interestPeriod === "per_day") {
          totalInterest = rawInterestRate * durationInYears * 365;
        } else {
          totalInterest = rawInterestRate;
        }
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
      // Percentage-based
      // We treat the configured rate as an annualized % derived from interestPeriod.
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
          scheduleHash,
        };
      }

      // Use repayment frequency to get a consistent per-period rate.
      const { unit, count } =
        repaymentFrequency === "LUMP_SUM"
          ? { unit: "year", count: 1 }
          : frequencyToInterval(repaymentFrequency);

      // Approximate a period in years.
      const start = dayjs(startDate);
      const next = start.add(count, unit);
      
      let periodYears;
      if (repaymentFrequency === "MONTHLY") {
        periodYears = 1 / 12;
      } else if (repaymentFrequency === "WEEKLY") {
        periodYears = 1 / 52;
      } else if (repaymentFrequency === "BIWEEKLY") {
        periodYears = 1 / 26;
      } else if (repaymentFrequency === "QUARTERLY") {
        periodYears = 1 / 4;
      } else if (repaymentFrequency === "SEMIANNUALLY") {
        periodYears = 1 / 2;
      } else if (repaymentFrequency === "ANNUALLY") {
        periodYears = 1;
      } else if (repaymentFrequency === "DAILY") {
        periodYears = 1 / 365;
      } else {
        // Fallback for irregular or LUMP_SUM
        if (interestPeriod === "per_month") {
           periodYears = next.diff(start, "month", true) / 12;
        } else if (interestPeriod === "per_week") {
           periodYears = next.diff(start, "week", true) / 52;
        } else if (interestPeriod === "per_year") {
           periodYears = next.diff(start, "year", true);
        } else {
           periodYears = next.diff(start, "day") / 365;
        }
      }

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

        if (i === n - 1) {
          principalDue = round2(outstanding);
        }

        const totalDue = round2(principalDue + interestDue);
        const balanceAfter = round2(outstanding - principalDue);

        installments.push({
          dueDate: installmentDates[i],
          principalDue,
          interestDue,
          feesDue: 0,
          totalDue,
          balanceAfter: balanceAfter < 0 ? 0 : balanceAfter,
        });

        outstanding = Math.max(0, outstanding - principalDue);
      }

      // Fix rounding drift on principal
      const principalSum = round2(
        installments.reduce((s, x) => s + x.principalDue, 0)
      );
      const principalDiff = round2(principal - principalSum);
      const last = installments[installments.length - 1];
      last.principalDue = round2(last.principalDue + principalDiff);
      last.totalDue = round2(last.principalDue + last.interestDue);
      last.balanceAfter = 0;
    }
  }

  const totals = {
    totalPrincipal: round2(installments.reduce((s, x) => s + x.principalDue, 0)),
    totalInterest: round2(installments.reduce((s, x) => s + x.interestDue, 0)),
    totalFees: 0,
    totalPayable: round2(installments.reduce((s, x) => s + x.totalDue, 0)),
    numberOfInstallments: installments.length,
  };

  return {
    supported: true,
    reason: null,
    scheduleHash,
    schedulePreview: {
      generatedAt: nowIso(),
      interestCalculationMethod,
      repaymentFrequency,
      startDate,
      maturityDate,
      installments,
      totals,
    },
  };
};

// ------------------------------
// GraphQL operations - Using Loan model with status DRAFT
// ------------------------------

const CREATE_LOAN_MUTATION = `
  mutation CreateLoan($input: CreateLoanInput!) {
    createLoan(input: $input) {
      id
      loanNumber
      status
      borrowerID
      branchID
      loanProductID
      principal
      interestRate
      startDate
      maturityDate
      loanComputationRecord
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_LOAN_MUTATION = `
  mutation UpdateLoan($input: UpdateLoanInput!, $condition: ModelLoanConditionInput) {
    updateLoan(input: $input, condition: $condition) {
      id
      loanNumber
      status
      borrowerID
      loanProductID
      principal
      interestRate
      startDate
      maturityDate
      loanComputationRecord
      updatedAt
    }
  }
`;

const GET_LOAN_QUERY = `
  query GetLoan($id: ID!) {
    getLoan(id: $id) {
      id
      loanNumber
      status
      borrowerID
      branchID
      loanProductID
      principal
      interestRate
      startDate
      maturityDate
      duration
      durationInterval
      paymentFrequency
      loanComputationRecord
      createdByEmployeeID
      createdAt
      updatedAt
      borrower {
        id
        firstname
        othername
        businessName
        uniqueIdNumber
      }
      loanProduct {
        id
        name
      }
    }
  }
`;

const LOANS_BY_BRANCH_QUERY = `
  query LoansByBranchIDAndStartDate(
    $branchID: ID!
    $startDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelLoanFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loansByBranchIDAndStartDate(
      branchID: $branchID
      startDate: $startDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanNumber
        status
        borrowerID
        loanProductID
        principal
        interestRate
        startDate
        maturityDate
        loanComputationRecord
        createdAt
        updatedAt
        borrower {
          id
          firstname
          othername
          businessName
        }
      }
      nextToken
    }
  }
`;

const LOANS_BY_BORROWER_QUERY = `
  query LoansByBorrowerIDAndStartDate(
    $borrowerID: ID!
    $startDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelLoanFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loansByBorrowerIDAndStartDate(
      borrowerID: $borrowerID
      startDate: $startDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanNumber
        status
        borrowerID
        branchID
        principal
        interestRate
        loanComputationRecord
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

const CREATE_LOAN_EVENT_MUTATION = `
  mutation CreateLoanEvent($input: CreateLoanEventInput!) {
    createLoanEvent(input: $input) {
      id
    }
  }
`;

const LOAN_EVENTS_BY_LOAN_QUERY = `
  query LoanEventsByLoan(
    $loanID: ID!
    $eventAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $limit: Int
    $nextToken: String
  ) {
    loanEventsByLoanIDAndEventAt(
      loanID: $loanID
      eventAt: $eventAt
      sortDirection: $sortDirection
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        eventAt
        eventType
        actorEmployeeID
        summary
        payload
      }
      nextToken
    }
  }
`;

const CREATE_LOAN_INSTALLMENT_MUTATION = `
  mutation CreateLoanInstallment($input: CreateLoanInstallmentInput!) {
    createLoanInstallment(input: $input) {
      id
    }
  }
`;

const CREATE_LOAN_ACCOUNT_MUTATION = `
  mutation CreateLoanAccount($input: CreateLoanAccountInput!) {
    createLoanAccount(input: $input) {
      id
    }
  }
`;

const runWithConcurrency = async (items, limit, worker) => {
  const list = Array.isArray(items) ? items : [];
  const concurrency = Math.max(1, Math.min(limit || 1, list.length || 1));
  const results = new Array(list.length);
  let nextIndex = 0;

  const runners = Array.from({ length: concurrency }, async () => {
    while (true) {
      const current = nextIndex;
      nextIndex += 1;
      if (current >= list.length) return;
      results[current] = await worker(list[current], current);
    }
  });

  await Promise.all(runners);
  return results;
};

// ------------------------------
// Public Draft API - Using Loan model
// ------------------------------

export const getLoanDraftById = async (id) => {
  const client = generateClient();
  const result = await client.graphql({
    query: GET_LOAN_QUERY,
    variables: { id },
  });
  const loan = result?.data?.getLoan || null;
  if (!loan) return null;
  
  // Transform Loan to draft-like structure for compatibility
  const computationRecord = parseAwsJson(loan?.loanComputationRecord) || {};
  const draftRecord = computationRecord?.draftRecord || null;
  return {
    ...loan,
    draftNumber: loan.loanNumber,
    // This screen is about draft loans; prefer the workflow status stored in computationRecord.
    // Fall back to the status field if computationRecord doesn't have it.
    status: computationRecord?.status || loan.status || "DRAFT",
    // Expose the actual draft values (matches CreateLoan / LoanScheduleDraft expectations)
    draftRecord: draftRecord ? safeJsonStringify(draftRecord) : null,
    editVersion: 1, // No version tracking yet
    lastEditedAt: loan.updatedAt,
    schedulePreview: computationRecord?.schedulePreview,
    scheduleHash: computationRecord?.scheduleHash,
  };
};

export const listLoanDraftsByBranch = async ({
  branchID,
  status,
  limit = 100,
}) => {
  const client = generateClient();
  let nextToken = null;
  const items = [];

  do {
    const result = await client.graphql({
      query: LOANS_BY_BRANCH_QUERY,
      variables: {
        branchID,
        sortDirection: "DESC",
        filter: { status: { eq: "DRAFT" } },
        limit,
        nextToken,
      },
    });

    const batch = result?.data?.loansByBranchIDAndStartDate?.items || [];
    // Transform to draft-like structure
    const transformed = batch.map((loan) => {
      const computationRecord = parseAwsJson(loan?.loanComputationRecord) || {};
      const draftRecord = computationRecord?.draftRecord || null;
      return {
        ...loan,
        draftNumber: loan.loanNumber,
        status: computationRecord?.status || loan.status || "DRAFT",
        draftRecord: draftRecord ? safeJsonStringify(draftRecord) : null,
        lastEditedAt: loan.updatedAt,
      };
    });
    items.push(...transformed);
    nextToken = result?.data?.loansByBranchIDAndStartDate?.nextToken || null;
  } while (nextToken);

  return items;
};

export const listLoanDraftsByInstitution = async ({
  institutionID,
  status,
  limit = 100,
}) => {
  // For institutions without branch context, fetch from all branches of the institution
  const client = generateClient();
  let allBranches = [];

  // 1. Fetch the institution and its branches
  const GET_INSTITUTION_QUERY = `
    query GetInstitution($id: ID!) {
      getInstitution(id: $id) {
        id
        branches {
          items {
            id
          }
          nextToken
        }
      }
    }
  `;

  try {
    const result = await client.graphql({
      query: GET_INSTITUTION_QUERY,
      variables: {
        id: institutionID,
      },
    });

    const branches = result?.data?.getInstitution?.branches?.items || [];
    allBranches = branches;
  } catch (err) {
    console.error("Error fetching institution branches:", err);
    return [];
  }

  // 2. Fetch drafts from each branch (in parallel)
  try {
    const draftPromises = allBranches.map((branch) =>
      listLoanDraftsByBranch({ branchID: branch.id, limit })
    );
    const results = await Promise.all(draftPromises);
    return results.flat();
  } catch (err) {
    console.error("Error fetching drafts for institution branches:", err);
    return [];
  }
};

export const listLoanDraftsByBorrower = async ({ borrowerID, limit = 100 }) => {
  const client = generateClient();
  let nextToken = null;
  const items = [];

  do {
    const result = await client.graphql({
      query: LOANS_BY_BORROWER_QUERY,
      variables: {
        borrowerID,
        sortDirection: "DESC",
        filter: { status: { eq: "DRAFT" } },
        limit,
        nextToken,
      },
    });

    const batch = result?.data?.loansByBorrowerIDAndStartDate?.items || [];
    const transformed = batch.map((loan) => {
      const computationRecord = parseAwsJson(loan?.loanComputationRecord) || {};
      const draftRecord = computationRecord?.draftRecord || null;
      return {
        ...loan,
        draftNumber: loan.loanNumber,
        status: computationRecord?.status || loan.status || "DRAFT",
        draftRecord: draftRecord ? safeJsonStringify(draftRecord) : null,
        lastEditedAt: loan.updatedAt,
      };
    });
    items.push(...transformed);
    nextToken = result?.data?.loansByBorrowerIDAndStartDate?.nextToken || null;
  } while (nextToken);

  return items;
};

export const createLoanDraft = async ({
  userDetails,
  draftRecord,
  source = "BLANK",
  status = "DRAFT",
  termsSnapshot,
  assignedToEmployeeID,
}) => {
  const client = generateClient();

  const scheduleResult = await generateSchedulePreviewFromDraftRecord(draftRecord);
  if (!scheduleResult.supported) {
    console.warn("Schedule preview generation failed:", scheduleResult.reason);
  }

  // Build computation record with all draft data
  const computationRecord = {
    source,
    status,
    draftRecord,
    termsSnapshot,
    schedulePreview: scheduleResult?.schedulePreview,
    scheduleHash: scheduleResult?.scheduleHash,
    createdAt: nowIso(),
  };

  const input = {
    loanNumber: `LD-${Date.now()}`,
    status: status || "DRAFT",
    borrowerID: draftRecord?.borrower || null,
    branchID: userDetails?.branchUsersId || null,
    loanProductID: draftRecord?.loanProduct || null,
    createdByEmployeeID: userDetails?.id || null,
    
    // Core loan fields from draft
    principal: Number(draftRecord?.principalAmount) || null,
    interestRate: Number(draftRecord?.interestRate) || null,
    startDate: draftRecord?.loanStartDate || draftRecord?.disbursementDate || null,
    maturityDate: scheduleResult?.schedulePreview?.maturityDate || null,
    duration: Number(draftRecord?.termDuration ?? draftRecord?.loanDuration ?? draftRecord?.duration ?? 0) || null,
    durationInterval: draftRecord?.durationPeriod ?? draftRecord?.durationInterval ?? null,
    paymentFrequency: scheduleResult?.schedulePreview?.repaymentFrequency || null,
    loanCurrency: draftRecord?.loanCurrency || null,
    
    // Store all draft data in loanComputationRecord
    loanComputationRecord: safeJsonStringify(computationRecord),
  };

  const result = await client.graphql({
    query: CREATE_LOAN_MUTATION,
    variables: { input },
  });

  const created = result?.data?.createLoan;
  if (created?.id) {
    await client.graphql({
      query: CREATE_LOAN_EVENT_MUTATION,
      variables: {
        input: {
          loanID: created.id,
          eventAt: nowIso(),
          eventType: "CREATED",
          actorEmployeeID: userDetails?.id || null,
          summary: "Draft loan created",
          payload: safeJsonStringify({ source, status }),
        },
      },
    });
  }

  // Transform to draft-like structure for compatibility
  return {
    ...created,
    draftNumber: created.loanNumber,
    status: status || "DRAFT",
    draftRecord: safeJsonStringify(draftRecord),
    editVersion: 1,
    lastEditedAt: created.updatedAt,
    schedulePreview: scheduleResult?.schedulePreview ? safeJsonStringify(scheduleResult.schedulePreview) : null,
    scheduleHash: scheduleResult?.scheduleHash,
  };
};

export const updateLoanDraft = async ({
  id,
  expectedEditVersion,
  userDetails,
  patch,
}) => {
  const client = generateClient();

  // Get existing loan to merge computation record
  const existing = await getLoanDraftById(id);
  if (!existing) throw new Error("Draft loan not found");
  
  const existingComputationRecord = parseAwsJson(existing.loanComputationRecord) || {};
  const existingDraftRecord = parseAwsJson(patch?.draftRecord) || parseAwsJson(existingComputationRecord.draftRecord) || patch?.draftRecord;
  
  const scheduleResult = existingDraftRecord
    ? await generateSchedulePreviewFromDraftRecord(existingDraftRecord)
    : null;

  // Build updated computation record
  const updatedComputationRecord = {
    ...existingComputationRecord,
    draftRecord: existingDraftRecord,
    schedulePreview: scheduleResult?.schedulePreview,
    scheduleHash: scheduleResult?.scheduleHash,
    lastEditedAt: nowIso(),
    lastEditedByEmployeeID: userDetails?.id || null,
  };

  if (patch?.status) {
    updatedComputationRecord.status = patch.status;
  }

  const input = {
    id,
    loanComputationRecord: safeJsonStringify(updatedComputationRecord),
  };

  // Update core loan fields if draft record changed
  if (patch?.draftRecord && scheduleResult) {
    input.principal = Number(existingDraftRecord?.principalAmount) || null;
    input.interestRate = Number(existingDraftRecord?.interestRate) || null;
    input.startDate = existingDraftRecord?.loanStartDate || existingDraftRecord?.disbursementDate || null;
    input.maturityDate = scheduleResult?.schedulePreview?.maturityDate || null;
    input.duration = Number(existingDraftRecord?.termDuration ?? existingDraftRecord?.loanDuration ?? existingDraftRecord?.duration ?? 0) || null;
    input.durationInterval = existingDraftRecord?.durationPeriod ?? existingDraftRecord?.durationInterval ?? null;
    input.paymentFrequency = scheduleResult?.schedulePreview?.repaymentFrequency || null;
    input.loanCurrency = existingDraftRecord?.loanCurrency || null;

    if (scheduleResult && !scheduleResult.supported) {
      console.warn("Schedule preview generation failed:", scheduleResult.reason);
    }
  }

  if (patch?.borrowerID) {
    input.borrowerID = patch.borrowerID;
  }
  if (patch?.loanProductID) {
    input.loanProductID = patch.loanProductID;
  }
  if (patch?.status) {
    input.status = patch.status;
  }

  const result = await client.graphql({
    query: UPDATE_LOAN_MUTATION,
    variables: { input },
  });

  const updated = result?.data?.updateLoan;

  await client.graphql({
    query: CREATE_LOAN_EVENT_MUTATION,
    variables: {
      input: {
        loanID: id,
        eventAt: nowIso(),
        eventType: "OTHER",
        actorEmployeeID: userDetails?.id || null,
        summary: "Draft loan updated",
        payload: safeJsonStringify({ patch }),
      },
    },
  });

  // Transform to draft-like structure
  // Parse the updated computation record to get the workflow status
  const finalComputationRecord = parseAwsJson(updated.loanComputationRecord) || {};
  
  return {
    ...updated,
    draftNumber: updated.loanNumber,
    status: finalComputationRecord?.status || updated.status || "DRAFT",
    draftRecord: patch?.draftRecord || existing.draftRecord,
    editVersion: (expectedEditVersion || 0) + 1,
    lastEditedAt: updated.updatedAt,
    schedulePreview: scheduleResult?.schedulePreview ? safeJsonStringify(scheduleResult.schedulePreview) : existing.schedulePreview,
    scheduleHash: scheduleResult?.scheduleHash || existing.scheduleHash,
  };
};

export const transitionLoanDraftStatus = async ({
  loanDraft,
  userDetails,
  nextStatus,
  rejectionReason,
}) => {
  // Safety gates for externalizing the schedule.
  if (nextStatus === "SENT_FOR_APPROVAL") {
    if (!loanDraft?.schedulePreview || !loanDraft?.scheduleHash) {
      throw new Error(
        "Schedule preview is missing. Save Draft to generate a schedule before sending for approval."
      );
    }
    const draftRecord = parseAwsJson(loanDraft.draftRecord) || {};
    const regen = await generateSchedulePreviewFromDraftRecord(draftRecord);
    if (!regen.supported) {
      throw new Error(regen.reason || "Unsupported schedule configuration");
    }
    if (regen.scheduleHash !== loanDraft.scheduleHash) {
      throw new Error(
        "Schedule preview is stale. Please Save Draft to refresh before sending for approval."
      );
    }
  }

  const patch = {
    status: nextStatus,
    rejectionReason: nextStatus === "REJECTED" ? (rejectionReason || null) : undefined,
  };

  const updated = await updateLoanDraft({
    id: loanDraft.id,
    expectedEditVersion: loanDraft.editVersion,
    userDetails,
    patch,
  });

  const client = generateClient();
  await client.graphql({
    query: CREATE_LOAN_EVENT_MUTATION,
    variables: {
      input: {
        loanID: loanDraft.id,
        eventAt: nowIso(),
        eventType: nextStatus,
        actorEmployeeID: userDetails?.id || null,
        summary: `Status changed to ${nextStatus}`,
        payload: safeJsonStringify({ nextStatus, rejectionReason }),
      },
    },
  });

  return updated;
};

export const listLoanDraftEvents = async ({ loanDraftID, limit = 100 }) => {
  const client = generateClient();
  let nextToken = null;
  const items = [];

  do {
    const result = await client.graphql({
      query: LOAN_EVENTS_BY_LOAN_QUERY,
      variables: {
        loanID: loanDraftID,
        sortDirection: "DESC",
        limit,
        nextToken,
      },
    });

    const batch = result?.data?.loanEventsByLoanIDAndEventAt?.items || [];
    items.push(...batch);
    nextToken = result?.data?.loanEventsByLoanIDAndEventAt?.nextToken || null;
  } while (nextToken);

  return items;
};

export const convertDraftToLoan = async ({ loanDraft, userDetails }) => {
  const client = generateClient();

  if (!loanDraft?.schedulePreview || !loanDraft?.scheduleHash) {
    throw new Error("Draft schedule preview is missing. Save the draft before converting.");
  }

  const draftRecord = parseAwsJson(loanDraft.draftRecord) || {};
  const schedulePreview = parseAwsJson(loanDraft.schedulePreview);

  const regen = await generateSchedulePreviewFromDraftRecord(draftRecord);
  if (!regen.supported) {
    throw new Error(regen.reason || "Unsupported schedule configuration");
  }
  if (regen.scheduleHash !== loanDraft.scheduleHash) {
    throw new Error(
      "Schedule preview is stale. Please Save Draft to refresh before converting."
    );
  }

  const installments = schedulePreview?.installments || regen.schedulePreview?.installments;
  if (!Array.isArray(installments) || installments.length === 0) {
    throw new Error("Schedule preview contains no installments");
  }

  // Update the existing draft loan to ACTIVE status
  const computationRecord = parseAwsJson(loanDraft.loanComputationRecord) || {};
  computationRecord.convertedAt = nowIso();
  computationRecord.convertedToActive = true;

  const updateInput = {
    id: loanDraft.id,
    status: "ACTIVE",
    loanComputationRecord: safeJsonStringify(computationRecord),
  };

  const updateResult = await client.graphql({
    query: UPDATE_LOAN_MUTATION,
    variables: { input: updateInput },
  });

  const loan = updateResult?.data?.updateLoan;
  if (!loan?.id) throw new Error("Failed to convert draft loan to active");

  // Link intended routing account (minimum continuity)
  if (draftRecord?.accountLoansId) {
    try {
      await client.graphql({
        query: CREATE_LOAN_ACCOUNT_MUTATION,
        variables: {
          input: {
            loanId: loan.id,
            accountId: draftRecord.accountLoansId,
          },
        },
      });
    } catch (err) {
      console.warn("Failed to link Loan to source account:", err);
    }
  }

  // Create Installments
  const INSTALLMENT_CONCURRENCY = 6;
  await runWithConcurrency(installments, INSTALLMENT_CONCURRENCY, (inst) =>
    client.graphql({
      query: CREATE_LOAN_INSTALLMENT_MUTATION,
      variables: {
        input: {
          loanID: loan.id,
          dueDate: inst.dueDate,
          principalDue: inst.principalDue,
          interestDue: inst.interestDue,
          feesDue: inst.feesDue || 0,
          penaltyDue: inst.penaltyDue || 0,
          totalDue: inst.totalDue,
          principalPaid: 0,
          interestPaid: 0,
          feesPaid: 0,
          penaltyPaid: 0,
          totalPaid: 0,
          status: "PENDING",
          calculationRecord: safeJsonStringify({
            source: "DRAFT_SCHEDULE_PREVIEW",
          }),
        },
      },
    })
  );

  // Create Loan Event
  await client.graphql({
    query: CREATE_LOAN_EVENT_MUTATION,
    variables: {
      input: {
        loanID: loan.id,
        eventAt: nowIso(),
        eventType: "CREATED",
        actorEmployeeID: userDetails?.id || null,
        summary: "ACTIVATED_FROM_DRAFT",
        payload: safeJsonStringify({ convertedFromDraft: true }),
      },
    },
  });

  return loan;
};

export const copyLoanDraft = async ({ loanDraft, userDetails }) => {
  const draftRecord = parseAwsJson(loanDraft?.draftRecord) || {};
  const computationRecord = parseAwsJson(loanDraft?.loanComputationRecord) || {};
  const termsSnapshot = computationRecord.termsSnapshot;

  // Remove any fields that should not carry over
  const cleaned = { ...draftRecord };

  const created = await createLoanDraft({
    userDetails,
    draftRecord: cleaned,
    source: "COPY",
    status: "DRAFT",
    termsSnapshot,
  });

  const client = generateClient();
  await client.graphql({
    query: CREATE_LOAN_EVENT_MUTATION,
    variables: {
      input: {
        loanID: created.id,
        eventAt: nowIso(),
        eventType: "OTHER",
        actorEmployeeID: userDetails?.id || null,
        summary: "Draft copied",
        payload: safeJsonStringify({ fromLoanDraftID: loanDraft?.id }),
      },
    },
  });

  return created;
};

// Renamed export for backward compatibility
export const generateSchedulePreviewFromDraftValues = generateSchedulePreviewFromDraftRecord;
