import React from "react";
import {
  LoanExplorerContext,
  LOAN_EXPLORER_CACHE_TTL_MS,
  getSortedExplorerRows,
} from "./LoanExplorerContext";
import { isLoanSummaryVisible } from "../loanSummaryProjection";

const getSearchableLoanText = (loan) =>
  [
    loan?.borrowerDisplayName,
    loan?.borrowerPhone,
    loan?.loanNumber,
    loan?.id,
    loan?.lifecycleStatus,
    loan?.uiStatusLabel,
    loan?.loanProductName,
    loan?.loanOfficerDisplayName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export default function useLoanExplorer({ userDetails } = {}) {
  const context = React.useContext(LoanExplorerContext);

  if (!context) {
    throw new Error("useLoanExplorer must be used within LoanExplorerProvider.");
  }

  const normalizedUserType =
    (userDetails?.userType || "").toLowerCase() ||
    (context.isAdminUser ? "admin" : "");
  const isAdminUser = normalizedUserType === "admin";
  const activeInstitutionId = context.activeInstitutionId;
  const allSummaries = context.allSummaries;
  const allSummariesLoaded = context.allSummariesLoaded;
  const currentPage = context.currentPage;
  const loadBranches = context.loadBranches;
  const loadPage = context.loadPage;
  const loading = context.loading;
  const loans = context.loans;
  const nextToken = context.nextToken;
  const needsRefresh = context.needsRefresh;
  const pageSize = context.pageSize;
  const refreshPage = context.refreshPage;
  const searchTerm = context.searchTerm;
  const selectedBranchFilter = context.selectedBranchFilter;
  const sortModel = context.sortModel;
  const lastFetchedAt = context.lastFetchedAt;
  const hasCachedData = loans.length > 0 || allSummariesLoaded;

  React.useEffect(() => {
    if (isAdminUser && activeInstitutionId) {
      loadBranches();
    }
  }, [activeInstitutionId, isAdminUser, loadBranches]);

  React.useEffect(() => {
    if (!hasCachedData && !loading) {
      loadPage({ direction: "first" });
      return;
    }

    if (!hasCachedData) {
      return;
    }

    const isFresh =
      typeof lastFetchedAt === "number" &&
      Date.now() - lastFetchedAt < LOAN_EXPLORER_CACHE_TTL_MS;

    if (isFresh && !needsRefresh) {
      return;
    }

    refreshPage();
  }, [
    hasCachedData,
    lastFetchedAt,
    loadPage,
    loading,
    needsRefresh,
    refreshPage,
  ]);

  const sourceLoans = React.useMemo(() => {
    const baseRows =
      sortModel.length > 0 && allSummariesLoaded
        ? getSortedExplorerRows({
            allSummaries,
            sortModel,
          })
        : loans;

    return baseRows.filter(isLoanSummaryVisible);
  }, [allSummaries, allSummariesLoaded, loans, sortModel]);

  const filteredLoans = React.useMemo(() => {
    let result = sourceLoans;

    if (isAdminUser && selectedBranchFilter.length > 0) {
      result = result.filter((loan) =>
        selectedBranchFilter.includes(loan.branchID),
      );
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter((loan) => getSearchableLoanText(loan).includes(query));
    }

    return result;
  }, [isAdminUser, searchTerm, selectedBranchFilter, sourceLoans]);

  const pagedLoans = React.useMemo(() => {
    if (!(sortModel.length > 0 && allSummariesLoaded)) {
      return filteredLoans;
    }

    const startIndex = currentPage * pageSize;
    return filteredLoans.slice(startIndex, startIndex + pageSize);
  }, [allSummariesLoaded, currentPage, filteredLoans, pageSize, sortModel.length]);

  const kpis = React.useMemo(() => {
    const current = sourceLoans.filter((loan) => loan.uiStatusFilterKey === "current");
    const missedPayment = sourceLoans.filter(
      (loan) => loan.uiStatusFilterKey === "missed_payment",
    );
    const overdue = sourceLoans.filter((loan) => loan.uiStatusFilterKey === "overdue");
    const totalPrincipal = sourceLoans.reduce(
      (sum, loan) => sum + (loan.principalAmount || 0),
      0,
    );
    const totalOutstanding = sourceLoans.reduce(
      (sum, loan) => sum + (loan.amountDueAmount || 0),
      0,
    );

    return {
      total: sourceLoans.length,
      current: current.length,
      missedPayment: missedPayment.length,
      overdue: overdue.length,
      totalPrincipal,
      totalOutstanding,
    };
  }, [sourceLoans]);

  const tabCounts = React.useMemo(() => {
    const counts = { all: sourceLoans.length };
    [
      "current",
      "missed_payment",
      "overdue",
      "closed",
      "written_off",
      "voided",
    ].forEach((statusKey) => {
      counts[statusKey] = sourceLoans.filter(
        (loan) => loan.uiStatusFilterKey === statusKey,
      ).length;
    });
    return counts;
  }, [sourceLoans]);

  const hasNextPage =
    sortModel.length > 0 && allSummariesLoaded
      ? (currentPage + 1) * pageSize < filteredLoans.length
      : !!nextToken;

  const hasPrevPage = currentPage > 0;

  return {
    ...context,
    filteredLoans,
    pagedLoans,
    kpis,
    tabCounts,
    hasNextPage,
    hasPrevPage,
    loadedLoanCount: sourceLoans.length,
  };
}