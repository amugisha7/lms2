export const createPayment = /* GraphQL */ `
  mutation CreatePayment(
    $input: CreatePaymentInput!
    $condition: ModelPaymentConditionInput
  ) {
    createPayment(input: $input, condition: $condition) {
      id
      paymentDate
      amount
      status
      paymentStatusEnum
      loan {
        id
        loanNumber
      }
    }
  }
`;

export const updatePayment = /* GraphQL */ `
  mutation UpdatePayment(
    $input: UpdatePaymentInput!
    $condition: ModelPaymentConditionInput
  ) {
    updatePayment(input: $input, condition: $condition) {
      id
      status
      paymentStatusEnum
    }
  }
`;

export const getPayment = /* GraphQL */ `
  query GetPayment($id: ID!) {
    getPayment(id: $id) {
      id
      paymentDate
      amount
      description
      referenceNumber
      paymentMethod
      status
      paymentStatusEnum
      notes
      loan {
        id
        loanNumber
      }
      account {
        id
        name
      }
      events {
        items {
          id
          eventType
          summary
        }
      }
    }
  }
`;

export const createMoneyTransaction = /* GraphQL */ `
  mutation CreateMoneyTransaction(
    $input: CreateMoneyTransactionInput!
    $condition: ModelMoneyTransactionConditionInput
  ) {
    createMoneyTransaction(input: $input, condition: $condition) {
      id
    }
  }
`;

export const updateLoanInstallment = /* GraphQL */ `
  mutation UpdateLoanInstallment(
    $input: UpdateLoanInstallmentInput!
    $condition: ModelLoanInstallmentConditionInput
  ) {
    updateLoanInstallment(input: $input, condition: $condition) {
      id
      status
      totalPaid
    }
  }
`;
