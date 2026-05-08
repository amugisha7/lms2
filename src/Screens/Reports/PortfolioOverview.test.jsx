import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import PortfolioOverview from "./PortfolioOverview";
import { UserContext } from "../../App";
import { themeSettings } from "../../theme";
import { useReportData } from "./useReportData";
import { useSnapshotPersistence } from "./useSnapshotPersistence";

const mockReportShell = jest.fn(({ children }) => <div>{children}</div>);

jest.mock("./ReportShell", () => ({
  __esModule: true,
  default: (props) => mockReportShell(props),
}));

jest.mock("./useReportData", () => ({
  useReportData: jest.fn(),
}));

jest.mock("./useSnapshotPersistence", () => ({
  useSnapshotPersistence: jest.fn(),
}));

jest.mock("../../App", () => {
  const React = require("react");
  return {
    UserContext: React.createContext({ userDetails: null }),
  };
});

function renderWithProviders(ui, userDetails) {
  const theme = createTheme(themeSettings("light"));

  return render(
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{ userDetails }}>{ui}</UserContext.Provider>
    </ThemeProvider>,
  );
}

describe("PortfolioOverview", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2026-05-03T00:00:00Z"));
    mockReportShell.mockClear();

    useSnapshotPersistence.mockReturnValue({
      saveSnapshot: jest.fn(),
      saving: false,
      lastSavedAt: null,
      saveError: null,
    });

    useReportData.mockReturnValue({
      summaries: [
        {
          id: "loan-1",
          borrowerDisplayName: "Alpha Traders",
          loanNumber: "L-100",
          branchID: "branch-1",
          loanOfficerID: "officer-1",
          loanOfficerDisplayName: "Ann Doe",
          loanProductID: "product-auto",
          loanProductName: "Auto",
          principalAmount: 1200,
          loanBalanceAmount: 900,
          arrearsAmount: 120,
          totalPaidAmount: 300,
          missedInstallmentCount: 1,
          nextDueDate: "2026-03-20",
          lastPaymentDate: "2026-03-25",
          startDate: "2026-01-12",
          displayStatus: "CURRENT_WITH_MISSED_PAYMENT",
          displayStatusRank: 20,
        },
        {
          id: "loan-2",
          borrowerDisplayName: "Baker Foods",
          loanNumber: "L-101",
          branchID: "branch-1",
          loanOfficerID: "officer-2",
          loanOfficerDisplayName: "Ben Cole",
          loanProductID: "product-mortgage",
          loanProductName: "Mortgage",
          principalAmount: 700,
          loanBalanceAmount: 500,
          arrearsAmount: 0,
          totalPaidAmount: 200,
          missedInstallmentCount: 0,
          nextDueDate: "2026-05-06",
          lastPaymentDate: "2026-04-20",
          startDate: "2026-02-01",
          displayStatus: "CURRENT",
          displayStatusRank: 10,
        },
        {
          id: "loan-3",
          borrowerDisplayName: "Central Works",
          loanNumber: "L-102",
          branchID: "branch-2",
          loanOfficerID: "officer-2",
          loanOfficerDisplayName: "Ben Cole",
          loanProductID: "product-auto",
          loanProductName: "Auto",
          principalAmount: 950,
          loanBalanceAmount: 600,
          arrearsAmount: 200,
          totalPaidAmount: 100,
          missedInstallmentCount: 2,
          nextDueDate: "2026-01-15",
          lastPaymentDate: null,
          startDate: "2025-11-10",
          displayStatus: "OVERDUE",
          displayStatusRank: 30,
        },
        {
          id: "loan-4",
          borrowerDisplayName: "Dormant Account",
          loanNumber: "L-103",
          branchID: "branch-2",
          loanOfficerID: "officer-3",
          loanOfficerDisplayName: "Cara Dunn",
          loanProductID: "product-sme",
          loanProductName: "SME",
          principalAmount: 400,
          loanBalanceAmount: 0,
          arrearsAmount: 0,
          totalPaidAmount: 400,
          missedInstallmentCount: 0,
          nextDueDate: null,
          lastPaymentDate: "2026-03-01",
          startDate: "2025-07-01",
          displayStatus: "CLOSED",
          displayStatusRank: 40,
        },
      ],
      branches: [
        { id: "branch-1", name: "North Branch" },
        { id: "branch-2", name: "South Branch" },
      ],
      loading: false,
      error: null,
      refresh: jest.fn(),
      scope: { isAdmin: true, branchId: null },
      lastFetchedAt: null,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders multidimensional concentration and aging insights from loan summaries", () => {
    renderWithProviders(<PortfolioOverview />, {
      userType: "Admin",
      institution: { currencyCode: "USD" },
    });

    expect(mockReportShell.mock.calls[0][0]).toEqual(
      expect.objectContaining({ showDateFilters: true }),
    );

    expect(screen.getByText("Concentration Snapshot")).toBeInTheDocument();
    expect(screen.getByText("Portfolio Risk Highlights")).toBeInTheDocument();
    expect(screen.getByText("Aging and Delinquency")).toBeInTheDocument();
    expect(screen.getByText("31-60 Days")).toBeInTheDocument();
    expect(screen.getByText("90+ Days")).toBeInTheDocument();
    expect(screen.getByText("High Arrears (2)")).toBeInTheDocument();
    expect(screen.getByText("70% of outstanding balance")).toBeInTheDocument();
    expect(screen.getByText("55% of outstanding balance")).toBeInTheDocument();
    expect(screen.getByText("75% of outstanding balance")).toBeInTheDocument();
    expect(screen.getByText("North Branch")).toBeInTheDocument();
    expect(screen.getByText("Ben Cole")).toBeInTheDocument();
    expect(screen.getAllByText("Auto").length).toBeGreaterThan(0);
  });
});