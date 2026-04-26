# Reporting Prompt Sequence

Use these prompts in order, one at a time.

Recommended execution order:

1. `01-reporting-foundation.md`
2. `02-loan-portfolio-overview.md`
3. `03-delinquency-report.md`
4. `04-aging-analysis-report.md`
5. `05-par-summary-report.md`
6. `06-provisions-report.md`
7. `07-disbursement-report.md`
8. `08-loan-repayment-schedules-report.md`
9. `09-active-loans-by-officer-report.md`
10. `10-concentrations-report.md`
11. `11-interest-and-penalty-report.md`
12. `12-write-off-and-recovery-report.md`

Why this order:

- Prompt 1 creates the shared reporting shell, routing, scope handling, data loading, and `FinancialReport` snapshot persistence.
- Prompt 2 adds the broad portfolio view that later reports can reuse for summary cards and shared formatting.
- Prompts 3 and 4 build the collections-focused operational reports on top of the same loan summary dataset.
- Prompt 5 adds regulatory/risk aggregation using the aging logic already introduced.
- Prompt 6 finishes with provisioning, which depends on aging/PAR outputs and a documented reserve policy.
- Prompt 7 adds funding-outflow monitoring using existing loan approval/disbursement fields.
- Prompt 8 adds repayment schedule visibility and forecasting using the existing statement/schedule helpers.
- Prompt 9 adds officer workload and performance reporting using `loanOfficerID` and `loanOfficerDisplayName` from `LoanSummary`.
- Prompt 10 adds exposure concentration analysis by borrower, product, purpose, and available sector-like dimensions.
- Prompt 11 adds yield and charge-income reporting using payment allocations and penalty records.
- Prompt 12 adds write-off and recovery monitoring after the delinquency, aging, PAR, and provisions logic already exists.

Codebase facts the prompts assume:

- The app is a React + MUI + AWS Amplify GraphQL workspace.
- `/reports` already exists in `src/Routes.jsx` but currently points to `MainGrid`.
- Loan portfolio read models already exist in `src/Models/Loans/loanSummaryHelpers.js`, `src/Models/Loans/loanSummaryProjection.js`, and `src/Models/Loans/LoansDisplay/loanExplorerQueries.js`.
- Admin branch scoping already exists via `src/ModelAssets/AdminBranchScopeSelector.jsx` and the app-level user/institution context in `src/App.jsx`.
- A `FinancialReport` model already exists and can store report snapshots using `reportName`, `reportType`, `reportDate`, `startDate`, `endDate`, `reportData`, `status`, `branchFinancialReportsId`, and `customFinancialReportDetails`.
- The model layer also exposes `approvedDate`, `DisbursementStatus`, borrower business/employment fields, loan purpose, payment allocation fields, and penalty records that later prompts can use when `LoanSummary` alone is not enough.

Implementation guardrails for the LLM:

- Reuse `LoanSummary` data first. Do not introduce a separate report-only loan query path unless a real gap is found.
- Respect branch/institution scope. Admin users should be able to choose branch scope; branch users should remain limited to their own branch.
- Use `displayStatus`, `missedInstallmentCount`, `arrearsAmount`, `nextDueDate`, `lastPaymentDate`, `maturityDateEffective`, `principalAmount`, `amountDueAmount`, and `loanBalanceAmount` from `LoanSummary` before falling back to raw loan records.
- If a report needs dimensions not present on `LoanSummary` such as borrower business type, employment department, loan purpose detail, penalty metadata, schedule rows, or disbursement-specific status, enrich from raw loan/borrower/payment/penalty reads only for those missing dimensions.
- Prefer adding shared helpers/hooks in a `src/Screens/Reports/` folder rather than scattering reporting logic across unrelated loan screens.
- Avoid schema changes unless the report genuinely cannot be implemented with existing fields and `FinancialReport` JSON storage.
- Each prompt should leave the app in a usable state with working routes and no placeholder imports.
