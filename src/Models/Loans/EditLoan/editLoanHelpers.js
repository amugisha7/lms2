import { generateClient } from "aws-amplify/api";

export const updateLoan = async (input) => {
  const client = generateClient();
  const result = await client.graphql({
    query: `
      mutation UpdateLoan($input: UpdateLoanInput!) {
        updateLoan(input: $input) {
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
  return result?.data?.updateLoan;
};

export const getLoanById = async (id) => {
    const client = generateClient();
    const result = await client.graphql({
        query: `
            query GetLoan($id: ID!) {
                getLoan(id: $id) {
                    id
                    borrowerLoansId
                    loanProductLoansId
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
                    institutionLoansId
                    createdByEmployeeLoansId
                    borrower {
                        id
                        firstname
                        othername
                        businessName
                        uniqueIdNumber
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
        variables: { id }
    });
    return result?.data?.getLoan;
}

export const buildLoanUpdateInput = (values, userDetails, id) => ({
  id: id,
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
  institutionLoansId: userDetails?.institutionUsersId || null,
});

export const LIST_BORROWERS_QUERY = `
  query ListBorrowers($institutionId: ID!, $nextToken: String) {
    listBorrowers(
      filter: { institutionBorrowersId: { eq: $institutionId } }
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

export const LIST_LOAN_PRODUCTS_QUERY = `
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

export const fetchBorrowersAndProducts = async (institutionId) => {
  const client = generateClient();
  const borrowers = [];
  const loanProducts = [];

  try {
    // Fetch Borrowers
    let nextToken = null;
    while (true) {
      const result = await client.graphql({
        query: LIST_BORROWERS_QUERY,
        variables: {
          institutionId,
          nextToken,
        },
      });

      const listResult = result?.data?.listBorrowers || {};
      const batchItems = Array.isArray(listResult.items)
        ? listResult.items
        : [];
      borrowers.push(...batchItems);

      const newNextToken = listResult.nextToken || null;
      if (!newNextToken) {
        break;
      }
      nextToken = newNextToken;
    }

    // Fetch Loan Products
    nextToken = null;
    while (true) {
      const result = await client.graphql({
        query: LIST_LOAN_PRODUCTS_QUERY,
        variables: {
          institutionId,
          nextToken,
        },
      });

      const listResult = result?.data?.listLoanProducts || {};
      const batchItems = Array.isArray(listResult.items)
        ? listResult.items
        : [];
      loanProducts.push(...batchItems);

      const newNextToken = listResult.nextToken || null;
      if (!newNextToken) {
        break;
      }
      nextToken = newNextToken;
    }
  } catch (err) {
    console.error("Error fetching borrowers or loan products:", err);
    throw err;
  }

  return { borrowers, loanProducts };
};