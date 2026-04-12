## Phase 2: Server-Side Freshness via Lambda Triggers

Give this entire document to an LLM along with workspace access. This is Phase 2 of 5. Phase 1 must be complete before starting this phase.

---

### Context: What Phase 1 Built

Phase 1 created:
- `LoanExplorerContext.jsx` — React Context above the router that caches explorer state across navigation.
- `loanExplorerQueries.js` — data-fetching layer with `fetchExplorerPage` using `byDisplayStatusUpdatedAt` GSI for status filtering and `byInstitutionUpdatedAt`/`byBranchUpdatedAt` for unfiltered views.
- `useLoanExplorer.js` — hook that reads from context, handles cache freshness (60s TTL), triggers foreground or background loads.
- Refactored `LoansDisplay.jsx` to use the hook. Hybrid sort strategy: paginated by default, full-fetch when sorting.
- After mutations, `syncAndRefreshLoan(loanId)` syncs the summary then refreshes the affected row.
- Page-level stale refresh: after fetching a page, `refreshStaleLoanSummaries` runs on that page (cap 20 rows for paginated, 50 for full-set).

**What Phase 2 replaces:** The client-side `refreshStaleLoanSummaries` call. After Phase 2, summaries are kept fresh by backend triggers, and the explorer is a pure read-only query with no write-back during browsing.

---

### Pre-existing infrastructure

- Amplify CLI is configured in this project (`amplify/` directory).
- The only existing Lambda is `S3Trigger3f2463e0`.
- The schema is at `amplify/backend/api/lms2/schema.graphql`.
- The projection logic is in `src/Models/Loans/loanSummaryProjection.js` — functions like `buildLoanSummaryRecord`, `attachDerivedLoanData`, `resolveDisplayStatusMeta`, `computeNextStatusTransitionAt`, `computeTotalPaid`, `computeMaturityDate`, `computeScheduleMetrics`, `isLoanSummaryCandidate`, `normalizeMoneyValue`, `LOAN_DISPLAY_STATUS`.
- Statement ledger builder is in `src/Models/Loans/LoanStatements/statementHelpers.js` — `buildStatementLedger` is imported by the projection.
- The summary CRUD helpers are in `src/Models/Loans/loanSummaryHelpers.js` — `syncLoanSummaryFromLoan`, `syncLoanSummaryByLoanId`, `fetchLoanSummarySourceById`, `GET_LOAN_SUMMARY_SOURCE_QUERY`, `LOAN_SUMMARY_FIELDS`, etc.

---

### Phase 2 Objective

Create two Lambda functions:

**A. `loanSummaryStreamHandler`** — A DynamoDB Streams trigger that fires when Loan, Payment, or Penalty records are created, modified, or deleted. It recomputes the affected loan's `LoanSummary` and upserts it.

**B. `loanSummaryScheduledRefresh`** — A CloudWatch EventBridge scheduled function (runs every 15 minutes) that queries for stale `LoanSummary` records (where `nextStatusTransitionAt <= now`) and refreshes them.

After deploying these, remove the client-side `refreshStaleLoanSummaries` call from the explorer.

---

### Step 1: Create `loanSummaryStreamHandler` Lambda

Use Amplify CLI to add a new Lambda: `amplify add function` → `loanSummaryStreamHandler`. Or create the function directory manually following the Amplify convention:

Create directory: `amplify/backend/function/loanSummaryStreamHandler/`

**`amplify/backend/function/loanSummaryStreamHandler/src/index.js`:**

This Lambda receives DynamoDB Stream events. Each event record has:
- `eventName`: `INSERT`, `MODIFY`, or `REMOVE`
- `dynamodb.NewImage` / `dynamodb.OldImage`: the DynamoDB item (in DynamoDB JSON format with type descriptors like `{ S: "value" }`)

Implementation:

1. For each record in `event.Records`:
   - Determine the source table from `record.eventSourceARN` (extract table name).
   - If the table is the **Loan** table:
     - Extract the loan ID from `record.dynamodb.Keys.id.S`.
     - On INSERT/MODIFY: fetch the full loan source via AppSync/DynamoDB (use the same query shape as `GET_LOAN_SUMMARY_SOURCE_QUERY`), compute the summary using the ported projection logic, and upsert the `LoanSummary`.
     - On REMOVE: delete the corresponding `LoanSummary` record.
   - If the table is the **Payment** table:
     - Extract the loan ID from `record.dynamodb.NewImage.loanPaymentsId.S` (or `OldImage` on REMOVE). Note: check the actual field name used on the Payment model to link back to the Loan — it may be `loanPaymentsId` or a similarly named foreign key field. Read the schema to confirm.
     - Fetch the full loan source by that loan ID, recompute and upsert the `LoanSummary`.
   - If the table is the **Penalty** table:
     - Same pattern — extract the loan ID from the penalty record's foreign key, recompute the summary.

2. **Porting the projection logic:** The Lambda runs in Node.js. The projection functions in `loanSummaryProjection.js` and `loanSummaryHelpers.js` are pure JavaScript with no browser dependencies. Copy the needed functions into a `projection.js` file within the Lambda's `src/` directory:
   - `buildLoanSummaryRecord`
   - `attachDerivedLoanData`
   - `resolveDisplayStatusMeta`
   - `computeNextStatusTransitionAt`
   - `computeMaturityDate`
   - `computeScheduleMetrics`
   - `computeTotalPaid`
   - `isLoanSummaryCandidate`
   - `normalizeMoneyValue`
   - `roundMoney`
   - `LOAN_DISPLAY_STATUS`
   - `buildStatementLedger` (from statementHelpers — or the relevant parts)
   - All helper functions they depend on (`startOfDay`, `toDateOnly`, `toIsoStartOfDay`, `normalizeSearchText`, `getInstallmentDueAmount`, `getSortedSchedule`, `getTotalPaid`, `getBalance`, `getPrincipalBalance`, `getLastPaymentDate`, `formatBorrowerName`, `formatEmployeeName`)

   Alternatively, if Amplify supports it, reference the shared source files. But for reliability, copy the functions into the Lambda package.

3. **AppSync calls from Lambda:** Use the `@aws-sdk/client-appsync` or make direct HTTPS calls to the AppSync endpoint with IAM auth. The Lambda needs:
   - The AppSync endpoint URL (from environment variable)
   - The AppSync API key or IAM role permissions to call AppSync
   - Queries: the source-fetch query (same shape as `GET_LOAN_SUMMARY_SOURCE_QUERY`), and the create/update/delete mutations for `LoanSummary`.

4. **Error handling:** Log errors but do not throw — a failed summary sync for one record should not block processing of other records in the batch.

5. **Idempotency:** The upsert pattern (check if LoanSummary exists, then update or create) handles duplicate stream events safely.

**`amplify/backend/function/loanSummaryStreamHandler/src/package.json`:**
```json
{
  "name": "loan-summary-stream-handler",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "node-fetch": "^2.7.0"
  }
}
```

(Use `node-fetch` v2 for CommonJS compatibility, or use the built-in `https` module for AppSync calls.)

### Step 2: Create `loanSummaryScheduledRefresh` Lambda

Create directory: `amplify/backend/function/loanSummaryScheduledRefresh/`

**`amplify/backend/function/loanSummaryScheduledRefresh/src/index.js`:**

This Lambda runs on a schedule (every 15 minutes via EventBridge).

Implementation:

1. Query the `byRefreshScope` GSI:
   - `refreshScope = "LOAN_SUMMARY"`
   - `nextStatusTransitionAt` <= current ISO timestamp
   - `sortDirection: ASC` (oldest first)
   - `limit: 200` (process at most 200 per invocation to stay within Lambda timeout)
   - Paginate if the first page returns a `nextToken` (but cap total at 200).

2. For each stale summary:
   - Fetch the full loan source by `summary.loanID`.
   - Recompute the summary using the projection logic.
   - Upsert the `LoanSummary`.
   - If the loan no longer qualifies (e.g., status changed to DRAFT), delete the `LoanSummary`.

3. Use the same ported projection functions as the stream handler. Share the `projection.js` file (copy it into this Lambda's `src/` too, or use a Lambda layer).

4. Log a summary: `Refreshed X of Y stale summaries`.

**Schedule rule:** Set up a CloudWatch EventBridge rule:
- `rate(15 minutes)`
- Target: this Lambda function

This can be configured in the Amplify `custom-resource` or via the function's CloudFormation template.

### Step 3: Configure DynamoDB Streams

Enable DynamoDB Streams on the Loan, Payment, and Penalty tables:
- Stream view type: `NEW_AND_OLD_IMAGES`
- Event source mapping: `loanSummaryStreamHandler` Lambda

This can be done via the Amplify custom CloudFormation resources or by modifying the function's CloudFormation template to add the event source mappings.

The table names follow Amplify's convention: `Loan-{apiId}-{env}`, `Payment-{apiId}-{env}`, `Penalty-{apiId}-{env}`. Use `!Ref` to reference them dynamically in CloudFormation.

### Step 4: Lambda IAM permissions

Both Lambdas need:
- `dynamodb:GetItem`, `dynamodb:PutItem`, `dynamodb:UpdateItem`, `dynamodb:DeleteItem`, `dynamodb:Query` on the LoanSummary table.
- `dynamodb:GetItem`, `dynamodb:Query` on the Loan, Payment, Penalty, Borrower, Branch, Employee, LoanProduct, Institution tables (for fetching the full loan source).
- `dynamodb:DescribeStream`, `dynamodb:GetRecords`, `dynamodb:GetShardIterator`, `dynamodb:ListStreams` on the Loan, Payment, Penalty tables (for the stream handler).
- `appsync:GraphQL` on the API (if using AppSync for queries instead of direct DynamoDB access).

### Step 5: Remove client-side stale refresh from explorer

In `LoanExplorerContext.jsx` (or wherever the page-level stale refresh lives):
- Remove the `refreshStaleLoanSummaries` call after fetching a page.
- Remove the import of `refreshStaleLoanSummaries`.
- The explorer is now pure read-only — it queries `LoanSummary` and trusts the backend to keep it fresh.

Keep `syncAndRefreshLoan(loanId)` — this is for immediate feedback after user-initiated mutations (like recording a payment). The stream handler will also fire, but the client-side sync gives instant UI feedback.

### Step 6: Test the pipeline

After deployment:
1. Create a payment on a loan via the UI.
2. Check CloudWatch logs for the stream handler — it should log that it processed the payment event and updated the LoanSummary.
3. Navigate to the Loan Explorer — the affected row should show the updated `totalPaidAmount` without any client-side refresh logic.
4. Find a loan whose `nextStatusTransitionAt` is in the past (e.g., maturity date has passed). Wait for the scheduled refresh to run. Verify the `displayStatus` changed to `OVERDUE`.
5. Verify the scheduled refresh Lambda logs show how many summaries it processed.

---

### What NOT to change in Phase 2

- Do NOT change the `LoanSummary` schema (no new fields).
- Do NOT change the LoansDisplay UI layout.
- Do NOT change the LoanDetailPage.
- Do NOT modify the projection logic in `loanSummaryProjection.js` — copy it into the Lambda packages. The client-side version remains as-is for `syncAndRefreshLoan`.

### Files to create

1. `amplify/backend/function/loanSummaryStreamHandler/src/index.js`
2. `amplify/backend/function/loanSummaryStreamHandler/src/projection.js`
3. `amplify/backend/function/loanSummaryStreamHandler/src/package.json`
4. `amplify/backend/function/loanSummaryScheduledRefresh/src/index.js`
5. `amplify/backend/function/loanSummaryScheduledRefresh/src/projection.js`
6. `amplify/backend/function/loanSummaryScheduledRefresh/src/package.json`
7. CloudFormation templates / custom resources for stream triggers and EventBridge rule.

### Files to modify

1. `src/Models/Loans/LoansDisplay/LoanExplorerContext.jsx` — remove `refreshStaleLoanSummaries` call.

### Verification

1. Creating a payment updates the LoanSummary within seconds (stream trigger).
2. Reversing a payment updates the LoanSummary within seconds.
3. Changing a loan's status (e.g., Close, Write Off) updates the LoanSummary.
4. A loan whose maturity passes overnight is updated to OVERDUE by the scheduled refresh within 15 minutes.
5. The Loan Explorer no longer makes any write/update API calls during browsing — it's pure read-only.
6. `syncAndRefreshLoan` still works for instant UI feedback after user mutations.
7. CloudWatch logs confirm both Lambdas are executing correctly.
8. `amplify push` succeeds without errors.
