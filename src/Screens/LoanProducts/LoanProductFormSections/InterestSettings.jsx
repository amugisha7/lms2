import React from "react";
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";

const INTEREST_METHODS = [
  { value: "flat", label: "Flat Rate" },
  {
    value: "reducing_equal_instalments",
    label: "Reducing Balance - Equal Instalments",
  },
  {
    value: "reducing_equal_principal",
    label: "Reducing Balance - Equal Principle",
  },
  { value: "interest_only", label: "Interest-Only" },
  { value: "compound_accrued", label: "Compound Interest - Accrued" },
  {
    value: "compound_equal_instalments",
    label: "Compound Interest - Equal Instalments",
  },
];

const INTEREST_TYPE_OPTIONS = [
  { value: "percentage", label: "Percentage (%) Based" },
  { value: "fixed", label: "Fixed Amount Per Cycle" },
];

const INTEREST_PERIOD_OPTIONS = [
  { value: "per_day", label: "Per Day" },
  { value: "per_week", label: "Per Week" },
  { value: "bi_weekly", label: "Bi-Weekly" },
  { value: "per_month", label: "Per Month" },
  { value: "per_quarter", label: "Per Quarter" },
  { value: "per_year", label: "Per Year" },
  { value: "per_loan", label: "Per Loan" },
];

export default function InterestSettings({ formik, disabled = false }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
      <Grid size={{ xs: 12, md: 12 }}>
        <hr style={{ width: "100%", marginBottom: "20px" }} />
        <p className="smallFormHeading">INTEREST SETTINGS:</p>
      </Grid>
      {formik.values.interestMethod && (
        <Grid size={{ xs: 12, md: 12 }} sx={{ mb: "-20px" }}>
          <p className="helperText">
            {(() => {
              switch (formik.values.interestMethod) {
                case "flat":
                  return "Flat Rate – Interest is calculated once on the original principal for the entire loan term.";
                case "reducing_equal_instalments":
                  return "Reducing Balance – Equal Instalments – Repayments are equal, but interest is charged on the remaining balance each period.";
                case "reducing_equal_principal":
                  return "Reducing Balance – Equal Principal – Principal repayments are equal each period, causing decreasing total payments as interest reduces over time.";
                case "interest_only":
                  return "Interest-Only – Borrower pays only interest during the term, with the full principal due at the end.";
                case "compound_accrued":
                  return "Compound Interest – Accrued – Interest is added to the outstanding balance periodically, increasing the amount on which future interest is calculated.";
                case "compound_equal_instalments":
                  return "Compound Interest – Equal Instalments – Loan is repaid in equal amounts, with interest compounding on the remaining balance each period.";
                default:
                  return "";
              }
            })()}
          </p>
        </Grid>
      )}

      <Grid size={{ xs: 12, md: 4 }}>
        <FormLabel htmlFor="interestMethod">Interest Method</FormLabel>
        <Select
          id="interestMethod"
          name="interestMethod"
          value={formik.values.interestMethod}
          onChange={formik.handleChange}
          size="small"
          fullWidth
          disabled={disabled}
          renderValue={(selected) => {
            if (!selected) return "Select Interest Method";
            const method = INTEREST_METHODS.find((m) => m.value === selected);
            return method ? method.label : "Select Interest Method";
          }}
          sx={{
            border:
              formik.touched.interestMethod && formik.errors.interestMethod
                ? "1.5px solid #d32f2f"
                : `1px solid ${colors.grey[200]}`,
            width: "100%",
          }}
        >
          <MenuItem value="" disabled sx={{ "&:hover": { color: "white" } }}>
            Select Interest Method
          </MenuItem>
          {INTEREST_METHODS.map((method) => (
            <MenuItem
              key={method.value}
              value={method.value}
              sx={{ "&:hover": { color: "white" } }}
            >
              {method.label}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormLabel htmlFor="interestType">Interest Type</FormLabel>
        <Select
          id="interestType"
          name="interestType"
          value={formik.values.interestType}
          onChange={formik.handleChange}
          size="small"
          fullWidth
          disabled={disabled}
          renderValue={(selected) => {
            if (!selected) return "Select Interest Type";
            const type = INTEREST_TYPE_OPTIONS.find(
              (t) => t.value === selected
            );
            return type ? type.label : "Select Interest Type";
          }}
          sx={{
            border:
              formik.touched.interestType && formik.errors.interestType
                ? "1.5px solid #d32f2f"
                : `1px solid ${colors.grey[200]}`,
            width: "100%",
          }}
        >
          <MenuItem value="" disabled sx={{ "&:hover": { color: "white" } }}>
            Select Interest Type
          </MenuItem>
          {INTEREST_TYPE_OPTIONS.map((type) => (
            <MenuItem
              key={type.value}
              value={type.value}
              sx={{ "&:hover": { color: "white" } }}
            >
              {type.label}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormLabel htmlFor="interestPeriod">Loan Interest Period</FormLabel>
        <Select
          id="interestPeriod"
          name="interestPeriod"
          value={formik.values.interestPeriod || ""}
          onChange={formik.handleChange}
          size="small"
          fullWidth
          disabled={disabled}
          renderValue={(selected) => {
            if (!selected) return "Select Interest Period";
            const found = INTEREST_PERIOD_OPTIONS.find(
              (o) => o.value === selected
            );
            return found ? found.label : "Select Interest Period";
          }}
          sx={{
            border:
              formik.touched.interestPeriod && formik.errors.interestPeriod
                ? "1.5px solid #d32f2f"
                : `1px solid ${colors.grey[200]}`,
            width: "100%",
          }}
        >
          <MenuItem value="" disabled sx={{ "&:hover": { color: "white" } }}>
            Select Interest Period
          </MenuItem>
          {INTEREST_PERIOD_OPTIONS.map((option) => (
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
      <Grid size={{ xs: 12, md: 4 }}>
        <FormLabel htmlFor="minInterest">Minimum Interest Amount</FormLabel>
        <OutlinedInput
          id="minInterest"
          name="minInterest"
          type="number"
          placeholder="Minimum"
          size="small"
          value={formik.values.minInterest}
          onChange={formik.handleChange}
          disabled={disabled}
          sx={{
            border:
              formik.touched.minInterest && formik.errors.minInterest
                ? "1.5px solid #d32f2f"
                : `1px solid ${colors.grey[200]}`,
            width: "100%",
          }}
          error={
            formik.touched.minInterest && Boolean(formik.errors.minInterest)
          }
          inputProps={{ min: 0 }}
        />
        {formik.touched.minInterest && formik.errors.minInterest && (
          <Typography color="error" variant="caption">
            {formik.errors.minInterest}
          </Typography>
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormLabel htmlFor="defaultInterest">Default Interest Amount</FormLabel>
        <OutlinedInput
          id="defaultInterest"
          name="defaultInterest"
          type="number"
          placeholder="Default"
          size="small"
          value={formik.values.defaultInterest}
          onChange={formik.handleChange}
          disabled={disabled}
          sx={{
            border:
              formik.touched.defaultInterest && formik.errors.defaultInterest
                ? "1.5px solid #d32f2f"
                : `1px solid ${colors.grey[200]}`,
            width: "100%",
          }}
          error={
            formik.touched.defaultInterest &&
            Boolean(formik.errors.defaultInterest)
          }
          inputProps={{ min: 0 }}
        />
        {formik.touched.defaultInterest && formik.errors.defaultInterest && (
          <Typography color="error" variant="caption">
            {formik.errors.defaultInterest}
          </Typography>
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormLabel htmlFor="maxInterest">Maximum Interest Amount</FormLabel>
        <OutlinedInput
          id="maxInterest"
          name="maxInterest"
          type="number"
          placeholder="Maximum"
          size="small"
          value={formik.values.maxInterest}
          onChange={formik.handleChange}
          disabled={disabled}
          sx={{
            border:
              formik.touched.maxInterest && formik.errors.maxInterest
                ? "1.5px solid #d32f2f"
                : `1px solid ${colors.grey[200]}`,
            width: "100%",
          }}
          error={
            formik.touched.maxInterest && Boolean(formik.errors.maxInterest)
          }
          inputProps={{ min: 0 }}
        />
        {formik.touched.maxInterest && formik.errors.maxInterest && (
          <Typography color="error" variant="caption">
            {formik.errors.maxInterest}
          </Typography>
        )}
      </Grid>
      {/* Show explanation for selected interest method */}
    </>
  );
}
