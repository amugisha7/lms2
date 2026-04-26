import React from "react";
import { Box, Typography } from "@mui/material";
import DropDownSearchable from "../Resources/FormComponents/DropDownSearchable";

export default function AdminBranchScopeSelector({
  branches,
  selectedBranchId,
  onBranchChange,
  helperText = "Choose a branch before viewing records.",
  emptyMessage = "Please select a branch above to continue.",
}) {
  const normalizedBranches = Array.isArray(branches) ? branches : [];
  const hasSingleBranch = normalizedBranches.length === 1;
  const singleBranchId = hasSingleBranch ? normalizedBranches[0]?.id || "" : "";

  React.useEffect(() => {
    if (
      !hasSingleBranch ||
      !singleBranchId ||
      typeof onBranchChange !== "function"
    ) {
      return;
    }

    if (selectedBranchId !== singleBranchId) {
      onBranchChange(singleBranchId);
    }
  }, [hasSingleBranch, onBranchChange, selectedBranchId, singleBranchId]);

  const branchOptions = React.useMemo(
    () =>
      normalizedBranches.map((branch) => ({
        value: branch.id,
        label: branch.name,
      })),
    [normalizedBranches],
  );

  if (hasSingleBranch) {
    return null;
  }

  return (
    <>
      <Box sx={{ width: "100%", mb: 2 }}>
        <DropDownSearchable
          label="Select Branch"
          name="selectedBranchId"
          placeholder="type to search branches..."
          required={true}
          options={branchOptions}
          value={selectedBranchId || ""}
          onChange={(event) => onBranchChange(event.target.value)}
          helperText={helperText}
        />
      </Box>

      {!selectedBranchId && (
        <Box
          sx={{
            mt: 1,
            mb: 2,
            p: 2,
            backgroundColor: "#e3f2fd",
            border: "1px solid #2196f3",
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: "#1565c0" }}>
            {emptyMessage}
          </Typography>
        </Box>
      )}
    </>
  );
}
