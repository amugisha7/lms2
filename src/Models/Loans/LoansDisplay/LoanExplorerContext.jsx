import React from "react";
import { generateClient } from "aws-amplify/api";
import { listBranches } from "../../../graphql/queries";
import { useSnackbar } from "../../../ModelAssets/SnackbarContext";
import {
  LOAN_SUMMARY_SYNCED_EVENT,
  backfillLoanSummariesForScope,
  fetchAllLoanSummariesForScope,
  fetchLoanSummaryById,
  syncLoanSummaryByLoanId,
} from "../loanSummaryHelpers";
import {
  fetchExplorerPage,
  mapLoanSummaryToExplorerRow,
  sortExplorerRows,
} from "./loanExplorerQueries";

const LOAN_EXPLORER_DEFAULTS = {
  loans: [],
  allSummaries: [],
  allSummariesLoaded: false,
  branches: [],
  branchesLoading: false,
  statusFilter: null,
  searchTerm: "",
  selectedBranchFilter: [],
  currentPage: 0,
  nextToken: null,
  prevTokens: [],
  pageSize: 50,
  sortModel: [],
  lastFetchedAt: null,
  needsRefresh: false,
  loading: false,
  workingOverlayOpen: false,
  workingOverlayMessage: "Working...",
  isAdminUser: false,
  activeInstitutionId: null,
  activeBranchId: null,
  loadPage: async () => {},
  refreshPage: async () => {},
  rebuildSummaries: async () => {},
  loadBranches: async () => [],
  setStatusFilter: async () => {},
  setSearchTerm: () => {},
  setSelectedBranchFilter: () => {},
  setSortModel: async () => {},
  markNeedsRefresh: () => {},
  syncAndRefreshLoan: async () => {},
};

const FULL_LOAD_PAGE_SIZE = 500;
const BRANCH_LIST_PAGE_SIZE = 1000;
export const LOAN_EXPLORER_CACHE_TTL_MS = 60 * 1000;

export const LoanExplorerContext = React.createContext(LOAN_EXPLORER_DEFAULTS);

const dedupeById = (items = []) =>
  Array.from(
    new Map(items.filter(Boolean).map((item) => [item.id, item])).values(),
  );

const getCurrentPageToken = (pageIndex, prevTokens) => {
  if (pageIndex <= 0) {
    return null;
  }

  return prevTokens[pageIndex - 1] || null;
};

const getScopedSummaryMatch = ({
  summary,
  isAdminUser,
  institutionId,
  branchId,
}) => {
  if (!summary?.id) {
    return false;
  }

  if (isAdminUser) {
    return !institutionId || summary.institutionID === institutionId;
  }

  return !branchId || summary.branchID === branchId;
};

const updateCollectionWithSummary = ({
  collection,
  summary,
  statusFilter,
  allowInsert = false,
  isAdminUser,
  institutionId,
  branchId,
}) => {
  if (!summary?.id) {
    return collection;
  }

  const inScope = getScopedSummaryMatch({
    summary,
    isAdminUser,
    institutionId,
    branchId,
  });
  const matchesStatus = !statusFilter || summary.displayStatus === statusFilter;
  const nextCollection = Array.isArray(collection) ? collection.slice() : [];
  const existingIndex = nextCollection.findIndex(
    (item) => item?.id === summary.id,
  );

  if (existingIndex >= 0) {
    if (!inScope || !matchesStatus) {
      nextCollection.splice(existingIndex, 1);
      return nextCollection;
    }

    nextCollection[existingIndex] = summary;
    return nextCollection;
  }

  if (allowInsert && inScope && matchesStatus) {
    nextCollection.push(summary);
  }

  return nextCollection;
};

const updateRowsWithSummary = ({ rows, summary, statusFilter }) => {
  if (!summary?.id) {
    return rows;
  }

  const nextRow = mapLoanSummaryToExplorerRow(summary);
  const existingIndex = (rows || []).findIndex((row) => row?.id === nextRow.id);

  if (existingIndex < 0) {
    return rows;
  }

  if (statusFilter && summary.displayStatus !== statusFilter) {
    return rows.filter((row) => row?.id !== nextRow.id);
  }

  return rows.map((row) => (row?.id === nextRow.id ? nextRow : row));
};

export function LoanExplorerProvider({ children, userDetails }) {
  const { showSnackbar } = useSnackbar();
  const [loans, setLoans] = React.useState([]);
  const [allSummaries, setAllSummaries] = React.useState([]);
  const [allSummariesLoaded, setAllSummariesLoaded] = React.useState(false);
  const [branches, setBranches] = React.useState([]);
  const [branchesLoading, setBranchesLoading] = React.useState(false);
  const [statusFilter, setStatusFilterState] = React.useState(null);
  const [searchTerm, setSearchTermState] = React.useState("");
  const [selectedBranchFilter, setSelectedBranchFilterState] = React.useState(
    [],
  );
  const [currentPage, setCurrentPage] = React.useState(0);
  const [nextToken, setNextToken] = React.useState(null);
  const [prevTokens, setPrevTokens] = React.useState([]);
  const [pageSize] = React.useState(50);
  const [sortModel, setSortModelState] = React.useState([]);
  const [lastFetchedAt, setLastFetchedAt] = React.useState(null);
  const [needsRefresh, setNeedsRefresh] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [workingOverlayOpen, setWorkingOverlayOpen] = React.useState(false);
  const [workingOverlayMessage, setWorkingOverlayMessage] =
    React.useState("Working...");
  const requestSequenceRef = React.useRef(0);
  const branchLoadRef = React.useRef(false);
  const normalizedUserType = (userDetails?.userType || "").toLowerCase();
  const isAdminUser = normalizedUserType === "admin";
  const activeBranchId =
    userDetails?.branchUsersId || userDetails?.branch?.id || null;
  const activeInstitutionId =
    userDetails?.institution?.id || userDetails?.institutionUsersId || null;
  const currencyCode =
    userDetails?.institution?.currencyCode || userDetails?.currencyCode || null;
  const scopeKey = isAdminUser
    ? `institution:${activeInstitutionId || "none"}`
    : `branch:${activeBranchId || "none"}`;

  const applySummaryPatch = React.useCallback(
    (summary, { allowInsert = false } = {}) => {
      if (!summary?.id) {
        return;
      }

      setAllSummaries((current) =>
        updateCollectionWithSummary({
          collection: current,
          summary,
          statusFilter,
          allowInsert,
          isAdminUser,
          institutionId: activeInstitutionId,
          branchId: activeBranchId,
        }),
      );
      setLoans((current) =>
        updateRowsWithSummary({ rows: current, summary, statusFilter }),
      );
    },
    [activeBranchId, activeInstitutionId, isAdminUser, statusFilter],
  );

  const loadBranches = React.useCallback(
    async ({ force = false } = {}) => {
      if (!isAdminUser || !activeInstitutionId) {
        setBranches([]);
        setSelectedBranchFilterState([]);
        setBranchesLoading(false);
        return [];
      }

      if (!force && branches.length > 0) {
        return branches;
      }

      if (branchLoadRef.current) {
        return branches;
      }

      branchLoadRef.current = true;
      setBranchesLoading(true);

      try {
        const client = generateClient();
        const collected = [];
        let branchNextToken = null;

        do {
          const result = await client.graphql({
            query: listBranches,
            variables: {
              limit: BRANCH_LIST_PAGE_SIZE,
              nextToken: branchNextToken,
              filter: { institutionBranchesId: { eq: activeInstitutionId } },
            },
          });

          const listResult = result?.data?.listBranches || {};
          const items = Array.isArray(listResult.items)
            ? listResult.items.filter(Boolean)
            : [];

          collected.push(...items);
          branchNextToken = listResult.nextToken || null;
        } while (branchNextToken);

        setBranches(collected);
        setSelectedBranchFilterState((current) =>
          current.filter((branchId) =>
            collected.some((branch) => branch.id === branchId),
          ),
        );

        return collected;
      } catch (error) {
        console.error("LoanExplorer - Failed to load branches:", error);
        showSnackbar("Unable to load branches.", "red");
        setBranches([]);
        return [];
      } finally {
        branchLoadRef.current = false;
        setBranchesLoading(false);
      }
    },
    [activeInstitutionId, branches, isAdminUser, showSnackbar],
  );

  const fetchPage = React.useCallback(
    async ({
      nextTokenOverride = null,
      pageIndex = 0,
      displayStatusOverride = statusFilter,
      background = false,
    } = {}) => {
      const institutionId = isAdminUser ? activeInstitutionId : null;
      const branchId = isAdminUser ? null : activeBranchId;

      if (!institutionId && !branchId) {
        setLoans([]);
        setNextToken(null);
        setPrevTokens([]);
        setLoading(false);
        return { items: [], nextToken: null };
      }

      const client = generateClient();
      const requestId = ++requestSequenceRef.current;

      if (!background) {
        setLoading(true);
      }

      try {
        const page = await fetchExplorerPage({
          institutionId,
          branchId,
          displayStatusFilter: displayStatusOverride,
          limit: pageSize,
          nextToken: nextTokenOverride,
          client,
        });

        const summaries = page.items;

        if (requestId !== requestSequenceRef.current) {
          return null;
        }

        setLoans(summaries.map(mapLoanSummaryToExplorerRow));
        setNextToken(page.nextToken || null);
        setCurrentPage(pageIndex);
        setLastFetchedAt(Date.now());
        setNeedsRefresh(false);

        return {
          items: summaries,
          nextToken: page.nextToken || null,
        };
      } catch (error) {
        if (requestId !== requestSequenceRef.current) {
          return null;
        }

        console.error("LoanExplorer - Failed to load explorer page:", error);
        setLoans([]);
        setNextToken(null);
        showSnackbar("Unable to load the Loan Explorer.", "red");
        return null;
      } finally {
        if (requestId === requestSequenceRef.current && !background) {
          setLoading(false);
        }
      }
    },
    [
      activeBranchId,
      activeInstitutionId,
      isAdminUser,
      pageSize,
      showSnackbar,
      statusFilter,
    ],
  );

  const fetchAllSummaries = React.useCallback(
    async ({
      displayStatusOverride = statusFilter,
      background = false,
      pageIndexOverride = 0,
    } = {}) => {
      const institutionId = isAdminUser ? activeInstitutionId : null;
      const branchId = isAdminUser ? null : activeBranchId;

      if (!institutionId && !branchId) {
        setAllSummaries([]);
        setAllSummariesLoaded(false);
        return [];
      }

      const client = generateClient();
      const requestId = ++requestSequenceRef.current;

      if (!background) {
        setLoading(true);
      }
      setWorkingOverlayMessage("Loading all loans for sorting...");
      setWorkingOverlayOpen(!background);

      try {
        let summaries = [];

        if (displayStatusOverride) {
          let batchNextToken = null;

          do {
            const page = await fetchExplorerPage({
              institutionId,
              branchId,
              displayStatusFilter: displayStatusOverride,
              limit: FULL_LOAD_PAGE_SIZE,
              nextToken: batchNextToken,
              client,
            });

            summaries.push(...page.items);
            batchNextToken = page.nextToken;
          } while (batchNextToken);
        } else {
          summaries = await fetchAllLoanSummariesForScope({
            institutionId,
            branchId,
            pageSize: FULL_LOAD_PAGE_SIZE,
            client,
          });
        }

        summaries = dedupeById(summaries);

        if (requestId !== requestSequenceRef.current) {
          return [];
        }

        setAllSummaries(summaries);
        setAllSummariesLoaded(true);
        setCurrentPage(pageIndexOverride);
        setLastFetchedAt(Date.now());
        setNeedsRefresh(false);
        return summaries;
      } catch (error) {
        if (requestId !== requestSequenceRef.current) {
          return [];
        }

        console.error("LoanExplorer - Failed to load all summaries:", error);
        showSnackbar("Unable to load all loans for sorting.", "red");
        return [];
      } finally {
        if (requestId === requestSequenceRef.current) {
          if (!background) {
            setLoading(false);
          }
          setWorkingOverlayOpen(false);
        }
      }
    },
    [
      activeBranchId,
      activeInstitutionId,
      isAdminUser,
      showSnackbar,
      statusFilter,
    ],
  );

  const loadPage = React.useCallback(
    async ({ direction = "first" } = {}) => {
      if (sortModel.length > 0) {
        if (!allSummariesLoaded) {
          await fetchAllSummaries({ background: false });
          return;
        }

        setCurrentPage((current) => {
          if (direction === "next") {
            return current + 1;
          }

          if (direction === "prev") {
            return Math.max(current - 1, 0);
          }

          return 0;
        });
        return;
      }

      if (direction === "next") {
        if (!nextToken) {
          return;
        }

        const nextPageToken = nextToken;
        const result = await fetchPage({
          nextTokenOverride: nextPageToken,
          pageIndex: currentPage + 1,
        });

        if (result) {
          setPrevTokens((current) => [...current, nextPageToken]);
        }

        return;
      }

      if (direction === "prev") {
        if (currentPage <= 0) {
          return;
        }

        const previousPageIndex = currentPage - 1;
        const previousPageToken = getCurrentPageToken(
          previousPageIndex,
          prevTokens,
        );
        const result = await fetchPage({
          nextTokenOverride: previousPageToken,
          pageIndex: previousPageIndex,
        });

        if (result) {
          setPrevTokens((current) => current.slice(0, -1));
        }

        return;
      }

      setPrevTokens([]);
      await fetchPage({ nextTokenOverride: null, pageIndex: 0 });
    },
    [
      allSummariesLoaded,
      currentPage,
      fetchAllSummaries,
      fetchPage,
      nextToken,
      prevTokens,
      sortModel.length,
    ],
  );

  const refreshPage = React.useCallback(async () => {
    const hasCache = loans.length > 0 || allSummariesLoaded;

    if (sortModel.length > 0) {
      await fetchAllSummaries({
        background: hasCache,
        pageIndexOverride: currentPage,
      });
      return;
    }

    await fetchPage({
      nextTokenOverride: getCurrentPageToken(currentPage, prevTokens),
      pageIndex: currentPage,
      background: hasCache,
    });
  }, [
    allSummariesLoaded,
    currentPage,
    fetchAllSummaries,
    fetchPage,
    loans.length,
    prevTokens,
    sortModel.length,
  ]);

  const rebuildSummaries = React.useCallback(async () => {
    const branchItems = isAdminUser ? await loadBranches() : [];
    const branchIds = isAdminUser
      ? branchItems.map((branch) => branch.id).filter(Boolean)
      : activeBranchId
        ? [activeBranchId]
        : [];

    if (!branchIds.length) {
      showSnackbar("No branches are available for summary rebuild.", "red");
      return;
    }

    const branchInstitutionById = isAdminUser
      ? Object.fromEntries(
          branchItems
            .filter((branch) => branch?.id)
            .map((branch) => [
              branch.id,
              branch.institutionBranchesId || activeInstitutionId || null,
            ]),
        )
      : activeBranchId
        ? { [activeBranchId]: activeInstitutionId || null }
        : {};

    setWorkingOverlayMessage("Rebuilding Loan Explorer summaries...");
    setWorkingOverlayOpen(true);
    setLoading(true);

    try {
      await backfillLoanSummariesForScope({
        branchIds,
        client: generateClient(),
        branchInstitutionById,
        defaultInstitutionId: activeInstitutionId || null,
        defaultCurrencyCode: currencyCode,
        onProgress: ({ processedLoans, syncedSummaries }) => {
          setWorkingOverlayMessage(
            `Rebuilding Loan Explorer summaries... ${syncedSummaries}/${processedLoans}`,
          );
        },
      });

      setAllSummaries([]);
      setAllSummariesLoaded(false);
      setPrevTokens([]);
      setNextToken(null);

      if (sortModel.length > 0) {
        await fetchAllSummaries({ background: false });
      } else {
        await fetchPage({ nextTokenOverride: null, pageIndex: 0 });
      }

      showSnackbar("Loan Explorer summaries rebuilt.", "green");
    } catch (error) {
      console.error("LoanExplorer - Failed to rebuild summaries:", error);
      showSnackbar("Unable to rebuild Loan Explorer summaries.", "red");
    } finally {
      setLoading(false);
      setWorkingOverlayOpen(false);
    }
  }, [
    activeBranchId,
    activeInstitutionId,
    currencyCode,
    fetchAllSummaries,
    fetchPage,
    isAdminUser,
    loadBranches,
    showSnackbar,
    sortModel.length,
  ]);

  const setStatusFilter = React.useCallback(
    async (nextStatus) => {
      const normalizedStatus = nextStatus || null;

      setStatusFilterState(normalizedStatus);
      setCurrentPage(0);
      setPrevTokens([]);
      setNextToken(null);
      setAllSummaries([]);
      setAllSummariesLoaded(false);

      if (sortModel.length > 0) {
        await fetchAllSummaries({
          displayStatusOverride: normalizedStatus,
          background: false,
        });
        return;
      }

      await fetchPage({
        nextTokenOverride: null,
        pageIndex: 0,
        displayStatusOverride: normalizedStatus,
      });
    },
    [fetchAllSummaries, fetchPage, sortModel.length],
  );

  const setSearchTerm = React.useCallback(
    (term) => {
      setSearchTermState(term);

      if (sortModel.length > 0) {
        setCurrentPage(0);
      }
    },
    [sortModel.length],
  );

  const setSelectedBranchFilter = React.useCallback(
    (branchIds) => {
      setSelectedBranchFilterState(
        Array.isArray(branchIds) ? branchIds.filter(Boolean) : [],
      );

      if (sortModel.length > 0) {
        setCurrentPage(0);
      }
    },
    [sortModel.length],
  );

  const setSortModel = React.useCallback(
    async (nextModel) => {
      const normalizedModel = Array.isArray(nextModel)
        ? nextModel.filter((item) => item?.field && item?.sort)
        : [];

      setSortModelState(normalizedModel);
      setCurrentPage(0);

      if (!normalizedModel.length) {
        setPrevTokens([]);
        setNextToken(null);
        await fetchPage({ nextTokenOverride: null, pageIndex: 0 });
        return;
      }

      if (allSummariesLoaded) {
        return;
      }

      await fetchAllSummaries({ background: false });
    },
    [allSummariesLoaded, fetchAllSummaries, fetchPage],
  );

  const markNeedsRefresh = React.useCallback(() => {
    setNeedsRefresh(true);
  }, []);

  const syncAndRefreshLoan = React.useCallback(
    async (loanId) => {
      if (!loanId) {
        return;
      }

      setWorkingOverlayMessage("Refreshing loan summary...");
      setWorkingOverlayOpen(true);

      try {
        const client = generateClient();
        await syncLoanSummaryByLoanId(loanId, { client });
        const updatedSummary = await fetchLoanSummaryById({
          id: loanId,
          client,
        });

        if (updatedSummary?.id) {
          applySummaryPatch(updatedSummary, {
            allowInsert: allSummariesLoaded,
          });
          setLastFetchedAt(Date.now());
        }

        if (!allSummariesLoaded || sortModel.length === 0) {
          await refreshPage();
        }

        setNeedsRefresh(false);
      } catch (error) {
        console.error("LoanExplorer - Failed to sync loan summary:", error);
        showSnackbar("Unable to refresh that loan.", "red");
      } finally {
        setWorkingOverlayOpen(false);
      }
    },
    [
      allSummariesLoaded,
      applySummaryPatch,
      refreshPage,
      showSnackbar,
      sortModel.length,
    ],
  );

  React.useEffect(() => {
    setLoans([]);
    setAllSummaries([]);
    setAllSummariesLoaded(false);
    setBranches([]);
    setBranchesLoading(false);
    setSelectedBranchFilterState([]);
    setCurrentPage(0);
    setNextToken(null);
    setPrevTokens([]);
    setSortModelState([]);
    setLastFetchedAt(null);
    setNeedsRefresh(false);
    setLoading(false);
    setWorkingOverlayOpen(false);
    setWorkingOverlayMessage("Working...");
  }, [scopeKey]);

  React.useEffect(() => {
    if (isAdminUser) {
      return;
    }

    setBranches([]);
    setBranchesLoading(false);
    setSelectedBranchFilterState([]);
  }, [isAdminUser]);

  React.useEffect(() => {
    const syncListener = (event) => {
      const syncedSummary = event?.detail?.summary || null;

      if (syncedSummary?.id) {
        applySummaryPatch(syncedSummary, { allowInsert: allSummariesLoaded });
      }

      setNeedsRefresh(true);
    };

    window.addEventListener(LOAN_SUMMARY_SYNCED_EVENT, syncListener);

    return () => {
      window.removeEventListener(LOAN_SUMMARY_SYNCED_EVENT, syncListener);
    };
  }, [allSummariesLoaded, applySummaryPatch]);

  const contextValue = React.useMemo(
    () => ({
      loans,
      allSummaries,
      allSummariesLoaded,
      branches,
      branchesLoading,
      statusFilter,
      searchTerm,
      selectedBranchFilter,
      currentPage,
      nextToken,
      prevTokens,
      pageSize,
      sortModel,
      lastFetchedAt,
      needsRefresh,
      loading,
      workingOverlayOpen,
      workingOverlayMessage,
      isAdminUser,
      activeInstitutionId,
      activeBranchId,
      loadPage,
      refreshPage,
      rebuildSummaries,
      loadBranches,
      setStatusFilter,
      setSearchTerm,
      setSelectedBranchFilter,
      setSortModel,
      markNeedsRefresh,
      syncAndRefreshLoan,
    }),
    [
      activeBranchId,
      activeInstitutionId,
      allSummaries,
      allSummariesLoaded,
      branches,
      branchesLoading,
      currentPage,
      lastFetchedAt,
      loadBranches,
      loadPage,
      loading,
      loans,
      markNeedsRefresh,
      needsRefresh,
      nextToken,
      pageSize,
      prevTokens,
      rebuildSummaries,
      refreshPage,
      searchTerm,
      selectedBranchFilter,
      setSearchTerm,
      setSelectedBranchFilter,
      setSortModel,
      setStatusFilter,
      sortModel,
      statusFilter,
      syncAndRefreshLoan,
      workingOverlayMessage,
      workingOverlayOpen,
      isAdminUser,
    ],
  );

  return (
    <LoanExplorerContext.Provider value={contextValue}>
      {children}
    </LoanExplorerContext.Provider>
  );
}

export const getSortedExplorerRows = ({ allSummaries, sortModel }) =>
  sortExplorerRows(
    (allSummaries || []).map((summary) => mapLoanSummaryToExplorerRow(summary)),
    sortModel,
  );
