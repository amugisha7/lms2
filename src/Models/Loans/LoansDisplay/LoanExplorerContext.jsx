import React from "react";
import { generateClient } from "aws-amplify/api";
import { useSnackbar } from "../../../ModelAssets/SnackbarContext";
import {
  BRANCH_LOANS_STATEMENT_READY_QUERY,
  GET_LOAN_STATEMENT_READY_QUERY,
} from "../loanDataQueries";
import { attachDerivedLoanData } from "../loanSummaryProjection";

const LOAN_EXPLORER_DEFAULTS = {
  loanRecordsById: {},
  loanDisplayRows: [],
  loanDisplayLoading: false,
  loanDisplayLoadingMore: false,
  loanDisplayHasMore: false,
  loanDisplayLastFetchedAt: null,
  workingOverlayOpen: false,
  workingOverlayMessage: "Working...",
  isAdminUser: false,
  activeInstitutionId: null,
  activeBranchId: null,
  getLoanRecord: () => null,
  ensureLoanRecord: async () => null,
  loadLoanDisplayPage: async () => [],
  refreshLoanDisplayPage: async () => [],
  updateCachedLoan: () => null,
  mergeCachedLoanPatch: () => null,
  applyLoanPaymentMutation: () => null,
};

const LOANS_DISPLAY_PAGE_SIZE = 25;

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

const assertGraphqlResult = (operationName, result) => {
  const graphQLErrors = Array.isArray(result?.errors)
    ? result.errors.filter(Boolean)
    : [];

  if (!graphQLErrors.length) {
    return;
  }

  console.groupCollapsed(`[LoanExplorer] GraphQL errors in ${operationName}`);
  console.error("GraphQL errors:", graphQLErrors);
  console.error("Partial response data:", result?.data || null);
  console.groupEnd();

  const error = new Error(`${operationName} returned GraphQL errors`);
  error.errors = graphQLErrors;
  error.data = result?.data;
  throw error;
};

export function LoanExplorerProvider({ children, userDetails }) {
  const { showSnackbar } = useSnackbar();
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
  const loanDisplayScopeRef = React.useRef(null);
  const loanDisplayPagingRef = React.useRef(
    createInitialLoanDisplayPagingState(),
  );
  const normalizedUserType = (userDetails?.userType || "").toLowerCase();
  const isAdminUser = normalizedUserType === "admin";
  const activeBranchId =
    userDetails?.branchID || userDetails?.branch?.id || null;
  const activeInstitutionId =
    userDetails?.institution?.id || userDetails?.institutionID || null;
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
      assertGraphqlResult("GetLoanStatementReady", result);
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
        ? branchIdOverride || activeBranchId || null
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
          assertGraphqlResult("BranchLoansStatementReady", result);

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

  React.useEffect(() => {
    setLoanRecordsById({});
    setLoanDisplayIds([]);
    setLoanDisplayLoading(false);
    setLoanDisplayLoadingMore(false);
    setLoanDisplayHasMore(false);
    setLoanDisplayLastFetchedAt(null);
    setWorkingOverlayOpen(false);
    setWorkingOverlayMessage("Working...");
    loanDisplayScopeRef.current = null;
    loanDisplayPagingRef.current = createInitialLoanDisplayPagingState();
  }, [scopeKey]);

  const contextValue = React.useMemo(
    () => ({
      loanRecordsById,
      loanDisplayRows,
      loanDisplayLoading,
      loanDisplayLoadingMore,
      loanDisplayHasMore,
      loanDisplayLastFetchedAt,
      workingOverlayOpen,
      workingOverlayMessage,
      isAdminUser,
      activeInstitutionId,
      activeBranchId,
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
      applyLoanPaymentMutation,
      ensureLoanRecord,
      getLoanRecord,
      isAdminUser,
      loadLoanDisplayPage,
      loanDisplayHasMore,
      loanDisplayLastFetchedAt,
      loanDisplayLoading,
      loanDisplayLoadingMore,
      loanDisplayRows,
      loanRecordsById,
      mergeCachedLoanPatch,
      refreshLoanDisplayPage,
      updateCachedLoan,
      workingOverlayMessage,
      workingOverlayOpen,
    ],
  );

  return (
    <LoanExplorerContext.Provider value={contextValue}>
      {children}
    </LoanExplorerContext.Provider>
  );
}
