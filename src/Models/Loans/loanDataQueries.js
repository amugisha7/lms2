export const LOAN_STATEMENT_READY_FIELDS = `
  id
  loanNumber
  approvedDate
  principal
  fees
  interestRate
  startDate
  maturityDate
  stopDate
  extensionPeriod
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
    extendLoanAfterMaturity
    interestTypeMaturity
    calculateInterestOn
    loanInterestRateAfterMaturity
    recurringPeriodAfterMaturityUnit
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
      loanPenaltiesId
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
    }
  }
  events(limit: 100) {
    items {
      id
      eventAt
      eventType
      summary
      payload
    }
  }
`;

export const GET_LOAN_STATEMENT_READY_QUERY = `
  query GetLoanStatementReady($id: ID!) {
    getLoan(id: $id) {
      ${LOAN_STATEMENT_READY_FIELDS}
    }
  }
`;

export const LIST_LOANS_STATEMENT_READY_QUERY = `
  query ListLoansStatementReady(
    $filter: ModelLoanFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoans(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        ${LOAN_STATEMENT_READY_FIELDS}
      }
      nextToken
    }
  }
`;

export const BRANCH_LOANS_STATEMENT_READY_QUERY = `
  query BranchLoansStatementReady(
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
        ${LOAN_STATEMENT_READY_FIELDS}
      }
      nextToken
    }
  }
`;