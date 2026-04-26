# Prompt 7: Disbursement Report

Continue from the reporting foundation and earlier report prompts.

Your task is to implement a Disbursement Report for monitoring loan funding outflows, operational control, and compliance-style review.

Inspect these areas before making changes:

- The shared reporting module created earlier in `src/Screens/Reports/`
- `src/Models/index.d.ts` for `DisbursementStatus`, `Loan`, and related fields
- `src/Models/Loans/loanSummaryHelpers.js`
- `src/App.jsx`
- Any shared export/snapshot helpers created in Prompt 1

Repo-specific data notes:

- The model layer exposes `approvedDate`.
- The repo also exposes a `DisbursementStatus` enum.
- `LoanSummary` gives scoped portfolio fields but may not contain every disbursement-specific field needed for audit views.
- If disbursement-specific status/date fields are not present in `LoanSummary`, it is acceptable to enrich from raw loan reads for those missing fields only.

Business intent:

- Track loans approved/disbursed in a selected date window.
- Monitor funding outflows by branch, product, and officer.
- Surface exceptions such as approved-but-not-disbursed items or unusual disbursement patterns.

Implement `/reports/disbursement` with the following:

1. Summary KPIs for at least:
   - total disbursed amount in range
   - disbursed loan count in range
   - average disbursement amount
   - approved but not yet disbursed count
   - largest disbursement in range
2. A disbursement detail table with columns such as:
   - loan number
   - borrower
   - branch
   - loan officer
   - loan product
   - approved date
   - disbursement status
   - principal / disbursed amount
   - loan purpose
3. Rollups for admins by:
   - branch
   - loan product
   - loan officer
4. Exception views such as:
   - approved loans without completed disbursement
   - high-value disbursements above a configurable threshold
   - unusually concentrated disbursements by one branch or officer within the date window
5. CSV export and `FinancialReport` snapshot persistence using report type `disbursement_report`.

Calculation and data guidance:

- Use the report date range as the operational disbursement window.
- Prefer `approvedDate` only when that is the best available proxy for disbursement timing in this repo. If a better disbursement date/status field is present in the actual loan model or related records, use that instead and document the choice in the implementation summary.
- Reuse `LoanSummary` for scope and officer/product/amount metadata where possible.
- Avoid inventing a new funding ledger if the existing model layer already gives enough visibility.

Acceptance criteria:

- `/reports/disbursement` renders a real report, not a placeholder
- The report respects branch/institution scope
- The implementation makes the chosen disbursement-date/disbursement-status logic explicit
- Admin rollups, detail table, snapshot save, and export all work

At the end, summarize:

- Which date field was used as the disbursement date and why
- Which status field was used as the disbursement status and why
- Any assumptions made for approved-but-not-disbursed exception logic
