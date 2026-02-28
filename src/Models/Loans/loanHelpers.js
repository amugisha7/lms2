export const listLoans = /* GraphQL */ `
  query ListLoans(
    $filter: ModelLoanFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLoans(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        loanNumber
        branchID
        principal
        interestRate
        startDate
        maturityDate
        duration
        durationInterval
        status
        borrower {
          id
          firstname
          othername
          businessName
        }
        loanProduct {
          id
          name
        }
        installments(limit: 1000) {
          items {
            totalDue
            totalPaid
          }
        }
        payments(limit: 1000) {
          items {
            amount
            status
            paymentStatusEnum
          }
        }
        balanceSnapshots(limit: 1, sortDirection: DESC) {
          items {
            totalOutstanding
          }
        }
      }
      nextToken
    }
  }
`;

export const getLoan = /* GraphQL */ `
  query GetLoan($id: ID!) {
    getLoan(id: $id) {
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
      borrower {
        id
        firstname
        othername
        businessName
        phoneNumber
        email
      }
      branch {
        id
        name
      }
      installments(limit: 1000) {
        items {
          id
          dueDate
          principalDue
          interestDue
          feesDue
          penaltyDue
          totalDue
          principalPaid
          interestPaid
          feesPaid
          penaltyPaid
          totalPaid
          status
        }
      }
      payments(limit: 1000) {
        items {
          id
          paymentDate
          amount
          paymentMethod
          referenceNumber
          status
          paymentStatusEnum
        }
      }
      disbursements(limit: 100) {
        items {
          id
          disbursedAt
          amount
          status
          method
          reference
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
      balanceSnapshots(limit: 1, sortDirection: DESC) {
        items {
          id
          asOfAt
          principalOutstanding
          interestOutstanding
          feesOutstanding
          penaltyOutstanding
          totalOutstanding
          daysPastDue
        }
      }
      loanProduct {
        id
        name
        description
      }
    }
  }
`;

export const createLoan = /* GraphQL */ `
  mutation CreateLoan(
    $input: CreateLoanInput!
    $condition: ModelLoanConditionInput
  ) {
    createLoan(input: $input, condition: $condition) {
      id
      loanNumber
      status
    }
  }
`;

export const updateLoan = /* GraphQL */ `
  mutation UpdateLoan(
    $input: UpdateLoanInput!
    $condition: ModelLoanConditionInput
  ) {
    updateLoan(input: $input, condition: $condition) {
      id
      status
    }
  }
`;

export const createLoanInstallment = /* GraphQL */ `
  mutation CreateLoanInstallment(
    $input: CreateLoanInstallmentInput!
    $condition: ModelLoanInstallmentConditionInput
  ) {
    createLoanInstallment(input: $input, condition: $condition) {
      id
    }
  }
`;

export const createLoanDisbursement = /* GraphQL */ `
  mutation CreateLoanDisbursement(
    $input: CreateLoanDisbursementInput!
    $condition: ModelLoanDisbursementConditionInput
  ) {
    createLoanDisbursement(input: $input, condition: $condition) {
      id
    }
  }
`;

export const createLoanEvent = /* GraphQL */ `
  mutation CreateLoanEvent(
    $input: CreateLoanEventInput!
    $condition: ModelLoanEventConditionInput
  ) {
    createLoanEvent(input: $input, condition: $condition) {
      id
    }
  }
`;

export const createLoanBalanceSnapshot = /* GraphQL */ `
  mutation CreateLoanBalanceSnapshot(
    $input: CreateLoanBalanceSnapshotInput!
    $condition: ModelLoanBalanceSnapshotConditionInput
  ) {
    createLoanBalanceSnapshot(input: $input, condition: $condition) {
      id
    }
  }
`;
