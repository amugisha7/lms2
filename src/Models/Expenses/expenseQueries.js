const EXPENSE_RESULT_FIELDS = `
  id
  transactionDate
  amount
  description
  referenceNumber
  status
  notes
  payee
  paymentMethod
  type
  category
  branchID
  createdByEmployeeID
  accountExpensesId
  account {
    id
    name
    accountType
    currency
  }
  createdByEmployee {
    id
    firstName
    lastName
    email
  }
  createdAt
  updatedAt
`;

export const CREATE_EXPENSE_MUTATION = `
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      ${EXPENSE_RESULT_FIELDS}
    }
  }
`;

export const UPDATE_EXPENSE_MUTATION = `
  mutation UpdateExpense($input: UpdateExpenseInput!) {
    updateExpense(input: $input) {
      ${EXPENSE_RESULT_FIELDS}
    }
  }
`;

export const DELETE_EXPENSE_MUTATION = `
  mutation DeleteExpense($input: DeleteExpenseInput!) {
    deleteExpense(input: $input) {
      id
    }
  }
`;
