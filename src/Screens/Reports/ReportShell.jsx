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
import { useTheme } from "@mui/material/styles";
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
  showDateFilters = true,
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
  const theme = useTheme();
  const sf = theme.palette.sf;
  const defaultReportRangeAppliedRef = React.useRef(false);
  const requiresBranchSelection =
    isAdmin && branches.length !== 1 && !selectedBranchId;

  const actionButtonSx = {
    borderRadius: 0,
    borderColor: sf.sf_borderLight,
    color: sf.sf_brandPrimary,
    bgcolor: sf.sf_cardBg,
    px: 1.35,
    "&:hover": {
      borderColor: sf.sf_brandPrimary,
      bgcolor: sf.sf_actionHoverBg,
    },
  };

  React.useEffect(() => {
    if (
      !showDateFilters ||
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
  }, [endDate, onEndDateChange, onStartDateChange, showDateFilters, startDate]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          mb: 3,
          pb: 1.5,
          borderBottom: `3px solid ${sf.sf_brandPrimary}`,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
            gutterBottom
            sx={{ color: sf.sf_textPrimary, mb: 0.4 }}
          >
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" sx={{ color: sf.sf_textTertiary }}>
              {description}
            </Typography>
          )}
        </Box>
        {!requiresBranchSelection && (
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: sf.sf_textTertiary,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {loading ? "Refreshing report" : "Report ready"}
          </Typography>
        )}
      </Box>

      {/* Admin branch selector */}
      {isAdmin && (
        <Box sx={{ mb: 2 }}>
          <AdminBranchScopeSelector
            branches={branches}
            selectedBranchId={selectedBranchId}
            onBranchChange={onBranchChange}
            helperText="Select a branch before viewing report data."
            emptyMessage="Please select a branch above to view report data."
          />
        </Box>
      )}

      {/* Status messages */}
      <Stack spacing={1} sx={{ mb: 2 }}>
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
          {showDateFilters && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                border: `1px solid ${sf.sf_borderLight}`,
                bgcolor: sf.sf_cardBg,
                boxShadow: sf.sf_shadowSm,
              }}
            >
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
          )}

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "flex-end",
              mb: 2,
              p: 1.5,
              border: `1px solid ${sf.sf_borderLight}`,
              bgcolor: sf.sf_cardBg,
              boxShadow: sf.sf_shadowSm,
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
              sx={actionButtonSx}
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
                sx={actionButtonSx}
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
                sx={actionButtonSx}
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
                sx={actionButtonSx}
              >
                Export JSON
              </Button>
            )}
          </Box>

          <Divider sx={{ mb: 3, borderColor: sf.sf_borderLight }} />

          {/* Report body */}
          {children}
        </>
      )}
    </Box>
  );
}
