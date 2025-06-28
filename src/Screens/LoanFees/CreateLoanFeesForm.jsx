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

export default function CreateLoanFeesForm() {
  const [feeCalculation, setFeeCalculation] = React.useState("fixed");
  const [feePercentageBase, setFeePercentageBase] = React.useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      category: "non_deductable",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required("Fee Name is required")
        .max(100, "Name too long"),
      description: Yup.string().max(500, "Description too long"),
      category: Yup.string().required("Fee Category is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      // Log all values including local state
      const allValues = {
        ...values,
        feeCalculation,
        feePercentageBase:
          feeCalculation === "percentage" ? feePercentageBase : "",
      };
      console.log("Loan Fee Form Submission:", allValues);
      setSubmitting(false);
      resetForm();
      alert("Loan fee created!");
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
        width: "100%",
        flex: 1,
        mb: 6,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: 600, my: 2, textTransform: "none" }}
      >
        CREATE A LOAN FEE{" "}
        <Typography variant="caption" sx={{ color: "#90a4ae" }}>
          Help
        </Typography>
      </Typography>
      <Typography variant="caption" sx={{ mb: 1 }}>
        You must provide a 'Name'. Every other field is optional.
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
          <FormGrid size={{ xs: 12, md: 12 }}>
            <Typography variant="caption">FEES CATEGORY:</Typography>
            <hr style={{ width: "100%" }} />
          </FormGrid>

          <FormControl component="fieldset">
            <RadioGroup
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
            >
              <FormControlLabel
                value="non_deductable"
                control={<Radio />}
                label={
                  <Box>
                    <Typography>Non-Deductable Fee</Typography>
                    <Typography variant="caption">
                      This fee appears as a separate line item in the loan
                      schedule. The borrower must make a payment specifically
                      for this fee. You can set the fee amount when creating a
                      new loan &rarr;{" "}
                      <b style={{ color: "#1976d2" }}>Add Loan</b>.
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: "flex-start", mb: 2 }}
              />
              <FormControlLabel
                value="deductable"
                control={<Radio />}
                label={
                  <Box>
                    <Typography>Deductable Fee</Typography>
                    <Typography variant="caption">
                      This fee is automatically taken out of the loan amount
                      when the loan is disbursed. The borrower receives less
                      money but doesn't need to make a separate payment for this
                      fee. It won't appear in the payment schedule. You can set
                      the fee amount when adding a new loan &rarr;{" "}
                      <b style={{ color: "#1976d2" }}>Add Loan</b>.
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: "flex-start", mb: 2 }}
              />
              <FormControlLabel
                value="capitalized"
                control={<Radio />}
                label={
                  <Box>
                    <Typography>Capitalized Fee</Typography>
                    <Typography variant="caption">
                      This fee is added to the loan principal amount, so
                      interest is charged on both the original loan and this
                      fee. The borrower pays back the fee plus interest over the
                      life of the loan through regular payments. You can set the
                      fee amount when adding a new loan &rarr;{" "}
                      <b style={{ color: "#1976d2" }}>Add Loan</b>.
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: "flex-start" }}
              />
            </RadioGroup>
          </FormControl>
        </FormGrid>

        <FormGrid size={{ xs: 12, md: 12 }}>
          <FormGrid size={{ xs: 12, md: 12 }}>
            <Typography variant="caption">FEES CALCULATION:</Typography>
            <hr style={{ width: "100%" }} />
          </FormGrid>
          <Typography variant="caption" sx={{ mb: 1 }}>
            If you choose Fixed Amount, you'll need to enter the exact fee value
            when creating the loan. If you choose Percentage (%), the fee will
            be automatically calculated as a percentage of the loan’s principal
            and/or interest.
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              name="feeCalculation"
              value={feeCalculation}
              onChange={(e) => setFeeCalculation(e.target.value)}
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

        {feeCalculation === "percentage" && (
          <FormGrid size={{ xs: 12, md: 12 }}>
            <FormLabel sx={{ fontWeight: 500, mb: 1 }}>
              Calculate Fee percentage % of
            </FormLabel>
            <FormControl component="fieldset">
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
        )}
      </Grid>

      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={formik.isSubmitting}
          sx={{ mb: 6 }}
        >
          {formik.isSubmitting ? "Saving..." : "Create Loan Fee"}
        </Button>
      </Box>
    </Box>
  );
}
