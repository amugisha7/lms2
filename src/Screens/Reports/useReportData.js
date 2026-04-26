/**
 * useReportData – hook for fetching all LoanSummary rows for a report scope.
 *
 * Wraps fetchAllLoanSummariesForScope with loading state and refresh support.
 * Also loads the branch list for admin users.
 */

import { useState, useEffect, useCallback, useContext } from "react";
import { generateClient } from "aws-amplify/api";
import { listBranches } from "../../graphql/queries";
import {
  fetchAllLoanSummariesForBranches,
  fetchAllLoanSummariesForScope,
} from "../../Models/Loans/loanSummaryHelpers";
import { resolveReportScope } from "./reportUtils";
import { UserContext } from "../../App";

const PAGE_SIZE = 500;

export function useReportData({ selectedBranchId = null } = {}) {
  const { userDetails } = useContext(UserContext);

  const [summaries, setSummaries] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);

  const scope = resolveReportScope(userDetails);

  // Admin can override to a specific branch; non-admins are always their branch.
  const effectiveInstitutionId = scope.isAdmin && !selectedBranchId
    ? scope.institutionId
    : null;
  const effectiveBranchId = scope.isAdmin
    ? (selectedBranchId || null)
    : scope.branchId;

  const fetchData = useCallback(async () => {
    if (!effectiveInstitutionId && !effectiveBranchId) {
      setSummaries([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const client = generateClient();
      const shouldFanOutByBranch =
        scope.isAdmin &&
        !selectedBranchId &&
        !effectiveBranchId &&
        branches.length > 0;

      const items = shouldFanOutByBranch
        ? await fetchAllLoanSummariesForBranches({
            branchIds: branches.map((branch) => branch?.id).filter(Boolean),
            pageSize: PAGE_SIZE,
            client,
          })
        : await fetchAllLoanSummariesForScope({
            institutionId: effectiveInstitutionId,
            branchId: effectiveBranchId,
            pageSize: PAGE_SIZE,
            client,
          });

      setSummaries(items);
      setLastFetchedAt(Date.now());
    } catch (err) {
      console.error("[useReportData] fetch error:", err);
      setError("Failed to load loan data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    branches,
    effectiveInstitutionId,
    effectiveBranchId,
    scope.isAdmin,
    selectedBranchId,
  ]);

  // Load branches for admin users
  const fetchBranches = useCallback(async () => {
    if (!scope.isAdmin || !scope.institutionId) return;
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: listBranches,
        variables: {
          filter: { institutionBranchesId: { eq: scope.institutionId } },
          limit: 1000,
        },
      });
      const items = result?.data?.listBranches?.items || [];
      setBranches(items.filter(Boolean));
    } catch (err) {
      console.error("[useReportData] branch fetch error:", err);
    }
  }, [scope.isAdmin, scope.institutionId]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    summaries,
    branches,
    loading,
    error,
    lastFetchedAt,
    refresh: fetchData,
    scope,
  };
}
