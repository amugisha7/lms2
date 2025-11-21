import { generateClient } from "aws-amplify/api";

const LIST_BORROWERS_QUERY = `
  query ListBorrowers($branchId: ID!, $nextToken: String) {
    listBorrowers(
      filter: { branchBorrowersId: { eq: $branchId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
        id
        firstname
        othername
        businessName
        uniqueIdNumber
      }
      nextToken
    }
  }
`;

const LIST_LOAN_PRODUCTS_QUERY = `
  query ListLoanProducts($institutionId: ID!, $nextToken: String) {
    listLoanProducts(
      filter: { institutionLoanProductsId: { eq: $institutionId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
        id
        name
      }
      nextToken
    }
  }
`;

export const fetchBorrowers = async (branchId) => {
  const client = generateClient();
  let allBorrowersList = [];
  let nextToken = null;

  try {
    while (true) {
      console.log("API Call: LIST_BORROWERS_QUERY", {
        branchId,
        nextToken,
      });
      const result = await client.graphql({
        query: LIST_BORROWERS_QUERY,
        variables: {
          branchId,
          nextToken,
        },
      });

      const listResult = result?.data?.listBorrowers || {};
      const batchItems = Array.isArray(listResult.items)
        ? listResult.items
        : [];
      allBorrowersList.push(...batchItems);

      const newNextToken = listResult.nextToken || null;
      if (!newNextToken) {
        break;
      }
      nextToken = newNextToken;
    }
    return allBorrowersList;
  } catch (err) {
    console.error("Error fetching borrowers:", err);
    throw err;
  }
};

export const fetchLoanProducts = async (institutionId) => {
  const client = generateClient();
  let allLoanProductsList = [];
  let nextToken = null;

  try {
    console.log("Fetching loan products...");
    while (true) {
      console.log("API Call: LIST_LOAN_PRODUCTS_QUERY", {
        institutionId,
        nextToken,
      });
      const result = await client.graphql({
        query: `
          query ListLoanProducts($institutionId: ID!, $nextToken: String) {
            listLoanProducts(
              filter: { institutionLoanProductsId: { eq: $institutionId } }
              limit: 100
              nextToken: $nextToken
            ) {
              nextToken
              items {
                id
                name
                calculateInterestOn
                durationPeriod
                extendLoanAfterMaturity
                interestCalculationMethod
                interestPeriod
                interestRateDefault
                interestRateMax
                interestRateMin
                interestType
                interestTypeMaturity
                loanInterestRateAfterMaturity
                principalAmountDefault
                principalAmountMax
                principalAmountMin
                recurringPeriodAfterMaturityUnit
                repaymentFrequency
                repaymentOrder
                termDurationDefault
                termDurationMax
                termDurationMin
              }
            }
          }
        `,
        variables: {
          institutionId,
          nextToken,
        },
      });

      const listResult = result?.data?.listLoanProducts || {};
      const batchItems = Array.isArray(listResult.items)
        ? listResult.items
        : [];
      allLoanProductsList.push(...batchItems);

      const newNextToken = listResult.nextToken || null;
      if (!newNextToken) {
        break;
      }
      nextToken = newNextToken;
    }
    return allLoanProductsList;
  } catch (err) {
    console.error("Error fetching loan products:", err);
    throw err;
  }
};

export const createLoan = async (input) => {
  const client = generateClient();
  const result = await client.graphql({
    query: `
      mutation CreateLoan($input: CreateLoanInput!) {
        createLoan(input: $input) {
          id
          principalAmount
          interestRate
          termDuration
          durationPeriod
          disbursementDate
          maturityDate
          status
          repaymentFrequency
          repaymentOrder
          totalAmountDue
          totalAmountPaid
          outstandingBalance
          nextPaymentDate
          lastPaymentDate
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
          createdByEmployee {
            id
            firstName
            lastName
          }
        }
      }
    `,
    variables: { input },
  });
  return result?.data?.createLoan;
};

export const associateLoanWithFees = async (loanId, loanFeesId) => {
  const client = generateClient();
  await client.graphql({
    query: `
      mutation CreateLoanLoanFees($input: CreateLoanLoanFeesInput!) {
        createLoanLoanFees(input: $input) {
          id
        }
      }
    `,
    variables: {
      input: {
        loanId,
        loanFeesId,
      },
    },
  });
};

export const associateLoanWithPenalty = async (loanId, penaltyId) => {
  const client = generateClient();
  await client.graphql({
    query: `
      mutation CreateLoanPenalty($input: CreateLoanPenaltyInput!) {
        createLoanPenalty(input: $input) {
          id
        }
      }
    `,
    variables: {
      input: {
        loanId,
        penaltyId,
      },
    },
  });
};

export const buildLoanInput = (values, userDetails) => ({
  borrowerLoansId: values.borrower,
  loanProductLoansId: values.loanProduct,
  principalAmount: values.principalAmount ? Number(values.principalAmount) : null,
  interestRate: values.interestRate ? Number(values.interestRate) : null,
  termDuration: values.termDuration ? Number(values.termDuration) : null,
  durationPeriod: values.durationPeriod || null,
  disbursementDate: values.disbursementDate || null,
  maturityDate: values.maturityDate || null,
  status: values.status || "Pending",
  repaymentFrequency: values.repaymentFrequency || null,
  repaymentOrder: values.repaymentOrder ? JSON.stringify(values.repaymentOrder) : null,
  totalAmountDue: values.totalAmountDue ? Number(values.totalAmountDue) : null,
  totalAmountPaid: 0,
  outstandingBalance: values.principalAmount ? Number(values.principalAmount) : null,
  institutionLoansId: userDetails?.institutionUsersId || null,
  createdByEmployeeLoansId: userDetails?.id || null,
});