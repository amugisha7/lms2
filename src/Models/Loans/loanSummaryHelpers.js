import { generateClient } from "aws-amplify/api";
import {
  buildLoanSummaryRecord,
  isLoanSummaryVisible,
} from "./loanSummaryProjection";
import { LIST_LOANS_STATEMENT_READY_QUERY } from "./loanDataQueries";

export const LOAN_SUMMARY_FIELDS = `
  id
  loanID
  refreshScope
  institutionID
  branchID
  borrowerID
  borrowerDisplayName
  borrowerDisplayNameNormalized
  borrowerPhone
  loanNumber
  loanOfficerID
  loanOfficerDisplayName
  loanProductID
  loanProductName
  principalAmount
  totalPaidAmount
  amountDueAmount
  loanBalanceAmount
  arrearsAmount
  missedInstallmentCount
  nextDueDate
  lastPaymentDate
  startDate
  maturityDateEffective
  lifecycleStatus
  displayStatus
  displayStatusRank
  displayStatusComputedAt
  nextStatusTransitionAt
  currencyCode
  updatedAt
`;

export const GET_LOAN_SUMMARY_SOURCE_QUERY = `
  query GetLoanSummarySource($id: ID!) {
    getLoan(id: $id) {
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
        institution {
          id
          currencyCode
        }
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
    }
  }
`;

export const GET_LOAN_SUMMARY_QUERY = `
  query GetLoanSummary($id: ID!) {
    getLoanSummary(id: $id) {
      ${LOAN_SUMMARY_FIELDS}
    }
  }
`;

export const LOAN_SUMMARIES_BY_INSTITUTION_QUERY = `
  query LoanSummariesByInstitutionIDAndDisplayStatusComputedAt(
    $institutionID: ID!
    $displayStatusComputedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelLoanSummaryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanSummariesByInstitutionIDAndDisplayStatusComputedAt(
      institutionID: $institutionID
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

export const LOAN_SUMMARIES_BY_BRANCH_QUERY = `
  query LoanSummariesByBranchIDAndDisplayStatusComputedAt(
    $branchID: ID!
    $displayStatusComputedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelLoanSummaryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanSummariesByBranchIDAndDisplayStatusComputedAt(
      branchID: $branchID
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

export const CREATE_LOAN_SUMMARY_MUTATION = `
  mutation CreateLoanSummary(
    $input: CreateLoanSummaryInput!
    $condition: ModelLoanSummaryConditionInput
  ) {
    createLoanSummary(input: $input, condition: $condition) {
      ${LOAN_SUMMARY_FIELDS}
    }
  }
`;

export const UPDATE_LOAN_SUMMARY_MUTATION = `
  mutation UpdateLoanSummary(
    $input: UpdateLoanSummaryInput!
    $condition: ModelLoanSummaryConditionInput
  ) {
    updateLoanSummary(input: $input, condition: $condition) {
      ${LOAN_SUMMARY_FIELDS}
    }
  }
`;

export const DELETE_LOAN_SUMMARY_MUTATION = `
  mutation DeleteLoanSummary(
    $input: DeleteLoanSummaryInput!
    $condition: ModelLoanSummaryConditionInput
  ) {
    deleteLoanSummary(input: $input, condition: $condition) {
      id
      loanID
    }
  }
`;

export const LOAN_SUMMARIES_BY_REFRESH_SCOPE_QUERY = `
  query LoanSummariesByRefreshScopeAndNextStatusTransitionAt(
    $refreshScope: String!
    $nextStatusTransitionAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $limit: Int
    $nextToken: String
  ) {
    loanSummariesByRefreshScopeAndNextStatusTransitionAt(
      refreshScope: $refreshScope
      nextStatusTransitionAt: $nextStatusTransitionAt
      sortDirection: $sortDirection
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanID
        displayStatus
        nextStatusTransitionAt
      }
      nextToken
    }
  }
`;

const logSyncWarning = (action, error) => {
  console.warn(`[LoanSummary] ${action} skipped:`, error);
};

export const LOAN_SUMMARY_SYNCED_EVENT = "loan-summary-synced";

const dispatchLoanSummarySynced = (summary) => {
  if (typeof window === "undefined" || !summary?.id) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(LOAN_SUMMARY_SYNCED_EVENT, {
      detail: {
        loanId: summary.loanID || summary.id,
        summary,
      },
    }),
  );
};

export const fetchLoanSummarySourceById = async ({ loanId, client }) => {
  const resolvedClient = client || generateClient();
  const result = await resolvedClient.graphql({
    query: GET_LOAN_SUMMARY_SOURCE_QUERY,
    variables: { id: loanId },
  });

  return result?.data?.getLoan || null;
};

export const fetchLoanSummaryById = async ({ id, client }) => {
  const resolvedClient = client || generateClient();
  const result = await resolvedClient.graphql({
    query: GET_LOAN_SUMMARY_QUERY,
    variables: { id },
  });

  const summary = result?.data?.getLoanSummary || null;
  return isLoanSummaryVisible(summary) ? summary : null;
};

export const fetchLoanSummariesPage = async ({
  institutionId,
  branchId,
  limit = 500,
  nextToken = null,
  filter,
  client,
} = {}) => {
  const resolvedClient = client || generateClient();

  if (!institutionId && !branchId) {
    return { items: [], nextToken: null };
  }

  const query = institutionId
    ? LOAN_SUMMARIES_BY_INSTITUTION_QUERY
    : LOAN_SUMMARIES_BY_BRANCH_QUERY;
  const variables = institutionId
    ? {
        institutionID: institutionId,
        sortDirection: "DESC",
        filter,
        limit,
        nextToken,
      }
    : {
        branchID: branchId,
        sortDirection: "DESC",
        filter,
        limit,
        nextToken,
      };

  const result = await resolvedClient.graphql({
    query,
    variables,
  });

  const listResult = institutionId
    ? result?.data?.loanSummariesByInstitutionIDAndDisplayStatusComputedAt
    : result?.data?.loanSummariesByBranchIDAndDisplayStatusComputedAt;

  return {
    items: Array.isArray(listResult?.items)
      ? listResult.items.filter(Boolean).filter(isLoanSummaryVisible)
      : [],
    nextToken: listResult?.nextToken || null,
  };
};

export const fetchAllLoanSummariesForScope = async ({
  institutionId,
  branchId,
  filter,
  pageSize = 500,
  client,
} = {}) => {
  const resolvedClient = client || generateClient();
  const items = [];
  let nextToken = null;

  do {
    const page = await fetchLoanSummariesPage({
      institutionId,
      branchId,
      filter,
      limit: pageSize,
      nextToken,
      client: resolvedClient,
    });

    items.push(...page.items);
    nextToken = page.nextToken;
  } while (nextToken);

  return Array.from(new Map(items.map((item) => [item.id, item])).values());
};

export const fetchAllLoanSummariesForBranches = async ({
  branchIds = [],
  filter,
  pageSize = 500,
  client,
} = {}) => {
  const resolvedClient = client || generateClient();
  const collected = [];

  for (const branchId of branchIds.filter(Boolean)) {
    const branchItems = await fetchAllLoanSummariesForScope({
      branchId,
      filter,
      pageSize,
      client: resolvedClient,
    });
    collected.push(...branchItems);
  }

  return Array.from(new Map(collected.map((item) => [item.id, item])).values());
};

export const isLoanSummaryStale = (
  summary,
  referenceDate = new Date().toISOString(),
) => {
  if (!summary?.nextStatusTransitionAt) return false;

  const transitionAt = new Date(summary.nextStatusTransitionAt).getTime();
  const referenceTime = new Date(referenceDate).getTime();

  return (
    Number.isFinite(transitionAt) &&
    Number.isFinite(referenceTime) &&
    transitionAt <= referenceTime
  );
};

const deleteLoanSummaryIfPresent = async ({ client, id }) => {
  try {
    const existingSummary = await fetchLoanSummaryById({ id, client });
    if (!existingSummary?.id) return null;

    const result = await client.graphql({
      query: DELETE_LOAN_SUMMARY_MUTATION,
      variables: { input: { id } },
    });

    return result?.data?.deleteLoanSummary || null;
  } catch (error) {
    logSyncWarning(`delete for loan ${id}`, error);
    return null;
  }
};

export const syncLoanSummaryFromLoan = async (loan, options = {}) => {
  if (!loan?.id) return null;

  const client = options.client || generateClient();

  try {
    const summaryInput = buildLoanSummaryRecord(loan, options);
    if (!summaryInput) {
      await deleteLoanSummaryIfPresent({ client, id: loan.id });
      return null;
    }

    const existingSummary = await fetchLoanSummaryById({ id: loan.id, client }).catch(
      () => null,
    );

    if (existingSummary?.id) {
      const result = await client.graphql({
        query: UPDATE_LOAN_SUMMARY_MUTATION,
        variables: {
          input: {
            ...summaryInput,
            id: existingSummary.id,
          },
        },
      });

      const updatedSummary = result?.data?.updateLoanSummary || null;
      dispatchLoanSummarySynced(updatedSummary);
      return updatedSummary;
    }

    const result = await client.graphql({
      query: CREATE_LOAN_SUMMARY_MUTATION,
      variables: {
        input: {
          ...summaryInput,
          id: loan.id,
        },
      },
    });

    const createdSummary = result?.data?.createLoanSummary || null;
    dispatchLoanSummarySynced(createdSummary);
    return createdSummary;
  } catch (error) {
    logSyncWarning(`sync for loan ${loan.id}`, error);
    return null;
  }
};

export const syncLoanSummaryByLoanId = async (loanId, options = {}) => {
  if (!loanId) return null;

  const client = options.client || generateClient();

  try {
    const loan = options.loan || (await fetchLoanSummarySourceById({ loanId, client }));
    if (!loan?.id) return null;
    return await syncLoanSummaryFromLoan(loan, { ...options, client });
  } catch (error) {
    logSyncWarning(`source fetch for loan ${loanId}`, error);
    return null;
  }
};

export const refreshStaleLoanSummaries = async (
  summaries,
  { client, limit = 100, referenceDate = new Date().toISOString() } = {},
) => {
  const resolvedClient = client || generateClient();
  const staleSummaries = (summaries || [])
    .filter(Boolean)
    .filter((summary) => isLoanSummaryStale(summary, referenceDate))
    .slice(0, limit);

  const refreshed = [];
  for (const summary of staleSummaries) {
    const updated = await syncLoanSummaryByLoanId(summary.loanID, {
      client: resolvedClient,
    });
    if (updated?.id) {
      refreshed.push(updated);
    }
  }

  return refreshed;
};

export const backfillLoanSummariesForScope = async ({
  branchIds = [],
  client,
  pageSize = 100,
  branchInstitutionById = {},
  defaultInstitutionId = null,
  defaultCurrencyCode = null,
  onProgress,
} = {}) => {
  const resolvedClient = client || generateClient();
  let processedLoans = 0;
  let syncedSummaries = 0;

  for (const branchId of branchIds.filter(Boolean)) {
    let nextToken = null;

    do {
      const result = await resolvedClient.graphql({
        query: LIST_LOANS_STATEMENT_READY_QUERY,
        variables: {
          limit: pageSize,
          nextToken,
          filter: { branchID: { eq: branchId } },
        },
      });

      const listResult = result?.data?.listLoans || {};
      const loans = Array.isArray(listResult?.items)
        ? listResult.items.filter(Boolean)
        : [];

      for (const loan of loans) {
        processedLoans += 1;
        const synced = await syncLoanSummaryFromLoan(loan, {
          client: resolvedClient,
          defaultInstitutionId:
            branchInstitutionById[branchId] || defaultInstitutionId || null,
          defaultCurrencyCode,
        });
        if (synced?.id) {
          syncedSummaries += 1;
        }
      }

      onProgress?.({
        branchId,
        processedLoans,
        syncedSummaries,
      });

      nextToken = listResult?.nextToken || null;
    } while (nextToken);
  }

  return {
    processedLoans,
    syncedSummaries,
  };
};

export const listDueLoanSummaryRefreshCandidates = async ({
  limit = 100,
  nextToken = null,
  before = new Date().toISOString(),
  client,
} = {}) => {
  const resolvedClient = client || generateClient();
  const result = await resolvedClient.graphql({
    query: LOAN_SUMMARIES_BY_REFRESH_SCOPE_QUERY,
    variables: {
      refreshScope: "LOAN_SUMMARY",
      nextStatusTransitionAt: { le: before },
      sortDirection: "ASC",
      limit,
      nextToken,
    },
  });

  return {
    items:
      result?.data?.loanSummariesByRefreshScopeAndNextStatusTransitionAt?.items ||
      [],
    nextToken:
      result?.data?.loanSummariesByRefreshScopeAndNextStatusTransitionAt
        ?.nextToken || null,
  };
};

export const refreshDueLoanSummaries = async ({
  limit = 100,
  before = new Date().toISOString(),
  client,
} = {}) => {
  const resolvedClient = client || generateClient();
  let nextToken = null;
  const refreshed = [];

  do {
    const batch = await listDueLoanSummaryRefreshCandidates({
      limit,
      before,
      nextToken,
      client: resolvedClient,
    });

    for (const summary of batch.items.filter(Boolean)) {
      const result = await syncLoanSummaryByLoanId(summary.loanID, {
        client: resolvedClient,
      });
      if (result?.id) {
        refreshed.push(result.id);
      }
    }

    nextToken = batch.nextToken;
  } while (nextToken);

  return refreshed;
};