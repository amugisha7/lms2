## Phase 1: Loan Explorer — Context Caching, Hybrid Sort, Paginated Queries

Give this entire document to an LLM along with workspace access. This is Phase 1 of 5.

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
- `Institution` model has `apiIntegrationSettings: AWSJSON` and `customInstitutionDetails: AWSJSON` fields.

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
- `fetchAllLoanSummariesForScope({ institutionId, branchId, filter, pageSize, client })` — loops all pages into one array.
- `fetchAllLoanSummariesForBranches({ branchIds, pageSize, client })` — same but across multiple branches for admin users.
- `syncLoanSummaryFromLoan(loan, options)` — builds summary from full loan, creates or updates the LoanSummary record.
- `syncLoanSummaryByLoanId(loanId, options)` — fetches source loan then calls syncLoanSummaryFromLoan.
- `refreshStaleLoanSummaries(summaries, { client, limit, referenceDate })` — filters summaries where `nextStatusTransitionAt <= now`, re-syncs each one sequentially.
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
- `STATUS_TABS` array with keys: `all`, `current`, `missed_payment`, `overdue`, `closed`, `written_off`, `voided`.
- `DISPLAY_STATUS_BY_CODE` map built from `LOAN_DISPLAY_STATUS`.
- `mapLoanSummaryToExplorerRow(summary)` maps a LoanSummary into a row with `uiStatusCode`, `uiStatusLabel`, `uiStatusFilterKey`.
- `BranchFilterWrapper` component for admin branch filtering using `MultipleDropDownSearchable`.

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

**Settings** (`src/Models/Settings/SettingsWrapper.jsx`):
- Tab-based settings page at `/settings`. Currently has 4 tabs: Settings, Account Info, Document Header, Customer Applications.

---

### Phase 1 Objective

Three architectural changes to the Loan Explorer:

**A. Context-based navigation caching** — Stop re-fetching loan summaries every time the user navigates back to `/loans`. Cache the explorer state in a React Context above the router so it survives route changes.

**B. Hybrid data strategy** — On initial load and when filtering by status, use paginated server-side queries (one page at a time). When the user activates sorting on any column, load the full summary set so sorting is globally accurate. LoanSummary records are flat (~1KB each), so loading the full set (up to ~2000) is cheap — the expensive pattern we're eliminating is loading nested payments/penalties per loan, NOT loading flat summary records.

**C. Server-side status filtering** — When a user clicks a status tab, query the `byDisplayStatusUpdatedAt` GSI directly instead of loading all summaries and filtering client-side.

---

### Step 1: Create `LoanExplorerContext.jsx`

Create `src/Models/Loans/LoansDisplay/LoanExplorerContext.jsx`.

This context lives above the router and caches explorer data across navigation.

**Context value shape:**

```js
{
  // Data
  loans: [],                    // current array of mapped explorer rows
  allSummaries: [],             // full summary set (loaded when sorting is active)
  allSummariesLoaded: false,    // whether allSummaries is populated
  branches: [],                 // branch list for admin filtering

  // Filter/pagination state
  statusFilter: null,           // active LoanDisplayStatus enum value, null = all
  searchTerm: "",
  selectedBranchFilter: [],     // branch IDs (admin only)
  currentPage: 0,
  nextToken: null,
  prevTokens: [],
  pageSize: 50,
  sortModel: [],                // MUI DataGrid sort model [{field, sort}]

  // Freshness
  lastFetchedAt: null,          // timestamp of last API fetch
  needsRefresh: false,          // set true after mutations

  // Loading
  loading: false,
  workingOverlayOpen: false,
  workingOverlayMessage: "Working...",

  // Actions (functions)
  loadPage: ({ direction }) => {},    // "first" | "next" | "prev"
  refreshPage: () => {},
  rebuildSummaries: () => {},
  setStatusFilter: (status) => {},
  setSearchTerm: (term) => {},
  setSelectedBranchFilter: (branchIds) => {},
  setSortModel: (model) => {},
  markNeedsRefresh: () => {},
  syncAndRefreshLoan: (loanId) => {},   // after mutation: sync summary then refresh
}
```

**Provider implementation details:**

1. Use `React.createContext` and a provider component `LoanExplorerProvider`.
2. All state lives in the provider via `React.useState` / `React.useRef`.
3. The provider does NOT auto-fetch on mount. The `useLoanExplorer` hook (consumed by LoansDisplay) triggers the initial load.
4. **Cache behavior:**
   - Store `lastFetchedAt` as a timestamp.
   - When the consumer (LoansDisplay) mounts, check: if `lastFetchedAt` is within 60 seconds and `needsRefresh` is false, skip the API call and use cached data.
   - If `needsRefresh` is true, show cached data immediately, then do a background refresh of the current page. When the new data arrives, merge it into state. Set `needsRefresh = false`.
   - If `lastFetchedAt` is older than 60 seconds, same: show cached data, background refresh.
   - If no cached data exists (first visit), do a normal foreground load with loading spinner.
5. **Sort model handling:**
   - When `sortModel` is empty (default), use paginated queries (one page at a time).
   - When `sortModel` has an entry (user clicked a column header to sort), load ALL summaries for the scope via `fetchAllLoanSummariesForScope` / `fetchAllLoanSummariesForBranches` (the existing functions), store in `allSummaries`, set `allSummariesLoaded = true`.
   - Once `allSummaries` is loaded, it is cached. Subsequent sort changes reuse the cached array (no API call). Only a filter change or refresh clears it.
   - When sorting is active, `loans` is derived from `allSummaries` by applying the sort, then slicing for the current page. Pagination is client-side over the sorted full set.
   - When the user clears sorting (clicks the column header to remove sort), switch back to server-paginated mode. Keep `allSummaries` cached in case they sort again.
6. **`syncAndRefreshLoan(loanId)`** — called after payment/edit. Calls `syncLoanSummaryByLoanId(loanId)`, then if `allSummariesLoaded`, fetch the single updated summary via `fetchLoanSummaryById` and replace it in `allSummaries`. Also replace it in `loans`. If not in full-set mode, call `refreshPage`.

Export `LoanExplorerContext` and `LoanExplorerProvider`.

### Step 2: Create `loanExplorerQueries.js`

Create `src/Models/Loans/LoansDisplay/loanExplorerQueries.js`.

This file provides the data-fetching layer.

**Export `fetchExplorerPage`:**

```js
fetchExplorerPage({
  institutionId,        // string | null
  branchId,             // string | null
  displayStatusFilter,  // string | null — LoanDisplayStatus enum value, or null for "all"
  limit,                // number — page size, default 50
  nextToken,            // string | null
  client,               // optional
})
→ Promise<{ items: LoanSummary[], nextToken: string | null }>
```

Implementation:
- When `displayStatusFilter` is provided (not null), write and use a GraphQL query for the `byDisplayStatusUpdatedAt` GSI:
  - Partition key: `displayStatus = displayStatusFilter`
  - Apply a DynamoDB `filter` for `institutionID` (eq) or `branchID` (eq) to scope by tenant.
  - Sort direction: DESC.
- When `displayStatusFilter` is null, use the existing `byInstitutionUpdatedAt` or `byBranchUpdatedAt` GSIs (same logic as current `fetchLoanSummariesPage`).
- Always pass `limit` and `nextToken`.
- Return `{ items, nextToken }`.
- Import `LOAN_SUMMARY_FIELDS` from `loanSummaryHelpers.js`.
- Write the `byDisplayStatusUpdatedAt` GraphQL query string inline in this file:

```js
const LOAN_SUMMARIES_BY_DISPLAY_STATUS_QUERY = `
  query LoanSummariesByDisplayStatusAndDisplayStatusComputedAt(
    $displayStatus: LoanDisplayStatus!
    $displayStatusComputedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelLoanSummaryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    loanSummariesByDisplayStatusAndDisplayStatusComputedAt(
      displayStatus: $displayStatus
      displayStatusComputedAt: $displayStatusComputedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        ${LOAN_SUMMARY_FIELDS}
      }
      nextToken
    }
  }
`;
```

When using this query with an institution scope, pass `filter: { institutionID: { eq: institutionId } }`. When using with a branch scope, pass `filter: { branchID: { eq: branchId } }`.

### Step 3: Create `useLoanExplorer.js` hook

Create `src/Models/Loans/LoansDisplay/useLoanExplorer.js`.

This is a thin adapter that reads from `LoanExplorerContext` and exposes a convenient API for LoansDisplay.

Implementation:

1. `const context = React.useContext(LoanExplorerContext);`
2. On mount (via `useEffect`), check the cache freshness and trigger load if needed:
   - If `context.loans.length === 0` and not loading → call `context.loadPage({ direction: "first" })` (foreground load).
   - If `context.loans.length > 0` and `context.lastFetchedAt` is within 60s and `!context.needsRefresh` → do nothing (use cache).
   - If `context.loans.length > 0` and (stale or needsRefresh) → show cached immediately, call `context.refreshPage()` in background.
3. Derive `filteredLoans` via `React.useMemo`:
   - Start from `context.loans`.
   - Apply `selectedBranchFilter` if admin and branches selected (same logic as current LoansDisplay).
   - Apply `searchTerm` filter (same client-side text search logic as current LoansDisplay).
4. Compute `kpis` via `React.useMemo` from `context.loans` (same logic as current):
   ```js
   // KPIs reflect the current loaded data. When sorting is active, this is the full portfolio.
   // When paginated, this is the current page only.
   // TODO: Phase 4 — add server-side aggregate KPI queries.
   ```
5. Compute `tabCounts` via `React.useMemo` from `context.loans` (same logic as current).
6. Derive `hasNextPage` = `!!context.nextToken`.
7. Derive `hasPrevPage` = `context.currentPage > 0`.
8. For admin users, trigger branch loading on mount (same pattern as current LoansDisplay — query `listBranches` filtered by institution). Store branches in context.
9. Return the full explorer API surface (all context values + derived values).

### Step 4: Wire `LoanExplorerProvider` into the app

Modify `src/Routes.jsx` (or `src/App.jsx` — whichever wraps the router):
- Import `LoanExplorerProvider` from `./Models/Loans/LoansDisplay/LoanExplorerContext`.
- Wrap it **inside** the existing `UserContext.Provider` but **outside** the `<Routes>` element, so it has access to `userDetails` and persists across route changes.
- The provider needs `userDetails` — pass it as a prop, or have the provider read `UserContext` internally.

### Step 5: Refactor `LoansDisplay.jsx`

Modify the existing `LoansDisplay.jsx`:

1. **Remove** all state variables now managed by the context/hook:
   - `loans`, `loading`, `searchTerm`, `statusFilter`, `branches`, `selectedBranchFilter`, `hasFetchedRef`, `workingOverlayOpen`, `workingOverlayMessage`
2. **Remove** the `loadLoansPage` callback and the `useEffect` that calls it.
3. **Remove** `filteredLoans`, `kpis`, `tabCounts` useMemo hooks.
4. **Add**: `const explorer = useLoanExplorer({ userDetails });`
5. Wire all UI elements to `explorer.*` properties.
6. Keep the `WorkingOverlay`, drive from `explorer.workingOverlayOpen` / `explorer.workingOverlayMessage`.
7. Keep ALL column definitions, `KpiCard`, `CurrencyText`, helper functions, rendering logic exactly as-is.
8. **Status tab mapping** — The `onClick` for each status tab calls `explorer.setStatusFilter(mappedValue)`:
   - `"all" → null`
   - `"current" → "CURRENT"`
   - `"missed_payment" → "CURRENT_WITH_MISSED_PAYMENT"`
   - `"overdue" → "OVERDUE"`
   - `"closed" → "CLOSED"`
   - `"written_off" → "WRITTEN_OFF"`
   - `"voided" → "VOIDED"`
9. **Pagination controls** — Add below the DataGrid:
   - "Previous" button (disabled when `!explorer.hasPrevPage`), calls `explorer.loadPage({ direction: "prev" })`.
   - "Page X" text showing `explorer.currentPage + 1`.
   - "Next" button (disabled when `!explorer.hasNextPage`), calls `explorer.loadPage({ direction: "next" })`.
   - Style with `sf` theme tokens, `borderRadius: 0`, consistent with existing buttons.
   - When sorting is active (full data loaded), pagination is client-side: "Next"/"Prev" navigate through the local sorted array. `hasNextPage` / `hasPrevPage` are derived from the local page index vs total items.
10. **Sorting** — Pass `sortModel={explorer.sortModel}` and `onSortModelChange={explorer.setSortModel}` to `CustomDataGrid`. When the user clicks a column header:
    - The `setSortModel` handler in the context detects the change.
    - If `allSummariesLoaded` is false, it triggers `fetchAllLoanSummariesForScope` / `fetchAllLoanSummariesForBranches` to load the full set.
    - Once loaded, sorting and pagination happen client-side over the full set.
    - Show a brief loading indicator while the full set loads (use `workingOverlayMessage: "Loading all loans for sorting..."`).
11. SYNC SUMMARIES button → `explorer.rebuildSummaries()`.
12. Refresh button → `explorer.refreshPage()`.
13. `openPaymentPopup` and `openStatementPopup` stay exactly as-is.
14. Keep `LoanInfoPopup`, `ManagePaymentsPopup`, `LoanStatementPopup` integration unchanged.
15. After a payment via `ManagePaymentsPopup`, call `explorer.syncAndRefreshLoan(loanId)`.
16. Keep `paymentPopupOpen`, `paymentLoanRow`, `statementPopupOpen`, `statementLoanRow` as local state in LoansDisplay.
17. Keep drag-to-scroll, top scrollbar sync, all DataGrid styling.
18. `mapLoanSummaryToExplorerRow` — move into `loanExplorerQueries.js` or keep in LoansDisplay. Either way, it must remain accessible. It currently lives in LoansDisplay as a module-level function.

### Step 6: Stale-refresh at page level

In the `LoanExplorerProvider`, after fetching a page of summaries (in paginated mode, not full-set mode), run `refreshStaleLoanSummaries` on just that page's items (cap at 20 stale rows). Replace refreshed items in the page data before setting state.

When loading the full set for sorting, run `refreshStaleLoanSummaries` with a cap of 50 stale rows. This slightly delays the sort-mode load but ensures accuracy.

---

### What NOT to change in Phase 1

- Do NOT change the `LoanSummary` schema.
- Do NOT add Lambda triggers or DynamoDB streams.
- Do NOT change the LoanDetailPage (that's Phase 3).
- Do NOT change ManagePaymentsPopup or LoanStatementPopup.
- Do NOT add new routes (except the provider wrapper in Routes.jsx or App.jsx).
- Do NOT change the projection logic in `loanSummaryProjection.js`.
- Do NOT change `syncLoanSummaryFromLoan` or `backfillLoanSummariesForScope` logic.
- Do NOT rename the page title from "Loan Explorer".
- Do NOT remove any exports from `loanSummaryHelpers.js` that other files depend on.

### Constraints

- Use `generateClient` from `"aws-amplify/api"` for all GraphQL calls.
- All UI components use `theme.palette.sf` tokens for colors (not raw hex values).
- Use the existing `CustomDataGrid` component.
- Do not install new npm packages.
- Preserve all existing imports and exports that other files depend on.
- All files are `.js` or `.jsx` (not TypeScript).
- Use React hooks and functional components throughout.
- Use `React.useState`, `React.useEffect`, `React.useMemo`, `React.useCallback` (not destructured imports — match the existing code style in LoansDisplay.jsx).
- `UserContext` is imported from `../../App` (relative to the Loans folder structure).

### Files to create

1. `src/Models/Loans/LoansDisplay/LoanExplorerContext.jsx`
2. `src/Models/Loans/LoansDisplay/loanExplorerQueries.js`
3. `src/Models/Loans/LoansDisplay/useLoanExplorer.js`

### Files to modify

1. `src/Models/Loans/LoansDisplay/LoansDisplay.jsx`
2. `src/Routes.jsx` (or `src/App.jsx`) — wrap with `LoanExplorerProvider`

### Verification

After Phase 1:
1. The `/loans` page loads showing the first page of summaries (50 rows).
2. Navigating to a loan detail and pressing Back returns instantly to the cached loan list — no loading spinner, no API call.
3. After recording a payment on the detail page and navigating back, the affected row updates in the background without a full reload.
4. Clicking a status tab reloads from the server with that status filter applied server-side.
5. Clicking a column header to sort triggers loading of the full summary set, then sorts globally. The sort is accurate across the entire portfolio (e.g., sorting by Total Paid descending correctly shows the loan with the most payments at the top).
6. When sorted, "Next"/"Previous" paginate through the locally-sorted full dataset. When not sorted, they use server-side cursor pagination.
7. The search bar filters the current view client-side.
8. KPI cards and tab counts reflect the loaded data (current page when paginated, full set when sorted).
9. Opening payments popup, statement popup, and navigating to loan detail still work.
10. SYNC SUMMARIES still triggers a full rebuild.
11. No regressions in admin vs non-admin branch filtering.
12. The app compiles without errors (`npm start` runs clean).
