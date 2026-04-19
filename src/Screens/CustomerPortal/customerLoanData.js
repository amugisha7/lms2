import { generateClient } from "aws-amplify/api";
import { LIST_LOANS_STATEMENT_READY_QUERY } from "../../Models/Loans/loanDataQueries";
import {
  attachDerivedLoanData,
  isLoanSummaryCandidate,
} from "../../Models/Loans/loanSummaryProjection";

const CUSTOMER_LOANS_PAGE_SIZE = 100;

const sortCustomerLoans = (loans) =>
  [...loans].sort((left, right) => {
    const rightDate = new Date(
      right?.startDate || right?.approvedDate || right?.createdAt || 0,
    ).getTime();
    const leftDate = new Date(
      left?.startDate || left?.approvedDate || left?.createdAt || 0,
    ).getTime();

    return rightDate - leftDate;
  });

const normalizeCustomerLoan = (loan, borrowerId) => {
  if (!loan?.id || !borrowerId || loan.borrowerID !== borrowerId) {
    return null;
  }

  const derivedLoan = attachDerivedLoanData(loan);
  return isLoanSummaryCandidate(derivedLoan) ? derivedLoan : null;
};

export async function fetchCustomerLoans({ borrowerId, client } = {}) {
  if (!borrowerId) {
    return [];
  }

  const graphqlClient = client || generateClient();
  const loansById = new Map();
  let nextToken = null;

  do {
    const response = await graphqlClient.graphql({
      query: LIST_LOANS_STATEMENT_READY_QUERY,
      variables: {
        filter: {
          borrowerID: { eq: borrowerId },
        },
        limit: CUSTOMER_LOANS_PAGE_SIZE,
        nextToken,
      },
    });

    const connection = response?.data?.listLoans;
    const items = Array.isArray(connection?.items) ? connection.items : [];

    items.forEach((loan) => {
      const normalizedLoan = normalizeCustomerLoan(loan, borrowerId);
      if (normalizedLoan) {
        loansById.set(normalizedLoan.id, normalizedLoan);
      }
    });

    nextToken = connection?.nextToken || null;
  } while (nextToken);

  return sortCustomerLoans(Array.from(loansById.values()));
}

export async function fetchCustomerLoanById({ borrowerId, loanId, client } = {}) {
  if (!borrowerId || !loanId) {
    return null;
  }

  const graphqlClient = client || generateClient();
  const response = await graphqlClient.graphql({
    query: LIST_LOANS_STATEMENT_READY_QUERY,
    variables: {
      filter: {
        borrowerID: { eq: borrowerId },
        id: { eq: loanId },
      },
      limit: 1,
    },
  });

  const item = response?.data?.listLoans?.items?.find(Boolean) || null;
  return normalizeCustomerLoan(item, borrowerId);
}