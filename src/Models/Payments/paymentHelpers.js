// --- Payment Mutations ---

export const createPayment = /* GraphQL */ `
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      id
      paymentDate
      amount
      description
      notes
      status
      paymentStatusEnum
      accountID
      account {
        id
        name
      }
      receivingEmployeeID
      receivingEmployee {
        id
        firstName
        lastName
      }
      createdAt
    }
  }
`;

export const updatePayment = /* GraphQL */ `
  mutation UpdatePayment($input: UpdatePaymentInput!) {
    updatePayment(input: $input) {
      id
      paymentDate
      amount
      description
      notes
      status
      paymentStatusEnum
      accountID
      account {
        id
        name
      }
    }
  }
`;

// --- Payment Queries ---

export const listPaymentsByLoan = /* GraphQL */ `
  query ListPaymentsByLoan($loanID: ID!, $limit: Int, $nextToken: String) {
    listPayments(
      filter: { loanID: { eq: $loanID } }
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        paymentDate
        amount
        description
        notes
        status
        paymentStatusEnum
        account {
          id
          name
        }
        receivingEmployee {
          id
          firstName
          lastName
        }
        createdAt
      }
      nextToken
    }
  }
`;

// --- Account Query (branch-scoped) ---

export const LIST_ACCOUNT_BRANCHES_QUERY = /* GraphQL */ `
  query ListAccountBranches($branchId: ID!, $nextToken: String) {
    listAccountBranches(
      filter: { branchId: { eq: $branchId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
        account {
          id
          name
          accountType
          currency
          status
        }
      }
      nextToken
    }
  }
`;

// --- MoneyTransaction Mutation ---

export const createMoneyTransaction = /* GraphQL */ `
  mutation CreateMoneyTransaction($input: CreateMoneyTransactionInput!) {
    createMoneyTransaction(input: $input) {
      id
    }
  }
`;
