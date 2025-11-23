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
        moneyTransactions {
          items {
            amount
            transactionDate
            transactionType
            id
            description
          }
        }
        payments {
          items {
            amount
            paymentDate
            id
          }
        }
        penalties {
          items {
            amount
            penaltyDate
            id
          }
        }
        loans {
          items {
            loan {
              id
              principal
              createdAt
              borrower {
                businessName
                firstname
                othername
              }
            }
          }
        }
        loanFees {
          items {
            id
            amount
            loanFeesDescription
          }
        }
        expenses {
          items {
            amount
            id
            description
            type
          }
        }
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
