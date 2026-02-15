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
        moneyTransactions(limit: 1000) {
          items {
            amount
            transactionDate
            transactionType
            id
            description
            referenceNumber
            notes
            documents(limit: 100) {
              items {
                id
                document {
                  id
                  documentName
                  documentDescription
                  s3Key
                  fileName
                  contentType
                  status
                  createdAt
                }
              }
            }
          }
        }
        payments(limit: 1000) {
          items {
            amount
            paymentDate
            id
          }
        }
        penalties(limit: 1000) {
          items {
            amount
            penaltyDate
            id
          }
        }
        loans(limit: 1000) {
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
        loanFees(limit: 1000) {
          items {
            id
            amount
            loanFeesDescription
          }
        }
        expenses(limit: 1000) {
          items {
            amount
            id
            description
            type
          }
        }
        branches(limit: 100) {
          items {
            id
            branchId
            accountId
            branch {
              id
              name
            }
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
      branches(limit: 100) {
        items {
          id
          branchId
          accountId
          branch {
            id
            name
          }
        }
      }
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
      branches(limit: 100) {
        items {
          id
          branchId
          accountId
          branch {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_ACCOUNT_WITH_TRANSACTIONS_QUERY = `
  query GetAccount($id: ID!) {
    getAccount(id: $id) {
      id
      name
      openingBalance
      status
      currency
      accountType
      description
      createdAt
      updatedAt
      moneyTransactions(limit: 1000) {
        items {
          id
          amount
          transactionDate
          transactionType
          description
          referenceNumber
          notes
          documents(limit: 100) {
            items {
              id
              document {
                id
                documentName
                documentDescription
                s3Key
                fileName
                contentType
                status
                createdAt
              }
            }
          }
        }
      }
      payments(limit: 1000) {
        items {
          amount
          paymentDate
          id
        }
      }
      penalties(limit: 1000) {
        items {
          amount
          penaltyDate
          id
        }
      }
      loans(limit: 1000) {
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
      loanFees(limit: 1000) {
        items {
          id
          amount
          loanFeesDescription
        }
      }
      expenses(limit: 1000) {
        items {
          amount
          id
          description
          type
        }
      }
      branches(limit: 100) {
        items {
          id
          branchId
          accountId
          branch {
            id
            name
          }
        }
      }
    }
  }
`;

export const CREATE_ACCOUNT_BRANCH_MUTATION = `
  mutation CreateAccountBranch($input: CreateAccountBranchInput!) {
    createAccountBranch(input: $input) {
      id
      accountId
      branchId
    }
  }
`;

export const DELETE_ACCOUNT_BRANCH_MUTATION = `
  mutation DeleteAccountBranch($input: DeleteAccountBranchInput!) {
    deleteAccountBranch(input: $input) {
      id
    }
  }
`;

export const LIST_ACCOUNT_BRANCHES_QUERY = `
  query ListAccountBranches($accountId: ID!) {
    listAccountBranches(filter: { accountId: { eq: $accountId } }, limit: 100) {
      items {
        id
        accountId
        branchId
      }
    }
  }
`;

export const LIST_ACCOUNTS_BY_BRANCH_QUERY = `
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
          openingBalance
          status
          currency
          accountType
          description
          createdAt
          updatedAt
          moneyTransactions(limit: 1000) {
            items {
              amount
              transactionDate
              transactionType
              id
              description
              referenceNumber
              notes
              documents(limit: 100) {
                items {
                  id
                  document {
                    id
                    documentName
                    documentDescription
                    s3Key
                    fileName
                    contentType
                    status
                    createdAt
                  }
                }
              }
            }
          }
          payments(limit: 1000) {
            items {
              amount
              paymentDate
              id
            }
          }
          penalties(limit: 1000) {
            items {
              amount
              penaltyDate
              id
            }
          }
          loans(limit: 1000) {
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
          loanFees(limit: 1000) {
            items {
              id
              amount
              loanFeesDescription
            }
          }
          expenses(limit: 1000) {
            items {
              amount
              id
              description
              type
            }
          }
          branches(limit: 100) {
            items {
              id
              branchId
              accountId
              branch {
                id
                name
              }
            }
          }
        }
      }
      nextToken
    }
  }
`;
