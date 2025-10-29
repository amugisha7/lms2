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
import PrincipalSettings from "./EditLoanProductFormSections/PrincipalSettings";
import InterestSettings from "./EditLoanProductFormSections/InterestSettings";
import LoanMaturitySettings from "./EditLoanProductFormSections/LoanMaturitySettings";
import DurationSettings from "./EditLoanProductFormSections/DurationSettings";
import RepaymentSettings from "./EditLoanProductFormSections/RepaymentSettings";
import LoanBranchesSelect from "./EditLoanProductFormSections/LoanBranchesSelect";
import { styled } from "@mui/material/styles";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { tokens } from "../../theme";
import LoanFeesSettings from "./EditLoanProductFormSections/LoanFeesSettings";
import { generateClient } from "aws-amplify/api";
import CustomEditFormButtons from "../../ComponentAssets/CustomEditFormButtons";

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

export default function EditLoanProductForm(props) {
  const { initialValues, isViewMode = false, onClose, onEditSuccess } = props;
  const { userDetails } = useContext(UserContext);
  const navigate = useNavigate();
  const [submitError, setSubmitError] = React.useState("");
  const [submitSuccess, setSubmitSuccess] = React.useState("");
  const [validationSchema, setValidationSchema] =
    React.useState(baseValidationSchema);
  const [selectedLoanFees, setSelectedLoanFees] = React.useState("");
  const [editMode, setEditMode] = React.useState(!isViewMode);

  const repaymentOrderRef = React.useRef();
  const client = generateClient();

  // Helper to build payload for API (for both create and update)
  const buildLoanProductInput = (
    values,
    repaymentOrder,
    selectedLoanFees,
    userDetails,
    isUpdate = false
  ) => {
    const input = {
      name: values.name,
      description: "",
      principalAmountMin: values.minPrincipal
        ? Number(values.minPrincipal)
        : null,
      principalAmountMax: values.maxPrincipal
        ? Number(values.maxPrincipal)
        : null,
      principalAmountDefault: values.defaultPrincipal
        ? Number(values.defaultPrincipal)
        : null,
      interestRateMin: values.minInterest ? Number(values.minInterest) : null,
      interestRateMax: values.maxInterest ? Number(values.maxInterest) : null,
      interestRateDefault: values.defaultInterest
        ? Number(values.defaultInterest)
        : null,
      interestCalculationMethod: values.interestMethod || null,
      interestType: values.interestType || null,
      interestPeriod: values.interestPeriod || null,
      termDurationMin: values.minDuration ? Number(values.minDuration) : null,
      termDurationMax: values.maxDuration ? Number(values.maxDuration) : null,
      termDurationDefault: values.defaultDuration
        ? Number(values.defaultDuration)
        : null,
      durationPeriod: values.durationPeriod || null,
      repaymentFrequency: values.repaymentFrequency || null,
      repaymentOrder: repaymentOrder ? JSON.stringify(repaymentOrder) : null,
      extendLoanAfterMaturity:
        values.extendLoanAfterMaturity === "yes" ? true : false,
      interestTypeMaturity: values.interestTypeMaturity || null,
      calculateInterestOn: values.calculateInterestOn || null,
      loanInterestRateAfterMaturity: values.loanInterestRateAfterMaturity
        ? Number(values.loanInterestRateAfterMaturity)
        : null,
      recurringPeriodAfterMaturityUnit:
        values.recurringPeriodAfterMaturityUnit || null,
    };

    if (isUpdate) {
      input.id = initialValues.id;
    } else {
      input.institutionLoanProductsId = userDetails?.institutionUsersId || null;
    }

    return input;
  };

  // Transform initial values from API format to form format
  const getFormInitialValues = (apiValues) => {
    if (!apiValues) {
      return {
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
        extendLoanAfterMaturity: "",
        interestTypeMaturity: "",
        calculateInterestOn: "",
        loanInterestRateAfterMaturity: "",
        recurringPeriodAfterMaturityUnit: "",
      };
    }

    return {
      name: apiValues.name || "",
      branch: apiValues.branches?.items?.map((item) => item.branchId) || [],
      minPrincipal: apiValues.principalAmountMin || "",
      defaultPrincipal: apiValues.principalAmountDefault || "",
      maxPrincipal: apiValues.principalAmountMax || "",
      interestMethod: apiValues.interestCalculationMethod || "",
      interestType: apiValues.interestType || "",
      minInterest: apiValues.interestRateMin || "",
      defaultInterest: apiValues.interestRateDefault || "",
      maxInterest: apiValues.interestRateMax || "",
      interestPeriod: apiValues.interestPeriod || "",
      durationPeriod: apiValues.durationPeriod || "",
      minDuration: apiValues.termDurationMin || "",
      defaultDuration: apiValues.termDurationDefault || "",
      maxDuration: apiValues.termDurationMax || "",
      repaymentFrequency: apiValues.repaymentFrequency || "",
      extendLoanAfterMaturity: apiValues.extendLoanAfterMaturity ? "yes" : "no",
      interestTypeMaturity: apiValues.interestTypeMaturity || "",
      calculateInterestOn: apiValues.calculateInterestOn || "",
      loanInterestRateAfterMaturity:
        apiValues.loanInterestRateAfterMaturity || "",
      recurringPeriodAfterMaturityUnit:
        apiValues.recurringPeriodAfterMaturityUnit || "",
    };
  };

  const formik = useFormik({
    initialValues: getFormInitialValues(initialValues),
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      let repaymentOrder = null;
      if (
        repaymentOrderRef.current &&
        repaymentOrderRef.current.getRepaymentOrder
      ) {
        repaymentOrder = repaymentOrderRef.current.getRepaymentOrder();
      }
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);

      try {
        const isUpdate = initialValues && initialValues.id;
        const input = buildLoanProductInput(
          values,
          repaymentOrder,
          selectedLoanFees,
          userDetails,
          isUpdate
        );

        console.log("Submitting to AppSync:", input);

        let result;
        if (isUpdate) {
          // Update existing loan product
          result = await client.graphql({
            query: `
              mutation UpdateLoanProduct($input: UpdateLoanProductInput!) {
                updateLoanProduct(input: $input) {
                  id
                  name
                  principalAmountMin
                  principalAmountMax
                  principalAmountDefault
                  interestRateMin
                  interestRateMax
                  interestRateDefault
                  interestCalculationMethod
                  interestType
                  interestPeriod
                  termDurationMin
                  termDurationMax
                  termDurationDefault
                  durationPeriod
                  repaymentFrequency
                  repaymentOrder
                  extendLoanAfterMaturity
                  interestTypeMaturity
                  calculateInterestOn
                  loanInterestRateAfterMaturity
                  recurringPeriodAfterMaturityUnit
                }
              }
            `,
            variables: { input },
          });

          setSubmitSuccess("Loan product updated successfully!");
          if (onEditSuccess && result?.data?.updateLoanProduct) {
            onEditSuccess(result.data.updateLoanProduct);
          }
        } else {
          // Create new loan product
          result = await client.graphql({
            query: `
              mutation CreateLoanProduct($input: CreateLoanProductInput!) {
                createLoanProduct(input: $input) {
                  id
                  name
                }
              }
            `,
            variables: { input },
          });

          setSubmitSuccess("Loan product created successfully!");
        }

        const loanProductId =
          result?.data?.updateLoanProduct?.id ||
          result?.data?.createLoanProduct?.id;

        // Handle branch associations (for both create and update)
        if (loanProductId && values.branch && Array.isArray(values.branch)) {
          // For updates, we might want to remove existing associations first
          if (isUpdate) {
            // Remove existing branch associations
            try {
              await client
                .graphql({
                  query: `
                  query ListBranchLoanProducts($loanProductId: ID!) {
                    listBranchLoanProducts(
                      filter: { loanProductId: { eq: $loanProductId } }
                    ) {
                      items {
                        id
                      }
                    }
                  }
                `,
                  variables: { loanProductId },
                })
                .then(async (existingResult) => {
                  const existing =
                    existingResult.data.listBranchLoanProducts.items || [];
                  for (const item of existing) {
                    await client.graphql({
                      query: `
                      mutation DeleteBranchLoanProduct($input: DeleteBranchLoanProductInput!) {
                        deleteBranchLoanProduct(input: $input) {
                          id
                        }
                      }
                    `,
                      variables: { input: { id: item.id } },
                    });
                  }
                });
            } catch (err) {
              console.log("Error removing existing branches:", err);
            }
          }

          // Add new branch associations
          for (const branch of values.branch) {
            const branchId = typeof branch === "object" ? branch.value : branch;
            if (branchId) {
              await client.graphql({
                query: `
                  mutation CreateBranchLoanProduct($input: CreateBranchLoanProductInput!) {
                    createBranchLoanProduct(input: $input) {
                      id
                    }
                  }
                `,
                variables: {
                  input: {
                    branchId,
                    loanProductId,
                  },
                },
              });
            }
          }
        }

        // Handle loan fees associations (similar pattern)
        if (loanProductId) {
          let loanFeeIds = [];
          if (selectedLoanFees && selectedLoanFees.length > 0) {
            if (Array.isArray(selectedLoanFees)) {
              loanFeeIds = selectedLoanFees.map((f) =>
                typeof f === "object" ? f.value : f
              );
            } else if (typeof selectedLoanFees === "string") {
              loanFeeIds = selectedLoanFees.split(",");
            }
          }

          // For updates, remove existing loan fee associations first
          if (isUpdate) {
            try {
              await client
                .graphql({
                  query: `
                  query ListLoanProductLoanFees($loanProductId: ID!) {
                    listLoanProductLoanFees(
                      filter: { loanProductId: { eq: $loanProductId } }
                    ) {
                      items {
                        id
                      }
                    }
                  }
                `,
                  variables: { loanProductId },
                })
                .then(async (existingResult) => {
                  const existing =
                    existingResult.data.listLoanProductLoanFees.items || [];
                  for (const item of existing) {
                    await client.graphql({
                      query: `
                      mutation DeleteLoanProductLoanFees($input: DeleteLoanProductLoanFeesInput!) {
                        deleteLoanProductLoanFees(input: $input) {
                          id
                        }
                      }
                    `,
                      variables: { input: { id: item.id } },
                    });
                  }
                });
            } catch (err) {
              console.log("Error removing existing loan fees:", err);
            }
          }

          // Add new loan fee associations
          for (const loanFeesId of loanFeeIds) {
            if (loanFeesId) {
              await client.graphql({
                query: `
                  mutation CreateLoanProductLoanFees($input: CreateLoanProductLoanFeesInput!) {
                    createLoanProductLoanFees(input: $input) {
                      id
                    }
                  }
                `,
                variables: {
                  input: {
                    loanFeesId,
                    loanProductId,
                  },
                },
              });
            }
          }
        }

        setSubmitting(false);
        if (!isUpdate) {
          resetForm();
        }
      } catch (err) {
        console.log("err::: ", err);
        setSubmitError(
          `Failed to ${
            initialValues?.id ? "update" : "create"
          } loan product. Please try again.`
        );
        setSubmitting(false);
      }
    },
  });

  // Set selected loan fees from initial values
  React.useEffect(() => {
    if (initialValues?.loanFees?.items) {
      const feeIds = initialValues.loanFees.items.map((item) => item.id);
      setSelectedLoanFees(feeIds);
    }
  }, [initialValues]);

  const toggleEdit = () => {
    setEditMode(!editMode);
  };

  const getEditMode = () => editMode;

  React.useImperativeHandle(props.ref, () => ({
    toggleEdit,
    getEditMode,
  }));

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flex: 1,
      }}
    >
      {editMode && (
        <CustomEditFormButtons
          formik={formik}
          setEditMode={setEditMode}
          setSubmitError={setSubmitError}
          setSubmitSuccess={setSubmitSuccess}
        />
      )}
      {submitError && (
        <Typography color="error" sx={{ mt: 2 }}>
          {submitError}
        </Typography>
      )}
      {submitSuccess && (
        <Typography color="primary" sx={{ mt: 2 }}>
          {submitSuccess}
        </Typography>
      )}
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
            disabled={!editMode}
          />
          {formik.touched.name && formik.errors.name && (
            <Typography color="error" variant="caption">
              {formik.errors.name}
            </Typography>
          )}
        </FormGrid>
        <LoanBranchesSelect formik={formik} disabled={!editMode} />
        <PrincipalSettings formik={formik} disabled={!editMode} />
        <InterestSettings formik={formik} disabled={!editMode} />
        <DurationSettings formik={formik} disabled={!editMode} />
        <RepaymentSettings
          formik={formik}
          ref={repaymentOrderRef}
          disabled={!editMode}
        />
        <LoanMaturitySettings formik={formik} disabled={!editMode} />
        <FormGrid size={{ xs: 12, md: 12 }}>
          <LoanFeesSettings
            value={selectedLoanFees}
            onChange={setSelectedLoanFees}
            disabled={!editMode}
          />
        </FormGrid>
      </Grid>
    </Box>
  );
}
