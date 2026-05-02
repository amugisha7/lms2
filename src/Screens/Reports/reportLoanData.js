import { generateClient } from "aws-amplify/api";
import {
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

const mapLoanToVisibleSummary = (loan, options = {}) => {
  const summary = buildLoanSummaryRecord(loan, options);
  return summary && isLoanSummaryVisible(summary) ? summary : null;
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