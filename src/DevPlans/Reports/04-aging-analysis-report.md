# Prompt 4: Aging Analysis Report

Continue from the earlier reporting prompts.

Your task is to implement an Aging Analysis Report that buckets overdue exposure and supports recovery prioritization.

Review these areas first:

- Shared report data/filter helpers
- The delinquency report implementation
- `src/Models/Loans/loanSummaryProjection.js`
- `src/Models/Loans/loanSummaryHelpers.js`

Business intent:

- Classify overdue loans into aging buckets.
- Show how arrears and exposure are distributed across delinquency age bands.
- Support collections management, branch comparisons, and reporting consistency for later PAR/provision logic.

Implement `/reports/aging-analysis` with the following:

1. Aging bucket definitions based on days past due. Use explicit buckets such as:
   - Current / not past due
   - 1-30 days
   - 31-60 days
   - 61-90 days
   - 91-180 days
   - 181+ days
2. Summary totals by bucket for at least:
   - loan count
   - outstanding balance
   - arrears amount
   - share of total at-risk balance
3. Branch rollup by aging bucket for admin users.
4. A detailed table where every loan is assigned an aging bucket and sortable by severity.
5. Filters for branch, loan officer, bucket, and status.
6. CSV export and `FinancialReport` snapshot persistence with report type `aging_analysis_report`.

Calculation guidance:

- Calculate `daysPastDue` from `nextDueDate` relative to today.
- If a loan is current or has no past-due amount, place it in `Current / not past due` rather than forcing it into an overdue bucket.
- Reuse the same `daysPastDue` helper and date logic introduced for delinquency if possible.
- Keep bucket classification in a shared helper because the PAR and provisioning prompts will depend on it.

Recommended detailed table columns:

- borrower
- loan number
- branch
- loan officer
- display status
- next due date
- days past due
- aging bucket
- arrears amount
- outstanding balance
- last payment date

UI guidance:

- Present the bucket summary first, then the detail table.
- Make the bucket labels and totals clear enough that finance and collections users can read the same screen.
- Keep the implementation dependency-light; prefer shared MUI components over adding another visualization library.

Acceptance criteria:

- `/reports/aging-analysis` assigns every relevant loan to a clear bucket
- Bucket totals are internally consistent with detailed rows
- Branch rollups work for admins
- Shared aging helpers are reusable by later report prompts
- Snapshot and export both work

At the end, summarize:

- Aging buckets implemented
- Shared helpers created or reused
- Any assumptions about current loans versus delinquent loans
