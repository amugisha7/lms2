import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { themeSettings } from "../../theme";
import { UserContext } from "../../App";
import ProfitabilityReport from "./ProfitabilityReport";

const mockGraphql = jest.fn();

jest.mock("aws-amplify/api", () => ({
  generateClient: jest.fn(),
}));

jest.mock("../../graphql/queries", () => ({
  listBranches: "LIST_BRANCHES",
  expensesByBranchID: "EXPENSES_BY_BRANCH",
  otherIncomesByBranchID: "OTHER_INCOMES_BY_BRANCH",
}));

jest.mock("./reportLoanData", () => ({
  fetchAllReportLoanSummariesForBranch: jest.fn(),
}));

jest.mock("../../App", () => {
  const ReactLib = require("react");
  return {
    UserContext: ReactLib.createContext({ userDetails: null }),
  };
});

jest.mock("../../ModelAssets/AdminBranchScopeSelector", () => () => (
  <div>Branch Selector</div>
));

jest.mock("../../ModelAssets/WorkingOverlay", () => () => null);

jest.mock("../../ModelAssets/NotificationContext", () => ({
  useNotification: () => ({ showNotification: jest.fn() }),
}));

const { generateClient: mockGenerateClient } = require("aws-amplify/api");
const {
  fetchAllReportLoanSummariesForBranch:
    mockFetchAllReportLoanSummariesForBranch,
} = require("./reportLoanData");

const renderWithUser = (ui, userDetails) => {
  const theme = createTheme(themeSettings("light"));
  return render(
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{ userDetails }}>{ui}</UserContext.Provider>
    </ThemeProvider>,
  );
};

const PAYMENT_IN_RANGE_DATE = (() => {
  // Today is always inside the default "this_year" range (start of year → today).
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
})();

describe("ProfitabilityReport (Profit / Loss)", () => {
  beforeEach(() => {
    mockGraphql.mockReset();
    mockGenerateClient.mockReset();
    mockGenerateClient.mockReturnValue({ graphql: mockGraphql });
    mockFetchAllReportLoanSummariesForBranch.mockReset();
  });

  it("renders the Profit / Loss header and statement panel for a branch user", async () => {
    mockFetchAllReportLoanSummariesForBranch.mockResolvedValue([]);
    mockGraphql.mockResolvedValue({
      data: {
        expensesByBranchID: { items: [], nextToken: null },
        otherIncomesByBranchID: { items: [], nextToken: null },
      },
    });

    renderWithUser(<ProfitabilityReport />, {
      userType: "LoanOfficer",
      branchID: "branch-1",
    });

    // Both the page header and the statement panel title contain "Profit / Loss".
    await waitFor(() =>
      expect(screen.getByText(/Profit \/ Loss Statement/i)).toBeInTheDocument(),
    );

    const headings = screen.getAllByText(/Profit \/ Loss/i);
    expect(headings.length).toBeGreaterThanOrEqual(2);

    expect(screen.getByText(/Cash Basis/i)).toBeInTheDocument();
    expect(screen.getByText(/Accrual Basis/i)).toBeInTheDocument();
    expect(screen.getByText(/^Compare$/i)).toBeInTheDocument();
  });

  it("populates the Interest on Loans line from valid payment allocations", async () => {
    mockFetchAllReportLoanSummariesForBranch.mockResolvedValue([
      {
        id: "loan-1",
        reportSourcePayments: [
          {
            paymentDate: PAYMENT_IN_RANGE_DATE,
            paymentStatusEnum: "COMPLETED",
            amountAllocatedToInterest: 1234.56,
            amountAllocatedToFees: 0,
            amountAllocatedToPenalty: 0,
          },
        ],
      },
    ]);
    mockGraphql.mockResolvedValue({
      data: {
        expensesByBranchID: { items: [], nextToken: null },
        otherIncomesByBranchID: { items: [], nextToken: null },
      },
    });

    renderWithUser(<ProfitabilityReport />, {
      userType: "LoanOfficer",
      branchID: "branch-1",
    });

    await waitFor(() => {
      const row = screen.getByText("Interest on Loans").closest("tr");
      expect(row).toBeTruthy();
      expect(within(row).getByText(/1,234\.56/)).toBeInTheDocument();
    });

    // Total Revenue should reflect the same number when there's only interest.
    const totalRevenueRow = screen.getByText("Total Revenue").closest("tr");
    expect(within(totalRevenueRow).getByText(/1,234\.56/)).toBeInTheDocument();
  });
});
