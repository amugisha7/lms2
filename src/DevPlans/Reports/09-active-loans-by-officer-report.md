# Prompt 9: Active Loans by Officer Report

Continue from the earlier reporting prompts.

Your task is to implement an Active Loans by Officer report to measure workload distribution, portfolio quality by officer, and operational accountability.

Inspect before editing:

- Shared reporting files in `src/Screens/Reports/`
- `src/Models/Loans/loanSummaryHelpers.js`
- `src/Models/Loans/loanSummaryProjection.js`
- Repo notes around employee/loan officer linkage

Repo-specific data notes:

- `LoanSummary` already exposes `loanOfficerID` and `loanOfficerDisplayName`.
- Repo memory indicates officer display should prefer assigned/related employee identity and fall back to created-by employee display when necessary.
- For this report, reuse `loanOfficerID` and `loanOfficerDisplayName` from `LoanSummary` as the default grouping key.

Business intent:

- Show active portfolio workload by officer.
- Compare exposure, delinquency, and account volume across staff.
- Support branch managers and admins reviewing portfolio ownership.

Implement `/reports/active-loans-by-officer` with the following:

1. Officer summary table showing, per officer:
   - active loan count
   - total outstanding balance
   - total arrears amount
   - delinquent loan count
   - overdue loan count
   - average balance per loan
2. Officer KPI cards for the currently selected branch/scope such as:
   - total officers with active loans
   - highest active balance per officer
   - highest delinquent balance per officer
   - most overloaded officer by loan count
3. Drill-down detail table listing each active loan with:
   - officer
   - borrower
   - loan number
   - branch
   - display status
   - next due date
   - missed installment count
   - arrears amount
   - outstanding balance
4. Filters for branch, officer, status, and delinquency band.
5. CSV export and `FinancialReport` snapshot persistence using report type `active_loans_by_officer_report`.

Calculation guidance:

- Define active loans consistently with the rest of the reporting suite. Exclude voided loans and typically exclude closed loans from active workload.
- Use the existing display status system for overdue/current/missed-payment breakdowns.
- Keep officer aggregation logic in a shared helper so it can support future dashboard widgets.

Acceptance criteria:

- `/reports/active-loans-by-officer` shows real officer groupings from loan summary data
- Active workload and delinquency metrics are visible per officer
- Scope rules are respected for admins vs branch users
- Export and snapshot work

At the end, summarize:

- How active loans were defined
- Which fields were used to identify/group officers
- Any fallback logic used when officer identifiers or names were missing
