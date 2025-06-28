import React from "react";
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";

const DURATION_PERIOD_OPTIONS = [
  { value: "days", label: "Days" },
  { value: "weeks", label: "Weeks" },
  { value: "months", label: "Months" },
  { value: "years", label: "Years" },
];

export default function DurationSettings({ formik }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
      <Grid size={{ xs: 12, md: 12 }}>
        <hr style={{ width: "100%" }} />
        <Typography variant="caption" sx={{ mt: 2 }}>
          DURATION SETTINGS:
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <FormLabel htmlFor="durationPeriod">Loan Duration Period</FormLabel>
        <Select
          id="durationPeriod"
          name="durationPeriod"
          value={formik.values.durationPeriod || ""}
          onChange={formik.handleChange}
          size="small"
          fullWidth
          renderValue={(selected) => {
            if (!selected) return "Select Duration Period";
            const found = DURATION_PERIOD_OPTIONS.find(
              (o) => o.value === selected
            );
            return found ? found.label : "Select Duration Period";
          }}
          sx={{
            border:
              formik.touched.durationPeriod && formik.errors.durationPeriod
                ? "1.5px solid #d32f2f"
                : `1px solid ${colors.grey[200]}`,
            width: "100%",
          }}
        >
          <MenuItem value="" disabled sx={{ "&:hover": { color: "white" } }}>
            Select Duration Period
          </MenuItem>
          {DURATION_PERIOD_OPTIONS.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{ "&:hover": { color: "white" } }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <FormLabel htmlFor="minDuration">Minimum Duration</FormLabel>
        <OutlinedInput
          id="minDuration"
          name="minDuration"
          type="number"
          placeholder="Minimum"
          size="small"
          value={formik.values.minDuration}
          onChange={formik.handleChange}
          sx={{
            border:
              formik.touched.minDuration && formik.errors.minDuration
                ? "1.5px solid #d32f2f"
                : `1px solid ${colors.grey[200]}`,
            width: "100%",
          }}
          error={
            formik.touched.minDuration && Boolean(formik.errors.minDuration)
          }
          inputProps={{ min: 0 }}
        />
        {formik.touched.minDuration && formik.errors.minDuration && (
          <Typography color="error" variant="caption">
            {formik.errors.minDuration}
          </Typography>
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <FormLabel htmlFor="defaultDuration">Default Duration</FormLabel>
        <OutlinedInput
          id="defaultDuration"
          name="defaultDuration"
          type="number"
          placeholder="Default"
          size="small"
          value={formik.values.defaultDuration}
          onChange={formik.handleChange}
          sx={{
            border:
              formik.touched.defaultDuration && formik.errors.defaultDuration
                ? "1.5px solid #d32f2f"
                : `1px solid ${colors.grey[200]}`,
            width: "100%",
          }}
          error={
            formik.touched.defaultDuration &&
            Boolean(formik.errors.defaultDuration)
          }
          inputProps={{ min: 0 }}
        />
        {formik.touched.defaultDuration && formik.errors.defaultDuration && (
          <Typography color="error" variant="caption">
            {formik.errors.defaultDuration}
          </Typography>
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <FormLabel htmlFor="maxDuration">Maximum Duration</FormLabel>
        <OutlinedInput
          id="maxDuration"
          name="maxDuration"
          type="number"
          placeholder="Maximum"
          size="small"
          value={formik.values.maxDuration}
          onChange={formik.handleChange}
          sx={{
            border:
              formik.touched.maxDuration && formik.errors.maxDuration
                ? "1.5px solid #d32f2f"
                : `1px solid ${colors.grey[200]}`,
            width: "100%",
          }}
          error={
            formik.touched.maxDuration && Boolean(formik.errors.maxDuration)
          }
          inputProps={{ min: 0 }}
        />
        {formik.touched.maxDuration && formik.errors.maxDuration && (
          <Typography color="error" variant="caption">
            {formik.errors.maxDuration}
          </Typography>
        )}
      </Grid>
    </>
  );
}
