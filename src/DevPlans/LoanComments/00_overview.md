# Loan Comments — Implementation Plan Overview

## Goal

Implement a fully functional Loan Comments feature within the existing Loan module. Comments are tied to individual loans and allow employees to add timestamped notes with optional attachments (stored as JSON metadata, not file uploads).

## Schema (already exists — DO NOT modify)

```graphql
type LoanComment @model {
  id: ID!
  loanID: ID! @index(name: "byLoan", sortKeyFields: ["commentAt"])
  loan: Loan @belongsTo(fields: ["loanID"])
  commentAt: AWSDateTime!
  body: String!
  attachments: AWSJSON
  createdByEmployeeID: ID @index(name: "byCreatedByEmployeeID")
  createdByEmployee: Employee @belongsTo(fields: ["createdByEmployeeID"])
  customLoanCommentDetails: AWSJSON
}
```

The Loan model already has: `comments: [LoanComment] @hasMany(indexName: "byLoan", fields: ["id"])`

## GraphQL Operations (already auto-generated — DO NOT modify)

- `src/graphql/queries.js` — `getLoanComment`, `listLoanComments`
- `src/graphql/mutations.js` — `createLoanComment`, `updateLoanComment`, `deleteLoanComment`
- `src/graphql/subscriptions.js` — `onCreateLoanComment`, `onUpdateLoanComment`, `onDeleteLoanComment`

## Files to Create

All in `src/Models/Loans/LoanComments/`:

1. `loanCommentQueries.js` — Lean GraphQL query fragments for fetching comments by loan
2. `loanCommentHelpers.js` — Formatting helpers (date, employee name, sorting)
3. `LoanComments.jsx` — Main component: list + create + delete comments
4. `LoanCommentItem.jsx` — Single comment display (chat-bubble style)

## Files to Modify

1. `src/Models/Loans/LoanDetailPage.jsx` — Add a "Comments" tab (index 2)

## Prompt Execution Order

1. `01_queries_and_helpers.md` — Create query fragments and helper utilities
2. `02_comment_item_component.md` — Create the individual comment display component
3. `03_loan_comments_component.md` — Create the main LoanComments container
4. `04_integrate_loan_detail_page.md` — Wire Comments tab into LoanDetailPage

## Codebase Conventions

- Use `generateClient()` from `aws-amplify/api` (or `resilientClient` for reads)
- Use MUI components (`Box`, `Typography`, `TextField`, `Button`, `IconButton`, etc.)
- Use `useTheme()` for theme-aware styling
- Use `UserContext` from `../../App` for current user/employee info
- Use `useHasPermission` from `../../ModelAssets/Permissions/permissions` for permission checks
- Permission resource for comments: use the `"loan"` resource key (same as loan files)
- Dates: use `AWSDateTime` format (`new Date().toISOString()`)
- Follow the LoanFiles pattern: self-contained component that receives `loan` and `setNotification` props
