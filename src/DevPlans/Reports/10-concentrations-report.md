# Prompt 10: Concentrations Report

Continue from the earlier reporting prompts.

Your task is to implement a Concentrations Report that detects excessive exposure to single borrowers, products, purposes, and available sector-like segments.

Inspect before editing:

- Shared reporting files in `src/Screens/Reports/`
- `src/Models/Loans/loanSummaryHelpers.js`
- `src/Models/index.d.ts` for borrower and loan fields
- Any earlier report helpers for branch rollups and portfolio totals

Repo-specific data notes:

- `LoanSummary` provides exposure values and core grouping fields such as borrower, branch, loan officer, loan product, and purpose-related fields from source loans.
- Borrower/business segmentation fields exist in the model layer, including fields like `businessName`, `typeOfBusiness`, `employmentDepartment`, and `employerName`.
- There does not appear to be one canonical `sector` field on `LoanSummary`, so this report may enrich with borrower/raw loan data only where classification dimensions are missing.

Business intent:

- Identify concentration risk by single borrower and by portfolio segment.
- Support internal risk management and oversight of excessive exposure clusters.

Implement `/reports/concentrations` with the following:

1. Concentration KPIs for at least:
   - largest single-borrower exposure
   - top 5 borrower share of total outstanding portfolio
   - largest product concentration share
   - largest purpose/sector concentration share
2. Ranking tables for:
   - top borrowers by outstanding balance
   - top loan products by outstanding balance
   - top loan purposes by outstanding balance
   - top sector-like categories by outstanding balance
3. For sector-like grouping, use this fallback order unless actual code inspection reveals a better canonical field:
   - borrower `typeOfBusiness`
   - borrower `employmentDepartment`
   - borrower `employerName`
   - loan `loanPurpose`
   - otherwise `Unclassified`
4. Show counts, balances, and percentage of total portfolio for each concentration group.
5. Add a detail drill-down view for the selected concentration group.
6. CSV export and `FinancialReport` snapshot persistence using report type `concentrations_report`.

Calculation guidance:

- Use outstanding balance as the main exposure metric unless another exposure basis is clearly required for a specific breakdown.
- Reuse `LoanSummary` for balances and statuses.
- Enrich from borrower/raw loan records only for segmentation fields missing from the summary projection.
- Keep concentration grouping helpers centralized and auditable.

Acceptance criteria:

- `/reports/concentrations` identifies top borrower and segment concentrations
- The report makes its segmentation fallback logic explicit in code and summary output
- Portfolio share percentages are internally consistent
- Export and snapshot work

At the end, summarize:

- Which dimensions were supported
- What fallback order was used for sector-like grouping
- Whether any raw loan/borrower enrichment was needed beyond `LoanSummary`
