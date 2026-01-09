import React from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Settings as SettingsIcon } from "@mui/icons-material";
import PlusButtonMain from "../ModelAssets/PlusButtonMain";
import FormLinkText from "./FormComponents/FormLinkText";

/**
 * Reusable header component for draft documents with configurable checkboxes and action buttons
 */
export default function DraftHeader({
  // Header options
  showCustomHeader = true,
  onCustomHeaderChange,
  hasCustomHeader = false,
  showCustomHeaderFirstPageOnly = true,
  onCustomHeaderFirstPageOnlyChange,

  // Institution display options
  showInstitutionName = true,
  onInstitutionNameChange,
  showBranchName = true,
  onBranchNameChange,

  // Column visibility options
  visibleColumns,
  onColumnVisibilityChange,
  availableColumns,

  // Action buttons
  actions = [],

  // Totals display
  totalsContent,

  // General
  readOnly = false,

  // Additional field checkboxes (for extensibility)
  additionalFields = [],

  // Configurable checkbox rows
  checkboxRows = [],
}) {
  const theme = useTheme();

  const handleColumnChange = (columnKey, checked) => {
    if (onColumnVisibilityChange) {
      onColumnVisibilityChange({
        ...visibleColumns,
        [columnKey]: checked,
      });
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* Action Buttons - Top Most */}
      {actions.length > 0 && (
        <Box
          className="no-print"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            justifyContent: { xs: "flex-start", md: "flex-end" },
          }}
        >
          {actions.map((action, index) => {
            const button = (
              <PlusButtonMain
                key={action.key || index}
                buttonText={action.text}
                variant={action.variant || "outlined"}
                startIcon={action.startIcon ?? null}
                onClick={action.onClick}
                disabled={action.disabled}
              />
            );

            // Wrap in tooltip if provided
            return action.tooltip ? (
              <Tooltip key={action.key || index} title={action.tooltip}>
                <span>{button}</span>
              </Tooltip>
            ) : (
              button
            );
          })}
        </Box>
      )}

      {/* Checkboxes Section */}
      <Box
        className="no-print"
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 1.5,
          //   backgroundColor: theme.palette.grey[50],
          borderRadius: 1,
        }}
      >
        {/* Header Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, minWidth: "80px" }}
          >
            Header:
          </Typography>
          <Box
            sx={{ display: "flex", gap: { xs: 1, sm: 2 }, flexWrap: "wrap" }}
          >
            <FormControlLabel
              sx={{
                m: 0,
                "& .MuiFormControlLabel-label": {
                  fontSize: theme.typography.caption.fontSize,
                },
              }}
              control={
                <Checkbox
                  size="small"
                  checked={showCustomHeader}
                  onChange={(e) => {
                    if (onCustomHeaderChange) {
                      onCustomHeaderChange(e.target.checked);
                    }
                  }}
                  disabled={readOnly || !hasCustomHeader}
                />
              }
              label="Custom Header"
            />
            <FormControlLabel
              sx={{
                m: 0,
                "& .MuiFormControlLabel-label": {
                  fontSize: theme.typography.caption.fontSize,
                },
              }}
              control={
                <Checkbox
                  size="small"
                  checked={showCustomHeaderFirstPageOnly}
                  onChange={(e) => {
                    if (onCustomHeaderFirstPageOnlyChange) {
                      onCustomHeaderFirstPageOnlyChange(e.target.checked);
                    }
                  }}
                  disabled={readOnly || !showCustomHeader}
                />
              }
              label="First Page Only"
            />
            <FormControlLabel
              sx={{
                m: 0,
                "& .MuiFormControlLabel-label": {
                  fontSize: theme.typography.caption.fontSize,
                },
              }}
              control={
                <Checkbox
                  size="small"
                  checked={showInstitutionName}
                  onChange={(e) => {
                    if (onInstitutionNameChange) {
                      onInstitutionNameChange(e.target.checked);
                    }
                  }}
                  disabled={readOnly}
                />
              }
              label="Institution Name"
            />
            <FormControlLabel
              sx={{
                m: 0,
                "& .MuiFormControlLabel-label": {
                  fontSize: theme.typography.caption.fontSize,
                },
              }}
              control={
                <Checkbox
                  size="small"
                  checked={showBranchName}
                  onChange={(e) => {
                    if (onBranchNameChange) {
                      onBranchNameChange(e.target.checked);
                    }
                  }}
                  disabled={readOnly}
                />
              }
              label="Branch Name"
            />
            <FormLinkText
              icon={SettingsIcon}
              linkText="Custom Header"
              linkUrl="/settings?tab=2"
              sx={{
                ml: { xs: 1, sm: 2 },
                "& .MuiLink-root": {
                  fontSize: theme.typography.caption.fontSize,
                },
              }}
            />
          </Box>
        </Box>

        {/* Configurable Checkbox Rows */}
        {checkboxRows.map((row, rowIndex) => (
          <Box
            key={row.key || rowIndex}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, minWidth: "80px" }}
            >
              {row.label}:
            </Typography>
            <Box
              sx={{ display: "flex", gap: { xs: 1, sm: 2 }, flexWrap: "wrap" }}
            >
              {row.checkboxes.map((checkbox) => (
                <FormControlLabel
                  key={checkbox.key}
                  sx={{
                    m: 0,
                    "& .MuiFormControlLabel-label": {
                      fontSize: theme.typography.caption.fontSize,
                    },
                  }}
                  control={
                    <Checkbox
                      size="small"
                      checked={checkbox.checked}
                      onChange={(e) => checkbox.onChange?.(e.target.checked)}
                      disabled={readOnly || checkbox.disabled}
                    />
                  }
                  label={checkbox.label}
                />
              ))}
            </Box>
          </Box>
        ))}

        {/* Show Columns Row */}
        {availableColumns.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, minWidth: "80px" }}
            >
              Columns:
            </Typography>
            <Box
              sx={{ display: "flex", gap: { xs: 1, sm: 2 }, flexWrap: "wrap" }}
            >
              {availableColumns.map((column) => (
                <FormControlLabel
                  key={column.key}
                  sx={{
                    m: 0,
                    "& .MuiFormControlLabel-label": {
                      fontSize: theme.typography.caption.fontSize,
                    },
                  }}
                  control={
                    <Checkbox
                      size="small"
                      checked={visibleColumns[column.key] ?? true}
                      onChange={(e) =>
                        handleColumnChange(column.key, e.target.checked)
                      }
                      disabled={readOnly}
                    />
                  }
                  label={column.label}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Action Buttons and Totals */}
      <Box
        className="no-print"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {totalsContent && <Box>{totalsContent}</Box>}
      </Box>
    </Box>
  );
}
