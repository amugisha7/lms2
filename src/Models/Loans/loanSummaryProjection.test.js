jest.mock("./LoanStatements/statementHelpers", () => ({
  buildStatementLedger: jest.fn(),
  formatBorrowerName: jest.fn(() => "Borrower"),
  formatEmployeeName: jest.fn(() => "Officer"),
}));

import {
  getBalance,
  getPrincipalBalance,
  getTotalPaid,
} from "./loanSummaryProjection";
import { buildStatementLedger } from "./LoanStatements/statementHelpers";

describe("loanSummaryProjection balance helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("prefers derived statement totals over subtracting total payments from principal", () => {
    const loan = {
      principal: 1000,
      payments: {
        items: [
          {
            id: "payment-1",
            paymentStatusEnum: "COMPLETED",
            amount: 100,
          },
        ],
      },
      derivedStatement: {
        totals: {
          totalPaymentsApplied: 100,
          totalRemaining: 960,
          remainingPrincipal: 980,
        },
      },
    };

    expect(getTotalPaid(loan)).toBe(100);
    expect(getBalance(loan)).toBe(960);
    expect(getPrincipalBalance(loan)).toBe(980);
    expect(buildStatementLedger).not.toHaveBeenCalled();
  });

  it("builds a statement fallback when computed fields are missing", () => {
    buildStatementLedger.mockReturnValue({
      totals: {
        totalPaymentsApplied: 100,
        totalRemaining: 955,
        remainingPrincipal: 970,
      },
    });

    const loan = {
      principal: 1000,
      payments: {
        items: [
          {
            id: "payment-1",
            paymentStatusEnum: "COMPLETED",
            amount: 100,
            amountAllocatedToPrincipal: 30,
            amountAllocatedToInterest: 70,
          },
        ],
      },
    };

    expect(getTotalPaid(loan)).toBe(100);
    expect(getBalance(loan)).toBe(955);
    expect(getPrincipalBalance(loan)).toBe(970);
    expect(buildStatementLedger).toHaveBeenCalled();
  });
});