import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useContext } from "react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import PrincipalSettings from "./LoanProductFormSections/PrincipalSettings";
import InterestSettings from "./LoanProductFormSections/InterestSettings";
import LoanMaturitySettings from "./LoanProductFormSections/LoanMaturitySettings";
import DurationSettings from "./LoanProductFormSections/DurationSettings";
import RepaymentSettings from "./LoanProductFormSections/RepaymentSettings";
import BranchSelect from "./LoanProductFormSections/BranchSelect";
import { styled } from "@mui/material/styles";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { tokens } from "../../theme";
import LoanFeesSettings from "./LoanProductFormSections/LoanFeesSettings";

// Dummy branches for dropdown (replace with real data as needed)
const BRANCHES = [
  { value: "branch1", label: "Branch 1" },
  { value: "branch2", label: "Branch 2" },
  { value: "branch3", label: "Branch 3" },
];

const StyledOutlinedInput = styled(OutlinedInput)(({ error, theme }) => {
  const colors = tokens(theme.palette.mode);
  return {
    border: error ? "1.5px solid #d32f2f" : `1px solid ${colors.grey[200]}`,
    fontSize: "1rem",
  };
});

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

const baseValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Loan Product Name is required")
    .max(100, "Name too long"),
  minPrincipal: Yup.number()
    .min(0, "Minimum Principal must be at least 0")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  maxPrincipal: Yup.number()
    .min(0, "Maximum Principal must be at least 0")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .when("minPrincipal", (minPrincipal, schema) =>
      minPrincipal !== null && minPrincipal !== undefined && minPrincipal !== ""
        ? schema.min(
            minPrincipal,
            "Maximum Principal must be greater than or equal to Minimum Principal"
          )
        : schema
    ),
  defaultPrincipal: Yup.number()
    .min(0, "Default Principal must be at least 0")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
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
  minInterest: Yup.number()
    .min(0, "Minimum Interest must be at least 0")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  maxInterest: Yup.number()
    .min(0, "Maximum Interest must be at least 0")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .when("minInterest", (minInterest, schema) =>
      minInterest !== null && minInterest !== undefined && minInterest !== ""
        ? schema.min(
            minInterest,
            "Maximum Interest must be greater than or equal to Minimum Interest"
          )
        : schema
    ),
  defaultInterest: Yup.number()
    .min(0, "Default Interest must be at least 0")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .when("minInterest", (minInterestValue, schema) => {
      if (
        minInterestValue !== null &&
        minInterestValue !== undefined &&
        minInterestValue !== ""
      ) {
        const numMinInterest = Number(minInterestValue);
        if (!isNaN(numMinInterest)) {
          return schema.min(
            numMinInterest,
            "Default Interest must be greater than or equal to Minimum Interest"
          );
        }
      }
      return schema;
    })
    .when("maxInterest", (maxInterestValue, schema) => {
      if (
        maxInterestValue !== null &&
        maxInterestValue !== undefined &&
        maxInterestValue !== ""
      ) {
        const numMaxInterest = Number(maxInterestValue);
        if (!isNaN(numMaxInterest)) {
          return schema.max(
            numMaxInterest,
            "Default Interest must be less than or equal to Maximum Interest"
          );
        }
      }
      return schema;
    }),
  durationPeriod: Yup.string()
    .oneOf(["days", "weeks", "months", "years"])
    .nullable(),
  minDuration: Yup.number()
    .min(0, "Minimum Duration must be at least 0")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  maxDuration: Yup.number()
    .min(0, "Maximum Duration must be at least 0")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .when("minDuration", (minDuration, schema) =>
      minDuration !== null && minDuration !== undefined && minDuration !== ""
        ? schema.min(
            minDuration,
            "Maximum Duration must be greater than or equal to Minimum Duration"
          )
        : schema
    ),
  defaultDuration: Yup.number()
    .min(0, "Default Duration must be at least 0")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .when("minDuration", (minDurationValue, schema) => {
      if (
        minDurationValue !== null &&
        minDurationValue !== undefined &&
        minDurationValue !== ""
      ) {
        const numMinDuration = Number(minDurationValue);
        if (!isNaN(numMinDuration)) {
          return schema.min(
            numMinDuration,
            "Default Duration must be greater than or equal to Minimum Duration"
          );
        }
      }
      return schema;
    })
    .when("maxDuration", (maxDurationValue, schema) => {
      if (
        maxDurationValue !== null &&
        maxDurationValue !== undefined &&
        maxDurationValue !== ""
      ) {
        const numMaxDuration = Number(maxDurationValue);
        if (!isNaN(numMaxDuration)) {
          return schema.max(
            numMaxDuration,
            "Default Duration must be less than or equal to Maximum Duration"
          );
        }
      }
      return schema;
    }),
  repaymentFrequency: Yup.string()
    .oneOf([
      "daily",
      "weekly",
      "biweekly",
      "monthly",
      "bimonthly",
      "quarterly",
      "every_4_months",
      "semi_annual",
      "every_9_months",
      "yearly",
      "lump_sum",
    ])
    .nullable(),
  // All other fields are optional
});

export default function CreateLoanProductFormOptimized(props) {
  const { userDetails } = useContext(UserContext);
  const navigate = useNavigate();
  const [submitError, setSubmitError] = React.useState("");
  const [submitSuccess, setSubmitSuccess] = React.useState("");
  const [validationSchema, setValidationSchema] =
    React.useState(baseValidationSchema);
  const [selectedLoanFees, setSelectedLoanFees] = React.useState([]);

  const repaymentOrderRef = React.useRef();

  const formik = useFormik({
    initialValues: {
      name: "",
      branch: [],
      minPrincipal: "",
      defaultPrincipal: "",
      maxPrincipal: "",
      interestMethod: "",
      interestType: "",
      minInterest: "",
      defaultInterest: "",
      maxInterest: "",
      interestPeriod: "",
      durationPeriod: "",
      minDuration: "",
      defaultDuration: "",
      maxDuration: "",
      repaymentFrequency: "",
    },
    validationSchema, // now uses state
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      let repaymentOrder = null;
      if (
        repaymentOrderRef.current &&
        repaymentOrderRef.current.getRepaymentOrder
      ) {
        repaymentOrder = repaymentOrderRef.current.getRepaymentOrder();
      }
      // Capitalize each word and join with commas, e.g. "Fees, Interest, Penalty, Principal"
      const repaymentOrderString = Array.isArray(repaymentOrder)
        ? repaymentOrder
            .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
            .join(",")
        : "";
      console.log(
        "Loan Product Form Values:",
        values,
        "Repayment Order:",
        repaymentOrderString,
        "Loan Maturity Settings:",
        {
          extendLoanAfterMaturity: values.extendLoanAfterMaturity,
          interestTypeMaturity: values.interestTypeMaturity,
          calculateInterestOn: values.calculateInterestOn,
          loanInterestRateAfterMaturity: values.loanInterestRateAfterMaturity,
          recurringPeriodAfterMaturityUnit:
            values.recurringPeriodAfterMaturityUnit,
        }
      );
      console.log("Selected Loan Fee IDs:", selectedLoanFees);
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);
      try {
        // Replace with your actual API call
        setSubmitSuccess("Loan product created successfully!");
        setSubmitting(false);
        resetForm();
        // setTimeout(() => {
        //   navigate("/loanProducts");
        // }, 1500);
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
          <BranchSelect formik={formik} branches={BRANCHES} />
        </FormGrid>
        <PrincipalSettings formik={formik} />
        <InterestSettings formik={formik} />
        <DurationSettings formik={formik} />
        <RepaymentSettings formik={formik} ref={repaymentOrderRef} />
        <LoanMaturitySettings formik={formik} />
        <FormGrid size={{ xs: 12, md: 12 }}>
          <LoanFeesSettings
            value={selectedLoanFees}
            onChange={setSelectedLoanFees}
          />
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
