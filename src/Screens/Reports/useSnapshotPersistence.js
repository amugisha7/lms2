/**
 * useSnapshotPersistence – hook for saving FinancialReport snapshots.
 *
 * Wraps the createFinancialReport GraphQL mutation.
 * The saved payload contains both the computed results and the generation parameters.
 */

import { useState, useCallback } from "react";
import { generateClient } from "aws-amplify/api";
import { createFinancialReport } from "../../graphql/mutations";

export function useSnapshotPersistence() {
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [saveError, setSaveError] = useState(null);

  /**
   * Save a report snapshot.
   *
   * @param {object} params
   * @param {string} params.reportType       - e.g. "loan_portfolio_overview"
   * @param {string} params.reportName       - Human-readable name for this snapshot
   * @param {string} [params.startDate]      - ISO date string (report window start)
   * @param {string} [params.endDate]        - ISO date string (report window end)
   * @param {string} [params.branchId]       - branchFinancialReportsId (branch scope)
   * @param {object} params.reportData       - Main computed payload (will be JSON-stringified)
   * @param {object} [params.customDetails]  - Generation parameters such as matrix, scope etc.
   */
  const saveSnapshot = useCallback(
    async ({
      reportType,
      reportName,
      startDate,
      endDate,
      branchId,
      reportData,
      customDetails,
    }) => {
      setSaving(true);
      setSaveError(null);
      try {
        const client = generateClient();
        const input = {
          reportType,
          reportName: reportName || reportType,
          reportDate: new Date().toISOString().slice(0, 10),
          startDate: startDate || null,
          endDate: endDate || null,
          status: "generated",
          reportData: JSON.stringify(reportData || {}),
          customFinancialReportDetails: JSON.stringify(customDetails || {}),
          ...(branchId ? { branchFinancialReportsId: branchId } : {}),
        };

        await client.graphql({
          query: createFinancialReport,
          variables: { input },
        });

        setLastSavedAt(Date.now());
        return true;
      } catch (err) {
        console.error("[useSnapshotPersistence] save error:", err);
        setSaveError("Failed to save snapshot. Please try again.");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  return { saveSnapshot, saving, lastSavedAt, saveError };
}
