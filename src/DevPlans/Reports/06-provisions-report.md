# Prompt 6: Provisions Report

Continue from the previous reporting prompts.

Your task is to implement a Provisions Report that estimates expected loan loss reserves for finance reporting.

Review these areas first:

- The aging analysis and PAR helpers created earlier
- Shared reporting persistence/export helpers
- `FinancialReport` snapshot storage flow

Business intent:

- Calculate reserve requirements using a documented provisioning matrix.
- Make the assumptions explicit because this repo does not appear to have a dedicated provisioning policy model yet.
- Provide a finance-ready view that can be reviewed, tuned, and saved as a report snapshot.

Implement `/reports/provisions` with the following:

1. Create a provisioning matrix that maps delinquency bands to reserve percentages.
2. Use a sensible default matrix if no institution-specific policy exists yet. Example default:
   - Current: 1%
   - 1-30 days: 5%
   - 31-60 days: 15%
   - 61-90 days: 35%
   - 91-180 days: 60%
   - 181+ days: 100%
3. Make the matrix visible on the page and editable in the UI for the current report run.
4. Calculate, per bucket:
   - loan count
   - outstanding balance
   - applied provision percentage
   - required provision amount
5. Show totals for:
   - gross outstanding balance in scope
   - total provision required
   - net portfolio after provisions
6. Add a detailed table showing each loan's bucket, exposure, rate, and provision amount.
7. Persist the report using `FinancialReport` with report type `provisions_report`, and include the exact matrix used in the saved payload.
8. Support CSV export for the detailed rows and JSON export for the full computed payload.

Implementation guidance:

- Reuse the aging bucket helper rather than re-implementing delinquency banding.
- Keep the provisioning matrix in report-layer state or config, not in the schema, unless there is already an obvious institution settings model for it.
- If you add a helper for provision calculations, make it pure and testable.
- Clearly separate exposure, provision rate, and provision amount in code so finance reviewers can audit the math.

Important constraint:

- The repo currently does not show a dedicated reserve-policy backend. Do not invent a new backend configuration model unless absolutely necessary. For this step, an editable UI matrix plus snapshot persistence is enough.

Acceptance criteria:

- `/reports/provisions` calculates bucket-level and total reserve amounts
- The matrix used for the calculation is visible and editable
- Saved snapshots include both the results and the matrix used
- The report reuses existing aging logic rather than duplicating it
- Export works

At the end, summarize:

- Default provisioning matrix used
- How provision amounts were calculated
- What would be the clean next step if the team later wants institution-specific persisted reserve policy settings
