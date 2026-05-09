# Prompt 13: Profitability Report

Continue from the earlier reporting prompts, especially portfolio overview, active loans by officer, concentrations, interest and penalty, and write-off and recovery.

Your task is to implement the strongest Profitability Report this codebase can support without any schema changes.

This must be a repo-native report, not a generic banking profitability mockup.

Inspect before editing:

- `src/Screens/Reports/ReportShell.jsx`
- `src/Screens/Reports/useReportData.js`
- `src/Screens/Reports/reportUtils.js`
- `src/Screens/Reports/reportLoanData.js`
- `src/Screens/Reports/reportRegistry.js`
- `src/Screens/Reports/ReportsLanding.jsx`
- `src/Screens/Dashboard/Menu.jsx`
- `src/Screens/Reports/PortfolioOverview.jsx`
- `src/Screens/Reports/InterestAndPenaltyReport.jsx`
- `src/Screens/Reports/WriteOffAndRecoveryReport.jsx`
- `src/Models/Loans/LoansDisplay/LoansDisplay.jsx`
- `src/ModelAssets/DateFilters.jsx`
- `src/Models/Loans/loanSummaryProjection.js`
- `src/Models/Loans/loanSummaryHelpers.js`
- `src/Models/Loans/LoanStatements/statementHelpers.js`
- `src/Models/index.d.ts` (`FinancialReport` and any existing accounting-related models)
- If scheduled income semantics are unclear, inspect the existing loan summary projection logic in the backend projection files before inventing new math.

Repo-specific data notes:

- The shared reports stack already exists. Reuse `ReportShell`, `useReportData`, `reportUtils`, `reportLoanData`, the existing CSV helpers, and existing `FinancialReport` snapshot persistence patterns.
- `useReportData` and `LoanSummary` already provide the correct branch/institution scope entry point, plus borrower, branch, product, officer, status, balance, arrears, maturity, and payment recency fields.
- `reportLoanData.js` already exposes raw report loan reads with `loanComputationRecord`, `fees`, `payments`, `penalties`, borrower, branch, employee, and product metadata.
- Valid payments already expose `amountAllocatedToPrincipal`, `amountAllocatedToInterest`, `amountAllocatedToFees`, and `amountAllocatedToPenalty`. Reuse the same payment-validity rules already used elsewhere in the repo.
- This repo does not obviously expose a dedicated loan profitability, FTP, servicing-cost, or PD/LGD model. Do not add one. The report must clearly separate:
  - actual realized income from existing transaction data
  - optional modeled costs and net-profit assumptions entered client-side
- Date-window behavior for report rows should stay client-side once the needed rows are loaded. Reuse `parseReportDate`, `formatReportDateKey`, and the existing date-window helpers to avoid date drift.
- Styling must be based on the existing reports shell plus the visual language of `LoansDisplay`: `sf` palette tokens, flat bordered panels, compact uppercase helper labels, square corners, dense KPI blocks, segmented filter pills, and a detail grid that feels like the loans explorer rather than a new design system.
- Reuse `DateFilters` for the date range UI. Do not create a second date filtering component.
- `@mui/x-charts` is already installed. You may use it for simple trend or composition visuals if it improves clarity, but do not add a new charting dependency.

Business intent:

- Show which loans, branches, products, and officers are generating the most realized income.
- Surface low-profit and negative-profit loans using honest calculations based on data the repo actually has.
- Support management review with trend views, ranked lists, and exportable detail rows.
- Allow optional what-if cost assumptions without persisting new backend fields or changing Amplify schema.

Implement `/reports/profitability` with the following:

1. Add a report registry entry and route for a Profitability Report.
2. Add visible navigation to the new report anywhere this repo currently enumerates report destinations. At minimum:
   - add the Profitability Report to `REPORT_REGISTRY` so it appears on the reports landing page
   - add it to any existing reports submenu or dashboard report navigation that is driven by explicit route entries, including `src/Screens/Dashboard/Menu.jsx` if that menu still lists reports individually
   - ensure the report is discoverable through normal app navigation, not only by typing `/reports/profitability`
3. Use `ReportShell` and reuse `DateFilters` through the existing reporting shell flow.
4. Match the overall styling direction of `LoansDisplay`:
   - compact KPI header blocks
   - flat filter containers with `sf` colors
   - clickable pill-style filters similar to the loans page
   - dense tabular detail presentation
   - no rounded-card dashboard redesign
5. Build the report from two clearly labeled layers:
   - `Realized income` from actual repo data
   - `Net profit proxy` from realized income minus explicit user-visible modeled costs
6. Summary KPIs must include at least:
   - loans in scope
   - outstanding principal / active exposure
   - interest collected in range
   - fees collected in range
   - penalties collected in range
   - total realized income in range
   - modeled cost total
   - net profit proxy
   - average net profit proxy per loan
7. Add a compact assumptions panel for client-side modeling only. Persist assumptions in the existing `FinancialReport` JSON payload, not the schema. Include at least:
   - origination cost per loan
   - servicing cost per active loan per month
   - funding-cost rate or capital-cost rate applied to balance exposure
   - optional credit-cost factor applied to written-off exposure, arrears, or another clearly explained existing field
8. Make every assumption editable, visible, resettable, and explicitly labeled as a modeled input rather than sourced data.
9. Add a monthly trend section for the selected date range showing at least:
   - realized income by month
   - modeled costs by month
   - net profit proxy by month
10. Add ranked rollups for at least:

- branch
- loan product
- loan officer
- display status

11. Add a loan-level detail grid with search/filter/export support. Include columns such as:
    - borrower
    - loan number
    - branch
    - loan officer
    - product
    - display status
    - date taken
    - maturity date
    - outstanding balance
    - arrears amount
    - interest collected in range
    - fees collected in range
    - penalties collected in range
    - total realized income
    - modeled cost
    - net profit proxy
    - profitability band or margin band
12. Add exception views or ranked lists for at least:
    - highest-profit loans
    - lowest-profit loans
    - negative-profit loans
    - written-off loans with negative or weak profitability
13. Support CSV export and `FinancialReport` snapshot persistence using report type `profitability_report`.
14. If a new front-end registry constant is needed for the report type, add it in the reporting module only. Do not introduce or regenerate a schema change.

Calculation guidance:

- Use `LoanSummary` as the primary report dataset for scope, identity, balances, status, arrears, maturity, and grouping dimensions.
- Use raw report loan reads only to enrich the report with payment allocations, penalties, fee data, and schedule-derived values that are not already on `LoanSummary`.
- Use the repo's existing valid-payment rules. Exclude reversed, voided, failed, or otherwise invalid payments the same way other reporting and statement code does.
- Define realized income as the sum of valid payment allocations inside the selected date range:
  - realized interest = `amountAllocatedToInterest`
  - realized fees = `amountAllocatedToFees`
  - realized penalties = `amountAllocatedToPenalty`
- If you surface contractual or scheduled income, derive it from `loanComputationRecord` or existing projection helpers. Do not invent an amortization model from scratch if the repo already has one.
- If you include an expected-total-income or remaining-income metric, label it clearly as contractual or projected, not collected.
- Use existing status normalization and display-status logic. Do not build profitability logic off ad-hoc raw status strings when a normalized display status already exists.
- For modeled funding or servicing costs, keep formulas simple, inspectable, and explainable. Prefer transparent heuristics over pseudo-precision.
- If the repo already has a usable accounting source such as journal lines or chart-of-accounts data that cleanly ties to loans without broad speculative joins, you may inspect and reuse it. Do not make first delivery depend on that path.

UI guidance:

- Keep the page visually aligned with existing reports and `LoansDisplay`, not with generic BI dashboards.
- Reuse the same tone of filters and controls already present in the repo: square outlines, compact spacing, uppercase micro-labels, `sf` palette tokens, and clickable text actions where appropriate.
- Prefer MUI DataGrid or the same style of dense report tables already used in `src/Screens/Reports/`.
- If you add charts, keep them lightweight and subordinate to the KPIs and detail tables.
- Make branch scope, date range, assumptions, and export actions obvious without pushing the detail grid below an oversized hero section.

Testing expectations:

- Add focused tests for the profitability calculation helpers.
- Add at least one component-level test covering the report's main rendered state and one test covering assumption-driven recalculation or date-window filtering.
- Keep tests narrow and aligned with the existing reports test style.

Acceptance criteria:

- `/reports/profitability` renders inside the existing reports module without schema changes
- the report is reachable from the reports landing page and any existing explicit report navigation menu used by the app
- Date filtering reuses the existing `DateFilters` pattern
- The page visually aligns with `LoansDisplay` and the shared reports shell
- The report clearly distinguishes actual realized income from modeled net-profit outputs
- Branch, product, officer, and status rollups work
- The detail grid supports search and CSV export
- `FinancialReport` snapshots work using existing JSON-capable fields only
- No hidden assumptions or invented backend fields are required for the report to function

At the end, summarize:

- which repo fields were used for realized income
- which fields or helpers were used for balances, statuses, and grouping dimensions
- which modeled assumptions were introduced and how they affect net profit proxy
- any limitations caused by missing true cost-of-funds or expense-ledger data
- the cleanest future improvement path if the product later adds explicit profitability or cost-allocation models
