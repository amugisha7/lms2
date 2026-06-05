import {
  BASIS_MODES,
  COMPARE_TO,
  GROUP_BY,
  REPORT_MODES,
  buildPeriods,
  computeInterestAccrualCutoff,
  computeProfitLoss,
  formatPeriodLabel,
  isAccrualSuspendedAt,
} from "./profitLossHelpers";

// Shorthand: most tests below just want the periods array, not the truncated
// flag, so we unwrap here.
const periodsOf = (args) => buildPeriods(args).periods;

describe("buildPeriods — Standard mode", () => {
  it("returns just the primary period when compareTo is NONE", () => {
    const periods = periodsOf({
      mode: REPORT_MODES.STANDARD,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      compareTo: COMPARE_TO.NONE,
    });
    expect(periods).toHaveLength(1);
    expect(periods[0].key).toBe("primary");
    expect(periods[0].label).toMatch(/Jan/);
    expect(periods[0].label).toMatch(/Dec/);
  });

  it("appends a Previous Period column of equal length immediately before the primary", () => {
    const periods = periodsOf({
      mode: REPORT_MODES.STANDARD,
      startDate: "2026-02-01",
      endDate: "2026-02-28",
      compareTo: COMPARE_TO.PREVIOUS_PERIOD,
    });
    expect(periods).toHaveLength(2);
    const [, prior] = periods;
    // 28-day prior window ending 31-Jan-2026 → 4 Jan - 31 Jan.
    expect(prior.from.getFullYear()).toBe(2026);
    expect(prior.from.getMonth()).toBe(0);
    expect(prior.from.getDate()).toBe(4);
    expect(prior.to.getMonth()).toBe(0);
    expect(prior.to.getDate()).toBe(31);
  });

  it("appends a Previous Year column shifted -1 year", () => {
    const periods = periodsOf({
      mode: REPORT_MODES.STANDARD,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      compareTo: COMPARE_TO.PREVIOUS_YEAR,
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

  it("uses the user-picked range for a Custom comparison", () => {
    const periods = periodsOf({
      mode: REPORT_MODES.STANDARD,
      startDate: "2026-01-01",
      endDate: "2026-03-31",
      compareTo: COMPARE_TO.CUSTOM,
      compareStartDate: "2024-07-01",
      compareEndDate: "2024-09-30",
    });
    expect(periods).toHaveLength(2);
    const [, prior] = periods;
    expect(prior.from.getFullYear()).toBe(2024);
    expect(prior.from.getMonth()).toBe(6); // July
    expect(prior.to.getMonth()).toBe(8); // September
    expect(prior.to.getDate()).toBe(30);
  });

  it("silently drops the comparison column when Custom dates are missing", () => {
    const periods = periodsOf({
      mode: REPORT_MODES.STANDARD,
      startDate: "2026-01-01",
      endDate: "2026-01-31",
      compareTo: COMPARE_TO.CUSTOM,
    });
    expect(periods).toHaveLength(1);
  });

  it("returns an empty array when given invalid dates", () => {
    expect(periodsOf({ startDate: "", endDate: "" })).toEqual([]);
  });
});

describe("buildPeriods — Trend mode", () => {
  it("buckets a calendar year by month into 12 columns", () => {
    const periods = periodsOf({
      mode: REPORT_MODES.TREND,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      groupBy: GROUP_BY.MONTH,
    });
    expect(periods).toHaveLength(12);
    expect(periods[0].from.getMonth()).toBe(0);
    expect(periods[0].to.getMonth()).toBe(0);
    expect(periods[0].to.getDate()).toBe(31);
    expect(periods[11].from.getMonth()).toBe(11);
    expect(periods[11].to.getDate()).toBe(31);
  });

  it("clips first and last buckets to the date range edges", () => {
    const periods = periodsOf({
      mode: REPORT_MODES.TREND,
      startDate: "2026-01-15",
      endDate: "2026-03-10",
      groupBy: GROUP_BY.MONTH,
    });
    expect(periods).toHaveLength(3);
    expect(periods[0].from.getDate()).toBe(15);
    expect(periods[0].to.getDate()).toBe(31);
    expect(periods[2].to.getMonth()).toBe(2);
    expect(periods[2].to.getDate()).toBe(10);
  });

  it("buckets by quarter using calendar quarters", () => {
    const periods = periodsOf({
      mode: REPORT_MODES.TREND,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      groupBy: GROUP_BY.QUARTER,
    });
    expect(periods).toHaveLength(4);
    expect(periods[0].label).toBe("Q1 26");
    expect(periods[3].label).toBe("Q4 26");
  });

  it("flags truncated when the grouping exceeds the column cap", () => {
    const { periods, truncated } = buildPeriods({
      mode: REPORT_MODES.TREND,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      groupBy: GROUP_BY.DAY,
      maxColumns: 5,
    });
    expect(truncated).toBe(true);
    expect(periods).toHaveLength(5);
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
  const periods = periodsOf({
    mode: REPORT_MODES.STANDARD,
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    compareTo: COMPARE_TO.PREVIOUS_PERIOD,
  });

  it("returns empty totals when periods is empty", () => {
    const result = computeProfitLoss({ periods: [] });
    expect(result.periodTotals).toEqual([]);
    expect(result.expenseCategories).toEqual([]);
  });

  it("prefers derived payment rows (from the statement ledger) when present", () => {
    const loanSummaries = [
      {
        reportSourcePaymentRows: [
          {
            date: "2026-01-15",
            amount: 1100,
            allocPrincipal: 25,
            allocInterest: 1000,
            allocFees: 50,
            allocPenalty: 25,
          },
          {
            date: "2025-12-20",
            amount: 410,
            allocPrincipal: 0,
            allocInterest: 400,
            allocFees: 10,
            allocPenalty: 0,
          },
        ],
        reportSourcePayments: [
          {
            paymentDate: "2026-01-15",
            paymentStatusEnum: "COMPLETED",
            amountAllocatedToInterest: 999999,
          },
        ],
      },
    ];

    const result = computeProfitLoss({ loanSummaries, periods });
    const [primary, prior] = result.periodTotals;

    expect(primary.interestOnLoans).toBe(1000);
    expect(primary.feesCollected).toBe(50);
    expect(primary.penaltiesCollected).toBe(25);
    expect(prior.interestOnLoans).toBe(400);
    expect(prior.feesCollected).toBe(10);
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

  it("classifies controlled tax categories exactly (no keyword sniff needed)", () => {
    const expenses = [
      { transactionDate: "2026-01-10", category: "VAT", amount: 100 },
      { transactionDate: "2026-01-12", category: "Withholding Tax", amount: 50 },
      {
        transactionDate: "2026-01-15",
        category: "Other Tax",
        amount: 25,
      },
      {
        transactionDate: "2026-01-20",
        category: "Salaries & Wages",
        amount: 300,
      },
    ];
    const result = computeProfitLoss({ expenses, periods });
    const [primary] = result.periodTotals;
    expect(primary.taxExpense).toBe(175);
    expect(primary.operatingExpensesByCategory).toEqual({
      "Salaries & Wages": 300,
    });
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

describe("computeInterestAccrualCutoff", () => {
  const [period] = periodsOf({
    mode: REPORT_MODES.STANDARD,
    startDate: "2026-01-01",
    endDate: "2026-01-31",
  });

  it("returns period.to when no stop or write-off is set", () => {
    const cutoff = computeInterestAccrualCutoff({}, period);
    expect(cutoff?.getTime()).toBe(period.to.getTime());
  });

  it("uses write-off date when earlier than period.to", () => {
    const cutoff = computeInterestAccrualCutoff(
      { reportSourceWriteOffDate: "2026-01-15" },
      period,
    );
    expect(cutoff?.getFullYear()).toBe(2026);
    expect(cutoff?.getMonth()).toBe(0);
    expect(cutoff?.getDate()).toBe(15);
  });

  it("uses stopInterestAt when earlier than write-off and period.to", () => {
    const cutoff = computeInterestAccrualCutoff(
      {
        reportSourceWriteOffDate: "2026-01-20",
        reportSourceStopInterest: { stoppedAt: "2026-01-10" },
      },
      period,
    );
    expect(cutoff?.getDate()).toBe(10);
  });

  it("ignores stopInterestAt when resumedAt is set", () => {
    const cutoff = computeInterestAccrualCutoff(
      {
        reportSourceStopInterest: {
          stoppedAt: "2026-01-10",
          resumedAt: "2026-01-12",
        },
      },
      period,
    );
    expect(cutoff?.getTime()).toBe(period.to.getTime());
  });

  it("returns null when cutoff falls before period.from", () => {
    const cutoff = computeInterestAccrualCutoff(
      { reportSourceWriteOffDate: "2025-12-15" },
      period,
    );
    expect(cutoff).toBeNull();
  });
});

describe("isAccrualSuspendedAt", () => {
  it("is true after stoppedAt and before any resume", () => {
    const summary = {
      reportSourceStopInterest: { stoppedAt: "2026-01-10" },
    };
    expect(isAccrualSuspendedAt(summary, "2026-01-15")).toBe(true);
    expect(isAccrualSuspendedAt(summary, "2026-01-05")).toBe(false);
  });

  it("is false again after resumedAt", () => {
    const summary = {
      reportSourceStopInterest: {
        stoppedAt: "2026-01-10",
        resumedAt: "2026-01-20",
      },
    };
    expect(isAccrualSuspendedAt(summary, "2026-01-15")).toBe(true);
    expect(isAccrualSuspendedAt(summary, "2026-01-25")).toBe(false);
  });
});

describe("computeProfitLoss — accrual basis", () => {
  const periods = periodsOf({
    mode: REPORT_MODES.STANDARD,
    startDate: "2026-01-01",
    endDate: "2026-01-31",
  });

  it("recognizes interest from schedule installments due in the period", () => {
    const loanSummaries = [
      {
        reportSourceScheduleRows: [
          { dueDate: "2026-01-15", interestDue: 200, feesDue: 0, penaltyDue: 0 },
          { dueDate: "2026-02-15", interestDue: 200, feesDue: 0, penaltyDue: 0 },
        ],
      },
    ];
    const result = computeProfitLoss({
      loanSummaries,
      periods,
      basis: BASIS_MODES.ACCRUAL,
    });
    expect(result.periodTotals[0].interestOnLoans).toBe(200);
  });

  it("stops accruing interest after the write-off event date", () => {
    const loanSummaries = [
      {
        reportSourceWriteOffDate: "2026-01-20",
        reportSourceScheduleRows: [
          { dueDate: "2026-01-15", interestDue: 100 },
          { dueDate: "2026-01-25", interestDue: 100 },
        ],
      },
    ];
    const result = computeProfitLoss({
      loanSummaries,
      periods,
      basis: BASIS_MODES.ACCRUAL,
    });
    expect(result.periodTotals[0].interestOnLoans).toBe(100);
  });

  it("stops accruing interest after a manual Stop Interest date", () => {
    const loanSummaries = [
      {
        reportSourceStopInterest: { stoppedAt: "2026-01-12" },
        reportSourceScheduleRows: [
          { dueDate: "2026-01-10", interestDue: 75 },
          { dueDate: "2026-01-20", interestDue: 75 },
        ],
      },
    ];
    const result = computeProfitLoss({
      loanSummaries,
      periods,
      basis: BASIS_MODES.ACCRUAL,
    });
    expect(result.periodTotals[0].interestOnLoans).toBe(75);
  });

  it("recognizes ad-hoc Penalty records by penaltyDate (excludes voided)", () => {
    const loanSummaries = [
      {
        reportSourcePenalties: [
          { penaltyDate: "2026-01-12", amount: 50, penaltyStatus: "ACTIVE" },
          { penaltyDate: "2026-01-18", amount: 30, penaltyStatus: "VOIDED" },
        ],
      },
    ];
    const result = computeProfitLoss({
      loanSummaries,
      periods,
      basis: BASIS_MODES.ACCRUAL,
    });
    expect(result.periodTotals[0].penaltiesCollected).toBe(50);
  });

  it("recognizes LoanFees by loanFeesDate", () => {
    const loanSummaries = [
      {
        reportSourceLoanFees: [
          { loanFeesDate: "2026-01-05", amount: 25 },
          { loanFeesDate: "2026-01-25", amount: 75 },
          { loanFeesDate: "2025-12-30", amount: 999 },
        ],
      },
    ];
    const result = computeProfitLoss({
      loanSummaries,
      periods,
      basis: BASIS_MODES.ACCRUAL,
    });
    expect(result.periodTotals[0].feesCollected).toBe(100);
  });
});
