import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { useReportData } from "./useReportData";
import ReportShell from "./ReportShell";
import { UserContext } from "../../App";
import { themeSettings } from "../../theme";

const mockGraphql = jest.fn();

jest.mock("aws-amplify/api", () => ({
  generateClient: jest.fn(),
}));

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

function HookHarness({ selectedBranchId = null }) {
  const { summaries, branches, loading } = useReportData({ selectedBranchId });

  return (
    <div>
      <div>summaries:{summaries.length}</div>
      <div>branches:{branches.length}</div>
      <div>loading:{loading ? "yes" : "no"}</div>
    </div>
  );
}

function renderWithUser(ui, userDetails) {
  const theme = createTheme(themeSettings("light"));

  return render(
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{ userDetails }}>{ui}</UserContext.Provider>
    </ThemeProvider>,
  );
}

const { generateClient: mockGenerateClient } = require("aws-amplify/api");
const {
  fetchAllReportLoanSummariesForBranch:
    mockFetchAllReportLoanSummariesForBranch,
} = require("./reportLoanData");

describe("reports data loading", () => {
  beforeEach(() => {
    mockGraphql.mockReset();
    mockGenerateClient.mockReset();
    mockGenerateClient.mockReturnValue({ graphql: mockGraphql });
    mockFetchAllReportLoanSummariesForBranch.mockReset();
  });

  it("loads report data for branch users using their branch scope", async () => {
    mockFetchAllReportLoanSummariesForBranch.mockResolvedValue([
      { id: "loan-1" },
    ]);

    renderWithUser(<HookHarness />, {
      userType: "LoanOfficer",
      branchUsersId: "branch-1",
    });

    await waitFor(() =>
      expect(mockFetchAllReportLoanSummariesForBranch).toHaveBeenCalledWith(
        expect.objectContaining({
          branchId: "branch-1",
          pageSize: 500,
        }),
      ),
    );

    await waitFor(() =>
      expect(screen.getByText(/summaries:\s*1/)).toBeInTheDocument(),
    );
  });

  it("does not load admin report data before a branch is selected", async () => {
    mockGraphql.mockResolvedValue({
      data: {
        listBranches: {
          items: [
            { id: "branch-1", name: "Branch 1" },
            { id: "branch-2", name: "Branch 2" },
          ],
        },
      },
    });

    renderWithUser(<HookHarness />, {
      userType: "Admin",
      institution: { id: "inst-1" },
    });

    await waitFor(() =>
      expect(screen.getByText(/branches:\s*2/)).toBeInTheDocument(),
    );

    expect(mockFetchAllReportLoanSummariesForBranch).not.toHaveBeenCalled();
    expect(screen.getByText(/summaries:\s*0/)).toBeInTheDocument();
  });

  it("loads admin report data once a branch is selected", async () => {
    mockGraphql.mockResolvedValue({
      data: {
        listBranches: {
          items: [{ id: "branch-2", name: "Branch 2" }],
        },
      },
    });
    mockFetchAllReportLoanSummariesForBranch.mockResolvedValue([
      { id: "loan-2" },
    ]);

    renderWithUser(<HookHarness selectedBranchId="branch-2" />, {
      userType: "Admin",
      institution: { id: "inst-1" },
    });

    await waitFor(() =>
      expect(mockFetchAllReportLoanSummariesForBranch).toHaveBeenCalledWith(
        expect.objectContaining({
          branchId: "branch-2",
          pageSize: 500,
        }),
      ),
    );

    await waitFor(() =>
      expect(screen.getByText(/summaries:\s*1/)).toBeInTheDocument(),
    );
  });

  it("loads admin report data automatically when the institution has one branch", async () => {
    mockGraphql.mockResolvedValue({
      data: {
        listBranches: {
          items: [{ id: "branch-9", name: "Only Branch" }],
        },
      },
    });
    mockFetchAllReportLoanSummariesForBranch.mockResolvedValue([
      { id: "loan-9" },
    ]);

    renderWithUser(<HookHarness />, {
      userType: "Admin",
      institution: { id: "inst-1" },
    });

    await waitFor(() =>
      expect(mockFetchAllReportLoanSummariesForBranch).toHaveBeenCalledWith(
        expect.objectContaining({
          branchId: "branch-9",
          pageSize: 500,
        }),
      ),
    );

    await waitFor(() =>
      expect(screen.getByText(/summaries:\s*1/)).toBeInTheDocument(),
    );
  });

  it("retries branch loading when the admin branch list is empty", async () => {
    mockGraphql
      .mockResolvedValueOnce({
        data: {
          listBranches: {
            items: [],
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          listBranches: {
            items: [{ id: "branch-2", name: "Branch 2" }],
          },
        },
      });

    renderWithUser(<HookHarness />, {
      userType: "Admin",
      institution: { id: "inst-1" },
    });

    await waitFor(() => expect(mockGraphql).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(screen.getByText(/branches:\s*1/)).toBeInTheDocument(),
    );
  });

  it("hides report controls and content until an admin selects a branch", () => {
    renderWithUser(
      <ReportShell
        title="Portfolio Overview"
        isAdmin={true}
        branches={[
          { id: "branch-1", name: "Branch 1" },
          { id: "branch-2", name: "Branch 2" },
        ]}
        selectedBranchId={null}
        onBranchChange={jest.fn()}
        startDate=""
        endDate=""
        onStartDateChange={jest.fn()}
        onEndDateChange={jest.fn()}
        onRefresh={jest.fn()}
      >
        <div>Report Body</div>
      </ReportShell>,
      null,
    );

    expect(
      screen.getByText("Please select a branch above to view report data."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Report Body")).not.toBeInTheDocument();
    expect(screen.queryByText("This Month")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Refresh" }),
    ).not.toBeInTheDocument();
  });

  it("shows date filters by default and seeds this month when report content is available", async () => {
    const handleStartDateChange = jest.fn();
    const handleEndDateChange = jest.fn();

    renderWithUser(
      <ReportShell
        title="Portfolio Overview"
        isAdmin={true}
        branches={[{ id: "branch-1", name: "Branch 1" }]}
        selectedBranchId="branch-1"
        onBranchChange={jest.fn()}
        startDate=""
        endDate=""
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onRefresh={jest.fn()}
      >
        <div>Report Body</div>
      </ReportShell>,
      null,
    );

    expect(screen.getByText("This Month")).toBeInTheDocument();
    expect(screen.getByText("Report Body")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Refresh" })).toBeInTheDocument();
    expect(screen.queryByText("Clear Date Filter")).not.toBeInTheDocument();

    await waitFor(() =>
      expect(handleStartDateChange).toHaveBeenCalledWith(
        dayjs().startOf("month").format("YYYY-MM-DD"),
      ),
    );
    await waitFor(() =>
      expect(handleEndDateChange).toHaveBeenCalledWith(
        dayjs().startOf("day").format("YYYY-MM-DD"),
      ),
    );
  });

  it("can hide date filters for reports that do not use date ranges", () => {
    const handleStartDateChange = jest.fn();
    const handleEndDateChange = jest.fn();

    renderWithUser(
      <ReportShell
        title="Portfolio Overview"
        isAdmin={false}
        branches={[]}
        selectedBranchId={null}
        onBranchChange={jest.fn()}
        startDate=""
        endDate=""
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        showDateFilters={false}
        onRefresh={jest.fn()}
      >
        <div>Report Body</div>
      </ReportShell>,
      null,
    );

    expect(screen.queryByText("This Month")).not.toBeInTheDocument();
    expect(screen.getByText("Report Body")).toBeInTheDocument();
    expect(handleStartDateChange).not.toHaveBeenCalled();
    expect(handleEndDateChange).not.toHaveBeenCalled();
  });
});
