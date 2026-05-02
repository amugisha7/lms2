import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useReportData } from "./useReportData";
import ReportShell from "./ReportShell";
import { UserContext } from "../../App";

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
  return render(
    <UserContext.Provider value={{ userDetails }}>{ui}</UserContext.Provider>,
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

  it("hides report content until an admin selects a branch", () => {
    render(
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
    );

    expect(
      screen.getByText("Please select a branch above to view report data."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Report Body")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Refresh" })).toBeDisabled();
  });
});
