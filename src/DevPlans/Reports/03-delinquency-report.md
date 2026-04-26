# Prompt 3: Delinquency Report

Continue from Prompts 1 and 2.

Your task is to implement a Delinquency Report focused on immediate collections action and default prevention.

Review these code paths first:

- The shared reporting files created earlier
- `src/Models/Loans/loanSummaryProjection.js`
- `src/Models/Loans/LoansDisplay/LoansDisplay.jsx`
- Any shared report table/export helpers created in Prompt 1

Business intent:

- Surface the loans that need collections attention now.
- Prioritize cases by urgency, arrears size, missed-installment count, and inactivity.
- Give collections staff a sortable working list, not just summary KPIs.

Implement `/reports/delinquency` with the following:

1. Summary KPIs for:
   - delinquent loan count
   - total arrears amount on delinquent loans
   - delinquent outstanding balance
   - average arrears per delinquent loan
   - loans with no payment in the last 30 days
2. Define delinquent loans using the existing derived summary fields, not raw lifecycle guesses. Base the report primarily on:
   - `missedInstallmentCount > 0`
   - or `displayStatus` in missed-payment / overdue states
3. Add a priority score or urgency classification for each row using a transparent formula. Use factors such as:
   - days past due
   - missed installment count
   - arrears amount
   - outstanding balance
   - recency of last payment
4. Build a collections worklist table with columns such as:
   - borrower
   - loan number
   - branch
   - loan officer
   - next due date
   - days past due
   - missed installment count
   - arrears amount
   - outstanding balance
   - last payment date
   - urgency / priority
5. Add filters for:
   - branch
   - loan officer
   - urgency band
   - delinquency severity
   - days-past-due band
6. Add a short operational summary section that highlights:
   - top delinquent balances
   - oldest unpaid loans
   - loans with repeated missed installments
7. Support CSV export and `FinancialReport` snapshot persistence with report type `delinquency_report`.

Calculation guidance:

- Derive `daysPastDue` from `nextDueDate` relative to today. If `nextDueDate` is null, do not invent a number.
- Prefer using `loanBalanceAmount` for exposure and `arrearsAmount` for collections urgency.
- Keep the urgency formula understandable and centralized in a helper so it can be tuned later.
- Do not mutate the core `LoanSummary` model just to store priority.

UI guidance:

- This screen should feel operational and sortable first, visual second.
- Make it easy for staff to scan the highest-risk rows quickly.
- Reuse status chips and money/date formatting conventions already present in the loan screens.

Acceptance criteria:

- `/reports/delinquency` produces a real prioritized collections list
- The report respects branch/institution scope
- Delinquency is based on derived portfolio fields already used elsewhere in the repo
- CSV export and snapshot save work
- The urgency formula is isolated and documented clearly enough for later tuning

At the end, summarize:

- How delinquency was defined
- How urgency was scored
- Any edge cases handled for missing due dates or missing payment dates
