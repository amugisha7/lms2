/**
 * profitabilityHelpers.test.js
 *
 * Unit tests for the pure calculation helpers used by the Profitability Report.
 */

import {
  DEFAULT_ASSUMPTIONS,
  monthsInRange,
  computeLoanRealizedIncome,
  computeLoanModeledCost,
  profitabilityBand,
  buildMonthlyTrend,
  buildRollup,
} from "./profitabilityHelpers";

// ---------------------------------------------------------------------------
// monthsInRange
// ---------------------------------------------------------------------------
describe("monthsInRange", () => {
  it("returns 1 for same-month dates", () => {
    expect(monthsInRange("2026-03-01", "2026-03-31")).toBe(1);
  });

  it("returns the correct count spanning multiple months", () => {
    expect(monthsInRange("2026-01-01", "2026-03-31")).toBe(3);
  });

  it("returns 1 when dates are null", () => {
    expect(monthsInRange(null, null)).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// computeLoanRealizedIncome
// ---------------------------------------------------------------------------
describe("computeLoanRealizedIncome", () => {
  const makePayment = (overrides) => ({
    id: "p1",
    paymentDate: "2026-03-15",
    status: "COMPLETED",
    paymentStatusEnum: "COMPLETED",
    amountAllocatedToInterest: 100,
    amountAllocatedToFees: 20,
    amountAllocatedToPenalty: 5,
    ...overrides,
  });

  it("sums allocations for valid payments within the window", () => {
    const payments = [makePayment()];
    const result = computeLoanRealizedIncome(payments, "2026-03-01", "2026-03-31");
    expect(result.interest).toBe(100);
    expect(result.fees).toBe(20);
    expect(result.penalties).toBe(5);
    expect(result.total).toBe(125);
  });

  it("excludes reversed payments", () => {
    const payments = [
      makePayment({ paymentStatusEnum: "REVERSED" }),
    ];
    const result = computeLoanRealizedIncome(payments, "2026-03-01", "2026-03-31");
    expect(result.total).toBe(0);
  });

  it("excludes payments outside the date window", () => {
    const payments = [makePayment({ paymentDate: "2026-04-10" })];
    const result = computeLoanRealizedIncome(payments, "2026-03-01", "2026-03-31");
    expect(result.total).toBe(0);
  });

  it("returns zero totals for an empty payment list", () => {
    const result = computeLoanRealizedIncome([], "2026-03-01", "2026-03-31");
    expect(result.interest).toBe(0);
    expect(result.fees).toBe(0);
    expect(result.penalties).toBe(0);
    expect(result.total).toBe(0);
  });

  it("includes paymentRows for matched payments", () => {
    const payments = [makePayment()];
    const result = computeLoanRealizedIncome(payments, "2026-03-01", "2026-03-31");
    expect(result.paymentRows).toHaveLength(1);
    expect(result.paymentRows[0].interest).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// computeLoanModeledCost
// ---------------------------------------------------------------------------
describe("computeLoanModeledCost", () => {
  const loanRow = { loanBalanceAmount: 10000, arrearsAmount: 500 };

  it("returns zero costs for all-zero assumptions", () => {
    const cost = computeLoanModeledCost(loanRow, DEFAULT_ASSUMPTIONS, "2026-01-01", "2026-01-31");
    expect(cost.total).toBe(0);
  });

  it("applies origination cost as a flat amount", () => {
    const cost = computeLoanModeledCost(
      loanRow,
      { ...DEFAULT_ASSUMPTIONS, originationCostPerLoan: 200 },
      "2026-01-01",
      "2026-01-31",
    );
    expect(cost.origination).toBe(200);
  });

  it("multiplies servicing cost by the number of months", () => {
    const cost = computeLoanModeledCost(
      loanRow,
      { ...DEFAULT_ASSUMPTIONS, servicingCostPerLoanPerMonth: 50 },
      "2026-01-01",
      "2026-03-31", // 3 months
    );
    expect(cost.servicing).toBe(150);
  });

  it("applies funding cost as an annualised rate on the balance", () => {
    const cost = computeLoanModeledCost(
      loanRow,
      { ...DEFAULT_ASSUMPTIONS, fundingCostRatePct: 12 },
      "2026-01-01",
      "2026-06-30", // 6 months = 0.5 year
    );
    // 12% × 10000 × 0.5 = 600
    expect(cost.funding).toBeCloseTo(600, 1);
  });

  it("applies credit cost as a percentage of arrears", () => {
    const cost = computeLoanModeledCost(
      loanRow,
      { ...DEFAULT_ASSUMPTIONS, creditCostFactorPct: 10 },
      "2026-01-01",
      "2026-01-31",
    );
    // 10% × 500 = 50
    expect(cost.credit).toBe(50);
  });
});

// ---------------------------------------------------------------------------
// profitabilityBand
// ---------------------------------------------------------------------------
describe("profitabilityBand", () => {
  it("returns Negative for negative net profit", () => {
    expect(profitabilityBand(-100, 500)).toBe("Negative");
  });

  it("returns No Income when realized income is zero", () => {
    expect(profitabilityBand(0, 0)).toBe("No Income");
  });

  it("returns High for >= 70% margin", () => {
    expect(profitabilityBand(700, 1000)).toBe("High");
  });

  it("returns Medium for 40–69% margin", () => {
    expect(profitabilityBand(400, 1000)).toBe("Medium");
  });

  it("returns Low for 10–39% margin", () => {
    expect(profitabilityBand(100, 1000)).toBe("Low");
  });

  it("returns Marginal for 0–9% margin", () => {
    expect(profitabilityBand(50, 1000)).toBe("Marginal");
  });
});

// ---------------------------------------------------------------------------
// buildMonthlyTrend
// ---------------------------------------------------------------------------
describe("buildMonthlyTrend", () => {
  const makeLoanRow = (paymentRows) => ({
    paymentRows,
    modeledCost: 30,
  });

  it("returns an entry for each month in the range", () => {
    const rows = [
      makeLoanRow([{ paymentDate: "2026-01-15", interest: 100, fees: 10, penalties: 0 }]),
    ];
    const trend = buildMonthlyTrend(rows, "2026-01-01", "2026-03-31");
    expect(trend.map((r) => r.month)).toEqual(["2026-01", "2026-02", "2026-03"]);
  });

  it("aggregates realized income from all payment rows in the same month", () => {
    const rows = [
      makeLoanRow([
        { paymentDate: "2026-02-10", interest: 50, fees: 5, penalties: 0 },
        { paymentDate: "2026-02-20", interest: 50, fees: 5, penalties: 0 },
      ]),
    ];
    const trend = buildMonthlyTrend(rows, "2026-02-01", "2026-02-28");
    expect(trend[0].realizedIncome).toBe(110);
  });

  it("distributes modeled costs evenly across months", () => {
    const rows = [makeLoanRow([])]; // 30 modeled cost, no payments
    const trend = buildMonthlyTrend(rows, "2026-01-01", "2026-03-31");
    // 30 cost across 3 months = 10 each
    trend.forEach((m) => expect(m.modeledCost).toBeCloseTo(10, 5));
  });
});

// ---------------------------------------------------------------------------
// buildRollup
// ---------------------------------------------------------------------------
describe("buildRollup", () => {
  const loanRows = [
    {
      loanProductName: "Micro",
      loanBalanceAmount: 5000,
      interestCollected: 200,
      feesCollected: 50,
      penaltiesCollected: 10,
      realizedIncome: 260,
      modeledCost: 100,
      netProfit: 160,
    },
    {
      loanProductName: "SME",
      loanBalanceAmount: 20000,
      interestCollected: 800,
      feesCollected: 100,
      penaltiesCollected: 0,
      realizedIncome: 900,
      modeledCost: 200,
      netProfit: 700,
    },
    {
      loanProductName: "Micro",
      loanBalanceAmount: 3000,
      interestCollected: 100,
      feesCollected: 20,
      penaltiesCollected: 5,
      realizedIncome: 125,
      modeledCost: 80,
      netProfit: 45,
    },
  ];

  it("groups loans by the key function", () => {
    const rollup = buildRollup(loanRows, (r) => r.loanProductName, "product");
    expect(rollup).toHaveLength(2);
    const micro = rollup.find((r) => r.product === "Micro");
    expect(micro.loanCount).toBe(2);
  });

  it("sums numeric fields correctly", () => {
    const rollup = buildRollup(loanRows, (r) => r.loanProductName, "product");
    const micro = rollup.find((r) => r.product === "Micro");
    expect(micro.realizedIncome).toBe(385);
    expect(micro.netProfit).toBe(205);
  });

  it("sorts descending by netProfit", () => {
    const rollup = buildRollup(loanRows, (r) => r.loanProductName, "product");
    expect(rollup[0].product).toBe("SME"); // 700 > 205
  });
});
