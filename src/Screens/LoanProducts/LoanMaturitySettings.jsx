import React from "react";
import {
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  OutlinedInput,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import Grid from "@mui/material/Grid";

const CALCULATE_INTEREST_OPTIONS = [
  "Overdue Principal Amount",
  "Overdue Interest Amount",
  "Overdue (Principal + Interest) Amount",
  "Overdue (Principal + Interest + Fees) Amount",
  "Overdue (Principal + Interest + Penalty) Amount",
  "Overdue (Principal + Interest + Fees + Penalty) Amount",
  "Overdue (Interest + Fees) Amount",
  "Total Principal Amount Released",
  "Total Principal Balance Amount",
  "Maturity Date Installment Only - Overdue Principal Amount",
  "Maturity Date Installment Only - Overdue Interest Amount",
  "Maturity Date Installment Only - Overdue (Principal + Interest) Amount",
  "Maturity Date Installment Only - Overdue (Principal + Interest + Fees) Amount",
  "Maturity Date Installment Only - Overdue (Principal + Interest + Penalty) Amount",
  "Maturity Date Installment Only - Overdue (Principal + Interest + Fees + Penalty) Amount",
  "Maturity Date Installment Only - Overdue (Interest + Fees) Amount",
];

const MATURITY_PERIOD_OPTIONS = [
  "Daily",
  "Weekly",
  "Biweekly",
  "Monthly",
  "Bimonthly",
  "Quarterly",
  "Every 4 Months",
  "Semi-Annual",
  "Every 9 Months",
  "Yearly",
  "Lump-Sum",
];

export default function LoanMaturitySettings({ formik }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 12 }}>
          <hr style={{ width: "100%" }} />
          <Typography variant="caption">LOAN MATURITY SETTINGS:</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Extend Loan After Maturity</FormLabel>
            <RadioGroup
              row
              name="extendLoanAfterMaturity"
              value={formik.values.extendLoanAfterMaturity || "no"}
              onChange={formik.handleChange}
            >
              <FormControlLabel value="no" control={<Radio />} label="No" />
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            </RadioGroup>
          </FormControl>
        </Grid>
        {formik.values.extendLoanAfterMaturity === "yes" && (
          <Grid size={{ xs: 12, md: 12 }}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Interest Type</FormLabel>
              <RadioGroup
                name="interestTypeMaturity"
                value={formik.values.interestTypeMaturity || "percentage"}
                onChange={formik.handleChange}
              >
                <FormControlLabel
                  value="percentage"
                  control={<Radio />}
                  label="I want Interest to be percentage % based"
                />
                <FormControlLabel
                  value="fixed"
                  control={<Radio />}
                  label="I want Interest to be a fixed amount"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        )}
        {formik.values.extendLoanAfterMaturity === "yes" && (
          <>
            <Grid size={{ xs: 12, md: 12 }}>
              <FormControl fullWidth>
                <FormLabel htmlFor="calculateInterestOn">
                  {formik.values.interestTypeMaturity === "fixed"
                    ? "Calculate Interest if there is"
                    : "Calculate Interest on"}
                </FormLabel>
                <Select
                  name="calculateInterestOn"
                  value={formik.values.calculateInterestOn || ""}
                  onChange={formik.handleChange}
                  size="small"
                  sx={{
                    border:
                      formik.touched.calculateInterestOn &&
                      formik.errors.calculateInterestOn
                        ? "1.5px solid #d32f2f"
                        : `1px solid ${colors.grey[200]}`,
                    width: "100%",
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Select an option</em>
                  </MenuItem>
                  {CALCULATE_INTEREST_OPTIONS.map((option) => (
                    <MenuItem
                      key={option}
                      value={option}
                      sx={{
                        whiteSpace: { xs: "normal", sm: "nowrap" },
                        wordBreak: { xs: "break-word", sm: "normal" },
                        "&:hover": { color: "white" },
                      }}
                    >
                      <Box
                        sx={{
                          whiteSpace: { xs: "normal", sm: "nowrap" },
                          wordBreak: { xs: "break-word", sm: "normal" },
                        }}
                      >
                        {option}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormLabel htmlFor="loanInterestRateAfterMaturity">
                {formik.values.interestTypeMaturity === "fixed"
                  ? "Interest Amount After Maturity"
                  : "Interest Rate After Maturity"}
              </FormLabel>
              <OutlinedInput
                id="loanInterestRateAfterMaturity"
                name="loanInterestRateAfterMaturity"
                type="number"
                placeholder="Numbers or decimal only"
                size="small"
                value={formik.values.loanInterestRateAfterMaturity || ""}
                onChange={formik.handleChange}
                sx={{
                  border:
                    formik.touched.calculateInterestOn &&
                    formik.errors.calculateInterestOn
                      ? "1.5px solid #d32f2f"
                      : `1px solid ${colors.grey[200]}`,
                  width: "100%",
                }}
                inputProps={{ min: 0, step: "any" }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormLabel htmlFor="recurringPeriodAfterMaturityUnit">
                Interest Period After Maturity
              </FormLabel>

              <Select
                id="recurringPeriodAfterMaturityUnit"
                name="recurringPeriodAfterMaturityUnit"
                value={formik.values.recurringPeriodAfterMaturityUnit || ""}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                sx={{
                  border:
                    formik.touched.calculateInterestOn &&
                    formik.errors.calculateInterestOn
                      ? "1.5px solid #d32f2f"
                      : `1px solid ${colors.grey[200]}`,
                  width: "100%",
                }}
              >
                <MenuItem value="" disabled>
                  <em>-</em>
                </MenuItem>
                {MATURITY_PERIOD_OPTIONS.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    sx={{ "&:hover": { color: "white" } }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}
