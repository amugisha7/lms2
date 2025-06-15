import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { generateClient } from "aws-amplify/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useContext, useEffect } from "react";
import { UserContext } from "../../App";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Checkbox from "@mui/material/Checkbox";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

const StyledOutlinedInput = styled(OutlinedInput)(({ error, theme }) => {
  const colors = tokens(theme.palette.mode);
  return {
    border: error ? "1.5px solid #d32f2f" : `1px solid ${colors.grey[200]}`,
    fontSize: "1rem",
  };
});

const StyledSelect = styled(Select)(({ error, theme }) => {
  const colors = tokens(theme.palette.mode);
  return {
    border: error ? "1.5px solid #d32f2f" : `1px solid ${colors.grey[200]}`,
    fontSize: "1rem",
  };
});

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

// Dummy branches for dropdown (replace with real data as needed)
const BRANCHES = [
  { value: "branch1", label: "Branch 1" },
  { value: "branch2", label: "Branch 2" },
  { value: "branch3", label: "Branch 3" },
];

export default function CreateLoanProductForm(props) {
  const { userDetails } = useContext(UserContext);
  const navigate = useNavigate();
  const [submitError, setSubmitError] = React.useState("");
  const [submitSuccess, setSubmitSuccess] = React.useState("");

  const client = generateClient();

  const formik = useFormik({
    initialValues: {
      name: "",
      branch: [],
      minPrincipal: "",
      defaultPrincipal: "",
      maxPrincipal: "",
      interestMethod: "",
      interestType: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required("Loan Product Name is required")
        .max(100, "Name too long"),
      minPrincipal: Yup.number()
        .min(0, "Minimum Principal must be at least 0")
        .nullable()
        .transform((value, originalValue) =>
          originalValue === "" ? null : value
        ),
      maxPrincipal: Yup.number()
        .min(0, "Maximum Principal must be at least 0")
        .nullable()
        .transform((value, originalValue) =>
          originalValue === "" ? null : value
        )
        .when("minPrincipal", (minPrincipal, schema) =>
          minPrincipal !== null &&
          minPrincipal !== undefined &&
          minPrincipal !== ""
            ? schema.min(
                minPrincipal,
                "Maximum Principal must be greater than or equal to Minimum Principal"
              )
            : schema
        ),
      defaultPrincipal: Yup.number()
        .min(0, "Default Principal must be at least 0")
        .nullable()
        .transform((value, originalValue) =>
          originalValue === "" ? null : value
        )
        .when("minPrincipal", (minPrincipalValue, schema) => {
          if (
            minPrincipalValue !== null &&
            minPrincipalValue !== undefined &&
            minPrincipalValue !== ""
          ) {
            const numMinPrincipal = Number(minPrincipalValue);
            if (!isNaN(numMinPrincipal)) {
              return schema.min(
                numMinPrincipal,
                "Default Principal must be greater than or equal to Minimum Principal"
              );
            }
          }
          return schema;
        })
        .when("maxPrincipal", (maxPrincipalValue, schema) => {
          if (
            maxPrincipalValue !== null &&
            maxPrincipalValue !== undefined &&
            maxPrincipalValue !== ""
          ) {
            const numMaxPrincipal = Number(maxPrincipalValue);
            if (!isNaN(numMaxPrincipal)) {
              return schema.max(
                numMaxPrincipal,
                "Default Principal must be less than or equal to Maximum Principal"
              );
            }
          }
          return schema;
        }),
      // All other fields are optional
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);

      try {
        // Replace with your actual API call
        // await client.graphql({ ... });

        setSubmitSuccess("Loan product created successfully!");
        setSubmitting(false);
        resetForm();

        setTimeout(() => {
          navigate("/loanProducts");
        }, 1500);
      } catch (err) {
        setSubmitError("Failed to create loan product. Please try again.");
        setSubmitting(false);
      }
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        mx: { xs: 0, sm: "auto" },
        mt: { xs: 0, sm: 0 },
        p: { xs: 0, sm: 0 },
        borderRadius: 1,
        display: "flex",
        flexDirection: "column",
        maxWidth: { xs: "100%", md: 800 },
        mx: "auto",
        width: "100%",
        flex: 1,
        mb: 6,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: 600, my: 2, textTransform: "uppercase" }}
      >
        Create a New Loan Product
      </Typography>

      <Typography variant="caption" sx={{ my: 2 }}>
        All fields are optional but you must provide a Loan Product Name.
      </Typography>

      <Grid container spacing={3}>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="name">Loan Product Name*</FormLabel>
          <StyledOutlinedInput
            id="name"
            name="name"
            placeholder="Enter Loan Product Name"
            size="small"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
          />
          {formik.touched.name && formik.errors.name && (
            <Typography color="error" variant="caption">
              {formik.errors.name}
            </Typography>
          )}
        </FormGrid>

        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="branch">Select a Branch</FormLabel>
          <StyledSelect
            id="branch"
            name="branch"
            multiple
            value={formik.values.branch}
            onChange={formik.handleChange}
            error={false}
            size="small"
            fullWidth
            renderValue={(selected) => {
              if (!selected || selected.length === 0) return "Select Branch";
              const selectedLabels = BRANCHES.filter((b) =>
                selected.includes(b.value)
              ).map((b) => b.label);
              return selectedLabels.join(", ");
            }}
          >
            <MenuItem
              value=""
              disabled
              sx={{
                "&:hover": {
                  color: "white",
                },
              }}
            >
              Select Branch
            </MenuItem>
            {BRANCHES.map((branch) => (
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
                  sx={{
                    mr: 1,
                    "&:hover": {
                      color: "white !important",
                    },
                  }}
                />
                {branch.label}
              </MenuItem>
            ))}
          </StyledSelect>
          {(!formik.values.branch || formik.values.branch.length === 0) && (
            <Typography variant="caption" sx={{ my: 2, color: "red" }}>
              WARNING: If you do not select any branch, then this loan product
              will not be available to any branch.
            </Typography>
          )}
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 12 }}>
          <Typography variant="caption">PRINCIPAL SETTINGS:</Typography>
          <hr style={{ width: "100%" }} />
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 4 }}>
          <FormLabel htmlFor="minPrincipal">Minimum Principal Amount</FormLabel>
          <StyledOutlinedInput
            id="minPrincipal"
            name="minPrincipal"
            type="number"
            placeholder="Minimum"
            size="small"
            value={formik.values.minPrincipal}
            onChange={formik.handleChange}
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
        </FormGrid>

        <FormGrid size={{ xs: 12, md: 4 }}>
          <FormLabel htmlFor="defaultPrincipal">
            Default Principal Amount
          </FormLabel>
          <StyledOutlinedInput
            id="defaultPrincipal"
            name="defaultPrincipal"
            type="number"
            placeholder="Default"
            size="small"
            value={formik.values.defaultPrincipal}
            onChange={formik.handleChange}
            error={
              formik.touched.defaultPrincipal &&
              Boolean(formik.errors.defaultPrincipal)
            }
            inputProps={{ min: 0 }}
          />
          {formik.touched.defaultPrincipal &&
            formik.errors.defaultPrincipal && (
              <Typography color="error" variant="caption">
                {formik.errors.defaultPrincipal}
              </Typography>
            )}
        </FormGrid>

        <FormGrid size={{ xs: 12, md: 4 }}>
          <FormLabel htmlFor="maxPrincipal">Maximum Principal Amount</FormLabel>
          <StyledOutlinedInput
            id="maxPrincipal"
            name="maxPrincipal"
            type="number"
            placeholder="Maximum"
            size="small"
            value={formik.values.maxPrincipal}
            onChange={formik.handleChange}
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
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 12 }}>
          <Typography variant="caption" sx={{ mt: 2 }}>
            INTEREST SETTINGS:
          </Typography>
          <hr style={{ width: "100%" }} />
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="interestMethod">Interest Method</FormLabel>
          <StyledSelect
            id="interestMethod"
            name="interestMethod"
            value={formik.values.interestMethod}
            onChange={formik.handleChange}
            error={false}
            size="small"
            fullWidth
            renderValue={(selected) => {
              if (!selected) return "Select Interest Method";
              const method = INTEREST_METHODS.find((m) => m.value === selected);
              return method ? method.label : "Select Interest Method";
            }}
          >
            <MenuItem
              value=""
              disabled
              sx={{
                "&:hover": {
                  color: "white",
                },
              }}
            >
              Select Interest Method
            </MenuItem>
            {INTEREST_METHODS.map((method) => (
              <MenuItem
                key={method.value}
                value={method.value}
                sx={{
                  "&:hover": {
                    color: "white",
                  },
                }}
              >
                {method.label}
              </MenuItem>
            ))}
          </StyledSelect>
        </FormGrid>

        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="interestType">Interest Type</FormLabel>
          <StyledSelect
            id="interestType"
            name="interestType"
            value={formik.values.interestType}
            onChange={formik.handleChange}
            error={false}
            size="small"
            fullWidth
            renderValue={(selected) => {
              if (!selected || selected.length === 0)
                return "Select Interest Type";
              const type = INTEREST_TYPE_OPTIONS.find(
                (t) => t.value === selected
              );
              return type ? type.label : "Select Interest Type";
            }}
          >
            <MenuItem
              value=""
              disabled
              sx={{
                "&:hover": {
                  color: "white",
                },
              }}
            >
              Select Interest Type
            </MenuItem>
            {INTEREST_TYPE_OPTIONS.map((type) => (
              <MenuItem
                key={type.value}
                value={type.value}
                sx={{
                  "&:hover": {
                    color: "white",
                  },
                }}
              >
                {type.label}
              </MenuItem>
            ))}
          </StyledSelect>
        </FormGrid>

        {/* Loan Interest Period Dropdown */}
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="interestPeriod">Loan Interest Period</FormLabel>
          <StyledSelect
            id="interestPeriod"
            name="interestPeriod"
            value={formik.values.interestPeriod || ""}
            onChange={formik.handleChange}
            error={false}
            size="small"
            fullWidth
            renderValue={(selected) => {
              if (!selected) return "Select Interest Period";
              const found = INTEREST_PERIOD_OPTIONS.find(
                (o) => o.value === selected
              );
              return found ? found.label : "Select Interest Period";
            }}
          >
            <MenuItem value="" disabled>
              Select Interest Period
            </MenuItem>
            {INTEREST_PERIOD_OPTIONS.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  "&:hover": {
                    color: "white",
                  },
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </StyledSelect>
        </FormGrid>
      </Grid>

      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        {submitError && (
          <Typography color="error" sx={{ mb: 1 }}>
            {submitError}
          </Typography>
        )}
        {submitSuccess && (
          <Typography color="primary" sx={{ mb: 1 }}>
            {submitSuccess}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={!formik.values.name || formik.isSubmitting}
          sx={{ mb: 6 }}
        >
          {formik.isSubmitting ? "Creating..." : "Create Loan Product"}
        </Button>
      </Box>
    </Box>
  );
}
