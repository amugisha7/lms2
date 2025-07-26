import React from "react";
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";

export default function PrincipalSettings({ formik }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Grid size={{ xs: 12, md: 12 }}>
        <hr style={{ width: "100%", marginBottom: "20px" }} />
        <Typography variant="caption">PRINCIPAL SETTINGS:</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormLabel htmlFor="minPrincipal">Minimum Principal Amount</FormLabel>
        <OutlinedInput
          id="minPrincipal"
          name="minPrincipal"
          type="number"
          placeholder="Minimum"
          size="small"
          value={formik.values.minPrincipal}
          onChange={formik.handleChange}
          sx={{
            border:
              formik.touched.minPrincipal && formik.errors.minPrincipal
                ? "1.5px solid #d32f2f"
                : `1px solid ${colors.grey[200]}`,
            width: "100%",
          }}
          error={
            formik.touched.minPrincipal && Boolean(formik.errors.minPrincipal)
          }
          inputProps={{ min: 0 }}
        />
        {formik.touched.minPrincipal && formik.errors.minPrincipal && (
          <Typography color="error" variant="caption">
            {formik.errors.minPrincipal}
          </Typography>
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormLabel htmlFor="defaultPrincipal">
          Default Principal Amount
        </FormLabel>
        <OutlinedInput
          id="defaultPrincipal"
          name="defaultPrincipal"
          type="number"
          placeholder="Default"
          size="small"
          value={formik.values.defaultPrincipal}
          onChange={formik.handleChange}
          sx={{
            border:
              formik.touched.defaultPrincipal && formik.errors.defaultPrincipal
                ? "1.5px solid #d32f2f"
                : `1px solid ${colors.grey[200]}`,
            width: "100%",
          }}
          error={
            formik.touched.defaultPrincipal &&
            Boolean(formik.errors.defaultPrincipal)
          }
          inputProps={{ min: 0 }}
        />
        {formik.touched.defaultPrincipal && formik.errors.defaultPrincipal && (
          <Typography color="error" variant="caption">
            {formik.errors.defaultPrincipal}
          </Typography>
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormLabel htmlFor="maxPrincipal">Maximum Principal Amount</FormLabel>
        <OutlinedInput
          id="maxPrincipal"
          name="maxPrincipal"
          type="number"
          placeholder="Maximum"
          size="small"
          value={formik.values.maxPrincipal}
          onChange={formik.handleChange}
          sx={{
            border:
              formik.touched.maxPrincipal && formik.errors.maxPrincipal
                ? "1.5px solid #d32f2f"
                : `1px solid ${colors.grey[200]}`,
            width: "100%",
          }}
          error={
            formik.touched.maxPrincipal && Boolean(formik.errors.maxPrincipal)
          }
          inputProps={{ min: 0 }}
        />
        {formik.touched.maxPrincipal && formik.errors.maxPrincipal && (
          <Typography color="error" variant="caption">
            {formik.errors.maxPrincipal}
          </Typography>
        )}
      </Grid>
    </>
  );
}
