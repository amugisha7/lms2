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
import { tokens } from "../../../theme";
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
  "Every 2 weeks",
  "Monthly",
  "Every 2 Months",
  "Every 3 Months",
  "Every 4 Months",
  "Every 6 Months",
  "Every 9 Months",
  "Yearly",
  "One-off / Lump-Sum",
];

export default function LoanMaturitySettings({ formik, disabled = false }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 12 }}>
          <hr style={{ width: "100%", marginBottom: "20px" }} />
          <p className="smallFormHeading">LOAN MATURITY SETTINGS:</p>
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <FormControl component="fieldset" fullWidth disabled={disabled}>
            <Typography>Should the Loan extend after Maturity?</Typography>
            <RadioGroup
              row
              name="extendLoanAfterMaturity"
              value={formik.values.extendLoanAfterMaturity || "no"}
              onChange={formik.handleChange}
              disabled={disabled}
            >
              <FormControlLabel
                value="no"
                control={<Radio />}
                label="No"
                disabled={disabled}
              />
              <FormControlLabel
                value="yes"
                control={<Radio />}
                label="Yes"
                disabled={disabled}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        {/* Wrap all maturity fields in a fragment and control their disabled state */}
        <React.Fragment>
          <Grid size={{ xs: 12, md: 12 }}>
            <FormControl
              component="fieldset"
              fullWidth
              disabled={
                disabled || formik.values.extendLoanAfterMaturity !== "yes"
              }
            >
              <FormLabel component="legend">
                <span
                  style={{
                    opacity:
                      formik.values.extendLoanAfterMaturity === "yes" ? 1 : 0.5,
                  }}
                >
                  Interest Type after Maturity
                </span>
              </FormLabel>
              <RadioGroup
                name="interestTypeMaturity"
                value={formik.values.interestTypeMaturity || "percentage"}
                onChange={formik.handleChange}
                disabled={disabled}
              >
                <FormControlLabel
                  value="percentage"
                  control={<Radio />}
                  label={
                    <span
                      style={{
                        opacity:
                          formik.values.extendLoanAfterMaturity === "yes"
                            ? 1
                            : 0.5,
                      }}
                    >
                      I want Interest to be percentage % based
                    </span>
                  }
                  disabled={formik.values.extendLoanAfterMaturity !== "yes"}
                />
                <FormControlLabel
                  value="fixed"
                  control={<Radio />}
                  label={
                    <span
                      style={{
                        opacity:
                          formik.values.extendLoanAfterMaturity === "yes"
                            ? 1
                            : 0.5,
                      }}
                    >
                      I want Interest to be a fixed amount
                    </span>
                  }
                  disabled={formik.values.extendLoanAfterMaturity !== "yes"}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <FormControl
              fullWidth
              disabled={
                disabled || formik.values.extendLoanAfterMaturity !== "yes"
              }
            >
              <FormLabel htmlFor="calculateInterestOn">
                <span
                  style={{
                    opacity:
                      formik.values.extendLoanAfterMaturity === "yes" ? 1 : 0.5,
                  }}
                >
                  {formik.values.interestTypeMaturity === "fixed"
                    ? "Calculate Interest if there is"
                    : "Calculate Interest on"}
                </span>
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
                disabled={
                  disabled || formik.values.extendLoanAfterMaturity !== "yes"
                }
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
              <span
                style={{
                  opacity:
                    formik.values.extendLoanAfterMaturity === "yes" ? 1 : 0.5,
                }}
              >
                {formik.values.interestTypeMaturity === "fixed"
                  ? "Interest Amount After Maturity"
                  : "Interest Rate After Maturity"}
              </span>
            </FormLabel>
            <OutlinedInput
              id="loanInterestRateAfterMaturity"
              name="loanInterestRateAfterMaturity"
              type="number"
              placeholder="Numbers or decimal only"
              size="small"
              value={formik.values.loanInterestRateAfterMaturity || ""}
              onChange={formik.handleChange}
              disabled={
                disabled || formik.values.extendLoanAfterMaturity !== "yes"
              }
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
              <span
                style={{
                  opacity:
                    formik.values.extendLoanAfterMaturity === "yes" ? 1 : 0.5,
                }}
              >
                Interest Period After Maturity
              </span>
            </FormLabel>
            <Select
              id="recurringPeriodAfterMaturityUnit"
              name="recurringPeriodAfterMaturityUnit"
              value={formik.values.recurringPeriodAfterMaturityUnit || ""}
              onChange={formik.handleChange}
              size="small"
              fullWidth
              disabled={
                disabled || formik.values.extendLoanAfterMaturity !== "yes"
              }
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
        </React.Fragment>
      </Grid>
    </>
  );
}
