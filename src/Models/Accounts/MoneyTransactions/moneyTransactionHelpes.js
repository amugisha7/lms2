export const GET_MONEY_TRANSACTION_WITH_DOCUMENTS = `
  query GetMoneyTransaction($id: ID!) {
    getMoneyTransaction(id: $id) {
      id
      transactionType
      transactionDate
      amount
      description
      referenceNumber
      status
      
      documents {
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

export const CREATE_DOCUMENT_MUTATION = `
  mutation CreateDocument($input: CreateDocumentInput!) {
    createDocument(input: $input) {
      id
      documentType
      documentName
      documentDescription
      serialNumber
      documentDate
      s3Key
      fileName
      contentType
      status
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_MONEY_TRANSACTION_DOCUMENT_MUTATION = `
  mutation CreateMoneyTransactionDocument($input: CreateMoneyTransactionDocumentInput!) {
    createMoneyTransactionDocument(input: $input) {
      id
      moneyTransactionId
      documentId
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_DOCUMENT_MUTATION = `
  mutation DeleteDocument($input: DeleteDocumentInput!) {
    deleteDocument(input: $input) {
      id
    }
  }
`;

export const DELETE_MONEY_TRANSACTION_DOCUMENT_MUTATION = `
  mutation DeleteMoneyTransactionDocument($input: DeleteMoneyTransactionDocumentInput!) {
    deleteMoneyTransactionDocument(input: $input) {
      id
    }
  }
`;

export const LIST_MONEY_TRANSACTION_DOCUMENTS_QUERY = `
  query ListMoneyTransactionDocuments(
    $filter: ModelMoneyTransactionDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMoneyTransactionDocuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        moneyTransactionId
        documentId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
