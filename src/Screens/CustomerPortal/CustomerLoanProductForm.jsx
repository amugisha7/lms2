import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography, Paper, Alert, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { generateClient } from "aws-amplify/api";
import { useNavigate } from "react-router-dom";
import { CustomerContext } from "../../CustomerApp";
import customerLoanApplicationForm from "./customerLoanApplicationForm";
import TextInput from "../../Resources/FormComponents/TextInput";
import Dropdown from "../../Resources/FormComponents/Dropdown";
import DateInput from "../../Resources/FormComponents/DateInput";
import TextAndDropdown from "../../Resources/FormComponents/TextAndDropdown";
import CreateFormButtons from "../../ModelAssets/CreateFormButtons";
import { createLoanDraft } from "../../Models/Loans/LoanDrafts/loanDraftHelpers";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => new Date().toISOString().split("T")[0];

const baseInitialValues = {
  loanProduct: "",
  principalAmount: "",
  loanDuration: "",
  durationPeriod: "months",
  loanStartDate: getTodayDate(),
  interestRate: "",
  loanPurpose: "",
};

// Helper to format currency
const formatCurrency = (value, currency = "") => {
  if (value === null || value === undefined || value === "") return "N/A";
  return `${currency}${Number(value).toLocaleString()}`;
};

// Component to show product constraints
const ProductConstraints = ({ selectedProduct }) => {
  if (!selectedProduct) return null;

  const constraints = [];

  // Principal constraints
  if (
    selectedProduct.principalAmountMin ||
    selectedProduct.principalAmountMax
  ) {
    const min = formatCurrency(selectedProduct.principalAmountMin);
    const max = formatCurrency(selectedProduct.principalAmountMax);
    constraints.push({
      label: "Loan Amount Range",
      value: `${min} - ${max}`,
    });
  }

  // Duration constraints
  if (selectedProduct.termDurationMin || selectedProduct.termDurationMax) {
    const period = selectedProduct.durationPeriod || "months";
    const min = selectedProduct.termDurationMin || 1;
    const max = selectedProduct.termDurationMax || "N/A";
    constraints.push({
      label: "Duration Range",
      value: `${min} - ${max} ${period}`,
    });
  }

  // Interest rate info
  if (
    selectedProduct.interestRateDefault !== null &&
    selectedProduct.interestRateDefault !== undefined
  ) {
    const interestType =
      selectedProduct.interestType === "fixed" ? "Fixed Amount" : "%";
    const period =
      selectedProduct.interestPeriod?.replace("per_", "per ") || "per month";
    constraints.push({
      label: "Interest Rate",
      value: `${selectedProduct.interestRateDefault}${interestType} ${period}`,
    });
  }

  // Repayment frequency
  if (selectedProduct.repaymentFrequency) {
    const freqLabel = selectedProduct.repaymentFrequency
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    constraints.push({
      label: "Repayment Frequency",
      value: freqLabel,
    });
  }

  // Interest calculation method
  if (selectedProduct.interestCalculationMethod) {
    const methodLabel = selectedProduct.interestCalculationMethod
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    constraints.push({
      label: "Interest Method",
      value: methodLabel,
    });
  }

  if (constraints.length === 0) return null;

  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
        Product Terms & Constraints
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {constraints.map((constraint, index) => (
          <Chip
            key={index}
            label={`${constraint.label}: ${constraint.value}`}
            size="small"
            variant="outlined"
            sx={{ fontSize: "0.75rem" }}
          />
        ))}
      </Box>
    </Box>
  );
};

// Component to auto-update form when product changes
const ProductChangeHandler = ({ loanProducts, onProductChange }) => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (values.loanProduct) {
      const selectedProduct = loanProducts.find(
        (p) => p.id === values.loanProduct,
      );
      if (selectedProduct) {
        // Set defaults from product
        if (selectedProduct.principalAmountDefault && !values.principalAmount) {
          setFieldValue(
            "principalAmount",
            selectedProduct.principalAmountDefault,
          );
        }
        if (selectedProduct.termDurationDefault && !values.loanDuration) {
          setFieldValue("loanDuration", selectedProduct.termDurationDefault);
        }
        if (selectedProduct.durationPeriod) {
          setFieldValue("durationPeriod", selectedProduct.durationPeriod);
        }
        if (
          selectedProduct.interestRateDefault !== null &&
          selectedProduct.interestRateDefault !== undefined
        ) {
          setFieldValue("interestRate", selectedProduct.interestRateDefault);
        }
        onProductChange(selectedProduct);
      }
    } else {
      onProductChange(null);
    }
  }, [values.loanProduct, loanProducts, setFieldValue, onProductChange]);

  return null;
};

// Build dynamic validation schema based on selected product
const buildValidationSchema = (selectedProduct) => {
  let principalValidation = Yup.number()
    .required("Principal amount is required")
    .min(1, "Amount must be greater than 0");

  let durationValidation = Yup.number()
    .required("Loan duration is required")
    .min(1, "Duration must be at least 1");

  if (selectedProduct) {
    if (selectedProduct.principalAmountMin) {
      principalValidation = principalValidation.min(
        selectedProduct.principalAmountMin,
        `Minimum amount is ${formatCurrency(selectedProduct.principalAmountMin)}`,
      );
    }
    if (selectedProduct.principalAmountMax) {
      principalValidation = principalValidation.max(
        selectedProduct.principalAmountMax,
        `Maximum amount is ${formatCurrency(selectedProduct.principalAmountMax)}`,
      );
    }
    if (selectedProduct.termDurationMin) {
      durationValidation = durationValidation.min(
        selectedProduct.termDurationMin,
        `Minimum duration is ${selectedProduct.termDurationMin} ${selectedProduct.durationPeriod || "months"}`,
      );
    }
    if (selectedProduct.termDurationMax) {
      durationValidation = durationValidation.max(
        selectedProduct.termDurationMax,
        `Maximum duration is ${selectedProduct.termDurationMax} ${selectedProduct.durationPeriod || "months"}`,
      );
    }
  }

  return Yup.object().shape({
    loanProduct: Yup.string().required("Please select a loan product"),
    principalAmount: principalValidation,
    loanDuration: durationValidation,
    durationPeriod: Yup.string().required("Duration period is required"),
    loanStartDate: Yup.date()
      .required("Start date is required")
      .min(new Date(getTodayDate()), "Start date cannot be in the past"),
    interestRate: Yup.number().nullable(),
    loanPurpose: Yup.string(),
  });
};

const renderFormField = (field, selectedProduct) => {
  switch (field.type) {
    case "select":
      return <Dropdown {...field} />;
    case "number":
      // For interest rate, make it read-only
      if (field.name === "interestRate") {
        return (
          <TextInput
            {...field}
            type="number"
            disabled={true}
            helperText={
              selectedProduct
                ? `Set by product: ${selectedProduct.interestRateDefault || 0}${
                    selectedProduct.interestType === "fixed" ? " (fixed)" : "%"
                  } ${selectedProduct.interestPeriod?.replace("per_", "per ") || ""}`
                : field.helperText
            }
          />
        );
      }
      return <TextInput {...field} type="number" />;
    case "textarea":
      return <TextInput {...field} multiline rows={4} />;
    case "date":
      return <DateInput {...field} />;
    case "textAndDropdown":
      return <TextAndDropdown {...field} />;
    default:
      return <TextInput {...field} />;
  }
};

export default function CustomerLoanProductForm() {
  const { borrower, institution, customerUser } = useContext(CustomerContext);
  const [loanProducts, setLoanProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!institution?.id) {
        setLoading(false);
        return;
      }

      const client = generateClient();

      try {
        // Fetch loan products for this institution
        let allProducts = [];
        let nextToken = null;

        do {
          const result = await client.graphql({
            query: `
              query ListLoanProducts($institutionId: ID!, $nextToken: String) {
                listLoanProducts(
                  filter: { institutionLoanProductsId: { eq: $institutionId } }
                  limit: 100
                  nextToken: $nextToken
                ) {
                  nextToken
                  items {
                    id
                    name
                    description
                    customLoanProductDetails
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
                    status
                  }
                }
              }
            `,
            variables: {
              institutionId: institution.id,
              nextToken: nextToken,
            },
          });

          const items = result?.data?.listLoanProducts?.items || [];
          allProducts = [...allProducts, ...items];

          nextToken = result?.data?.listLoanProducts?.nextToken;
        } while (nextToken);

        // Filter to only active, customer-visible products
        const visibleProducts = allProducts.filter((product) => {
          try {
            // Check if product is active (case-insensitive)
            const isActive = (product.status || "").toLowerCase() === "active";
            if (!isActive) {
              return false;
            }

            const customDetails = JSON.parse(
              product.customLoanProductDetails || "{}",
            );
            return customDetails.customerPortalVisible === true;
          } catch (e) {
            return false;
          }
        });

        setLoanProducts(visibleProducts);

        // Fetch branches
        const branchResult = await client.graphql({
          query: `query ListBranches($filter: ModelBranchFilterInput) {
            listBranches(filter: $filter) {
              items {
                id
                name
              }
            }
          }`,
          variables: {
            filter: {
              institutionBranchesId: { eq: institution.id },
            },
          },
        });

        setBranches(branchResult?.data?.listBranches?.items || []);
      } catch (err) {
        console.error("Error fetching loan products:", err);
        setSubmitError("Failed to load loan products. Please try again.");
      }

      setLoading(false);
    };

    fetchData();
  }, [institution]);

  // State to track selected product for dynamic validation and display
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Memoized callback for product change
  const handleProductChange = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  // Build validation schema based on selected product
  const validationSchema = useMemo(
    () => buildValidationSchema(selectedProduct),
    [selectedProduct],
  );

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitError("");
    setSubmitSuccess("");
    setSubmitting(true);

    try {
      const product = loanProducts.find((p) => p.id === values.loanProduct);

      // Create draft record with all fields from the form
      const draftRecord = {
        borrower: borrower.id,
        loanProduct: values.loanProduct,
        principalAmount: Number(values.principalAmount),
        loanPurpose: values.loanPurpose || null,
        // Use form values for duration and start date
        loanDuration: Number(values.loanDuration),
        durationPeriod:
          values.durationPeriod || product?.durationPeriod || "months",
        loanStartDate: values.loanStartDate,
        // Use product defaults for interest settings
        interestRate: product?.interestRateDefault || 0,
        interestMethod: product?.interestCalculationMethod || "flat",
        interestType: product?.interestType || "percentage",
        interestPeriod: product?.interestPeriod || "per_month",
        repaymentFrequency: product?.repaymentFrequency || "monthly",
        repaymentFrequencyType: "interval",
      };

      const userDetails = {
        id: customerUser.id,
        institutionUsersId: institution.id,
        branchUsersId: branches[0]?.id || null, // Use first branch
      };

      // Create with DRAFT status - customer applications need staff approval
      await createLoanDraft({
        userDetails,
        draftRecord,
        source: "CUSTOMER_PORTAL",
        status: "DRAFT",
      });

      setSubmitSuccess(
        "Loan application submitted successfully! Your application is now pending review. You'll be notified once it's processed.",
      );
      resetForm();

      // Navigate to loans list after a delay
      setTimeout(() => {
        navigate(`/client/${institution.id}/loans`);
      }, 2500);
    } catch (err) {
      console.error("Error submitting loan application:", err);
      setSubmitError("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const updatedForm = customerLoanApplicationForm.map((field) => {
    if (field.name === "loanProduct") {
      return {
        ...field,
        options: loanProducts.map((product) => ({
          value: product.id,
          label: product.name,
        })),
      };
    }
    // For duration period dropdown, lock it based on product if set
    if (
      field.dropdownName === "durationPeriod" &&
      selectedProduct?.durationPeriod
    ) {
      return {
        ...field,
        dropdownDisabled: true,
        dropdownHelperText: `Duration period is set by the loan product`,
      };
    }
    return field;
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (loanProducts.length === 0) {
    return (
      <Paper sx={{ p: 3, bgcolor: "warning.light" }}>
        <Typography>
          No loan products are currently available for customer applications.
          Please contact the institution for assistance.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Formik
        initialValues={baseInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={false}
      >
        {(formik) => (
          <Form>
            {/* Product change handler to update defaults and constraints */}
            <ProductChangeHandler
              loanProducts={loanProducts}
              onProductChange={handleProductChange}
            />

            <Grid container spacing={2}>
              {/* Loan Product Selection - first field */}
              <FormGrid size={{ xs: 12, md: 12 }} key="loanProduct">
                {renderFormField(
                  {
                    ...updatedForm.find((f) => f.name === "loanProduct"),
                    editing: true,
                    isEditMode: false,
                  },
                  selectedProduct,
                )}
              </FormGrid>

              {/* Show product constraints when a product is selected */}
              {selectedProduct && (
                <Grid size={{ xs: 12 }}>
                  <ProductConstraints selectedProduct={selectedProduct} />
                </Grid>
              )}

              {/* Rest of the form fields */}
              {updatedForm
                .filter((f) => f.name !== "loanProduct")
                .map((field) => (
                  <FormGrid
                    size={{ xs: 12, md: field.span }}
                    key={
                      field.name || field.textName || `field-${Math.random()}`
                    }
                  >
                    {renderFormField(
                      {
                        ...field,
                        editing: true,
                        isEditMode: false,
                      },
                      selectedProduct,
                    )}
                  </FormGrid>
                ))}

              {/* Error and success messages */}
              {submitError && (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {submitError}
                  </Alert>
                </Grid>
              )}
              {submitSuccess && (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="success" sx={{ mt: 1 }}>
                    {submitSuccess}
                  </Alert>
                </Grid>
              )}

              {/* Submit button */}
              <Box
                sx={{
                  display: "flex",
                  pr: 2,
                  justifyContent: { xs: "center", md: "flex-end" },
                  width: "100%",
                  mt: 2,
                }}
              >
                <CreateFormButtons
                  formik={formik}
                  setEditMode={() => {}}
                  setSubmitError={setSubmitError}
                  setSubmitSuccess={setSubmitSuccess}
                  hideCancel={true}
                  submitLabel="Submit Loan Application"
                />
              </Box>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}
