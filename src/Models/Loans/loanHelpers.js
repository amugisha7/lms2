import { generateClient } from "aws-amplify/api";

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
          interestCalculationMethod
          repaymentOrder
        }
        penalties(limit: 1000) {
          items {
            id
            amount
            penaltyName
            penaltyDate
            penaltyStatus
            notes
            penaltyType
            penaltyDescription
            status
          }
        }
        payments(limit: 1000) {
          items {
            id
            amount
            status
            paymentStatusEnum
            paymentMethod
            referenceNumber
            amountAllocatedToPrincipal
            amountAllocatedToInterest
            amountAllocatedToFees
            amountAllocatedToPenalty
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
      branchID
      createdByEmployeeID
      borrowerID
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
      loanProduct {
        id
        name
        description
        interestCalculationMethod
        repaymentOrder
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
      createdByEmployeeID
      createdByEmployee {
        id
        firstName
        lastName
        email
      }
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

export const getLoanById = async (id) => {
  const client = generateClient();
  const result = await client.graphql({
    query: getLoan,
    variables: { id },
  });

  return result?.data?.getLoan || null;
};

export const updateLoanOfficer = async (loanId, employeeId) => {
  const client = generateClient();
  const result = await client.graphql({
    query: updateLoan,
    variables: {
      input: {
        id: loanId,
        createdByEmployeeID: employeeId,
      },
    },
  });
  return result?.data?.updateLoan || null;
};
