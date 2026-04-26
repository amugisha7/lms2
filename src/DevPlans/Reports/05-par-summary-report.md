# Prompt 5: Portfolio at Risk (PAR) Summary

Continue from the earlier prompts, especially the aging report.

Your task is to implement a Portfolio at Risk (PAR) Summary suitable for management and regulatory-style reporting.

Inspect before changing code:

- The aging analysis helpers and screens created earlier
- Shared reporting foundation and snapshot/export helpers
- `src/DevPlans/Detailed_Development_Plan.md` note that PAR was previously intended as a dashboard metric

Business intent:

- Quantify portfolio risk at standard delinquency thresholds.
- Show absolute exposure and percentage of portfolio at risk.
- Make the result usable for executive review, branch comparisons, and compliance-style reporting.

Implement `/reports/par-summary` with the following:

1. PAR metrics for at least:
   - PAR 30
   - PAR 60
   - PAR 90
2. For each threshold, show:
   - outstanding balance at risk
   - percentage of total qualifying portfolio
   - loan count at risk
3. Add branch-level PAR comparison for admin users.
4. Add a compact trend-ready data structure in the saved snapshot payload so future periods can be compared later, even if you do not build charts now.
5. Add a supporting detail section listing the loans included in PAR 30 / 60 / 90 calculations.
6. Support CSV export and snapshot persistence with report type `portfolio_at_risk_summary`.

Calculation guidance:

- Base the calculation on the aging / days-past-due logic already introduced.
- Use outstanding balance exposure, not original principal, for the at-risk numerator unless the existing business logic strongly indicates otherwise.
- Clearly define the denominator. Prefer the total outstanding balance of the qualifying active portfolio in scope, excluding voided loans and usually excluding fully closed loans.
- Keep PAR formulas centralized in a helper so they are testable and reusable.
- If written-off loans are excluded from PAR, document that explicitly in the implementation.

Suggested output structure:

- top-level KPI cards for PAR 30 / 60 / 90 percentages
- a summary table with numerators, denominators, and counts
- admin branch comparison table
- detail table for included loans with threshold flags

Acceptance criteria:

- `/reports/par-summary` computes real PAR metrics from shared aging logic
- PAR percentages and balances are transparently derived and easy to audit
- Branch comparisons work for admins
- Snapshot payload contains enough structured data for later historical comparisons
- Export works for both summary and detail data

At the end, summarize:

- The PAR formulas used
- Which loans are excluded from denominators and why
- Which shared helpers now power both aging and PAR
