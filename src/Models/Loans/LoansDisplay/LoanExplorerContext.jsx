import React from "react";
import { generateClient } from "aws-amplify/api";
import { listBranches } from "../../../graphql/queries";
import { useSnackbar } from "../../../ModelAssets/SnackbarContext";
import {
  BRANCH_LOANS_STATEMENT_READY_QUERY,
  GET_LOAN_STATEMENT_READY_QUERY,
} from "../loanDataQueries";
import { attachDerivedLoanData } from "../loanSummaryProjection";
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
  loanRecordsById: {},
  loanDisplayRows: [],
  loanDisplayLoading: false,
  loanDisplayLoadingMore: false,
  loanDisplayHasMore: false,
  loanDisplayLastFetchedAt: null,
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
  getLoanRecord: () => null,
  ensureLoanRecord: async () => null,
  loadLoanDisplayPage: async () => [],
  refreshLoanDisplayPage: async () => [],
  updateCachedLoan: () => null,
  mergeCachedLoanPatch: () => null,
  applyLoanPaymentMutation: () => null,
};

const FULL_LOAD_PAGE_SIZE = 500;
const BRANCH_LIST_PAGE_SIZE = 1000;
const LOANS_DISPLAY_PAGE_SIZE = 25;
export const LOAN_EXPLORER_CACHE_TTL_MS = 60 * 1000;

export const LoanExplorerContext = React.createContext(LOAN_EXPLORER_DEFAULTS);

const dedupeById = (items = []) =>
  Array.from(
    new Map(items.filter(Boolean).map((item) => [item.id, item])).values(),
  );

const createInitialLoanDisplayPagingState = () => ({
  branchIds: [],
  branchIndex: 0,
  nextTokens: {},
});

const isLoansDisplayCandidate = (loan) => {
  const status = String(loan?.status || "").toLowerCase();
  return (
    !status.includes("draft") &&
    !status.includes("review") &&
    !status.includes("rejected")
  );
};

const normalizeLoanRecord = (loan) => {
  if (!loan?.id) {
    return null;
  }

  const { derivedStatement, ...baseLoan } = loan;

  return attachDerivedLoanData(baseLoan);
};

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
  const [loanRecordsById, setLoanRecordsById] = React.useState({});
  const [loanDisplayIds, setLoanDisplayIds] = React.useState([]);
  const [loanDisplayLoading, setLoanDisplayLoading] = React.useState(false);
  const [loanDisplayLoadingMore, setLoanDisplayLoadingMore] =
    React.useState(false);
  const [loanDisplayHasMore, setLoanDisplayHasMore] = React.useState(false);
  const [loanDisplayLastFetchedAt, setLoanDisplayLastFetchedAt] =
    React.useState(null);
  const requestSequenceRef = React.useRef(0);
  const branchLoadRef = React.useRef(false);
  const loanDisplayScopeRef = React.useRef(null);
  const loanDisplayPagingRef = React.useRef(
    createInitialLoanDisplayPagingState(),
  );
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

  const updateCachedLoan = React.useCallback((loan) => {
    const normalizedLoan = normalizeLoanRecord(loan);

    if (!normalizedLoan) {
      return null;
    }

    setLoanRecordsById((current) => ({
      ...current,
      [normalizedLoan.id]: normalizedLoan,
    }));
    setLoanDisplayLastFetchedAt(Date.now());
    return normalizedLoan;
  }, []);

  const mergeCachedLoanPatch = React.useCallback((loanId, patch) => {
    if (!loanId || !patch) {
      return null;
    }

    let mergedLoan = null;

    setLoanRecordsById((current) => {
      const existingLoan = current[loanId];

      if (!existingLoan) {
        return current;
      }

      mergedLoan = normalizeLoanRecord({
        ...existingLoan,
        ...patch,
        borrower: patch.borrower || existingLoan.borrower,
        branch: patch.branch || existingLoan.branch,
        createdByEmployee:
          patch.createdByEmployee || existingLoan.createdByEmployee,
        loanProduct: patch.loanProduct || existingLoan.loanProduct,
        payments: patch.payments || existingLoan.payments,
        penalties: patch.penalties || existingLoan.penalties,
        events: patch.events || existingLoan.events,
      });

      if (!mergedLoan) {
        return current;
      }

      return {
        ...current,
        [loanId]: mergedLoan,
      };
    });

    if (mergedLoan) {
      setLoanDisplayLastFetchedAt(Date.now());
    }

    return mergedLoan;
  }, []);

  const applyLoanPaymentMutation = React.useCallback(({ loanId, payment }) => {
    if (!loanId || !payment?.id) {
      return null;
    }

    let updatedLoan = null;

    setLoanRecordsById((current) => {
      const existingLoan = current[loanId];

      if (!existingLoan) {
        return current;
      }

      const existingItems = Array.isArray(existingLoan?.payments?.items)
        ? existingLoan.payments.items.filter(Boolean)
        : [];
      const hasExistingPayment = existingItems.some(
        (existingPayment) => existingPayment?.id === payment.id,
      );
      const nextItems = hasExistingPayment
        ? existingItems.map((existingPayment) =>
            existingPayment?.id === payment.id
              ? {
                  ...existingPayment,
                  ...payment,
                  account: payment.account || existingPayment.account,
                  receivingEmployee:
                    payment.receivingEmployee ||
                    existingPayment.receivingEmployee,
                }
              : existingPayment,
          )
        : [{ ...payment }, ...existingItems];

      updatedLoan = normalizeLoanRecord({
        ...existingLoan,
        payments: {
          ...(existingLoan.payments || {}),
          items: nextItems,
        },
      });

      if (!updatedLoan) {
        return current;
      }

      return {
        ...current,
        [loanId]: updatedLoan,
      };
    });

    if (updatedLoan) {
      setLoanDisplayLastFetchedAt(Date.now());
    }

    return updatedLoan;
  }, []);

  const getLoanRecord = React.useCallback(
    (loanId) => loanRecordsById[loanId] || null,
    [loanRecordsById],
  );

  const ensureLoanRecord = React.useCallback(
    async (loanId, { force = false } = {}) => {
      if (!loanId) {
        return null;
      }

      if (!force && loanRecordsById[loanId]) {
        return loanRecordsById[loanId];
      }

      const client = generateClient();
      const result = await client.graphql({
        query: GET_LOAN_STATEMENT_READY_QUERY,
        variables: { id: loanId },
      });
      const fetchedLoan = normalizeLoanRecord(result?.data?.getLoan || null);

      if (fetchedLoan) {
        setLoanRecordsById((current) => ({
          ...current,
          [fetchedLoan.id]: fetchedLoan,
        }));
        setLoanDisplayLastFetchedAt(Date.now());
      }

      return fetchedLoan;
    },
    [loanRecordsById],
  );

  const loanDisplayRows = React.useMemo(
    () =>
      loanDisplayIds.map((loanId) => loanRecordsById[loanId]).filter(Boolean),
    [loanDisplayIds, loanRecordsById],
  );

  const loadLoanDisplayPage = React.useCallback(
    async ({ reset = false, force = false, branchIdOverride } = {}) => {
      const effectiveBranchId = isAdminUser
        ? branchIdOverride || null
        : activeBranchId;
      const nextScopeKey = `loans-display:${effectiveBranchId || "none"}`;
      const scopeChanged = loanDisplayScopeRef.current !== nextScopeKey;

      if (!effectiveBranchId) {
        loanDisplayScopeRef.current = nextScopeKey;
        loanDisplayPagingRef.current = createInitialLoanDisplayPagingState();
        setLoanDisplayIds([]);
        setLoanDisplayLoading(false);
        setLoanDisplayLoadingMore(false);
        setLoanDisplayHasMore(false);
        return [];
      }

      if (scopeChanged && !reset) {
        return loadLoanDisplayPage({
          reset: true,
          force,
          branchIdOverride: effectiveBranchId,
        });
      }

      if (!force && reset && !scopeChanged && loanDisplayIds.length > 0) {
        setLoanDisplayLoading(false);
        setLoanDisplayLoadingMore(false);
        return loanDisplayIds
          .map((loanId) => loanRecordsById[loanId])
          .filter(Boolean);
      }

      if (reset) {
        setLoanDisplayLoading(true);
      } else {
        setLoanDisplayLoadingMore(true);
      }

      try {
        const client = generateClient();
        let branchIds = loanDisplayPagingRef.current.branchIds;
        let branchIndex = loanDisplayPagingRef.current.branchIndex;
        let nextTokens = {
          ...(loanDisplayPagingRef.current.nextTokens || {}),
        };

        if (reset || scopeChanged) {
          branchIds = [effectiveBranchId];
          branchIndex = 0;
          nextTokens = {};
        }

        const collected = [];

        while (
          collected.length < LOANS_DISPLAY_PAGE_SIZE &&
          branchIndex < branchIds.length
        ) {
          const currentBranchId = branchIds[branchIndex];
          const result = await client.graphql({
            query: BRANCH_LOANS_STATEMENT_READY_QUERY,
            variables: {
              branchID: currentBranchId,
              sortDirection: "DESC",
              limit: LOANS_DISPLAY_PAGE_SIZE - collected.length,
              nextToken: nextTokens[currentBranchId] || null,
            },
          });

          const listResult = result?.data?.loansByBranchIDAndStartDate || {};
          const batch = Array.isArray(listResult.items)
            ? listResult.items.filter(Boolean)
            : [];

          collected.push(...batch);

          if (listResult.nextToken) {
            nextTokens[currentBranchId] = listResult.nextToken;
          } else {
            delete nextTokens[currentBranchId];
            branchIndex += 1;
          }
        }

        const processed = dedupeById(
          collected.map((loan) => normalizeLoanRecord(loan)).filter(Boolean),
        ).filter(isLoansDisplayCandidate);

        setLoanRecordsById((current) => {
          const next = { ...current };

          processed.forEach((loan) => {
            next[loan.id] = loan;
          });

          return next;
        });
        setLoanDisplayIds((current) => {
          const nextIds = reset || scopeChanged ? [] : current.slice();

          processed.forEach((loan) => {
            if (!nextIds.includes(loan.id)) {
              nextIds.push(loan.id);
            }
          });

          return nextIds;
        });

        loanDisplayScopeRef.current = nextScopeKey;
        loanDisplayPagingRef.current = {
          branchIds,
          branchIndex,
          nextTokens,
        };

        setLoanDisplayHasMore(
          branchIndex < branchIds.length || Object.keys(nextTokens).length > 0,
        );
        setLoanDisplayLastFetchedAt(Date.now());
        return processed;
      } catch (error) {
        console.error(
          "LoanExplorer - Failed to load loans display page:",
          error,
        );
        if (reset) {
          setLoanDisplayIds([]);
        }
        setLoanDisplayHasMore(false);
        showSnackbar("Unable to load loans.", "red");
        return [];
      } finally {
        setLoanDisplayLoading(false);
        setLoanDisplayLoadingMore(false);
      }
    },
    [
      activeBranchId,
      isAdminUser,
      loanDisplayIds,
      loanRecordsById,
      showSnackbar,
    ],
  );

  const refreshLoanDisplayPage = React.useCallback(
    async ({ branchIdOverride } = {}) =>
      loadLoanDisplayPage({
        reset: true,
        force: true,
        branchIdOverride,
      }),
    [loadLoanDisplayPage],
  );

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
    setLoanRecordsById({});
    setLoanDisplayIds([]);
    setLoanDisplayLoading(false);
    setLoanDisplayLoadingMore(false);
    setLoanDisplayHasMore(false);
    setLoanDisplayLastFetchedAt(null);
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
    loanDisplayScopeRef.current = null;
    loanDisplayPagingRef.current = createInitialLoanDisplayPagingState();
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
      loanRecordsById,
      loanDisplayRows,
      loanDisplayLoading,
      loanDisplayLoadingMore,
      loanDisplayHasMore,
      loanDisplayLastFetchedAt,
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
      getLoanRecord,
      ensureLoanRecord,
      loadLoanDisplayPage,
      refreshLoanDisplayPage,
      updateCachedLoan,
      mergeCachedLoanPatch,
      applyLoanPaymentMutation,
    }),
    [
      activeBranchId,
      activeInstitutionId,
      allSummaries,
      allSummariesLoaded,
      applyLoanPaymentMutation,
      branches,
      branchesLoading,
      currentPage,
      ensureLoanRecord,
      getLoanRecord,
      lastFetchedAt,
      loadBranches,
      loadLoanDisplayPage,
      loadPage,
      loading,
      loanDisplayHasMore,
      loanDisplayLastFetchedAt,
      loanDisplayLoading,
      loanDisplayLoadingMore,
      loanDisplayRows,
      loanRecordsById,
      loans,
      markNeedsRefresh,
      mergeCachedLoanPatch,
      needsRefresh,
      nextToken,
      pageSize,
      prevTokens,
      rebuildSummaries,
      refreshLoanDisplayPage,
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
      updateCachedLoan,
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
