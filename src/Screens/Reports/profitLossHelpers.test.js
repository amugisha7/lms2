import {
  BASIS_MODES,
  COMPARE_MODES,
  buildPeriods,
  computeProfitLoss,
  formatPeriodLabel,
} from "./profitLossHelpers";

describe("buildPeriods", () => {
  it("returns just the primary period when compareMode is NONE", () => {
    const periods = buildPeriods({
      startDate: "2025-07-01",
      endDate: "2026-12-01",
      compareMode: COMPARE_MODES.NONE,
      comparePeriods: 2,
    });
    expect(periods).toHaveLength(1);
    expect(periods[0].key).toBe("primary");
    expect(periods[0].label).toMatch(/Jul/);
    expect(periods[0].label).toMatch(/Dec/);
  });

  it("appends prior monthly periods immediately before the primary start", () => {
    const periods = buildPeriods({
      startDate: "2025-07-01",
      endDate: "2026-12-01",
      compareMode: COMPARE_MODES.MONTHLY,
      comparePeriods: 2,
    });
    expect(periods).toHaveLength(3);

    const [, june, may] = periods;
    expect(june.from.getMonth()).toBe(5); // June
    expect(june.from.getDate()).toBe(1);
    expect(june.to.getMonth()).toBe(5);
    expect(june.to.getDate()).toBe(30);

    expect(may.from.getMonth()).toBe(4); // May
    expect(may.from.getDate()).toBe(1);
    expect(may.to.getMonth()).toBe(4);
    expect(may.to.getDate()).toBe(31);
  });

  it("appends prior yearly periods when compareMode is YEARLY", () => {
    const periods = buildPeriods({
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      compareMode: COMPARE_MODES.YEARLY,
      comparePeriods: 1,
    });
    expect(periods).toHaveLength(2);
    const prior = periods[1];
    expect(prior.from.getFullYear()).toBe(2025);
    expect(prior.from.getMonth()).toBe(0);
    expect(prior.from.getDate()).toBe(1);
    expect(prior.to.getFullYear()).toBe(2025);
    expect(prior.to.getMonth()).toBe(11);
    expect(prior.to.getDate()).toBe(31);
  });

  it("returns an empty array when given invalid dates", () => {
    expect(buildPeriods({ startDate: "", endDate: "" })).toEqual([]);
  });
});

describe("formatPeriodLabel", () => {
  it("uses ordinal day suffixes and short month names", () => {
    const from = new Date(2025, 6, 1); // 1 Jul 2025
    const to = new Date(2025, 6, 31); // 31 Jul 2025
    expect(formatPeriodLabel(from, to)).toBe("1st Jul 25 - 31st Jul 25");
  });
});

describe("computeProfitLoss", () => {
  const periods = buildPeriods({
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    compareMode: COMPARE_MODES.MONTHLY,
    comparePeriods: 1,
  });

  it("returns empty totals when periods is empty", () => {
    const result = computeProfitLoss({ periods: [] });
    expect(result.periodTotals).toEqual([]);
    expect(result.expenseCategories).toEqual([]);
  });

  it("buckets valid payment allocations by paymentDate per period", () => {
    const loanSummaries = [
      {
        reportSourcePayments: [
          {
            paymentDate: "2026-01-15",
            paymentStatusEnum: "COMPLETED",
            amountAllocatedToInterest: 1000,
            amountAllocatedToFees: 50,
            amountAllocatedToPenalty: 25,
          },
          {
            paymentDate: "2025-12-20",
            paymentStatusEnum: "COMPLETED",
            amountAllocatedToInterest: 400,
            amountAllocatedToFees: 10,
            amountAllocatedToPenalty: 0,
          },
          {
            // Excluded: reversed
            paymentDate: "2026-01-10",
            paymentStatusEnum: "REVERSED",
            amountAllocatedToInterest: 9999,
          },
        ],
      },
    ];

    const result = computeProfitLoss({ loanSummaries, periods });
    const [primary, prior] = result.periodTotals;

    expect(primary.interestOnLoans).toBe(1000);
    expect(primary.feesCollected).toBe(50);
    expect(primary.penaltiesCollected).toBe(25);
    expect(primary.revenueFromLoans).toBe(1075);
    expect(primary.totalRevenue).toBe(1075);

    expect(prior.interestOnLoans).toBe(400);
    expect(prior.revenueFromLoans).toBe(410);
  });

  it("splits taxes from operating expenses and exposes category breakdown", () => {
    const expenses = [
      { transactionDate: "2026-01-10", category: "Rent", amount: 200 },
      { transactionDate: "2026-01-12", category: "Salaries", amount: 800 },
      {
        transactionDate: "2026-01-20",
        category: "Income Tax",
        amount: 150,
      },
      { transactionDate: "2025-12-05", category: "Rent", amount: 175 },
    ];

    const result = computeProfitLoss({ expenses, periods });
    const [primary, prior] = result.periodTotals;

    expect(primary.operatingExpensesByCategory).toEqual({
      Rent: 200,
      Salaries: 800,
    });
    expect(primary.operatingExpensesTotal).toBe(1000);
    expect(primary.taxExpense).toBe(150);
    expect(primary.totalExpenses).toBe(1000);
    expect(primary.netOperatingIncome).toBe(-1000);
    expect(primary.netIncomeAfterTaxes).toBe(-1150);

    expect(prior.operatingExpensesByCategory).toEqual({ Rent: 175 });
    expect(prior.taxExpense).toBe(0);
    expect(result.expenseCategories).toEqual(["Rent", "Salaries"]);
  });

  it("adds other income to total revenue", () => {
    const otherIncomes = [
      { incomeDate: "2026-01-05", amount: 500 },
      { incomeDate: "2025-12-15", amount: 300 },
    ];
    const result = computeProfitLoss({ otherIncomes, periods });
    expect(result.periodTotals[0].otherIncome).toBe(500);
    expect(result.periodTotals[0].totalRevenue).toBe(500);
    expect(result.periodTotals[1].otherIncome).toBe(300);
  });

  it("computes net income chain end-to-end", () => {
    const loanSummaries = [
      {
        reportSourcePayments: [
          {
            paymentDate: "2026-01-15",
            paymentStatusEnum: "COMPLETED",
            amountAllocatedToInterest: 1000,
            amountAllocatedToFees: 0,
            amountAllocatedToPenalty: 0,
          },
        ],
      },
    ];
    const expenses = [
      { transactionDate: "2026-01-20", category: "Rent", amount: 200 },
      { transactionDate: "2026-01-25", category: "Income Tax", amount: 100 },
    ];
    const otherIncomes = [{ incomeDate: "2026-01-08", amount: 50 }];

    const result = computeProfitLoss({
      loanSummaries,
      expenses,
      otherIncomes,
      periods,
    });
    const primary = result.periodTotals[0];
    expect(primary.totalRevenue).toBe(1050);
    expect(primary.totalExpenses).toBe(200);
    expect(primary.netOperatingIncome).toBe(850);
    expect(primary.netIncomeBeforeTaxes).toBe(850);
    expect(primary.netIncomeAfterTaxes).toBe(750);
  });
});

describe("BASIS_MODES sanity", () => {
  it("exposes cash and accrual constants", () => {
    expect(BASIS_MODES.CASH).toBe("cash");
    expect(BASIS_MODES.ACCRUAL).toBe("accrual");
  });
});
