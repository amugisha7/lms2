/**
 * ReportShell – shared page shell used by all report pages.
 *
 * Provides:
 *  - Page title + description
 *  - Date range controls (startDate / endDate)
 *  - Admin branch selector
 *  - Refresh action
 *  - Snapshot save button
 *  - Export helpers (CSV / JSON) via callback props
 */

import React from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Stack,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import AdminBranchScopeSelector from "../../ModelAssets/AdminBranchScopeSelector";
import DateFilters, { getPresetRange } from "../../ModelAssets/DateFilters";

export default function ReportShell({
  title,
  description,
  // scope
  isAdmin = false,
  branches = [],
  selectedBranchId,
  onBranchChange,
  // date range
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  // actions
  onRefresh,
  loading = false,
  onSaveSnapshot,
  saving = false,
  lastSavedAt = null,
  onExportCsv,
  onExportJson,
  // errors
  loadError,
  saveError,
  // children (report body)
  children,
}) {
  const defaultReportRangeAppliedRef = React.useRef(false);
  const requiresBranchSelection =
    isAdmin && branches.length !== 1 && !selectedBranchId;

  React.useEffect(() => {
    if (
      defaultReportRangeAppliedRef.current ||
      startDate ||
      endDate ||
      typeof onStartDateChange !== "function" ||
      typeof onEndDateChange !== "function"
    ) {
      return;
    }

    const defaultRange = getPresetRange("this_month");
    defaultReportRangeAppliedRef.current = true;
    if (!defaultRange) {
      return;
    }

    onStartDateChange(defaultRange.from);
    onEndDateChange(defaultRange.to);
  }, [endDate, onEndDateChange, onStartDateChange, startDate]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>

      {/* Admin branch selector */}
      {isAdmin && (
        <Box sx={{ mb: 2, maxWidth: 400 }}>
          <AdminBranchScopeSelector
            branches={branches}
            selectedBranchId={selectedBranchId}
            onBranchChange={onBranchChange}
            helperText="Select a branch before viewing report data."
            emptyMessage=""
          />
        </Box>
      )}

      {/* Status messages */}
      <Stack spacing={1} sx={{ mb: 2 }}>
        {requiresBranchSelection && (
          <Alert severity="info">
            Please select a branch above to view report data.
          </Alert>
        )}
        {!requiresBranchSelection && loadError && (
          <Alert severity="error">{loadError}</Alert>
        )}
        {!requiresBranchSelection && saveError && (
          <Alert severity="error">{saveError}</Alert>
        )}
        {!requiresBranchSelection && lastSavedAt && (
          <Alert severity="success">
            Snapshot saved at {new Date(lastSavedAt).toLocaleTimeString()}.
          </Alert>
        )}
      </Stack>

      {!requiresBranchSelection && (
        <>
          <Box sx={{ mb: 2 }}>
            <DateFilters
              dateFrom={startDate || ""}
              dateTo={endDate || ""}
              onDateFromChange={(value) =>
                onStartDateChange && onStartDateChange(value)
              }
              onDateToChange={(value) =>
                onEndDateChange && onEndDateChange(value)
              }
              alwaysVisible={true}
              allowClear={false}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "flex-end",
              mb: 2,
            }}
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={
                loading ? <CircularProgress size={14} /> : <RefreshIcon />
              }
              onClick={onRefresh}
              disabled={loading}
            >
              {loading ? "Loading…" : "Refresh"}
            </Button>

            {onSaveSnapshot && (
              <Button
                variant="outlined"
                size="small"
                startIcon={
                  saving ? <CircularProgress size={14} /> : <SaveIcon />
                }
                onClick={onSaveSnapshot}
                disabled={saving || loading}
              >
                {saving ? "Saving…" : "Save Snapshot"}
              </Button>
            )}

            {onExportCsv && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={onExportCsv}
                disabled={loading}
              >
                Export CSV
              </Button>
            )}

            {onExportJson && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={onExportJson}
                disabled={loading}
              >
                Export JSON
              </Button>
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Report body */}
          {children}
        </>
      )}
    </Box>
  );
}
