## Phase 4: Advanced Explorer Features — Sort GSIs, Saved Views, Search

Give this entire document to an LLM along with workspace access. This is Phase 4 of 5. Phases 1-3 must be complete before starting this phase.

---

### Context: What Phases 1-3 Built

- **Phase 1:** `LoanExplorerContext` (caches data across navigation, hybrid sort: paginated default + full-fetch on sort), `useLoanExplorer` hook, `loanExplorerQueries.js` (server-side status filtering via `byDisplayStatusUpdatedAt` GSI), refactored `LoansDisplay.jsx` with pagination controls.
- **Phase 2:** Lambda stream triggers (Loan/Payment/Penalty → auto-update LoanSummary), scheduled refresh Lambda (15-min interval for time-based status transitions). Explorer is pure read-only.
- **Phase 3:** `LoanWorkspace` replaced `LoanDetailPage` with summary header, quick actions, and tabbed interface (Overview, Payments, Statement, Schedule, Documents, History).

**Current hybrid sort behavior:** When the user clicks a column header to sort, the explorer loads ALL summaries for the scope via `fetchAllLoanSummariesForScope` / `fetchAllLoanSummariesForBranches`, caches them in `allSummaries`, and sorts client-side. This works well for portfolios up to ~2000 loans.

**Current KPI behavior:** KPIs and tab counts are computed from whatever data is currently loaded (one page when paginated, full set when sorted). They don't reflect the full portfolio in paginated mode.

**Current search behavior:** Client-side text filter over the currently-loaded page/set.

---

### Phase 4 Objective

Four improvements:

**A. Sort-field GSIs** — Add DynamoDB GSIs for the most-used sort fields so that sorted, paginated queries are globally accurate without loading the full set. This replaces the Phase 1 hybrid sort for large portfolios.

**B. Saved/predefined filter views** — Quick-access filter presets like "Overdue", "My Loans", "High Outstanding" that set multiple filters at once.

**C. Smart search** — Loan-number autocomplete via `byLoanSummaryNumber` GSI, and borrower-lookup search via `byBorrowerUpdatedAt` GSI.

**D. Server-side KPI aggregates** — Accurate portfolio-level KPIs without loading the full dataset.

---

### Step 1: Add sort-field GSIs to `LoanSummary` schema

Modify `amplify/backend/api/lms2/schema.graphql`. Add these indexes to the `LoanSummary` model:

```graphql
  institutionID: ID
    @index(
      name: "byInstitutionUpdatedAt"
      sortKeyFields: ["displayStatusComputedAt"]
    )
    @index(
      name: "byInstitutionAndPrincipal"
      sortKeyFields: ["principalAmount"]
    )
    @index(
      name: "byInstitutionAndStartDate"
      sortKeyFields: ["startDate"]
    )
    @index(
      name: "byInstitutionAndTotalPaid"
      sortKeyFields: ["totalPaidAmount"]
    )
    @index(
      name: "byInstitutionAndAmountDue"
      sortKeyFields: ["amountDueAmount"]
    )
    @index(
      name: "byInstitutionAndMaturity"
      sortKeyFields: ["maturityDateEffective"]
    )
```

**Important:** DynamoDB allows multiple `@index` directives on the same field. Each GSI uses `institutionID` as the partition key with a different sort key. This allows sorted paginated queries like "all loans for institution X, ordered by principalAmount DESC".

Count your total GSIs after this change. The `LoanSummary` model currently has 7 GSIs:
- `byRefreshScope`
- `byInstitutionUpdatedAt`
- `byBranchUpdatedAt`
- `byBorrowerUpdatedAt`
- `byLoanSummaryNumber`
- `byLoanOfficerUpdatedAt`
- `byDisplayStatusUpdatedAt`

Adding 5 new GSIs brings the total to 12. DynamoDB limit is 20. We're fine.

**Also add equivalent branch-level GSIs if branch-scoped users need sorted views:**

```graphql
  branchID: ID
    @index(
      name: "byBranchUpdatedAt"
      sortKeyFields: ["displayStatusComputedAt"]
    )
    @index(
      name: "byBranchAndPrincipal"
      sortKeyFields: ["principalAmount"]
    )
    @index(
      name: "byBranchAndStartDate"
      sortKeyFields: ["startDate"]
    )
    @index(
      name: "byBranchAndTotalPaid"
      sortKeyFields: ["totalPaidAmount"]
    )
    @index(
      name: "byBranchAndAmountDue"
      sortKeyFields: ["amountDueAmount"]
    )
    @index(
      name: "byBranchAndMaturity"
      sortKeyFields: ["maturityDateEffective"]
    )
```

That adds 5 more (17 total). Still under 20.

After schema change, run `amplify push` to deploy, then `amplify codegen` to regenerate.

### Step 2: Update `loanExplorerQueries.js` for sorted queries

Add a function:

```js
fetchSortedExplorerPage({
  institutionId,
  branchId,
  sortField,          // "principalAmount" | "startDate" | "totalPaidAmount" | "amountDueAmount" | "maturityDateEffective"
  sortDirection,      // "ASC" | "DESC"
  displayStatusFilter, // string | null — if set, apply as a DynamoDB filter (not GSI partition)
  limit,
  nextToken,
  client,
})
→ Promise<{ items: LoanSummary[], nextToken: string | null }>
```

Implementation:
- Map `sortField` to the GSI name: e.g., `"principalAmount"` → `"byInstitutionAndPrincipal"` (or `"byBranchAndPrincipal"` for branch-scoped users).
- Construct and execute the GraphQL query for that GSI.
- If `displayStatusFilter` is set, pass it as a DynamoDB `filter: { displayStatus: { eq: displayStatusFilter } }`. This is a post-filter (not partition key), which is acceptable because the GSI narrows the result set by institution/branch first.
- Return `{ items, nextToken }`.

Write the GraphQL query templates for each sort GSI. They follow the same pattern — only the index name and sort key field change.

### Step 3: Update `LoanExplorerContext.jsx` for server-side sorting

When the user sorts by a supported field (`principalAmount`, `startDate`, `totalPaidAmount`, `amountDueAmount`, `maturityDateEffective`):
- Instead of loading ALL summaries and sorting client-side, call `fetchSortedExplorerPage` with the appropriate GSI.
- Pagination is now server-side even when sorted.
- Reset `currentPage`, `prevTokens`, `nextToken` on sort change.

When the user sorts by a field NOT backed by a GSI (like `borrowerDisplayName`, `loanOfficerDisplayName`, `loanBalanceAmount`):
- Fall back to the Phase 1 hybrid approach: load all summaries, sort client-side.
- Show a brief note or log: "Client-side sort — for large portfolios, consider adding a GSI for this field."

Update the `setSortModel` handler to check the field and route to the correct strategy.

### Step 4: Saved/predefined filter views

Add a "Views" dropdown or chip bar above the filter area in `LoansDisplay.jsx`.

**Predefined views:**

| View name | Filters applied |
|-----------|----------------|
| All Loans | statusFilter: null, clear all other filters |
| Current | statusFilter: "CURRENT" |
| Missed Payment | statusFilter: "CURRENT_WITH_MISSED_PAYMENT" |
| Overdue | statusFilter: "OVERDUE" |
| Closed | statusFilter: "CLOSED" |
| My Loans | loanOfficerID filter = current user's employee ID |
| Recently Disbursed | statusFilter: null, sort by startDate DESC, date range filter: last 30 days |
| High Outstanding | statusFilter: null, sort by amountDueAmount DESC |

Implementation:
- Define a `PRESET_VIEWS` array with `{ key, label, filters }` objects.
- Add a row of Chip buttons above the status tabs (or replace the status tabs with a combined view selector).
- Clicking a view sets the corresponding `statusFilter`, `sortModel`, and any additional filters (like date range or officer) on the context.
- "My Loans" requires filtering by `loanOfficerID`. Add a `loanOfficerFilter` state to the context. When set, pass it as a DynamoDB `filter: { loanOfficerID: { eq: officerId } }` in the query. The user's employee ID comes from `userDetails.id` or `userDetails.employeeId`.
- "Recently Disbursed" requires filtering by `startDate` range. Add a `dateRangeFilter` state to the context. When set, use the `byInstitutionAndStartDate` GSI with a `startDate` sort key condition: `{ between: [thirtyDaysAgo, today] }`.

Also add a secondary filter panel (collapsible) below the views, with:
- Date range pickers for `startDate` and `maturityDateEffective`.
- Amount range inputs for `principalAmount`, `amountDueAmount`.
- Dropdown for loan product.
- These apply as DynamoDB `filter` expressions on the active query.

### Step 5: Smart search

Modify the search bar behavior in `LoansDisplay.jsx`:

**Loan number search:**
- If the search term looks like a loan number (starts with digits, or matches a known prefix pattern), query the `byLoanSummaryNumber` GSI directly: `loanNumber = searchTerm`.
- Show results as an autocomplete dropdown.
- On selection, navigate to the loan's workspace.

**Borrower search:**
- Add a borrower autocomplete mode. When the user starts typing a name, query borrowers (from a borrower search endpoint or the `LoanSummary` data).
- Since `borrowerDisplayNameNormalized` exists on `LoanSummary`, and the full set may be cached in `allSummaries`, search against the cached data first.
- If the full set isn't loaded, fall back to the server: scan isn't efficient, so instead prompt the user to select from a borrower dropdown (query the Borrower model separately) then filter loans by that borrower's ID using the `byBorrowerUpdatedAt` GSI.

**Implementation approach:**
- Replace the simple `InputBase` search with a component that detects the input type:
  - Numbers/known prefix → loan number lookup
  - Text → check cached `allSummaries` for matching `borrowerDisplayName` / `borrowerPhone` / `loanOfficerDisplayName`
  - If no cached data, show a "Search requires loading all loans" prompt with a button that triggers the full load
- Keep the existing client-side filter as the fallback for all other search patterns.

### Step 6: Server-side KPI aggregates

Create a utility function (or Lambda) that computes portfolio-level KPIs efficiently.

**Approach A — Client-side from full set (simplest):**
When the user first visits the explorer, load the full summary set in the background (don't block the UI). Once loaded, compute KPIs from the full set. Store them in the context. This is the same `allSummaries` that's cached for sorting.

**Approach B — Dedicated KPI Lambda (more scalable):**
Create a Lambda that queries DynamoDB directly (not via AppSync) to compute counts and sums. Called once on explorer mount. Returns:
```json
{
  "total": 523,
  "byStatus": {
    "CURRENT": 312,
    "CURRENT_WITH_MISSED_PAYMENT": 45,
    "OVERDUE": 89,
    "CLOSED": 67,
    "WRITTEN_OFF": 8,
    "VOIDED": 2
  },
  "totalPrincipal": 52300000,
  "totalOutstanding": 12340000
}
```

**Recommended: Approach A for now.** Since the full set is already loaded for sorting and cached in context, compute KPIs from it. The KPIs then reflect the full portfolio even when the DataGrid shows one page. Add a loading indicator: "Loading portfolio summary..." until `allSummaries` is populated.

Update the context:
- On mount, trigger a background load of `allSummaries` (non-blocking).
- Compute `portfolioKpis` from `allSummaries` via `useMemo`.
- Display `portfolioKpis` in the KPI cards even when the DataGrid shows a paginated subset.
- Tab counts also come from the full set.
- The full set loads once and is cached for the session. Background-refresh when stale.

---

### What NOT to change in Phase 4

- Do NOT change the Lambda trigger logic from Phase 2.
- Do NOT change the LoanWorkspace from Phase 3.
- Do NOT change the `LoanSummary` field list (only add GSIs).

### Files to modify

1. `amplify/backend/api/lms2/schema.graphql` — add sort-field GSIs.
2. `src/Models/Loans/LoansDisplay/loanExplorerQueries.js` — add `fetchSortedExplorerPage`, loan number lookup query.
3. `src/Models/Loans/LoansDisplay/LoanExplorerContext.jsx` — add sort GSI routing, saved views state, officer filter, date range filter, background full-set load for KPIs.
4. `src/Models/Loans/LoansDisplay/useLoanExplorer.js` — expose new filter/view APIs, portfolio KPIs.
5. `src/Models/Loans/LoansDisplay/LoansDisplay.jsx` — add saved views bar, secondary filter panel, smart search component, use portfolio KPIs.

### Files to create

1. `src/Models/Loans/LoansDisplay/ExplorerFilterPanel.jsx` — secondary filter panel (date ranges, amount ranges, product dropdown). Optional — can be inline.
2. `src/Models/Loans/LoansDisplay/ExplorerSearchBar.jsx` — smart search with loan-number autocomplete and borrower lookup. Optional — can be inline.

### Verification

1. Sorting by Principal, Start Date, Total Paid, Amount Due, or Maturity Date uses server-side GSIs — confirmed by checking that the query is paginated (Next/Prev work) and the sort is globally correct even on page 2+.
2. Sorting by other columns (Borrower Name, Officer, Loan Balance) falls back to full-set client-side sort.
3. KPI cards show portfolio-level totals (not just the current page).
4. Tab counts show total loans per status across the portfolio.
5. Clicking "Overdue" saved view shows only overdue loans. "My Loans" shows only the current user's loans. "Recently Disbursed" shows loans from the last 30 days sorted by start date.
6. Typing a loan number in the search bar finds the loan via GSI lookup.
7. Typing a borrower name searches the cached data (or prompts to load).
8. Date range and amount range filters narrow the displayed results.
9. `amplify push` succeeds. `npm start` compiles clean.
10. All Phase 1-3 functionality still works (navigation caching, status filtering, LoanWorkspace, mutation sync).
