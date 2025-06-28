import React from "react";
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";

export default function BranchSelect({ formik, branches }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Grid item xs={12} md={6}>
      <FormLabel htmlFor="branch">Select a Branch</FormLabel>
      <Select
        id="branch"
        name="branch"
        multiple
        value={formik.values.branch}
        onChange={formik.handleChange}
        size="small"
        fullWidth
        renderValue={(selected) => {
          if (!selected || selected.length === 0) return "Select Branch";
          const selectedLabels = branches
            .filter((b) => selected.includes(b.value))
            .map((b) => b.label);
          return selectedLabels.join(", ");
        }}
        sx={{
          border:
            formik.touched.branch && Boolean(formik.errors.branch)
              ? "1.5px solid #d32f2f"
              : `1px solid ${colors.grey[200]}`,
        }}
      >
        <MenuItem value="" disabled>
          Select Branch
        </MenuItem>
        {branches.map((branch) => (
          <MenuItem
            key={branch.value}
            value={branch.value}
            sx={{
              "&:hover": {
                color: "white",
              },
            }}
          >
            <Checkbox
              checked={
                Array.isArray(formik.values.branch) &&
                formik.values.branch.includes(branch.value)
              }
              size="small"
              sx={{ mr: 1 }}
            />
            {branch.label}
          </MenuItem>
        ))}
      </Select>
      {(!formik.values.branch || formik.values.branch.length === 0) && (
        <Typography variant="caption" sx={{ my: 2, color: "red" }}>
          WARNING: If you do not select any branch, then this loan product will
          not be available to any branch.
        </Typography>
      )}
    </Grid>
  );
}
