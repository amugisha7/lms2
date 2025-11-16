import { generateClient } from "aws-amplify/api";

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