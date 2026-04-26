# Prompt 2: Loan Portfolio Overview Report

Continue from the reporting foundation already created in Prompt 1.

Your task is to implement the Loan Portfolio Overview report for executive-level portfolio health monitoring.

Inspect these existing areas before changing code:

- `src/Screens/Reports/` created by Prompt 1
- `src/Models/Loans/loanSummaryHelpers.js`
- `src/Models/Loans/loanSummaryProjection.js`
- `src/Models/Loans/LoansDisplay/loanExplorerQueries.js`
- `src/Models/Loans/LoansDisplay/LoansDisplay.jsx`
- `src/App.jsx`

Business intent:

- Provide a high-level portfolio health view for management.
- Show total exposure, active portfolio size, arrears concentration, status mix, and branch-level performance.
- This report should become the shared executive summary that other reports can link back to.

Implement the following on `/reports/portfolio-overview`:

1. KPI cards for at least:
   - Total loans in scope
   - Active loans in scope
   - Total principal disbursed in scope
   - Total outstanding balance
   - Total arrears amount
   - Total collected / total paid amount
   - Percent of loans with missed installments
2. Status breakdown using the existing loan summary status model. Use `displayStatus` / derived status metadata, not raw `loan.status`.
3. Branch rollup table for admins showing, per branch:
   - loan count
   - outstanding balance
   - arrears amount
   - missed-installment loan count
   - overdue loan count
4. Near-term watchlists such as:
   - loans with upcoming due dates in the next 7 days
   - loans with no recent payment activity
   - largest balances outstanding
5. A detailed portfolio table that can be filtered/searched and reuses the report foundation controls.
6. Snapshot persistence through `FinancialReport` using a clear report type like `loan_portfolio_overview`.
7. CSV export for the detailed portfolio table and JSON export for the summary payload.

Metric guidance:

- Use `principalAmount`, `totalPaidAmount`, `loanBalanceAmount`, `arrearsAmount`, `missedInstallmentCount`, `nextDueDate`, `lastPaymentDate`, and `displayStatus` from `LoanSummary`.
- Treat written-off and voided loans separately from active operational portfolio totals. Be explicit in the implementation about whether they are included or excluded in each KPI.
- If a metric depends on a business assumption, document it in code comments only where the assumption is not obvious.

UI guidance:

- Keep the report readable on desktop and mobile.
- Reuse MUI cards/tables/charts only if already present in the repo; do not introduce a heavy charting dependency unless clearly necessary.
- If you need simple visualizations, prefer lightweight MUI-based bars or status chips over a new chart package.

Acceptance criteria:

- `/reports/portfolio-overview` shows a real portfolio summary, not a placeholder
- All metrics respect active branch/institution scope
- Status totals align with the existing loan summary display status system
- Admin users can compare branches
- Snapshot save and export both work for this report

At the end, summarize:

- Which KPIs were added
- Which loan statuses are included/excluded from portfolio totals
- Any assumptions made in watchlist calculations
