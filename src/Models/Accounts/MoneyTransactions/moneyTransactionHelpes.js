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

export const UPDATE_MONEY_TRANSACTION_MUTATION = `
  mutation UpdateMoneyTransaction($input: UpdateMoneyTransactionInput!) {
    updateMoneyTransaction(input: $input) {
      id
      transactionType
      amount
      description
      transactionDate
      status
      accountMoneyTransactionsId
      referenceNumber
      notes
    }
  }
`;
