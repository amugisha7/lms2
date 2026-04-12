## Plan: Loan Explorer and Loan Workspace

Redesign the loan browse and detail experience around two separate surfaces:

1. `Loan Explorer` for finding, filtering, sorting, and comparing loans quickly.
2. `Loan Workspace` for operating on a single loan: viewing details, managing payments, generating statements, and inspecting the full record.

The current `LoansDisplay` can be reused temporarily, but it should no longer be the architectural center of the solution. The backend should expose a read-optimized `LoanSummary` model for the explorer, while the existing `Loan` model remains the source of truth for detailed operational data.

## Goals

1. Search and find a loan quickly using multiple criteria such as borrower, loan number, branch, dates, officer, and status.
2. Let a user open a loan and immediately access the actions and information they need: payments, statements, balances, schedule, and operational context.
3. Provide a true portfolio view where users can compare loans, sort accurately, and focus on subsets such as overdue loans, loans with missed payments, recent disbursements, or high outstanding balances.
4. Minimize API cost by avoiding expensive list queries that fetch large related datasets for every visible row.

## Recommended Product Shape

### 1. Loan Explorer

This becomes the main list page for loans.

The explorer should provide:

- Fast structured filtering by branch, officer, lifecycle status, computed display status, start date range, maturity date range, payment activity, amount ranges, and product.
- Quick lookup by loan number.
- Borrower search through an autocomplete or targeted borrower-search flow rather than a broad text scan over all loans.
- Accurate server-side sorting on a defined set of summary fields.
- A dense comparison view with only read-model data needed for portfolio scanning.
- Row-level quick actions such as `Open`, `Add Payment`, `View Statement`, and `View Schedule`.

### 2. Loan Workspace

This becomes the operational detail surface for a single loan.

The workspace should provide:

- Summary header with borrower, balances, next due, status, loan officer, and maturity.
- Quick action bar for payment updates, statement generation, and navigation to related records.
- Lazy-loaded sections or tabs for Overview, Payments, Statement, Schedule, Documents, and History.
- No dependency on the explorer payload for detailed actions; details should load only when the user opens the loan.

## Core Recommendation

Make a dedicated `LoanSummary` or `LoanListItem` model the source of truth for explorer queries.

Do not keep using raw `Loan` plus `payments` plus `penalties` as the list query payload. That pattern is expensive and still does not guarantee accurate sorting across the full dataset.

Keep the existing `Loan` record as the write model and detailed operational model. Use `LoanSummary` strictly as a read model for browse/search/filter/sort.

## Why This Is Better

The current approach has structural problems:

- It pulls large related datasets into the list query, which increases API cost.
- It computes important fields on the client from partial data already loaded into the browser.
- It cannot guarantee correct sort order across all loans unless the full dataset is loaded first.
- It turns one screen into a dashboard, search tool, comparison table, and operations console at the same time.

Splitting the experience into explorer plus workspace fixes those problems cleanly.

## Search Strategy

The search design should be explicit about what is cheap and what is not.

### Low-cost search and filtering path

Use structured criteria plus targeted lookups instead of free-text scanning across all loan records.

Recommended patterns:

- Loan number: exact or prefix lookup.
- Borrower: autocomplete the borrower first, then filter loans by selected borrower.
- Branch, officer, lifecycle status, display status, product: structured filters.
- Start date, maturity date, last payment date: range filters.
- Principal, outstanding, arrears, total paid: numeric range filters.

This is the cheapest and most predictable path in AppSync plus DynamoDB.

### Search bar behavior

The explorer can still have one visible search bar, but it should route intelligently:

- If the value looks like a loan number, use loan-number lookup.
- If the user chooses a borrower from autocomplete, query by borrower.
- If the user enters a phone number or ID, resolve the borrower first, then load matching loans.
- Do not use broad `contains` scans over raw loan rows as the default search implementation.

### When to add a search engine

Only add OpenSearch, Algolia, Typesense, or Meilisearch if later you truly need fuzzy global text search across many fields at large scale.

That is not the best first step if API cost minimization is a hard goal.

## Read Model: LoanSummary

Create a new backend read model that stores only the fields needed for explorer behavior.

Suggested fields:

- `loanID`
- `institutionID`
- `branchID`
- `borrowerID`
- `borrowerDisplayName`
- `borrowerDisplayNameNormalized`
- `borrowerPhone`
- `loanNumber`
- `loanOfficerID`
- `loanOfficerDisplayName`
- `loanProductID`
- `loanProductName`
- `principalAmount`
- `totalPaidAmount`
- `amountDueAmount`
- `loanBalanceAmount`
- `arrearsAmount`
- `missedInstallmentCount`
- `nextDueDate`
- `lastPaymentDate`
- `startDate`
- `maturityDateEffective`
- `lifecycleStatus`
- `displayStatus`
- `displayStatusRank`
- `displayStatusComputedAt`
- `nextStatusTransitionAt`
- `currencyCode`
- `updatedAt`

### Status handling

Keep backend `lifecycleStatus` separate from `displayStatus`.

- `lifecycleStatus` preserves workflow meaning such as draft-converted `Current`, `Closed`, `Written Off`, or `Voided`.
- `displayStatus` exists for the explorer and user-facing filters, for example `Current`, `Current with missed payment`, and `Overdue`.

Persist `displayStatus` directly on `LoanSummary` so the explorer can filter and sort on it cheaply and accurately across the full dataset.

Recommended operational rule:

- Recompute `displayStatus` immediately whenever write-side events occur, such as loan updates, payment creation, payment reversal, penalty changes, and installment or schedule updates.
- Persist `displayStatusComputedAt` and `nextStatusTransitionAt` so the backend knows when a loan summary may become stale because of time rather than a write event.
- Run a scheduled refresh job that updates only summaries whose `nextStatusTransitionAt` has passed or is approaching, instead of rescanning the full portfolio.
- Before explorer retrieval or display, perform a lightweight stale check and refresh only rows whose `nextStatusTransitionAt` has elapsed or whose computed status is otherwise marked stale.

This keeps the explorer query simple: users filter directly on `LoanSummary.displayStatus` instead of recalculating status in the browser, while still preventing stale time-based statuses from lingering indefinitely.

Best-practice status freshness model:

- `displayStatus` is the persisted field used for sorting and filtering.
- `nextStatusTransitionAt` predicts the earliest time the display status might change without a write event, for example at the start of the next day or at maturity.
- scheduled refresh handles most transitions in bulk at low cost.
- retrieval-time refresh acts as a correctness backstop, not the primary mechanism.

### Summary maintenance

Update `LoanSummary` whenever these records change:

- `Loan`
- `Payment`
- `Penalty`
- persisted installment or schedule state
- borrower display fields
- loan officer display fields

This should be handled by a small projection pipeline rather than recomputing from scratch on every explorer request.

Add a targeted scheduled refresh for date-driven status changes. That job should only recalculate loans whose `nextStatusTransitionAt` is due or near due, such as loans nearing maturity, due dates, or missed-payment thresholds, rather than rebuilding every summary row indiscriminately.

Support a just-in-time refresh path before retrieval or display for rows whose status is stale. This should be limited to the specific rows being requested so it preserves correctness without turning every explorer request into a full recomputation workflow.

## Sorting Strategy

Support accurate server-side sorting only on fields that exist directly on `LoanSummary`.

Recommended initial sort fields:

- `startDate`
- `maturityDateEffective`
- `borrowerDisplayName`
- `loanNumber`
- `displayStatus`
- `principalAmount`
- `amountDueAmount`
- `loanBalanceAmount`
- `totalPaidAmount`
- `lastPaymentDate`

Every supported sort should have a stable secondary tiebreaker, typically `loanID`, so pagination remains deterministic.

Do not promise arbitrary sorting across every column unless each sort field is backed by the read model and query design.

## API Design

Introduce a dedicated explorer query rather than extending the current list query indefinitely.

Recommended direction:

- `searchLoanSummaries(input)` or `listLoanExplorerRows(input)`
- input includes branch scope, borrower selection, officer filter, status filters, date ranges, amount ranges, sort field, sort direction, page size, and cursor
- response returns only summary fields needed by the explorer plus a cursor

The detail view should use a separate query such as `getLoanWorkspace(loanID)` that loads richer data only when the user opens the loan.

For status-sensitive explorer responses, the backend may run a small pre-return freshness pass only on summaries whose `nextStatusTransitionAt` has elapsed. This should be an optimization guardrail, not the main status-computation path.

## UI Recommendation

Do not treat the current `LoansDisplay` grid as the only acceptable interface.

Recommended UX structure:

### Explorer layout

- Top row: search bar, saved views, branch filter, status filter, officer filter.
- Secondary filter panel: date ranges, amount ranges, product, arrears, last payment.
- Main table: concise, sortable summary fields only.
- Right-side drawer or quick panel: preview selected loan without leaving the explorer.

### Workspace layout

- Header with borrower, balances, status, next due, maturity, actions.
- Tabs or sections for Overview, Payments, Statement, Schedule, Files, History.
- Payment and statement actions should be accessible within one click from the workspace.

### Saved views

Add saved or predefined views such as:

- `All Loans`
- `Current`
- `Missed Payment`
- `Overdue`
- `Recently Disbursed`
- `High Outstanding`
- `My Loans`

These make the explorer faster to use than a generic grid alone.

## API Cost Strategy

This design should explicitly reduce cost.

### What to stop doing

- Do not load `payments(limit: 1000)` and `penalties(limit: 1000)` for every row in the list.
- Do not compute portfolio comparisons from detailed loan payloads in the browser.
- Do not use scan-like search patterns over raw loans for general browsing.

### What to do instead

- Query only `LoanSummary` fields in the explorer.
- Load full loan details only when a loan is opened.
- Use cursor pagination.
- Cache stable reference lists such as branches, officers, and products.
- Precompute display status and balances in the summary model.
- Keep statement generation and payment-detail flows off the list query path.
- Use `nextStatusTransitionAt` to target status-refresh work precisely instead of recalculating time-based status for every explorer request.
- Allow retrieval-time refresh only for stale rows being returned, not as the default evaluation path for all rows.

### Cost tradeoff decision

The recommended first version is `LoanSummary` on the existing Amplify/AppSync plus DynamoDB stack because it is cheaper than introducing a dedicated search engine early.

If later usage proves that fuzzy search across many text fields is essential, add a dedicated search index only for the explorer.

## Delivery Plan

### Phase 1: Define the explorer contract

1. Decide which explorer columns are truly needed for daily work.
2. Decide the supported search modes and supported sort fields.
3. Define the exact `LoanSummary` schema and display-status rules.
4. Decide whether the initial experience will reuse `LoansDisplay` or launch a new `LoanExplorer` screen.

### Phase 2: Build the read model

1. Add `LoanSummary` to the backend schema.
2. Add a projection/update path triggered by loan, payment, penalty, installment, and borrower/officer changes.
3. Add status freshness fields such as `displayStatusComputedAt` and `nextStatusTransitionAt`.
4. Add a targeted scheduled refresh job for time-based display-status transitions.
5. Add a just-in-time refresh path for stale rows before retrieval or display.
6. Backfill summaries for existing loans.
7. Regenerate GraphQL statements and models after schema changes.

### Phase 3: Build the explorer API

1. Create a dedicated explorer query.
2. Support cursor pagination and stable sorting.
3. Add targeted lookup paths for loan number and borrower-driven search.
4. Validate that filters and sorting compose correctly.

### Phase 4: Build the UI

1. Implement the explorer view with sortable summary columns and structured filters.
2. Add saved views and quick actions.
3. Add a preview drawer or lightweight details panel.
4. Keep the full workspace page for deeper inspection and operations.

### Phase 5: Optimize and harden

1. Measure API volume before and after the change.
2. Verify summary freshness after payments, reversals, scheduled status-refresh runs, and retrieval-time stale checks.
3. Add monitoring for projection failures, scheduled refresh failures, and stale-row correction frequency.
4. Reassess whether a search engine is actually needed.

## Relevant Files and Systems

- `c:/my_saas/lms2/src/Models/Loans/LoansDisplay/LoansDisplay.jsx` — current browse screen to be replaced or temporarily adapted.
- `c:/my_saas/lms2/src/Models/Loans/loanDataQueries.js` — current list query file; likely replaced by dedicated explorer queries.
- `c:/my_saas/lms2/src/Models/Loans/LoanStatements/statementHelpers.js` — current computation logic that can inform summary projection rules.
- `c:/my_saas/lms2/src/Models/Loans/LoanDrafts/loanDraftHelpers.js` — useful when aligning lifecycle and summary creation rules.
- `c:/my_saas/lms2/src/ModelAssets/CustomDataGrid.jsx` — may be reused if the explorer remains grid-based.
- `c:/my_saas/lms2/amplify/backend/api/lms2/schema.graphql` — add `LoanSummary` and explorer query support here.

## Verification

1. A user can find a loan by loan number, borrower, branch, status, and date criteria without loading the full loan dataset.
2. Explorer sorting is accurate across multiple pages for every supported sortable column.
3. Opening a loan from the explorer provides immediate access to payments, statements, and operational details.
4. Payment creation, reversal, installment updates, or status changes update the explorer summary correctly.
5. Loans that cross a date boundary into overdue or another time-driven state are updated correctly by scheduled refresh or retrieval-time stale correction without requiring a user write action.
6. Retrieval-time status correction is limited to stale rows and does not materially increase normal explorer query cost.
7. The explorer query is materially cheaper than the current raw-loan list query.
8. Compile, codegen, and runtime checks pass after schema and UI changes.

## Explicit Decisions

- Do not keep raw `Loan` as the explorer read model.
- Do not rely on client-side sorting for the full dataset.
- Do not make broad text-scan search the default search behavior.
- Keep workflow status and user-facing display status separate.
- Do not rely on retrieval-time recomputation as the primary status-maintenance mechanism; use persisted status plus targeted refresh, with retrieval-time correction only as a fallback.
- Prefer a read-model architecture first; add a search engine only if the measured product need justifies the extra cost.
