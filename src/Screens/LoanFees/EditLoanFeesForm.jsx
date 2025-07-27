import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../App";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

const StyledOutlinedInput = styled(OutlinedInput)(({ error, theme }) => ({
  border: error ? "1.5px solid #d32f2f" : `1px solid #e0e0e0`,
  fontSize: "1rem",
}));

const FEE_CALCULATION_OPTIONS = [
  { value: "fixed", label: "I want Fee to be a fixed amount" },
  { value: "percentage", label: "I want Fee to be percentage % based" },
];

const FEE_PERCENTAGE_BASE_OPTIONS = [
  { value: "principal", label: "Total Loan Due Principal Amount" },
  { value: "interest", label: "Total Loan Due Interest Amount" },
  {
    value: "principal_interest",
    label: "Total Loan Due Principal and Interest Amount",
  },
];

const FEE_CATEGORY_OPTIONS = [
  { value: "non_deductable", label: "Non-Deductable Fee" },
  { value: "deductable", label: "Deductable Fee" },
  { value: "capitalized", label: "Capitalized Fee" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function EditLoanFeesForm({
  initialValues,
  onClose,
  onEditSuccess,
}) {
  const client = generateClient();
  const { userDetails } = React.useContext(UserContext);
  const [submitError, setSubmitError] = React.useState("");
  const [submitSuccess, setSubmitSuccess] = React.useState("");

  const [feeCalculation, setFeeCalculation] = React.useState(
    initialValues.calculationMethod || "fixed"
  );
  const [feePercentageBase, setFeePercentageBase] = React.useState(
    initialValues.percentageBase || ""
  );
  const [feeCategory, setFeeCategory] = React.useState(
    initialValues.category || "non_deductable"
  );
  const [status, setStatus] = React.useState(initialValues.status || "active");

  const formik = useFormik({
    initialValues: {
      name: initialValues.name || "",
      description: initialValues.description || "",
      category: initialValues.category || "non_deductable",
      status: initialValues.status || "active",
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required("Fee Name is required")
        .max(100, "Name too long")
        .matches(/^[^,"'!{}]+$/, "Name contains invalid characters"),
      description: Yup.string()
        .max(500, "Description too long")
        .matches(/^[^,"'!{}]+$/, "Description contains invalid characters"),
      category: Yup.string().required("Fee Category is required"),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);

      if (!userDetails || !userDetails.institutionUsersId) {
        setSubmitError("ERROR. Please reload the page or contact support.");
        setSubmitting(false);
        return;
      }

      const allValues = {
        ...values,
        calculationMethod: feeCalculation,
        percentageBase:
          feeCalculation === "percentage" ? feePercentageBase : "",
        status,
      };

      try {
        const result = await client.graphql({
          query: `
            mutation UpdateLoanFeesConfig($input: UpdateLoanFeesConfigInput!) {
              updateLoanFeesConfig(input: $input) {
                id
                name
                category
                calculationMethod
                description
                percentageBase
                status
                institutionLoanFeesConfigsId
              }
            }
          `,
          variables: {
            input: {
              id: initialValues.id,
              name: allValues.name.trim(),
              category: allValues.category,
              calculationMethod: allValues.calculationMethod,
              description: allValues.description?.trim() || null,
              percentageBase: allValues.percentageBase || null,
              status: allValues.status,
              institutionLoanFeesConfigsId:
                userDetails?.institutionUsersId || null,
            },
          },
        });

        setSubmitSuccess("Loan fee config updated!");
        // Immediately update parent table with new row data
        if (onEditSuccess && result?.data?.updateLoanFeesConfig) {
          onEditSuccess(result.data.updateLoanFeesConfig);
        } else if (onClose) {
          onClose();
        }
      } catch (err) {
        setSubmitError("Failed to update loan fee config. Please try again.");
      } finally {
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
        p: { xs: 2, sm: 2 },
        borderRadius: 1,
        display: "flex",
        flexDirection: "column",
        maxWidth: { xs: "100%", md: 800 },
        width: "100%",
        flex: 1,
        mb: 2,
      }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: 600, my: 2, textTransform: "none" }}
      >
        Edit Loan Fee
      </Typography>
      <Grid container spacing={3}>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="name">Name*</FormLabel>
          <StyledOutlinedInput
            id="name"
            name="name"
            placeholder="Loan Fee Name"
            size="small"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            sx={{ maxWidth: 500, mb: 2 }}
          />
          {formik.touched.name && formik.errors.name && (
            <Typography color="error" variant="caption">
              {formik.errors.name}
            </Typography>
          )}
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="description">Description</FormLabel>
          <StyledOutlinedInput
            id="description"
            name="description"
            placeholder="Fee Description (optional)"
            size="small"
            multiline
            rows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            sx={{ maxWidth: 500, mb: 2 }}
          />
          {formik.touched.description && formik.errors.description && (
            <Typography color="error" variant="caption">
              {formik.errors.description}
            </Typography>
          )}
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 12 }}>
          <hr style={{ width: "100%", marginBottom: "20px" }} />
          <Typography sx={{ mb: "20px" }} variant="caption">
            FEES CATEGORY:
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              name="category"
              value={formik.values.category}
              onChange={(e) => {
                formik.handleChange(e);
                setFeeCategory(e.target.value);
              }}
            >
              {FEE_CATEGORY_OPTIONS.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                  sx={{ alignItems: "flex-start", mb: 2 }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 12 }}>
          <hr style={{ width: "100%", marginBottom: "20px" }} />
          <Typography sx={{ mb: "20px" }} variant="caption">
            FEES CALCULATION:
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              name="feeCalculation"
              value={feeCalculation}
              onChange={(e) => {
                const { value } = e.target;
                setFeeCalculation(value);
                if (value === "percentage") {
                  setFeePercentageBase("principal");
                } else {
                  setFeePercentageBase("");
                }
              }}
              row
            >
              {FEE_CALCULATION_OPTIONS.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                  sx={{ mr: 4 }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 12 }}>
          <FormLabel sx={{ fontWeight: 500, mb: 1 }}>
            Calculate Fee percentage % of
          </FormLabel>
          <FormControl
            component="fieldset"
            disabled={feeCalculation !== "percentage"}
          >
            <RadioGroup
              name="feePercentageBase"
              value={feePercentageBase}
              onChange={(e) => setFeePercentageBase(e.target.value)}
            >
              {FEE_PERCENTAGE_BASE_OPTIONS.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                  sx={{ mb: 1 }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 12 }}>
          <FormLabel sx={{ fontWeight: 500, mb: 1 }}>Status</FormLabel>
          <FormControl component="fieldset">
            <RadioGroup
              name="status"
              value={formik.values.status}
              onChange={(e) => {
                formik.handleChange(e);
                setStatus(e.target.value);
              }}
              row
            >
              {STATUS_OPTIONS.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                  sx={{ mr: 4 }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </FormGrid>
      </Grid>
      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={formik.isSubmitting || !formik.values.name}
          sx={{ mr: 2 }}
        >
          {formik.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>
      </Box>
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
    </Box>
  );
}
