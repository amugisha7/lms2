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
  TextField,
  CircularProgress,
  Alert,
  Divider,
  Stack,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import AdminBranchScopeSelector from "../../ModelAssets/AdminBranchScopeSelector";

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

      {/* Controls row */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "flex-end",
          mb: 2,
        }}
      >
        {/* Date range */}
        <TextField
          label="Start Date"
          type="date"
          size="small"
          value={startDate || ""}
          onChange={(e) =>
            onStartDateChange && onStartDateChange(e.target.value)
          }
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 160 }}
        />
        <TextField
          label="End Date"
          type="date"
          size="small"
          value={endDate || ""}
          onChange={(e) => onEndDateChange && onEndDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 160 }}
        />

        {/* Actions */}
        <Button
          variant="outlined"
          size="small"
          startIcon={loading ? <CircularProgress size={14} /> : <RefreshIcon />}
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? "Loading…" : "Refresh"}
        </Button>

        {onSaveSnapshot && (
          <Button
            variant="outlined"
            size="small"
            startIcon={saving ? <CircularProgress size={14} /> : <SaveIcon />}
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

      {/* Admin branch selector */}
      {isAdmin && (
        <Box sx={{ mb: 2, maxWidth: 400 }}>
          <AdminBranchScopeSelector
            branches={branches}
            selectedBranchId={selectedBranchId}
            onBranchChange={onBranchChange}
            helperText="Filter by branch (leave blank for institution-wide view)."
            emptyMessage=""
          />
        </Box>
      )}

      {/* Status messages */}
      <Stack spacing={1} sx={{ mb: 2 }}>
        {loadError && <Alert severity="error">{loadError}</Alert>}
        {saveError && <Alert severity="error">{saveError}</Alert>}
        {lastSavedAt && (
          <Alert severity="success">
            Snapshot saved at {new Date(lastSavedAt).toLocaleTimeString()}.
          </Alert>
        )}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Report body */}
      {children}
    </Box>
  );
}
