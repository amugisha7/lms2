## Phase 3: Loan Workspace — Rich Detail View

Give this entire document to an LLM along with workspace access. This is Phase 3 of 5. Phases 1-2 must be complete before starting this phase.

---

### Context: What Phases 1-2 Built

- **Phase 1:** `LoanExplorerContext` (caches data across navigation), `useLoanExplorer` hook, `loanExplorerQueries.js`, refactored `LoansDisplay.jsx` with paginated + hybrid-sort strategy, pagination controls, server-side status filtering via `byDisplayStatusUpdatedAt` GSI.
- **Phase 2:** `loanSummaryStreamHandler` Lambda (DynamoDB Streams on Loan/Payment/Penalty tables → auto-updates LoanSummary), `loanSummaryScheduledRefresh` Lambda (EventBridge every 15 min → refreshes stale time-based statuses). Client-side stale refresh removed from explorer.

**Current Loan Detail (`LoanDetailPage.jsx`):**
- Route: `/loans/id/:loanId/view`
- Fetches full loan via `getLoanById(loanId)`, parses `loanComputationRecord` JSON.
- Two tabs: Details (shows `EditLoan` component in read-only mode), Files (`LoanFiles` component).
- Action links: Edit (opens `CustomSlider` with `EditLoan`), View Statement (opens `LoanStatementPopup`), Manage Payments (opens `ManagePaymentsPopup`).
- Breadcrumb: "All Loans" > "Loan Profile".
- Uses `UserContext` for `userDetails`, `useNavigate`, `useParams` for `loanId`.

**Existing components that will be reused:**
- `EditLoan` (`src/Models/Loans/EditLoan/EditLoan.jsx`) — loan editing form.
- `ManagePaymentsPopup` (`src/Models/Payments/ManagePaymentsPopup.jsx`) — payment CRUD.
- `LoanStatementPopup` (`src/Models/Loans/LoanStatements/LoanStatementPopup.jsx`) — statement generation.
- `LoanFiles` (`src/Models/Loans/LoanFiles/LoanFiles.jsx`) — document management.
- `CustomSlider` — slide-in panel.
- `WorkingOverlay` — loading spinner overlay.
- `NotificationBar` — notification display.
- `ClickableText` — clickable text links.
- `LoanExplorerContext` — for `syncAndRefreshLoan` after mutations.

**Key helpers:**
- `getLoanById(loanId)` from `src/Models/Loans/loanHelpers.js` — fetches full loan with all relationships.
- `buildLoanDisplayName(loan, currencyCode)` from `src/Models/Loans/loanDisplayHelpers.js`.
- `buildStatementLedger(loan)` from `src/Models/Loans/LoanStatements/statementHelpers.js` — computes the amortization schedule, payment allocations, and balances.
- `attachDerivedLoanData(loan)` from `loanSummaryProjection.js` — computes all derived metrics.
- `syncLoanSummaryByLoanId(loanId)` from `loanSummaryHelpers.js`.

**Theme:** All UI uses `theme.palette.sf` tokens. Refer to LoansDisplay.jsx for the established design patterns (borderRadius: 0 throughout, `sf_brandPrimary`, `sf_textPrimary`, `sf_textTertiary`, `sf_borderLight`, `sf_kpiCardBg`, etc.).

---

### Phase 3 Objective

Replace `LoanDetailPage.jsx` with a richer `LoanWorkspace` component that provides a complete operational surface for a single loan. The workspace should feel like a dedicated application for working with one loan, not a stripped-down detail card.

---

### Step 1: Create `LoanWorkspace.jsx`

Create `src/Models/Loans/LoanWorkspace/LoanWorkspace.jsx`.

This replaces `LoanDetailPage.jsx` at the same route (`/loans/id/:loanId/view`).

**Layout structure:**

```
┌─────────────────────────────────────────────────────┐
│  ← Back to Loans    Breadcrumb: All Loans > Loan    │
├─────────────────────────────────────────────────────┤
│  SUMMARY HEADER                                      │
│  ┌──────┐ Borrower Name · Loan #1234                │
│  │Status│ Officer: John Doe · Branch: Central        │
│  │ Pill │                                            │
│  └──────┘                                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐  │
│  │Principal│ │Amt Due  │ │Loan Bal │ │Total Paid│  │
│  │ 50,000  │ │ 12,300  │ │ 37,700  │ │ 12,300   │  │
│  └─────────┘ └─────────┘ └─────────┘ └──────────┘  │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌─────────┐  │
│  │Next Due │ │Maturity │ │Arrears  │ │Missed   │  │
│  │15-May-26│ │01-Jan-27│ │ 2,300   │ │  2      │  │
│  └─────────┘ └─────────┘ └──────────┘ └─────────┘  │
├─────────────────────────────────────────────────────┤
│  QUICK ACTIONS                                       │
│  [Add Payment] [View Statement] [Edit Loan]          │
│  [Generate Documents] [View Schedule]                │
├─────────────────────────────────────────────────────┤
│  TABS                                                │
│  [Overview] [Payments] [Statement] [Schedule]        │
│  [Documents] [History]                               │
├─────────────────────────────────────────────────────┤
│  TAB CONTENT (lazy-loaded)                           │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Summary Header:**
- Back arrow + breadcrumb (same as current LoanDetailPage).
- Loan display name: borrower name · loan number.
- Status pill (colored chip, same styling as explorer status pills).
- Loan officer name, branch name.
- 8 metric cards in two rows of 4, similar to the KPI cards in the explorer. Use the same `KpiCard` pattern or a smaller variant. Fields:
  - Principal (`loan.principal`)
  - Amount Due (computed via `attachDerivedLoanData`)
  - Loan Balance (computed)
  - Total Paid (computed)
  - Next Due Date (computed)
  - Maturity Date (`loan.maturityDate` or computed)
  - Arrears (computed)
  - Missed Installments (computed)
- Currency formatting: use the same `formatMoneyParts` utility.

**Quick Actions Bar:**
- Row of buttons/clickable text links below the header.
- "Add Payment" → opens `ManagePaymentsPopup`.
- "View Statement" → opens `LoanStatementPopup`.
- "Edit Loan" → opens `CustomSlider` with `EditLoan`.
- "View Schedule" → switches to Schedule tab.
- Style as outlined buttons or `ClickableText`, consistent with the sf theme.

**Tabs:**
1. **Overview** — the current EditLoan in read-only mode (same as current Details tab). Shows the loan form fields as read-only.
2. **Payments** — renders `ManagePaymentsPopup` content inline (not as a popup). Or renders a payment list with add/edit capability. If `ManagePaymentsPopup` is tightly coupled as a dialog, render it inline by extracting its content, OR keep it as a popup triggered from this tab. Simpler approach: show a payments summary table here with columns (Date, Amount, Method, Status, Reference) built from `loan.payments.items`, plus an "Add Payment" button that opens the existing `ManagePaymentsPopup`.
3. **Statement** — renders the statement view. Use `LoanStatementPopup`'s content inline, or trigger it as a popup from a button.
4. **Schedule** — renders the amortization schedule table. Use `buildStatementLedger(loan)` to get the schedule, then display it in a table with columns: #, Due Date, Principal Due, Interest Due, Fees Due, Total Due, Cumulative Paid, Balance.
5. **Documents** — renders `LoanFiles` component (same as current Files tab).
6. **History** — placeholder for Phase 4+. Show `LoanEvent` records if available, otherwise display "Coming soon" text.

**Lazy loading:**
- On mount, fetch the full loan via `getLoanById(loanId)`. Compute derived data via `attachDerivedLoanData`.
- The Overview tab renders immediately from the loaded loan.
- Other tabs render from the same loaded loan data (payments, penalties, schedule are all included in the full loan fetch).
- No additional API calls when switching tabs — all data comes from the single loan fetch.
- The "lazy" aspect is React rendering: only the active tab's JSX is mounted.

**After mutations:**
- After a payment is recorded (via ManagePaymentsPopup), re-fetch the loan via `getLoanById(loanId)` to get the updated payments list. Recompute derived data. Update all displayed metrics.
- Call `syncAndRefreshLoan(loanId)` from `LoanExplorerContext` to sync the LoanSummary for the explorer. (Import the context and call `markNeedsRefresh` or `syncAndRefreshLoan`.)
- After editing the loan (via EditLoan), same pattern.
- Show a success notification via `NotificationBar` or `SnackbarContext`.

### Step 2: Update routing

In `src/Routes.jsx`:
- Replace the import of `LoanDetailPage` with `LoanWorkspace`.
- The route path stays the same: `loans/id/:loanId/view`.

```js
// Before:
import LoanDetailPage from "./Models/Loans/LoanDetailPage";
// After:
import LoanWorkspace from "./Models/Loans/LoanWorkspace/LoanWorkspace";
```

And in the Route element:
```jsx
// Before:
<Route path="loans/id/:loanId/view" element={<LoanDetailPage />} />
// After:
<Route path="loans/id/:loanId/view" element={<LoanWorkspace />} />
```

### Step 3: Preserve LoanDetailPage

Do NOT delete `LoanDetailPage.jsx`. Rename it or keep it as a backup. The new `LoanWorkspace` replaces it at the route level, but the old file should remain in the codebase in case of rollback.

---

### What NOT to change in Phase 3

- Do NOT change the `LoanSummary` schema.
- Do NOT change the Lambda triggers from Phase 2.
- Do NOT change `LoansDisplay.jsx` or the explorer context (except importing `syncAndRefreshLoan` if needed).
- Do NOT change `ManagePaymentsPopup` or `LoanStatementPopup` internals — reuse them as-is.
- Do NOT change `EditLoan` internals.
- Do NOT add new backend models or API changes.

### Constraints

- Same as Phase 1: `generateClient`, `theme.palette.sf` tokens, no new npm packages, `.jsx` files, `React.useState` style (matching existing patterns).
- The workspace must work with the existing data model — no schema changes.
- All existing popup components (`ManagePaymentsPopup`, `LoanStatementPopup`) should be reused, not rewritten.
- Performance: the single `getLoanById` call should be the only API call on mount. Tab switching should be instant (no additional fetches).

### Files to create

1. `src/Models/Loans/LoanWorkspace/LoanWorkspace.jsx` — main workspace component.
2. `src/Models/Loans/LoanWorkspace/WorkspaceHeader.jsx` — summary header with metrics (optional — can be inline in LoanWorkspace).
3. `src/Models/Loans/LoanWorkspace/PaymentsTab.jsx` — payments list + add button (optional — can be inline).
4. `src/Models/Loans/LoanWorkspace/ScheduleTab.jsx` — amortization schedule table (optional — can be inline).

### Files to modify

1. `src/Routes.jsx` — swap `LoanDetailPage` → `LoanWorkspace`.

### Verification

1. Navigating to `/loans/id/:loanId/view` shows the new LoanWorkspace with the summary header, quick actions, and tabs.
2. All 8 metric cards display correct values (matching what the explorer showed for this loan).
3. Quick action "Add Payment" opens the ManagePaymentsPopup. After recording a payment, metrics update and the explorer's row for this loan will be fresh when navigating back.
4. Quick action "View Statement" opens the LoanStatementPopup.
5. Quick action "Edit Loan" opens the edit slider. After saving, the workspace refreshes.
6. The Overview tab shows loan details in read-only mode (same as before).
7. The Payments tab shows a list of all payments for this loan.
8. The Schedule tab shows the amortization schedule.
9. The Documents tab shows loan files (same as before).
10. Navigating back to `/loans` returns instantly to the cached explorer with no re-fetch (Phase 1 caching still works).
11. The app compiles without errors.
