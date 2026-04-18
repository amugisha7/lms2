# Loan Computations Testing Matrix 1.0

This document is intended for a technical tester who will create loans, generate repayment schedules, open the loan statements, export the results, and compare them against external loan calculators.

Use principal 10,000 for all cases unless noted. For percentage cases, keep the base rate at 12% per year unless otherwise stated. Run the highest-priority rows first, then move into edge cases.

## Test Instructions

1. Create the loan with the exact values listed in the matrix.
2. Generate the repayment schedule.
3. Open the loan statement view.
4. Export the statement and schedule where available.
5. Compare the output against the matching online loan calculator.
6. Record any differences in monthly payment, total interest, payoff date, installment count, and due-date ordering.
7. When a calculator does not support a specific structure such as setDays, setDates, fixed-interest, or lump sum, compare only the closest equivalent structure and note the limitation.

## Comparison Rules

- Round all monetary comparisons to 2 decimal places.
- Verify that installment dates are in chronological order.
- Verify that the last installment absorbs rounding drift and closes the balance to zero.
- For statements, verify that reversed, failed, and voided payments are excluded.
- Verify that active penalties are included and cancelled or voided penalties are ignored.
- Verify that same-day events are ordered consistently when a payment and installment share the same date.

## Recommended Online Calculators

| Calculator                                                                                        | Best use                                           | Notes                                                                 |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------- |
| [Calculator.net Loan Calculator](https://www.calculator.net/loan-calculator.html)                 | General amortized loans and deferred payment loans | Good for monthly amortization, lump sum maturity, and schedule tables |
| [Calculator.net Amortization Calculator](https://www.calculator.net/amortization-calculator.html) | Detailed amortization schedules                    | Useful for checking principal and interest split over time            |
| [Bankrate Loan Calculator](https://www.bankrate.com/loans/loan-calculator/)                       | Personal, auto, and installment loan comparisons   | Useful for payment, total interest, and payoff-date validation        |
| [Bankrate Amortization Calculator](https://www.bankrate.com/mortgages/amortization-calculator/)   | Detailed amortization schedule checks              | Useful when you want a row-by-row payment schedule                    |
| [NerdWallet Personal Loan Calculator](https://www.nerdwallet.com/calculator/loan-calculator)      | Personal loan monthly payment checks               | Includes start date and amortization schedule                         |

Recommended usage by loan type:

- Monthly, weekly, biweekly, quarterly, semiannual, and annual amortized loans should be checked against Calculator.net, Bankrate, and NerdWallet where the calculator supports the same term structure.
- Lump sum loans should be checked against Calculator.net deferred payment loan output.
- Flat-rate and fixed-interest loans should be checked against the closest amortized comparison, then validated primarily by this system’s internal statement export because many public calculators do not model those structures exactly.
- SetDays and setDates loans should be validated primarily against this system’s schedule output, with external calculators used only as a sanity check for the closest comparable periodic structure.

## Priority 1: Core repayment styles

| Priority | Loan permutation           | Start date |  Duration | Repayment            | Interest settings                                             | What to verify                                           |
| -------- | -------------------------- | ---------: | --------: | -------------------- | ------------------------------------------------------------- | -------------------------------------------------------- |
| 1        | Baseline amortized monthly | 2026-01-15 | 12 months | interval monthly     | reducing_balance_equal_installments, percentage, 12% per year | Control case; standard amortization and statement totals |
| 2        | Weekly amortized           | 2026-01-07 |   8 weeks | interval weekly      | reducing_balance_equal_installments, percentage, 12% per year | Weekly periodic rate and 8 installment rows              |
| 3        | Biweekly amortized         | 2026-01-01 |  12 weeks | interval biweekly    | reducing_balance_equal_installments, percentage, 12% per year | Every-2-week schedule and rounding behavior              |
| 4        | Quarterly amortized        | 2026-01-15 | 12 months | interval quarterly   | reducing_balance_equal_installments, percentage, 12% per year | 4 installments and quarterly conversion                  |
| 5        | Semiannual amortized       | 2026-01-15 | 24 months | interval semi_annual | reducing_balance_equal_installments, percentage, 12% per year | 4 installments across 2 years                            |
| 6        | Annual amortized           | 2026-01-15 |   3 years | interval yearly      | reducing_balance_equal_installments, percentage, 12% per year | 3 annual installments                                    |
| 7        | Daily short-term           | 2026-03-01 |   30 days | interval daily       | reducing_balance_equal_installments, percentage, 12% per year | 30 daily rows and smallest-step date math                |

## Priority 2: Interest method coverage

| Priority | Loan permutation                 | Start date |  Duration | Repayment        | Interest settings                                              | What to verify                                                                                    |
| -------- | -------------------------------- | ---------: | --------: | ---------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 8        | Flat monthly                     | 2026-01-15 | 12 months | interval monthly | flat, percentage, 12% per year                                 | Flat-rate totals vs amortized totals                                                              |
| 9        | Reducing balance equal principal | 2026-01-15 | 12 months | interval monthly | reducing_balance_equal_principal, percentage, 12% per year     | Declining total payment and fixed principal slices                                                |
| 10       | Compound equal installments      | 2026-01-15 | 12 months | interval monthly | compound_interest_equal_installments, percentage, 12% per year | Compound branch with fixed-payment behavior                                                       |
| 11       | Compound accrued                 | 2026-01-15 | 12 months | interval monthly | compound_interest_accrued, percentage, 12% per year            | Same compound math path, different label mapping                                                  |
| 12       | Interest only label              | 2026-01-15 | 12 months | interval monthly | interest_only, percentage, 12% per year                        | Mapping/presentation check; current pipeline normalizes this rather than using a separate formula |
| 13       | Per-loan interest                | 2026-01-15 |  6 months | interval monthly | reducing_balance_equal_installments, percentage, 12% per loan  | One total interest amount spread across installments                                              |
| 14       | Fixed interest per month         | 2026-01-15 | 12 months | interval monthly | flat, fixed interest amount 100 per month                      | Fixed-amount interest schedule                                                                    |
| 15       | Fixed interest per loan          | 2026-01-15 | 12 months | interval monthly | flat, fixed interest amount 1,200 per loan                     | Fixed total interest across the whole loan                                                        |
| 16       | Lump sum flat                    | 2026-01-15 | 12 months | lumpSum          | flat, percentage, 12% per year                                 | Single maturity installment                                                                       |
| 17       | Lump sum compound                | 2026-01-15 | 12 months | lumpSum          | compound_interest_accrued, percentage, 12% per year            | Bullet loan with compounding behavior                                                             |

## Priority 3: Schedule edge cases

| Priority | Loan permutation          | Start date |  Duration | Repayment                   | Interest settings                                             | What to verify                                    |
| -------- | ------------------------- | ---------: | --------: | --------------------------- | ------------------------------------------------------------- | ------------------------------------------------- |
| 18       | SetDays weekly pattern    | 2026-02-02 |  2 months | setDays Monday and Thursday | reducing_balance_equal_installments, percentage, 12% per year | Irregular weekly schedule generation              |
| 19       | SetDates monthly pattern  | 2026-01-31 |  6 months | setDates 5 and 20           | reducing_balance_equal_installments, percentage, 12% per year | Multiple dates per month and month rollover       |
| 20       | SetDates month-end stress | 2026-01-31 |  3 months | setDates 31 only            | reducing_balance_equal_installments, percentage, 12% per year | Short-month skipping when the 31st does not exist |
| 21       | Leap-day start            | 2024-02-29 | 12 months | interval monthly            | reducing_balance_equal_installments, percentage, 12% per year | Leap-year date roll-forward and maturity handling |

## Priority 4: Statement integrity checks

| Priority | Loan permutation                    | Start date |  Duration | Repayment        | Interest settings                                              | What to verify                                                                                                                                                                                                                 |
| -------- | ----------------------------------- | ---------: | --------: | ---------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 22       | Statement overlays on baseline loan | 2026-01-15 | 12 months | interval monthly | reducing_balance_equal_installments, percentage, 12% per year  | Add one valid payment, one partial payment, one reversed or failed payment, one active penalty, one voided penalty, and one same-day payment. Verify statement totals, exclusion rules, allocation order, and same-day sorting |
| 23       | Statement overlays on flat loan     | 2026-01-15 | 12 months | interval monthly | flat, percentage, 12% per year                                 | Confirm statement logic behaves the same under flat interest                                                                                                                                                                   |
| 24       | Statement overlays on compound loan | 2026-01-15 | 12 months | interval monthly | compound_interest_equal_installments, percentage, 12% per year | Confirm statement logic behaves the same under compound interest                                                                                                                                                               |

## Recommended run order

1. Run rows 1 to 7 first.
2. Run rows 8 to 17 next.
3. Run rows 18 to 21 after that.
4. Finish with rows 22 to 24 for statement validation.

## Notes

- The create-loan path routes through the servicing engine, while statement export rebuilds the ledger and applies payment and penalty filtering.
- Reversed, failed, and voided payments should be excluded from statement totals.
- Active penalties should be included; voided or cancelled penalties should not.
- The current pipeline treats interest_only as a label/presentation path rather than a separate mathematical branch.

## Results Log Template

Use one row per test run. Add extra rows if you repeat the same loan after editing payments, penalties, or schedule settings.

| Run ID | Matrix Row | Loan ID | Calculator Used | Scheduled Payment | Total Interest | Payoff Date | Installments | Statement Match | Notes | Tester |
| ------ | ---------- | ------- | --------------- | ----------------: | -------------: | ----------- | -----------: | --------------- | ----- | ------ |
| 1      | 1          |         |                 |                   |                |             |              |                 |       |        |
| 2      | 2          |         |                 |                   |                |             |              |                 |       |        |
| 3      | 3          |         |                 |                   |                |             |              |                 |       |        |

### Per-Run Checkpoints

Capture these details for every run, even if the result is a mismatch.

- Loan permutation tested.
- Exact start date and maturity date.
- Principal, interest rate, interest type, interest period, and repayment frequency.
- Schedule export result.
- Statement export result.
- External calculator result and calculator name.
- Difference in payment amount, total interest, and payoff date.
- Any rounding differences or missing installments.
- Any statement-specific issues such as excluded payments, penalty handling, or allocation order.

### Pass / Fail Guidance

- Pass: Payment, total interest, installment count, and payoff date are within expected rounding tolerance and the statement matches the generated schedule.
- Partial pass: The schedule matches but the external calculator does not support the loan structure exactly.
- Fail: Installment count, payoff date, balance reduction, or statement totals diverge materially from the expected result.
