/**
 * useReportData – hook for fetching all LoanSummary rows for a report scope.
 *
 * Builds report summaries from branch-scoped loan reads with loading state and refresh support.
 * Also loads the branch list for admin users.
 */

import { useState, useEffect, useCallback, useContext } from "react";
import { generateClient } from "aws-amplify/api";
import { listBranches } from "../../graphql/queries";
import { fetchAllReportLoanSummariesForBranch } from "./reportLoanData";
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

  // Mirror LoansDisplay behavior: reports only load once an effective branch exists.
  const effectiveBranchId = scope.isAdmin
    ? (selectedBranchId || null)
    : scope.branchId;

  const fetchData = useCallback(async () => {
    if (!effectiveBranchId) {
      setSummaries([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const client = generateClient();
      const items = await fetchAllReportLoanSummariesForBranch({
        branchId: effectiveBranchId,
        institutionId: scope.institutionId,
        currencyCode: scope.currencyCode,
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
    effectiveBranchId, scope.currencyCode, scope.institutionId,
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
