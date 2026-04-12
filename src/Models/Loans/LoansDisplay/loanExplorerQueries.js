import { generateClient } from "aws-amplify/api";
import {
  LOAN_SUMMARY_FIELDS,
  fetchLoanSummariesPage,
} from "../loanSummaryHelpers";
import {
  LOAN_DISPLAY_STATUS,
  isLoanSummaryVisible,
} from "../loanSummaryProjection";

const LOAN_SUMMARIES_BY_DISPLAY_STATUS_QUERY = `
  query LoanSummariesByDisplayStatusAndDisplayStatusComputedAt(
    $displayStatus: LoanDisplayStatus!
    $displayStatusComputedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelLoanSummaryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanSummariesByDisplayStatusAndDisplayStatusComputedAt(
      displayStatus: $displayStatus
      displayStatusComputedAt: $displayStatusComputedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        ${LOAN_SUMMARY_FIELDS}
      }
      nextToken
    }
  }
`;

const DISPLAY_STATUS_BY_CODE = Object.values(LOAN_DISPLAY_STATUS).reduce(
  (accumulator, meta) => {
    accumulator[meta.code] = meta;
    return accumulator;
  },
  {},
);

const getDisplayStatusMeta = (code) =>
  DISPLAY_STATUS_BY_CODE[code] || {
    code: code || "UNKNOWN",
    label: code || "N/A",
    filterKey: "all",
    rank: 999,
  };

const getDateSortValue = (value) => {
  const timestamp = new Date(value || 0).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const normalizeSortValue = (value) => {
  if (typeof value === "string") {
    return value.toLowerCase();
  }

  if (value == null) {
    return "";
  }

  return value;
};

const compareValues = (leftValue, rightValue) => {
  const left = normalizeSortValue(leftValue);
  const right = normalizeSortValue(rightValue);

  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  if (left > right) return 1;
  if (left < right) return -1;
  return 0;
};

export const buildLoanExplorerName = (loan) => {
  const borrowerName = loan?.borrowerDisplayName || "Unnamed Borrower";
  return loan?.loanNumber
    ? `${borrowerName} · ${loan.loanNumber}`
    : borrowerName;
};

export const mapLoanSummaryToExplorerRow = (summary) => {
  const displayStatus = getDisplayStatusMeta(summary?.displayStatus);

  return {
    ...summary,
    id: summary?.loanID || summary?.id,
    uiStatusCode: displayStatus.code,
    uiStatusLabel: displayStatus.label,
    uiStatusFilterKey: displayStatus.filterKey,
    principalAmount: summary?.principalAmount || 0,
    totalPaidAmount: summary?.totalPaidAmount || 0,
    amountDueAmount: summary?.amountDueAmount || 0,
    loanBalanceAmount: summary?.loanBalanceAmount || 0,
    arrearsAmount: summary?.arrearsAmount || 0,
    missedInstallmentCount: summary?.missedInstallmentCount || 0,
  };
};

const SORT_VALUE_GETTERS = {
  borrower: (row) => buildLoanExplorerName(row),
  principalAmount: (row) => row?.principalAmount || 0,
  startDate: (row) => getDateSortValue(row?.startDate),
  nextDueDate: (row) => getDateSortValue(row?.nextDueDate),
  maturityDateEffective: (row) => getDateSortValue(row?.maturityDateEffective),
  amountDue: (row) => row?.amountDueAmount || 0,
  totalPaid: (row) => row?.totalPaidAmount || 0,
  loanBalance: (row) => row?.loanBalanceAmount || 0,
  loanOfficer: (row) => row?.loanOfficerDisplayName || "",
};

const getScopeFilter = ({ institutionId, branchId }) => {
  if (institutionId) {
    return { institutionID: { eq: institutionId } };
  }

  if (branchId) {
    return { branchID: { eq: branchId } };
  }

  return undefined;
};

export const sortExplorerRows = (rows, sortModel = []) => {
  const activeSorts = Array.isArray(sortModel)
    ? sortModel.filter((item) => item?.field && item?.sort)
    : [];

  if (!activeSorts.length) {
    return Array.isArray(rows) ? rows.slice() : [];
  }

  return (Array.isArray(rows) ? rows.slice() : []).sort((leftRow, rightRow) => {
    for (const sortItem of activeSorts) {
      const direction = sortItem.sort === "desc" ? -1 : 1;
      const getValue =
        SORT_VALUE_GETTERS[sortItem.field] ||
        ((row) => row?.[sortItem.field] ?? "");
      const comparison = compareValues(getValue(leftRow), getValue(rightRow));

      if (comparison !== 0) {
        return comparison * direction;
      }
    }

    return 0;
  });
};

export const fetchExplorerPage = async ({
  institutionId,
  branchId,
  displayStatusFilter = null,
  limit = 50,
  nextToken = null,
  client,
} = {}) => {
  const resolvedClient = client || generateClient();

  if (!institutionId && !branchId) {
    return { items: [], nextToken: null };
  }

  if (!displayStatusFilter) {
    return fetchLoanSummariesPage({
      institutionId,
      branchId,
      limit,
      nextToken,
      client: resolvedClient,
    });
  }

  const result = await resolvedClient.graphql({
    query: LOAN_SUMMARIES_BY_DISPLAY_STATUS_QUERY,
    variables: {
      displayStatus: displayStatusFilter,
      sortDirection: "DESC",
      filter: getScopeFilter({ institutionId, branchId }),
      limit,
      nextToken,
    },
  });

  const listResult =
    result?.data?.loanSummariesByDisplayStatusAndDisplayStatusComputedAt;

  return {
    items: Array.isArray(listResult?.items)
      ? listResult.items.filter(Boolean).filter(isLoanSummaryVisible)
      : [],
    nextToken: listResult?.nextToken || null,
  };
};