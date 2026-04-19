export const LIST_LOAN_COMMENTS = /* GraphQL */ `
  query ListLoanCommentsByLoan($loanID: ID!, $limit: Int, $nextToken: String) {
    listLoanComments(
      filter: { loanID: { eq: $loanID } }
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        loanID
        commentAt
        body
        attachments
        createdByEmployeeID
        customLoanCommentDetails
        createdByEmployee {
          id
          firstName
          lastName
          email
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const CREATE_LOAN_COMMENT = /* GraphQL */ `
  mutation CreateLoanComment($input: CreateLoanCommentInput!) {
    createLoanComment(input: $input) {
      id
      loanID
      commentAt
      body
      attachments
      createdByEmployeeID
      customLoanCommentDetails
      createdByEmployee {
        id
        firstName
        lastName
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_LOAN_COMMENT = /* GraphQL */ `
  mutation DeleteLoanComment($input: DeleteLoanCommentInput!) {
    deleteLoanComment(input: $input) {
      id
    }
  }
`;