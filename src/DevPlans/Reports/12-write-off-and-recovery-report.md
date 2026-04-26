# Prompt 12: Write-off and Recovery Report

Continue from the earlier reporting prompts, especially delinquency, aging, PAR, and provisions.

Your task is to implement a Write-off and Recovery Report that tracks charged-off exposure and any recoveries received after write-off.

Inspect before editing:

- Shared reporting files in `src/Screens/Reports/`
- `src/Models/Loans/loanSummaryProjection.js`
- `src/Models/Loans/loanSummaryHelpers.js`
- `src/Models/Loans/LoanStatements/statementHelpers.js`
- The earlier delinquency, aging, PAR, and provisions implementations

Repo-specific data notes:

- The portfolio status model already includes `WRITTEN_OFF`.
- `LoanSummary` includes `displayStatus`, balances, arrears, and payment recency.
- The repo does not obviously expose a dedicated recovery entity, so recovery logic may need to be inferred from valid payments posted against loans in written-off status.

Business intent:

- Measure losses already written off.
- Track any post-write-off collections/recoveries.
- Support reserve review, auditability, and management oversight.

Implement `/reports/write-off-and-recovery` with the following:

1. Summary KPIs for at least:
   - written-off loan count
   - total written-off exposure
   - recoveries collected in range
   - net write-off position after recoveries
2. A written-off loan table with columns such as:
   - borrower
   - loan number
   - branch
   - loan officer
   - write-off status / display status
   - outstanding balance
   - arrears amount
   - last payment date
   - recovery amount in selected period
3. A recovery detail table listing inferred post-write-off recoveries.
4. Branch and officer rollups for written-off exposure and recoveries.
5. CSV export and `FinancialReport` snapshot persistence using report type `write_off_and_recovery_report`.

Recovery logic guidance:

- If the repo has no separate recovery transaction type, infer recoveries as valid payments posted to loans whose effective display/lifecycle status is `WRITTEN_OFF`.
- Make that inference explicit in code and in the end summary.
- Keep recovery inference isolated in a helper so it can be replaced later if the team introduces a dedicated write-off/recovery ledger.

Write-off guidance:

- Reuse the existing `WRITTEN_OFF` display status / lifecycle handling already present in the loan summary logic.
- Prefer outstanding balance as the main write-off exposure metric unless repo logic shows a better already-computed write-off basis.

Acceptance criteria:

- `/reports/write-off-and-recovery` shows written-off exposure and recoveries in the selected period
- The implementation clearly distinguishes between inferred recoveries and true write-off state
- Branch/officer rollups work
- Export and snapshot work

At the end, summarize:

- How written-off loans were identified
- How recoveries were identified
- What the clean future improvement would be if the app later adds explicit write-off and recovery transaction models
