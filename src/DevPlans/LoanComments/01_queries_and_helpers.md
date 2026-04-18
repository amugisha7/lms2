# Prompt 1: Create Loan Comment Queries and Helpers

## Context

You are working in a React + AWS Amplify (Gen 1) loan management app. The GraphQL schema has a `LoanComment` model indexed by `loanID` + `commentAt`. Auto-generated queries exist in `src/graphql/queries.js` and mutations in `src/graphql/mutations.js`, but they fetch too many nested fields. We need lean custom queries and helper utilities.

## File: `src/Models/Loans/LoanComments/loanCommentQueries.js`

Create this file with the following:

### 1. `LIST_LOAN_COMMENTS` query

A custom GraphQL query that fetches comments for a specific loan. Use the `listLoanComments` resolver with a filter on `loanID`. Return only the fields we need for display:

- `id`, `loanID`, `commentAt`, `body`, `attachments`, `createdByEmployeeID`, `createdAt`, `updatedAt`
- Nested `createdByEmployee`: only `id`, `firstName`, `lastName`, `email`
- Support `$limit` (default 500) and `$nextToken` for pagination

```js
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
```

### 2. `CREATE_LOAN_COMMENT` mutation

A lean mutation that returns only the fields we need after creation:

```js
export const CREATE_LOAN_COMMENT = /* GraphQL */ `
  mutation CreateLoanComment($input: CreateLoanCommentInput!) {
    createLoanComment(input: $input) {
      id
      loanID
      commentAt
      body
      attachments
      createdByEmployeeID
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
```

### 3. `DELETE_LOAN_COMMENT` mutation

```js
export const DELETE_LOAN_COMMENT = /* GraphQL */ `
  mutation DeleteLoanComment($input: DeleteLoanCommentInput!) {
    deleteLoanComment(input: $input) {
      id
    }
  }
`;
```

---

## File: `src/Models/Loans/LoanComments/loanCommentHelpers.js`

Create this file with the following utility functions:

### 1. `formatCommentDate(dateString)`

Formats an AWSDateTime string to a user-friendly format like `"18 Apr 2026, 2:35 PM"`. Handle null/invalid dates by returning `""`.

```js
export const formatCommentDate = (dateString) => {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateString;
  }
};
```

### 2. `formatEmployeeName(employee)`

Returns `"FirstName LastName"` from the employee object. Falls back to `employee.email` then `"Unknown"`.

```js
export const formatEmployeeName = (employee) => {
  if (!employee) return "Unknown";
  const name = [employee.firstName, employee.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  return name || employee.email || "Unknown";
};
```

### 3. `sortCommentsByDate(comments, order = "desc")`

Sorts an array of comments by `commentAt`. Default descending (newest first).

```js
export const sortCommentsByDate = (comments, order = "desc") => {
  if (!Array.isArray(comments)) return [];
  return [...comments].sort((a, b) => {
    const dateA = new Date(a.commentAt || a.createdAt).getTime();
    const dateB = new Date(b.commentAt || b.createdAt).getTime();
    return order === "asc" ? dateA - dateB : dateB - dateA;
  });
};
```

## Verification

After creating both files, confirm:

- No import errors
- The GraphQL query strings are tagged with `/* GraphQL */`
- Helper functions are all named exports
