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
    repaymentFrequencyType: values?.repaymentFrequencyType,
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
    repaymentFrequencyType: values?.repaymentFrequencyType,
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
        const durationInYears = dayjs(maturityDate).diff(dayjs(startDate), "day") / 365;
        totalInterest = rawInterestRate * (interestPeriod === "per_year" ? durationInYears : 1);
        // If fixed per month/week/day, we approximate by scaling to loan length.
        if (interestPeriod === "per_month") totalInterest = rawInterestRate * durationInYears * 12;
        if (interestPeriod === "per_week") totalInterest = rawInterestRate * durationInYears * 52;
        if (interestPeriod === "per_day") totalInterest = rawInterestRate * durationInYears * 365;
      }
    } else {
      const durationInYears = dayjs(maturityDate).diff(dayjs(startDate), "day") / 365;
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
    // SIMPLE / COMPOUND: amortized equal installments using periodic rate.
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
    // For month/year we use dayjs diff to avoid hard-coding month length.
    const start = dayjs(startDate);
    const next = start.add(count, unit);
    const periodYears = Math.max(1 / 365, next.diff(start, "day") / 365);

    const r = annualRate * periodYears;
    const safeR = Number.isFinite(r) ? r : 0;

    let pmt = 0;
    if (safeR <= 0) {
      pmt = principal / n;
    } else {
      pmt = (principal * safeR * Math.pow(1 + safeR, n)) / (Math.pow(1 + safeR, n) - 1);
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
    const principalSum = round2(installments.reduce((s, x) => s + x.principalDue, 0));
    const principalDiff = round2(principal - principalSum);
    const last = installments[installments.length - 1];
    last.principalDue = round2(last.principalDue + principalDiff);
    last.totalDue = round2(last.principalDue + last.interestDue);
    last.balanceAfter = 0;
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
// GraphQL operations
// ------------------------------

const CREATE_LOAN_DRAFT_MUTATION = `
  mutation CreateLoanDraft($input: CreateLoanDraftInput!) {
    createLoanDraft(input: $input) {
      id
      status
      source
      draftNumber
      institutionID
      branchID
      borrowerID
      loanProductID
      editVersion
      scheduleHash
      lastEditedAt
      updatedAt
    }
  }
`;

const UPDATE_LOAN_DRAFT_MUTATION = `
  mutation UpdateLoanDraft($input: UpdateLoanDraftInput!, $condition: ModelLoanDraftConditionInput) {
    updateLoanDraft(input: $input, condition: $condition) {
      id
      status
      source
      draftNumber
      borrowerID
      loanProductID
      editVersion
      scheduleHash
      lastEditedAt
      updatedAt
    }
  }
`;

const GET_LOAN_DRAFT_QUERY = `
  query GetLoanDraft($id: ID!) {
    getLoanDraft(id: $id) {
      id
      status
      source
      draftNumber
      institutionID
      branchID
      borrowerID
      loanProductID
      createdByEmployeeID
      assignedToEmployeeID
      submittedAt
      approvedAt
      rejectedAt
      rejectionReason
      convertedAt
      draftRecord
      termsSnapshot
      schedulePreview
      scheduleHash
      editVersion
      lastEditedByEmployeeID
      lastEditedAt
      principal
      interestRate
      interestCalculationMethod
      startDate
      maturityDate
      loanCurrency
      createdAt
      updatedAt
    }
  }
`;

const LOAN_DRAFTS_BY_BRANCH_QUERY = `
  query LoanDraftsByBranchIDAndUpdatedAt(
    $branchID: ID!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelLoanDraftFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanDraftsByBranchIDAndUpdatedAt(
      branchID: $branchID
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        status
        source
        draftNumber
        borrowerID
        loanProductID
        principal
        interestRate
        startDate
        maturityDate
        lastEditedAt
        editVersion
        updatedAt
      }
      nextToken
    }
  }
`;

const LOAN_DRAFTS_BY_INSTITUTION_QUERY = `
  query LoanDraftsByInstitutionIDAndUpdatedAt(
    $institutionID: ID!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelLoanDraftFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanDraftsByInstitutionIDAndUpdatedAt(
      institutionID: $institutionID
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        status
        source
        draftNumber
        borrowerID
        loanProductID
        principal
        interestRate
        startDate
        maturityDate
        lastEditedAt
        editVersion
        updatedAt
      }
      nextToken
    }
  }
`;

const LOAN_DRAFTS_BY_BORROWER_QUERY = `
  query LoanDraftsByBorrowerIDAndUpdatedAt(
    $borrowerID: ID!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelLoanDraftFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanDraftsByBorrowerIDAndUpdatedAt(
      borrowerID: $borrowerID
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        status
        draftNumber
        principal
        interestRate
        lastEditedAt
        updatedAt
      }
      nextToken
    }
  }
`;

const CREATE_LOAN_DRAFT_EVENT_MUTATION = `
  mutation CreateLoanDraftEvent($input: CreateLoanDraftEventInput!) {
    createLoanDraftEvent(input: $input) {
      id
      loanDraftID
      eventAt
      eventType
      actorEmployeeID
      summary
      payload
    }
  }
`;

const LOAN_DRAFT_EVENTS_BY_DRAFT_QUERY = `
  query LoanDraftEventsByLoanDraft(
    $loanDraftID: ID!
    $sortDirection: ModelSortDirection
    $limit: Int
    $nextToken: String
  ) {
    loanDraftEventsByLoanDraft(
      loanDraftID: $loanDraftID
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

// Conversion ops (custom; do NOT import from src/graphql/*)
const CREATE_LOAN_MUTATION = `
  mutation CreateLoan($input: CreateLoanInput!) {
    createLoan(input: $input) {
      id
      loanNumber
      loanStatusEnum
      approvalStatusEnum
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

const CREATE_LOAN_EVENT_MUTATION = `
  mutation CreateLoanEvent($input: CreateLoanEventInput!) {
    createLoanEvent(input: $input) {
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
// Public Draft API
// ------------------------------

export const getLoanDraftById = async (id) => {
  const client = generateClient();
  const result = await client.graphql({
    query: GET_LOAN_DRAFT_QUERY,
    variables: { id },
  });
  return result?.data?.getLoanDraft || null;
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
      query: LOAN_DRAFTS_BY_BRANCH_QUERY,
      variables: {
        branchID,
        sortDirection: "DESC",
        filter: status ? { status: { eq: status } } : undefined,
        limit,
        nextToken,
      },
    });

    const batch = result?.data?.loanDraftsByBranchIDAndUpdatedAt?.items || [];
    items.push(...batch);
    nextToken =
      result?.data?.loanDraftsByBranchIDAndUpdatedAt?.nextToken || null;
  } while (nextToken);

  return items;
};

export const listLoanDraftsByInstitution = async ({
  institutionID,
  status,
  limit = 100,
}) => {
  const client = generateClient();
  let nextToken = null;
  const items = [];

  do {
    const result = await client.graphql({
      query: LOAN_DRAFTS_BY_INSTITUTION_QUERY,
      variables: {
        institutionID,
        sortDirection: "DESC",
        filter: status ? { status: { eq: status } } : undefined,
        limit,
        nextToken,
      },
    });

    const batch =
      result?.data?.loanDraftsByInstitutionIDAndUpdatedAt?.items || [];
    items.push(...batch);
    nextToken =
      result?.data?.loanDraftsByInstitutionIDAndUpdatedAt?.nextToken || null;
  } while (nextToken);

  return items;
};

export const listLoanDraftsByBorrower = async ({ borrowerID, limit = 100 }) => {
  const client = generateClient();
  let nextToken = null;
  const items = [];

  do {
    const result = await client.graphql({
      query: LOAN_DRAFTS_BY_BORROWER_QUERY,
      variables: {
        borrowerID,
        sortDirection: "DESC",
        limit,
        nextToken,
      },
    });

    const batch =
      result?.data?.loanDraftsByBorrowerIDAndUpdatedAt?.items || [];
    items.push(...batch);
    nextToken =
      result?.data?.loanDraftsByBorrowerIDAndUpdatedAt?.nextToken || null;
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
    // Draft can still be created; schedule-related actions will be blocked later.
    console.warn("Schedule preview generation failed:", scheduleResult.reason);
  }

  const input = {
    status,
    source,
    draftNumber: `LD-${Date.now()}`,
    institutionID: userDetails?.institutionUsersId || null,
    branchID: userDetails?.branchUsersId || null,
    borrowerID: draftRecord?.borrower || null,
    loanProductID: draftRecord?.loanProduct || null,
    createdByEmployeeID: userDetails?.id || null,
    assignedToEmployeeID: assignedToEmployeeID || null,
    draftRecord: safeJsonStringify(draftRecord),
    termsSnapshot: termsSnapshot ? safeJsonStringify(termsSnapshot) : null,
    schedulePreview: scheduleResult?.schedulePreview
      ? safeJsonStringify(scheduleResult.schedulePreview)
      : null,
    scheduleHash: scheduleResult?.scheduleHash || null,
    editVersion: 1,
    lastEditedByEmployeeID: userDetails?.id || null,
    lastEditedAt: nowIso(),

    // Denormalized
    principal: Number(draftRecord?.principalAmount) || null,
    interestRate: Number(draftRecord?.interestRate) || null,
    interestCalculationMethod: scheduleResult?.schedulePreview?.interestCalculationMethod || null,
    startDate: draftRecord?.loanStartDate || null,
    maturityDate: scheduleResult?.schedulePreview?.maturityDate || null,
    loanCurrency: draftRecord?.loanCurrency || null,
  };

  const result = await client.graphql({
    query: CREATE_LOAN_DRAFT_MUTATION,
    variables: { input },
  });

  const created = result?.data?.createLoanDraft;
  if (created?.id) {
    await client.graphql({
      query: CREATE_LOAN_DRAFT_EVENT_MUTATION,
      variables: {
        input: {
          loanDraftID: created.id,
          eventAt: nowIso(),
          eventType: "CREATED",
          actorEmployeeID: userDetails?.id || null,
          summary: "Draft created",
          payload: safeJsonStringify({ source, status }),
        },
      },
    });
  }

  return created;
};

export const updateLoanDraft = async ({
  id,
  expectedEditVersion,
  userDetails,
  patch,
}) => {
  const client = generateClient();

  const existingDraftRecord = parseAwsJson(patch?.draftRecord) || patch?.draftRecord;
  const scheduleResult = existingDraftRecord
    ? await generateSchedulePreviewFromDraftRecord(existingDraftRecord)
    : null;

  const input = {
    id,
    ...patch,
    editVersion: Number(expectedEditVersion) + 1,
    lastEditedByEmployeeID: userDetails?.id || null,
    lastEditedAt: nowIso(),
  };

  if (patch?.draftRecord && scheduleResult) {
    input.schedulePreview = scheduleResult?.schedulePreview
      ? safeJsonStringify(scheduleResult.schedulePreview)
      : null;
    input.scheduleHash = scheduleResult?.scheduleHash || null;

    // Denormalized refresh
    input.principal = Number(existingDraftRecord?.principalAmount) || null;
    input.interestRate = Number(existingDraftRecord?.interestRate) || null;
    input.interestCalculationMethod = scheduleResult?.schedulePreview?.interestCalculationMethod || null;
    input.startDate = existingDraftRecord?.loanStartDate || null;
    input.maturityDate = scheduleResult?.schedulePreview?.maturityDate || null;
    input.loanCurrency = existingDraftRecord?.loanCurrency || null;

    if (scheduleResult && !scheduleResult.supported) {
      console.warn("Schedule preview generation failed:", scheduleResult.reason);
    }
  }

  const result = await client.graphql({
    query: UPDATE_LOAN_DRAFT_MUTATION,
    variables: {
      input,
      condition: {
        editVersion: { eq: Number(expectedEditVersion) },
      },
    },
  });

  const updated = result?.data?.updateLoanDraft;

  await client.graphql({
    query: CREATE_LOAN_DRAFT_EVENT_MUTATION,
    variables: {
      input: {
        loanDraftID: id,
        eventAt: nowIso(),
        eventType: "UPDATED",
        actorEmployeeID: userDetails?.id || null,
        summary: "Draft updated",
        payload: safeJsonStringify({ editVersion: updated?.editVersion }),
      },
    },
  });

  return updated;
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
  };

  if (nextStatus === "SENT_FOR_APPROVAL") patch.submittedAt = nowIso();
  if (nextStatus === "APPROVED") patch.approvedAt = nowIso();
  if (nextStatus === "REJECTED") {
    patch.rejectedAt = nowIso();
    patch.rejectionReason = rejectionReason || null;
  }
  if (nextStatus === "ARCHIVED") {
    // no extra fields
  }

  const updated = await updateLoanDraft({
    id: loanDraft.id,
    expectedEditVersion: loanDraft.editVersion,
    userDetails,
    patch,
  });

  const client = generateClient();
  await client.graphql({
    query: CREATE_LOAN_DRAFT_EVENT_MUTATION,
    variables: {
      input: {
        loanDraftID: loanDraft.id,
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
      query: LOAN_DRAFT_EVENTS_BY_DRAFT_QUERY,
      variables: {
        loanDraftID,
        sortDirection: "DESC",
        limit,
        nextToken,
      },
    });

    const batch = result?.data?.loanDraftEventsByLoanDraft?.items || [];
    items.push(...batch);
    nextToken = result?.data?.loanDraftEventsByLoanDraft?.nextToken || null;
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

  // Create Loan
  const loanInput = {
    loanNumber: `LN-${Date.now()}`,
    borrowerID: loanDraft.borrowerID || draftRecord?.borrower || null,
    branchID: loanDraft.branchID || userDetails?.branchUsersId || null,
    loanProductID: loanDraft.loanProductID || draftRecord?.loanProduct || null,
    principal: Number(draftRecord?.principalAmount) || null,
    interestRate: Number(draftRecord?.interestRate) || null,
    duration: Number(draftRecord?.termDuration ?? draftRecord?.loanDuration ?? draftRecord?.duration ?? 0) || null,
    durationInterval: draftRecord?.durationPeriod ?? draftRecord?.durationInterval ?? null,
    startDate: draftRecord?.disbursementDate ?? draftRecord?.loanStartDate ?? draftRecord?.startDate ?? null,
    maturityDate: schedulePreview?.maturityDate || regen.schedulePreview?.maturityDate || null,
    paymentFrequency: schedulePreview?.repaymentFrequency || null,
    loanStatusEnum: "DRAFT",
    approvalStatusEnum:
      loanDraft.status === "APPROVED" ? "APPROVED" : "PENDING",
    createdByEmployeeID: loanDraft.createdByEmployeeID || userDetails?.id || null,
    loanDraftID: loanDraft.id,
    loanComputationRecord: safeJsonStringify({
      createdFromDraft: true,
      loanDraftID: loanDraft.id,
      draftNumber: loanDraft.draftNumber,
      draftRecord,
      scheduleHash: loanDraft.scheduleHash,
    }),
  };

  const loanResult = await client.graphql({
    query: CREATE_LOAN_MUTATION,
    variables: { input: loanInput },
  });

  const loan = loanResult?.data?.createLoan;
  if (!loan?.id) throw new Error("Failed to create Loan from draft");

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
            loanDraftID: loanDraft.id,
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
        summary: "CREATED_FROM_DRAFT",
        payload: safeJsonStringify({ loanDraftID: loanDraft.id }),
      },
    },
  });

  // Mark draft converted
  await updateLoanDraft({
    id: loanDraft.id,
    expectedEditVersion: loanDraft.editVersion,
    userDetails,
    patch: {
      status: "CONVERTED",
      convertedAt: nowIso(),
    },
  });

  await client.graphql({
    query: CREATE_LOAN_DRAFT_EVENT_MUTATION,
    variables: {
      input: {
        loanDraftID: loanDraft.id,
        eventAt: nowIso(),
        eventType: "CONVERTED",
        actorEmployeeID: userDetails?.id || null,
        summary: "Converted to Loan",
        payload: safeJsonStringify({ loanID: loan.id }),
      },
    },
  });

  return loan;
};

export const copyLoanDraft = async ({ loanDraft, userDetails }) => {
  const draftRecord = parseAwsJson(loanDraft?.draftRecord) || {};
  const termsSnapshot = parseAwsJson(loanDraft?.termsSnapshot);

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
    query: CREATE_LOAN_DRAFT_EVENT_MUTATION,
    variables: {
      input: {
        loanDraftID: created.id,
        eventAt: nowIso(),
        eventType: "COPIED",
        actorEmployeeID: userDetails?.id || null,
        summary: "Draft copied",
        payload: safeJsonStringify({ fromLoanDraftID: loanDraft?.id }),
      },
    },
  });

  return created;
};
