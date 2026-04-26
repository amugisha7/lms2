# Prompt 1: Reporting Foundation

You are working inside an existing React + MUI + AWS Amplify loan management system.

Your task is to build the shared reporting foundation that all later loan portfolio reports will use.

Important existing code to inspect before editing:

- `src/Routes.jsx`
- `src/App.jsx`
- `src/Screens/Dashboard/Menu.jsx`
- `src/Screens/Dashboard/Dashboard.jsx`
- `src/ModelAssets/AdminBranchScopeSelector.jsx`
- `src/Models/Loans/loanSummaryHelpers.js`
- `src/Models/Loans/loanSummaryProjection.js`
- `src/Models/Loans/LoansDisplay/loanExplorerQueries.js`
- `src/Models/index.d.ts` (`FinancialReport` type)
- `src/graphql/queries.js`
- `src/graphql/mutations.js`

What already exists in this repo:

- `/reports` route exists but points to `MainGrid`.
- `LoanSummary` already provides scoped, derived portfolio fields such as `principalAmount`, `totalPaidAmount`, `amountDueAmount`, `loanBalanceAmount`, `arrearsAmount`, `missedInstallmentCount`, `nextDueDate`, `lastPaymentDate`, `maturityDateEffective`, `displayStatus`, `institutionID`, and `branchID`.
- Admin branch selection patterns already exist in the loans explorer flow.
- `FinancialReport` already exists and can persist JSON snapshots.

Implement the following:

1. Create a new reporting module under `src/Screens/Reports/`.
2. Replace the placeholder `/reports` route with a real reports landing page.
3. Add child routes for these report pages, even if some are placeholders for now:
   - `/reports/portfolio-overview`
   - `/reports/delinquency`
   - `/reports/aging-analysis`
   - `/reports/par-summary`
   - `/reports/provisions`
4. Build a shared reporting layout/page shell that includes:
   - Page title and summary text
   - Date range controls (`startDate`, `endDate`)
   - Admin branch selector using the existing branch selector component and app/user scope patterns
   - Refresh action
   - Export-ready state hook (can initially support JSON and CSV helpers)
   - Snapshot save helper that writes into `FinancialReport`
5. Create reusable reporting helpers/hooks instead of putting data logic directly in page components. At minimum create shared utilities for:
   - Resolving active institution/branch scope from `UserContext`
   - Fetching all relevant `LoanSummary` rows for the active scope using pagination
   - Filtering summaries by report date window
   - Saving/loading `FinancialReport` snapshots for a specific report type
6. Create a reports landing page with cards/links for all five reports. Each card should show a short business description and navigate to the report page.
7. Add only the minimum navigation updates needed so the reports area is reachable from the existing dashboard flow. Reuse the existing `Reports` menu concept instead of inventing a second menu system.

Implementation guidance:

- Prefer `LoanSummary` reads rather than raw `Loan` reads.
- Reuse the branch/institution scoping strategy already used by the loans explorer. Admin users should be able to work institution-wide or by branch; non-admin users should be restricted to their branch.
- Use `FinancialReport.reportData` and `FinancialReport.customFinancialReportDetails` to store structured JSON metadata and generation parameters. Do not add a schema change just for report snapshots.
- Keep the UI visually consistent with existing dashboard screens and MUI usage.
- If you need a report registry/config object, create one so later report pages can share labels, route names, and report type identifiers.

Deliverables:

- New `src/Screens/Reports/` foundation files
- Updated routes
- Updated navigation entry points if required
- Working `/reports` landing page and placeholder child pages that all render inside the dashboard shell
- Shared hooks/helpers for scope, loan summary loading, and snapshot persistence

Acceptance criteria:

- `/reports` no longer points to `MainGrid`
- All five report routes render without crashing
- Admin branch selection is supported in the reports module
- Report snapshots can be saved to `FinancialReport` with a report type and JSON payload
- The code is organized so later prompts can add report-specific metrics without rewriting shared plumbing

At the end, summarize:

- Files created/updated
- Shared abstractions added
- Any assumptions made about admin scope or snapshot storage
