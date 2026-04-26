# Prompt 11: Interest and Penalty Report

Continue from the earlier reporting prompts.

Your task is to implement an Interest and Penalty Report that tracks revenue attributable to loan interest and penalties.

Inspect before changing code:

- Shared reporting files in `src/Screens/Reports/`
- `src/Models/Loans/loanSummaryHelpers.js`
- `src/Models/Loans/LoanStatements/statementHelpers.js`
- Model definitions for `Payment`, `Penalty`, and any related transaction fields in `src/Models/index.d.ts`
- The loan summary backend/projection logic if needed for payment allocation semantics

Repo-specific data notes:

- Payment records expose `amountAllocatedToPrincipal`, `amountAllocatedToInterest`, `amountAllocatedToFees`, and `amountAllocatedToPenalty`.
- Penalty records exist separately and include amount, date, category/type, and penalty status.
- Existing statement/projection logic already distinguishes valid payments and active penalties.

Business intent:

- Measure interest income and penalty-related income/charges over a selected period.
- Support product profitability analysis and collections/revenue monitoring.

Implement `/reports/interest-and-penalty` with the following:

1. Summary KPIs for at least:
   - interest collected in range
   - penalty collected in range
   - penalty charged in range
   - interest-to-penalty mix
   - top products by collected interest
2. Build the report primarily from payment allocations for collected values.
3. Use penalty records for charged penalty totals and penalty metadata.
4. Add rollups by:
   - branch
   - loan product
   - loan officer
5. Add a detail table that can show both:
   - payment-level interest/penalty collections
   - penalty-record charges
6. Support CSV export and `FinancialReport` snapshot persistence using report type `interest_and_penalty_report`.

Calculation guidance:

- Exclude reversed/voided/failed payments using the same validity rules already used elsewhere in the repo.
- Exclude voided/cancelled/reversed penalties using the same active-penalty logic already present in statement/projection helpers where possible.
- Be explicit about the difference between penalties charged and penalties actually collected.
- Keep date-window logic clear: payments should use payment date; penalties should use penalty date or created date depending on actual repo usage.

Acceptance criteria:

- `/reports/interest-and-penalty` distinguishes collections from charges
- Payment validity and penalty validity rules match existing repo behavior
- Product/branch/officer rollups work
- Export and snapshot work

At the end, summarize:

- Which fields were used for collected interest and collected penalties
- Which fields were used for penalty charges
- Any assumptions made about date selection for charge timing
