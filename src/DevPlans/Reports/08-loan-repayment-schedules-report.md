# Prompt 8: Loan Repayment Schedules Report

Continue from the earlier reporting prompts.

Your task is to implement a Loan Repayment Schedules report for payment forecasting, upcoming dues, and schedule visibility.

Inspect these code paths first:

- Shared reporting files in `src/Screens/Reports/`
- `src/Models/Loans/LoanStatements/statementHelpers.js`
- `src/Models/Loans/loanSummaryHelpers.js`
- `src/Models/Loans/loanSummaryProjection.js`
- Any schedule or forecast helpers created elsewhere in the repo

Repo-specific guidance:

- The repo already has deterministic statement/schedule helpers and derived statement logic.
- Do not re-implement schedule math from scratch if the schedule can be resolved from the existing statement helper path.

Business intent:

- Give operations and finance teams a forward-looking view of upcoming installments.
- Support daily/weekly payment planning and cash forecasting.
- Provide a schedule detail export that can be shared outside the app.

Implement `/reports/repayment-schedules` with the following:

1. Summary KPIs for at least:
   - installments due in the next 7 days
   - installments due in the next 30 days
   - expected principal due in the selected horizon
   - expected interest due in the selected horizon
   - expected penalty due in the selected horizon if schedule rows include it
2. A forecast summary grouped by due date period, for example:
   - daily for near-term view
   - weekly or monthly aggregation for wider horizons
3. A detailed schedule table with rows at installment level, not only loan level. Suggested columns:
   - due date
   - loan number
   - borrower
   - branch
   - loan officer
   - installment number if available
   - principal due
   - interest due
   - fees due
   - penalty due
   - total due
   - outstanding flag / paid flag if derivable
4. Filters for branch, loan officer, date horizon, and loan status.
5. CSV export and `FinancialReport` snapshot persistence using report type `loan_repayment_schedules_report`.

Implementation guidance:

- Reuse schedule resolution from `statementHelpers` or the repo’s statement/derived schedule logic.
- If installment-level schedule rows require raw loan reads, keep that enrichment isolated to this report layer rather than spreading it into unrelated screens.
- Do not duplicate the amortization engine.
- Make the forecast horizon configurable from the report controls.

UI guidance:

- Show the forecast summary first, then the installment detail table.
- Keep the detail view usable on desktop and still readable on smaller screens.

Acceptance criteria:

- `/reports/repayment-schedules` provides installment-level schedule visibility
- The report uses the existing schedule logic rather than a new formula branch
- Forecast totals and detail rows are internally consistent
- Snapshot and export work

At the end, summarize:

- Which existing schedule helpers were reused
- Whether schedule rows came from derived statement data, raw computation records, or both
- Any limitations for loans with incomplete or legacy schedule data
