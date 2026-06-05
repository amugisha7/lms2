import { generateClient } from "aws-amplify/api";
import {
  attachDerivedLoanData,
  buildLoanSummaryRecord,
  isLoanSummaryVisible,
} from "../../Models/Loans/loanSummaryProjection";

const REPORT_LOAN_SOURCE_FIELDS = `
  id
  loanNumber
  approvedDate
  principal
  fees
  interestRate
  startDate
  maturityDate
  duration
  durationInterval
  loanType
  rateInterval
  loanCurrency
  loanPurpose
  loanComputationRecord
  customLoanDetails
  numberOfPayments
  paymentFrequency
  status
  branchID
  borrowerID
  createdByEmployeeID
  loanProductID
  borrower {
    id
    firstname
    othername
    businessName
    phoneNumber
    otherPhoneNumber
    email
    uniqueIdNumber
  }
  branch {
    id
    name
  }
  createdByEmployee {
    id
    firstName
    lastName
    email
  }
  loanProduct {
    id
    name
    interestCalculationMethod
    repaymentOrder
  }
  penalties(limit: 1000) {
    items {
      id
      amount
      penaltyName
      penaltyCategory
      penaltyCalculationMethod
      penaltyRate
      penaltyDate
      penaltyStatus
      notes
      penaltyType
      penaltyDescription
      status
      createdAt
      updatedAt
    }
  }
  loanFees(limit: 1000) {
    items {
      id
      amount
      loanFeesName
      loanFeesCategory
      loanFeesType
      loanFeesDate
      loanFeesStatus
      status
      notes
      createdAt
    }
  }
  events(limit: 200) {
    items {
      id
      eventAt
      eventType
      summary
      payload
    }
  }
  payments(limit: 1000) {
    items {
      id
      paymentDate
      amount
      description
      paymentMethod
      referenceNumber
      status
      paymentStatusEnum
      amountAllocatedToPrincipal
      amountAllocatedToInterest
      amountAllocatedToFees
      amountAllocatedToPenalty
      createdAt
    }
  }
`;

export const GET_REPORT_LOAN_SOURCE_QUERY = `
  query GetReportLoanSource($id: ID!) {
    getLoan(id: $id) {
      ${REPORT_LOAN_SOURCE_FIELDS}
    }
  }
`;

const REPORT_BRANCH_LOANS_QUERY = `
  query ReportBranchLoans(
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
        ${REPORT_LOAN_SOURCE_FIELDS}
      }
      nextToken
    }
  }
`;

const safeParseJson = (value) => {
  if (value == null) return null;
  if (typeof value === "object") return value;
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const extractDerivedStatement = (loan, options) => {
  try {
    const derivedLoan = attachDerivedLoanData(loan, options);
    return derivedLoan?.derivedStatement || null;
  } catch (err) {
    console.warn(
      "[reportLoanData] failed to derive statement for loan",
      loan?.id,
      err,
    );
    return null;
  }
};

const buildPaymentRowsFromStatement = (derivedStatement) => {
  const rows = derivedStatement?.rows;
  if (!Array.isArray(rows)) return [];
  return rows
    .filter((row) => row?.rowType === "payment")
    .map((row) => ({
      date: row.date,
      amount: Number(row.amount) || 0,
      allocPrincipal: Number(row.allocPrincipal) || 0,
      allocInterest: Number(row.allocInterest) || 0,
      allocFees: Number(row.allocFees) || 0,
      allocPenalty: Number(row.allocPenalty) || 0,
      paymentStatusEnum: row.paymentStatusEnum || null,
    }));
};

const buildScheduleRowsFromStatement = (derivedStatement) => {
  const schedule = derivedStatement?.schedule;
  if (!Array.isArray(schedule)) return [];
  return schedule.map((inst, index) => ({
    instNum: index + 1,
    dueDate: inst.dueDate || null,
    principalDue: Number(inst.principalDue) || 0,
    interestDue: Number(inst.interestDue) || 0,
    feesDue: Number(inst.feesDue) || 0,
    penaltyDue: Number(inst.penaltyDue) || 0,
    openingBalance:
      Number(inst.openingBalance ?? inst._openingBalance) || 0,
  }));
};

const EXCLUDED_LOAN_FEE_STATUSES = new Set([
  "VOIDED",
  "CANCELLED",
  "REVERSED",
]);

const filterValidLoanFees = (items) =>
  (items || []).filter(Boolean).filter((fee) => {
    const status = String(fee?.loanFeesStatus || fee?.status || "").toUpperCase();
    return !EXCLUDED_LOAN_FEE_STATUSES.has(status);
  });

// Derive the write-off date from the LoanEvent stream. Prefer the most recent
// STATUS_CHANGED event whose payload (or summary) names WRITTEN_OFF. Falls back
// to null when no such event is recorded yet, even if the loan's current
// `status` is WRITTEN_OFF — in that case callers can fall back to `updatedAt`.
const extractWriteOffDate = (loan) => {
  const events = Array.isArray(loan?.events?.items)
    ? loan.events.items.filter(Boolean)
    : [];
  if (events.length === 0) return null;

  const writeOffEvents = events.filter((event) => {
    const type = String(event?.eventType || "").toUpperCase();
    const summary = String(event?.summary || "").toUpperCase();
    if (type !== "STATUS_CHANGED" && type !== "OTHER") return false;
    if (summary.includes("WRITTEN_OFF") || summary.includes("WRITE_OFF")) {
      return true;
    }
    const payload = safeParseJson(event?.payload);
    const toStatus = String(payload?.toStatus || payload?.status || "")
      .toUpperCase()
      .replace(/\s+/g, "_");
    return toStatus === "WRITTEN_OFF";
  });

  if (writeOffEvents.length === 0) return null;

  const latest = writeOffEvents
    .map((e) => ({ at: new Date(e.eventAt || 0).getTime(), raw: e }))
    .filter((e) => Number.isFinite(e.at) && e.at > 0)
    .sort((a, b) => b.at - a.at)[0];

  return latest ? new Date(latest.at).toISOString() : null;
};

const extractStopInterestState = (customLoanDetails) => {
  const parsed = safeParseJson(customLoanDetails);
  const stop = parsed?.stopInterest;
  if (!stop || typeof stop !== "object") return null;
  return {
    stoppedAt: stop.stoppedAt || null,
    resumedAt: stop.resumedAt || null,
    reason: stop.reason || null,
  };
};

const mapLoanToVisibleSummary = (loan, options = {}) => {
  const summary = buildLoanSummaryRecord(loan, options);
  if (!summary || !isLoanSummaryVisible(summary)) {
    return null;
  }

  const derivedStatement = extractDerivedStatement(loan, options);
  const customLoanDetails = safeParseJson(loan?.customLoanDetails);

  return {
    ...summary,
    reportSourcePayments: Array.isArray(loan?.payments?.items)
      ? loan.payments.items.filter(Boolean)
      : [],
    reportSourcePenalties: Array.isArray(loan?.penalties?.items)
      ? loan.penalties.items.filter(Boolean)
      : [],
    reportSourceLoanFees: filterValidLoanFees(loan?.loanFees?.items),
    reportSourcePaymentRows: buildPaymentRowsFromStatement(derivedStatement),
    reportSourceScheduleRows: buildScheduleRowsFromStatement(derivedStatement),
    reportSourceWriteOffDate: extractWriteOffDate(loan),
    reportSourceStopInterest: extractStopInterestState(loan?.customLoanDetails),
    reportSourceCustomLoanDetails: customLoanDetails,
    reportSourceMaturityDate:
      summary.maturityDateEffective || loan?.maturityDate || null,
  };
};

export const fetchReportLoanSummariesPage = async ({
  branchId,
  institutionId,
  currencyCode,
  limit = 500,
  nextToken = null,
  client,
} = {}) => {
  const resolvedClient = client || generateClient();

  if (!branchId) {
    return { items: [], nextToken: null };
  }

  const result = await resolvedClient.graphql({
    query: REPORT_BRANCH_LOANS_QUERY,
    variables: {
      branchID: branchId,
      sortDirection: "DESC",
      limit,
      nextToken,
    },
  });

  const listResult = result?.data?.loansByBranchIDAndStartDate || {};

  return {
    items: Array.isArray(listResult?.items)
      ? listResult.items
          .filter(Boolean)
          .map((loan) =>
            mapLoanToVisibleSummary(loan, {
              defaultInstitutionId: institutionId || null,
              defaultCurrencyCode: currencyCode || null,
            }),
          )
          .filter(Boolean)
      : [],
    nextToken: listResult?.nextToken || null,
  };
};

export const fetchAllReportLoanSummariesForBranch = async ({
  branchId,
  institutionId,
  currencyCode,
  pageSize = 500,
  client,
} = {}) => {
  const resolvedClient = client || generateClient();
  const items = [];
  let nextToken = null;

  do {
    const page = await fetchReportLoanSummariesPage({
      branchId,
      institutionId,
      currencyCode,
      limit: pageSize,
      nextToken,
      client: resolvedClient,
    });

    items.push(...page.items);
    nextToken = page.nextToken;
  } while (nextToken);

  return Array.from(new Map(items.map((item) => [item.id, item])).values());
};