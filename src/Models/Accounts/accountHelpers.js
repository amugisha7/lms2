export const LIST_ACCOUNTS_QUERY = `
  query ListAccounts($institutionId: ID!, $nextToken: String) {
    listAccounts(
      filter: { institutionAccountsId: { eq: $institutionId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
        id
        name
        openingBalance
        status
        currency
        accountType
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const CREATE_ACCOUNT_MUTATION = `
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      id
      name
      openingBalance
      status
      currency
      accountType
      description
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_ACCOUNT_MUTATION = `
  mutation DeleteAccount($input: DeleteAccountInput!) {
    deleteAccount(input: $input) {
      id
    }
  }
`;

export const UPDATE_ACCOUNT_MUTATION = `
  mutation UpdateAccount($input: UpdateAccountInput!) {
    updateAccount(input: $input) {
      id
      name
      openingBalance
      status
      currency
      accountType
      description
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_MONEY_TRANSACTION_MUTATION = `
  mutation CreateMoneyTransaction($input: CreateMoneyTransactionInput!) {
    createMoneyTransaction(input: $input) {
      id
      transactionType
      amount
      description
      transactionDate
      status
      accountMoneyTransactionsId
    }
  }
`;
