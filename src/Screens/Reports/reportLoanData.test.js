const mockGraphql = jest.fn();

jest.mock("aws-amplify/api", () => ({
  generateClient: jest.fn(),
}));

jest.mock("../../Models/Loans/loanSummaryProjection", () => ({
  buildLoanSummaryRecord: jest.fn((loan, options = {}) => {
    if (!loan?.id || loan?.status === "DRAFT") {
      return null;
    }

    return {
      id: loan.id,
      loanID: loan.id,
      branchID: loan.branchID,
      institutionID: options.defaultInstitutionId || null,
      currencyCode: options.defaultCurrencyCode || null,
      lifecycleStatus: loan.status,
    };
  }),
  isLoanSummaryVisible: jest.fn(
    (summary) => Boolean(summary) && summary.lifecycleStatus !== "DRAFT",
  ),
}));

const { generateClient: mockGenerateClient } = require("aws-amplify/api");
const {
  fetchAllReportLoanSummariesForBranch,
  fetchReportLoanSummariesPage,
} = require("./reportLoanData");

describe("reportLoanData", () => {
  beforeEach(() => {
    mockGraphql.mockReset();
    mockGenerateClient.mockReset();
    mockGenerateClient.mockReturnValue({ graphql: mockGraphql });
  });

  it("loads report summaries from the branch loans query", async () => {
    mockGraphql.mockResolvedValueOnce({
      data: {
        loansByBranchIDAndStartDate: {
          items: [{ id: "loan-1", status: "ACTIVE", branchID: "branch-1" }],
          nextToken: null,
        },
      },
    });

    const page = await fetchReportLoanSummariesPage({
      branchId: "branch-1",
      institutionId: "inst-1",
      currencyCode: "USD",
      limit: 25,
    });

    expect(mockGraphql).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.stringContaining("loansByBranchIDAndStartDate"),
        variables: {
          branchID: "branch-1",
          sortDirection: "DESC",
          limit: 25,
          nextToken: null,
        },
      }),
    );
    expect(page).toEqual({
      items: [
        {
          id: "loan-1",
          loanID: "loan-1",
          branchID: "branch-1",
          institutionID: "inst-1",
          currencyCode: "USD",
          lifecycleStatus: "ACTIVE",
        },
      ],
      nextToken: null,
    });
  });

  it("paginates all branch report summaries", async () => {
    mockGraphql
      .mockResolvedValueOnce({
        data: {
          loansByBranchIDAndStartDate: {
            items: [{ id: "loan-1", status: "ACTIVE", branchID: "branch-1" }],
            nextToken: "token-2",
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          loansByBranchIDAndStartDate: {
            items: [{ id: "loan-2", status: "ACTIVE", branchID: "branch-1" }],
            nextToken: null,
          },
        },
      });

    const summaries = await fetchAllReportLoanSummariesForBranch({
      branchId: "branch-1",
      institutionId: "inst-1",
      currencyCode: "USD",
      pageSize: 25,
    });

    expect(summaries).toEqual([
      {
        id: "loan-1",
        loanID: "loan-1",
        branchID: "branch-1",
        institutionID: "inst-1",
        currencyCode: "USD",
        lifecycleStatus: "ACTIVE",
      },
      {
        id: "loan-2",
        loanID: "loan-2",
        branchID: "branch-1",
        institutionID: "inst-1",
        currencyCode: "USD",
        lifecycleStatus: "ACTIVE",
      },
    ]);
  });
});