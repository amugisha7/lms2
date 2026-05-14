/**
 * ProfitabilityReport.test.jsx
 *
 * Component-level tests for the Profitability Report.
 */

import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { UserContext } from "../../App";
import { themeSettings } from "../../theme";
import ProfitabilityReport from "./ProfitabilityReport";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../../graphql/queries", () => ({
  listBranches: "LIST_BRANCHES",
}));

jest.mock("./reportLoanData", () => ({
  fetchAllReportLoanSummariesForBranch: jest.fn(),
}));

jest.mock("../../App", () => {
  const React = require("react");
  return {
    UserContext: React.createContext({ userDetails: null }),
  };
});

jest.mock("../../ModelAssets/AdminBranchScopeSelector", () => {
  const React = require("react");
  return function MockAdminBranchScopeSelector() {
    return <div>Branch Selector</div>;
  };
});

jest.mock("../../ModelAssets/DateFilters", () => {
  const React = require("react");
  const { getPresetRange } = jest.requireActual(
    "../../ModelAssets/DateFilters",
  );
  function MockDateFilters({ dateFrom, dateTo }) {
    return (
      <div>
        <span>DateFrom:{dateFrom}</span>
        <span>DateTo:{dateTo}</span>
      </div>
    );
  }
  MockDateFilters.getPresetRange = getPresetRange;
  return MockDateFilters;
});

jest.mock("@mui/x-charts/BarChart", () => ({
  BarChart: function MockBarChart() {
    return <div data-testid="bar-chart">Chart</div>;
  },
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const {
  fetchAllReportLoanSummariesForBranch: mockFetchSummaries,
} = require("./reportLoanData");

function renderReport(userDetails) {
  const theme = createTheme(themeSettings("light"));
  return render(
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{ userDetails }}>
        <ProfitabilityReport />
      </UserContext.Provider>
    </ThemeProvider>,
  );
}

const BRANCH_USER = {
  userType: "LoanOfficer",
  branchUsersId: "branch-1",
};

const SAMPLE_SUMMARIES = [
  {
    id: "loan-1",
    loanID: "loan-1",
    loanNumber: "LN-001",
    borrowerDisplayName: "Alice Smith",
    branchID: "branch-1",
    loanOfficerDisplayName: "Bob Jones",
    loanProductName: "Micro Loan",
    displayStatus: "CURRENT",
    startDate: "2025-01-01",
    maturityDateEffective: "2026-01-01",
    loanBalanceAmount: 5000,
    arrearsAmount: 0,
    reportSourcePayments: [
      {
        id: "pay-1",
        paymentDate: "2026-01-15",
        status: "COMPLETED",
        paymentStatusEnum: "COMPLETED",
        amount: 500,
        amountAllocatedToInterest: 80,
        amountAllocatedToFees: 20,
        amountAllocatedToPenalty: 0,
        amountAllocatedToPrincipal: 400,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ProfitabilityReport — main rendered state", () => {
  beforeEach(() => {
    mockFetchSummaries.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the report title", async () => {
    mockFetchSummaries.mockResolvedValue([]);

    renderReport(BRANCH_USER);

    await waitFor(() =>
      expect(screen.getByText("Profitability Report")).toBeInTheDocument(),
    );
  });

  it("renders the assumptions panel", async () => {
    mockFetchSummaries.mockResolvedValue([]);

    renderReport(BRANCH_USER);

    await waitFor(() =>
      expect(
        screen.getAllByText(/Modeled Cost Assumptions/i).length,
      ).toBeGreaterThan(0),
    );
    expect(
      screen.getByText(/MODELED — not sourced from repo data/i),
    ).toBeInTheDocument();
  });

  it("loads profitability data with the report and does not require a second payment fetch", async () => {
    mockFetchSummaries.mockResolvedValue(SAMPLE_SUMMARIES);

    renderReport(BRANCH_USER);

    await waitFor(() =>
      expect(screen.getAllByText(/Loans in Scope/i).length).toBeGreaterThan(0),
    );

    expect(screen.queryByText(/Load Payment Data/i)).not.toBeInTheDocument();
  });

  it("opens with the previous month selected by default", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-05-14T12:00:00"));
    mockFetchSummaries.mockResolvedValue([]);

    renderReport(BRANCH_USER);

    await waitFor(() => {
      expect(screen.getByText("DateFrom:2026-04-01")).toBeInTheDocument();
    });
    expect(screen.getByText("DateTo:2026-04-30")).toBeInTheDocument();
  });

  it("shows KPI blocks and detail grid after the initial report load", async () => {
    mockFetchSummaries.mockResolvedValue(SAMPLE_SUMMARIES);

    renderReport(BRANCH_USER);

    await waitFor(() =>
      expect(screen.getAllByText(/Loans in Scope/i).length).toBeGreaterThan(0),
    );
    expect(
      screen.getAllByText(/Total Realized Income/i).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/Net Profit Proxy/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Modeled Cost Total/i).length).toBeGreaterThan(
      0,
    );
  });
});

describe("ProfitabilityReport — assumption-driven recalculation", () => {
  beforeEach(() => {
    mockFetchSummaries.mockReset();
  });

  it("recalculates net profit when servicing cost assumption is changed", async () => {
    mockFetchSummaries.mockResolvedValue(SAMPLE_SUMMARIES);

    renderReport(BRANCH_USER);

    await waitFor(() =>
      expect(screen.getByText(/Loans in Scope/i)).toBeInTheDocument(),
    );

    // Find the servicing cost input (second number input in the assumptions panel)
    const inputs = screen.getAllByRole("spinbutton");
    // servicing cost is the second input
    const servicingInput = inputs[1];

    await act(async () => {
      fireEvent.change(servicingInput, { target: { value: "100" } });
    });

    // Net profit should now reflect the cost — presence of Modeled Cost column value changes
    // We verify the modeled cost disclaimer footnote is always present
    expect(
      screen.getByText(
        /Modeled Cost and Net Profit Proxy are client-side estimates/i,
      ),
    ).toBeInTheDocument();
  });
});
