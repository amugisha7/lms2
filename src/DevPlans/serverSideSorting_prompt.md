## Executable Prompt: Loan Explorer + Loan Workspace

Give this entire document to an LLM along with workspace access.

---

### Context: What Already Exists

This is an AWS Amplify v2 / AppSync / DynamoDB React app. The following are already built and working:

**Schema** (`amplify/backend/api/lms2/schema.graphql`):

- `Loan` model with all fields, relationships to Borrower, Payment, Penalty, Branch, Employee, LoanProduct.
- `LoanSummary` model (line ~600) with all needed fields and these GSIs:
  - `byRefreshScope` (partition: `refreshScope`, sort: `nextStatusTransitionAt`)
  - `byInstitutionUpdatedAt` (partition: `institutionID`, sort: `displayStatusComputedAt`)
  - `byBranchUpdatedAt` (partition: `branchID`, sort: `displayStatusComputedAt`)
  - `byBorrowerUpdatedAt` (partition: `borrowerID`, sort: `displayStatusComputedAt`)
  - `byLoanSummaryNumber` (partition: `loanNumber`)
  - `byLoanOfficerUpdatedAt` (partition: `loanOfficerID`, sort: `displayStatusComputedAt`)
  - `byDisplayStatusUpdatedAt` (partition: `displayStatus`, sort: `displayStatusComputedAt`)
- `displayStatus` is an enum `LoanDisplayStatus` with values: `CURRENT`, `CURRENT_WITH_MISSED_PAYMENT`, `OVERDUE`, `CLOSED`, `WRITTEN_OFF`, `VOIDED`.

**Projection logic** (`src/Models/Loans/loanSummaryProjection.js`):

- `buildLoanSummaryRecord(loan, options)` — takes a full Loan (with payments, penalties, borrower, branch, employee, loanProduct nested) and produces a flat `LoanSummary` input object.
- `attachDerivedLoanData(loan, options)` — computes totalPaid, amountDue, loanBalance, arrears, missedInstallmentCount, nextDueDate, displayStatus, nextStatusTransitionAt from the loan's schedule and payments.
- `resolveDisplayStatusMeta(loan, metrics, referenceDate)` — derives display status: WRITTEN_OFF and VOIDED from raw status; CLOSED from raw status; OVERDUE if past maturity; CURRENT_WITH_MISSED_PAYMENT if missedInstallmentCount > 0; else CURRENT.
- `computeNextStatusTransitionAt(loan, metrics, referenceDate)` — returns the earliest future date when status might change (maturity date + 1 day, or next installment due date + 1 day).
- `LOAN_DISPLAY_STATUS` — frozen object with code, label, filterKey, rank per status.

**Summary helpers** (`src/Models/Loans/loanSummaryHelpers.js`):

- `LOAN_SUMMARY_FIELDS` — GraphQL field selection string for LoanSummary.
- `GET_LOAN_SUMMARY_SOURCE_QUERY` — fetches a full Loan with all nested relationships needed for projection.
- `LOAN_SUMMARIES_BY_INSTITUTION_QUERY`, `LOAN_SUMMARIES_BY_BRANCH_QUERY` — paginated queries using the institution/branch GSIs.
- `LOAN_SUMMARIES_BY_REFRESH_SCOPE_QUERY` — queries `byRefreshScope` GSI to find summaries by `nextStatusTransitionAt`.
- `CREATE_LOAN_SUMMARY_MUTATION`, `UPDATE_LOAN_SUMMARY_MUTATION`, `DELETE_LOAN_SUMMARY_MUTATION`.
- `fetchLoanSummarySourceById({ loanId, client })` — fetches the full source Loan for re-projection.
- `fetchLoanSummaryById({ id, client })` — fetches a single LoanSummary.
- `fetchLoanSummariesPage({ institutionId, branchId, limit, nextToken, filter, client })` — single page query returning `{ items, nextToken }`.
- `fetchAllLoanSummariesForScope({ institutionId, branchId, filter, pageSize, client })` — loops all pages into one array (THIS IS THE EXPENSIVE PATTERN TO REPLACE).
- `fetchAllLoanSummariesForBranches({ branchIds, pageSize, client })` — same but across multiple branches for admin users.
- `syncLoanSummaryFromLoan(loan, options)` — builds summary from full loan, creates or updates the LoanSummary record.
- `syncLoanSummaryByLoanId(loanId, options)` — fetches source loan then calls syncLoanSummaryFromLoan.
- `refreshStaleLoanSummaries(summaries, { client, limit, referenceDate })` — filters summaries where `nextStatusTransitionAt <= now`, re-syncs each one sequentially (THIS IS THE CLIENT-SIDE REFRESH TO REPLACE WITH SERVER-SIDE IN PHASE 2).
- `backfillLoanSummariesForScope({ branchIds, client, pageSize, onProgress })` — loops all Loans for given branches, syncs each summary.
- `isLoanSummaryStale(summary, referenceDate)` — returns true if `nextStatusTransitionAt <= referenceDate`.

**Current UI** (`src/Models/Loans/LoansDisplay/LoansDisplay.jsx`):

- Currently loads ALL summaries via `fetchAllLoanSummariesForScope` / `fetchAllLoanSummariesForBranches` into state.
- Runs `refreshStaleLoanSummaries` client-side on every load (up to 100 stale rows).
- Filters by status, branch, and text search entirely on the client.
- Maps summaries to explorer rows via `mapLoanSummaryToExplorerRow`.
- Has KPI cards, status tab chips with counts, MUI DataGrid, clickable text for payments/statements.
- Row actions: `LoanInfoPopup` (hover card), `ManagePaymentsPopup` (opens after fetching full loan source), `LoanStatementPopup` (same).
- Uses `theme.palette.sf` for all colors (a custom design-system theme).

**Current Loan Detail** (`src/Models/Loans/LoanDetailPage.jsx`):

- Route: `/loans/id/:loanId/view`
- Fetches full loan via `getLoanById(loanId)`, parses `loanComputationRecord` JSON.
- Two tabs: Details (shows EditLoan in read-only mode), Files.
- Action links: Edit (opens slider), View Statement (popup), Manage Payments (popup).

**Routing** (`src/Routes.jsx`):

- `/loans` → `LoansDisplay`
- `/loans/id/:loanId/view` → `LoanDetailPage`
- `/loans/id/:loanId/statement` → statement route

**Lambda functions** (`amplify/backend/function/`):

- Only `S3Trigger3f2463e0` exists. No DynamoDB stream triggers yet.

**Shared components used**:

- `CustomDataGrid` — wrapper around MUI DataGrid.
- `WorkingOverlay` — loading overlay.
- `CustomSlider` — slide-in panel.
- `ManagePaymentsPopup` — payment CRUD popup (takes `loan` prop — the full source Loan).
- `LoanStatementPopup` — statement generator popup (takes `loan` prop).
- `NotificationContext`, `SnackbarContext` — notification systems.
- `UserContext` (from `App.jsx`) — provides `userDetails` with `institution`, `branch`, `userType`, `currencyCode`.

---

### Task: Refactor in 4 phases. Execute Phase 1 now. Leave Phases 2-4 for later prompts.

---

### Phase 1: Refactor LoansDisplay to use paginated server-side queries and server-side status filtering

**Objective**: Stop loading all summaries into memory. Instead, query one page at a time from DynamoDB using the existing GSIs, and filter by status server-side. Keep the current UI layout (KPI cards, DataGrid, status tabs, search bar) but wire them to paginated data.

#### Step 1: Create `loanExplorerQueries.js`

Create a new file at `src/Models/Loans/LoansDisplay/loanExplorerQueries.js`.

This file provides the data-fetching layer for the explorer. It should export these functions:

```js
fetchExplorerPage({
  institutionId,        // string | null
  branchId,             // string | null
  displayStatusFilter,  // string | null — one of the LoanDisplayStatus enum values, or null for "all"
  limit,                // number — page size, default 50
  nextToken,            // string | null — cursor from previous page
  client,               // optional — Amplify GraphQL client
})
→ Promise<{ items: LoanSummary[], nextToken: string | null }>
```

Implementation details:

- When `displayStatusFilter` is provided (not null, not "all"), query the `byDisplayStatusUpdatedAt` GSI:
  - partition key: `displayStatus = displayStatusFilter`
  - Apply a DynamoDB `filter` for `institutionID` or `branchID` to scope by tenant.
  - Sort direction: DESC (most recently computed first).
- When `displayStatusFilter` is null or "all", use the existing `byInstitutionUpdatedAt` or `byBranchUpdatedAt` GSIs (same as current `fetchLoanSummariesPage`).
- Always pass `limit` and `nextToken` through.
- Return `{ items, nextToken }`.

Write the GraphQL query strings inline in this file. Use the existing `LOAN_SUMMARY_FIELDS` template from `loanSummaryHelpers.js` (import it).

Also export:

```js
fetchExplorerKpis({
  institutionId,
  branchId,
  client,
})
→ Promise<{ total, current, missedPayment, overdue, totalPrincipal, totalOutstanding }>
```

Implementation: For KPIs, compute them from whatever summaries are currently in the `loans` state. Do not make separate API calls for KPIs in Phase 1.

```js
// TODO: Phase 2 — replace with a dedicated KPI query or aggregate Lambda
```

Also export:

```js
fetchExplorerStatusCounts({
  institutionId,
  branchId,
  client,
})
→ Promise<Record<string, number>>
```

Implementation: For now, compute counts from the loaded data in state (same as current). Add comment:

```js
// TODO: Phase 2 — server-side counts if the dataset exceeds one page
```

#### Step 2: Create `useLoanExplorer.js` hook

Create `src/Models/Loans/LoansDisplay/useLoanExplorer.js`.

This hook manages the explorer state. It should:

1. Accept `{ userDetails }` and derive `institutionId`, `branchId`, `isAdmin` from it.
2. Maintain state:
   - `loans` — the current page of mapped explorer rows.
   - `loading` — boolean.
   - `nextToken` — cursor for the next page.
   - `prevTokens` — array of previous cursors (for back-pagination: store the token that produced each page).
   - `currentPage` — 0-indexed page number.
   - `statusFilter` — the active display status filter string (null = all).
   - `searchTerm` — local text search applied client-side on the loaded page.
   - `selectedBranchFilter` — array of branch IDs (admin only).
   - `pageSize` — default 50.
   - `workingOverlayOpen` — boolean for the overlay.
   - `workingOverlayMessage` — string for the overlay message.
3. Expose `loadPage({ direction })` where direction is "next", "prev", or "first".
   - On "first": call `fetchExplorerPage` with `nextToken: null`. Reset `prevTokens` and `currentPage`.
   - On "next": call `fetchExplorerPage` with `nextToken: currentNextToken`. Push the current token onto `prevTokens`. Increment `currentPage`.
   - On "prev": pop the last token from `prevTokens`, call `fetchExplorerPage` with that token. Decrement `currentPage`.
4. Expose `setStatusFilter(status)` — when the user clicks a status tab, update `statusFilter` and call `loadPage({ direction: "first" })`.
5. Expose `setSearchTerm(term)` — updates local search state. Filtering by search term happens client-side on the current page only.
6. When `statusFilter` changes, the query switches GSI as described in Step 1.
7. Run the initial load on mount via `useEffect`.
8. Run `refreshStaleLoanSummaries` on the loaded page only (not the whole portfolio). Limit to 20 stale rows max per page load.
9. Map results through `mapLoanSummaryToExplorerRow` (move or import that function).

Return: `{ loans, filteredLoans, loading, statusFilter, setStatusFilter, searchTerm, setSearchTerm, currentPage, hasNextPage, hasPrevPage, loadPage, kpis, tabCounts, selectedBranchFilter, setSelectedBranchFilter, branches, refreshPage, rebuildSummaries, workingOverlayOpen, workingOverlayMessage }`.

`kpis` and `tabCounts` should be computed from the current `loans` array via `useMemo` (same logic as current LoansDisplay). Add a comment:

```js
// KPIs and tab counts reflect the current view, not the full portfolio.
// TODO: Phase 2 will add aggregate queries.
```

`rebuildSummaries` wraps the existing `backfillLoanSummariesForScope` call then reloads page 1.

`refreshPage` reloads the current page (re-calls `fetchExplorerPage` with the current token).

For admin users, load branches the same way the current LoansDisplay does (query `listBranches` filtered by institution). When `selectedBranchFilter` is set and the user is admin, pass the first selected branchId (or the institutionId if no branch filter). The branch-filtering behavior should match the current behavior.

#### Step 3: Refactor `LoansDisplay.jsx`

Modify the existing `LoansDisplay.jsx` to use the `useLoanExplorer` hook instead of managing all that state directly.

Specific changes:

1. Remove all the state variables that are now in the hook: `loans`, `loading`, `searchTerm`, `statusFilter`, `branches`, `selectedBranchFilter`, `hasFetchedRef`, `workingOverlayOpen`, `workingOverlayMessage`.
2. Remove the `loadLoansPage` callback and the `useEffect` that calls it.
3. Remove `filteredLoans`, `kpis`, `tabCounts` useMemo hooks.
4. Replace with: `const explorer = useLoanExplorer({ userDetails });`
5. Wire all UI elements to `explorer.*` properties.
6. Keep the WorkingOverlay, but drive it from `explorer.workingOverlayOpen` and `explorer.workingOverlayMessage`.
7. Keep all the column definitions, KpiCard, CurrencyText, helper functions, and rendering logic exactly as-is.
8. The status tab `onClick` now calls `explorer.setStatusFilter(mappedValue)` where the mapping is:
   - `"all" → null`
   - `"current" → "CURRENT"`
   - `"missed_payment" → "CURRENT_WITH_MISSED_PAYMENT"`
   - `"overdue" → "OVERDUE"`
   - `"closed" → "CLOSED"`
   - `"written_off" → "WRITTEN_OFF"`
   - `"voided" → "VOIDED"`
9. Add pagination controls below the DataGrid: "Previous" and "Next" buttons, disabled based on `explorer.hasPrevPage` / `explorer.hasNextPage`. Show `Page {explorer.currentPage + 1}`. Style them using the `sf` theme tokens consistent with the existing button/chip styling (borderRadius: 0, sf colors).
10. The SYNC SUMMARIES button calls `explorer.rebuildSummaries()`.
11. The refresh button calls `explorer.refreshPage()`.
12. `openPaymentPopup` and `openStatementPopup` stay exactly as-is (they already fetch the full loan source on demand via `fetchLoanSummarySourceById`).
13. Keep the `LoanInfoPopup`, `ManagePaymentsPopup`, `LoanStatementPopup` integration unchanged.
14. After a payment is recorded via `ManagePaymentsPopup`, call `syncLoanSummaryByLoanId(loanId)` then `explorer.refreshPage()` to update the row. Same for statement actions that modify data.
15. Keep the `paymentPopupOpen`, `paymentLoanRow`, `statementPopupOpen`, `statementLoanRow` state variables in LoansDisplay (they are UI state, not data state).
16. Keep the drag-to-scroll behavior, top scrollbar sync, and all the DataGrid styling.

#### Step 4: Stale-refresh at page level

In the `useLoanExplorer` hook, after fetching a page of summaries, run `refreshStaleLoanSummaries` on just that page's items (up to 20 stale rows max per page load). Replace the refreshed items in the page data before setting state. This is a lightweight correctness backstop — not a full portfolio scan.

#### What NOT to change in Phase 1

- Do NOT change the `LoanSummary` schema.
- Do NOT add Lambda triggers or DynamoDB streams.
- Do NOT change the LoanDetailPage.
- Do NOT change ManagePaymentsPopup or LoanStatementPopup.
- Do NOT add new routes.
- Do NOT change the projection logic in `loanSummaryProjection.js`.
- Do NOT change `syncLoanSummaryFromLoan` or `backfillLoanSummariesForScope` logic.
- Do NOT rename the route or page title from "Loan Explorer".
- Do NOT remove any exports from `loanSummaryHelpers.js` that other files may depend on.

#### Constraints

- Use `generateClient` from `"aws-amplify/api"` for all GraphQL calls.
- All UI components use `theme.palette.sf` tokens for colors (not raw hex values).
- Use the existing `CustomDataGrid` component.
- Do not install new npm packages.
- Preserve all existing imports and exports that other files depend on.
- All files are `.js` or `.jsx` (not TypeScript).
- Use React hooks and functional components throughout.
- Use `React.useState`, `React.useEffect`, `React.useMemo`, `React.useCallback` (not destructured imports — match the existing code style).

#### Files to create

1. `src/Models/Loans/LoansDisplay/loanExplorerQueries.js`
2. `src/Models/Loans/LoansDisplay/useLoanExplorer.js`

#### Files to modify

1. `src/Models/Loans/LoansDisplay/LoansDisplay.jsx`

#### Verification

After Phase 1:

1. The `/loans` page loads and shows the first page of summaries (50 rows) without fetching the entire portfolio.
2. Clicking a status tab reloads from the server with that status filter — the DataGrid shows only loans of that status.
3. Clicking "Next" loads the next page. "Previous" returns to the prior page.
4. The search bar filters the currently-loaded page client-side.
5. KPI cards and tab counts reflect the currently-loaded data.
6. Opening payments popup, statement popup, and navigating to loan detail all still work.
7. SYNC SUMMARIES still triggers a full rebuild.
8. No regressions in the admin vs non-admin branch filtering behavior.
9. The app compiles without errors (`npm start` runs clean).

---

### Phase 2 (future prompt): Server-side freshness via Lambda

Add a DynamoDB Stream Lambda trigger on the Loan and Payment tables that calls the projection logic from `loanSummaryProjection.js` (ported to Node.js Lambda). The trigger should:

- On INSERT/MODIFY of a Loan record: fetch the full loan source, build the LoanSummary, and upsert it.
- On INSERT/MODIFY/DELETE of a Payment record: look up the parent Loan, rebuild its LoanSummary.
- Same for Penalty records.

Add a CloudWatch EventBridge scheduled Lambda (runs every 15 minutes) that:

- Queries the `byRefreshScope` GSI with `refreshScope = "LOAN_SUMMARY"` and `nextStatusTransitionAt <= now`.
- For each stale summary, fetches the source Loan and re-syncs the summary.
- Limits to 200 per invocation to stay within Lambda timeout.

After this phase, remove the client-side `refreshStaleLoanSummaries` call from `useLoanExplorer`. The explorer becomes a pure read-only paginated query with no write-back.

### Phase 3 (future prompt): Loan Workspace

Replace `LoanDetailPage` with a richer `LoanWorkspace` component. Structure:

- Summary header bar: borrower name, loan number, status pill, principal, amount due, loan balance, next due date, maturity date, loan officer.
- Quick action bar: Add Payment, View Statement, View Schedule, Edit Loan, Generate Documents.
- Tabs: Overview (read-only loan details + key metrics), Payments (full payment list + add/edit), Statement (generated statement view), Schedule (amortization table), Documents/Files, History (loan events timeline).
- Lazy-load tab content (only fetch payment list when Payments tab is selected, etc.).
- After payment/edit actions, optimistically update local state and background-sync the LoanSummary via `syncLoanSummaryByLoanId`.
- Route stays at `/loans/id/:loanId/view`.

### Phase 4 (future prompt): Advanced Explorer Features

- Add server-side aggregate KPI queries (or a Lambda that maintains running totals).
- Add saved/predefined filter views (Current, Overdue, My Loans, Recently Disbursed, High Outstanding).
- Add loan-number autocomplete search using `byLoanSummaryNumber` GSI.
- Add borrower-lookup search: autocomplete borrower by name/phone, then query `byBorrowerUpdatedAt` GSI.
- Add date-range and amount-range filter controls in a secondary filter panel.
- Add server-side sort support: new GSIs or composite sort keys for the most-used sort fields (principalAmount, startDate, etc.).
- Per-status page counts via parallel GSI queries with `limit: 0` scans or a count-maintenance Lambda.
