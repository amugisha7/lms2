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
import FormLabel from "../../Resources/FormComponents/FormLabel";
import PlusButtonMain from "../../ModelAssets/PlusButtonMain";
import { createLoanDraft } from "../../Models/Loans/LoanDrafts/loanDraftHelpers";
import CustomerLoanSchedulePreview from "./CustomerLoanSchedulePreview";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => new Date().toISOString().split("T")[0];

// Get today's date at midnight for validation
const getTodayMidnight = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const baseInitialValues = {
  loanProduct: "",
  principalAmount: "",
  loanDuration: "",
  durationPeriod: "months",
  loanStartDate: "",
  interestRate: "",
  loanPurpose: "",
};

// Helper to parse customLoanProductDetails
const parseCustomDetails = (product) => {
  if (!product?.customLoanProductDetails) {
    return {
      customerPortalVisible: true,
      allowCustomerAmountEdit: true,
      allowCustomerDurationEdit: true,
    };
  }
  try {
    const details = JSON.parse(product.customLoanProductDetails);
    return {
      customerPortalVisible: details.customerPortalVisible !== false,
      allowCustomerAmountEdit: details.allowCustomerAmountEdit !== false,
      allowCustomerDurationEdit: details.allowCustomerDurationEdit !== false,
    };
  } catch (e) {
    return {
      customerPortalVisible: true,
      allowCustomerAmountEdit: true,
      allowCustomerDurationEdit: true,
    };
  }
};

// Helper to format currency
const formatCurrency = (value, currency = "") => {
  if (value === null || value === undefined || value === "") return "N/A";
  return `${currency}${Number(value).toLocaleString()}`;
};

// --- Normalization Helpers (matching UseLoanProduct.jsx logic) ---

const normalizeEnumKey = (value) => {
  if (value === null || value === undefined) return value;
  const raw = String(value).trim();
  if (!raw) return raw;
  return raw
    .toLowerCase()
    .replace(/\//g, " ")
    .replace(/-/g, "_")
    .replace(/\s+/g, "_");
};

const normalizeInterestType = (v) => {
  const key = normalizeEnumKey(v);
  if (!key) return v;
  if (key === "percent" || key === "percentage" || key === "percent_based") {
    return "percentage";
  }
  if (key === "fixed" || key === "fixed_amount") return "fixed";
  return key;
};

const normalizeDurationPeriod = (v) => {
  const key = normalizeEnumKey(v);
  if (!key) return v;
  if (["day", "days"].includes(key)) return "days";
  if (["week", "weeks"].includes(key)) return "weeks";
  if (["month", "months"].includes(key)) return "months";
  if (["year", "years"].includes(key)) return "years";
  return key;
};

const normalizeRepaymentFrequency = (v) => {
  const key = normalizeEnumKey(v);
  if (!key) return v;
  const map = {
    bi_weekly: "biweekly",
    biweekly: "biweekly",
    bi_monthly: "bimonthly",
    bimonthly: "bimonthly",
    every_4_month: "every_4_months",
    every_4_months: "every_4_months",
    every_9_month: "every_9_months",
    every_9_months: "every_9_months",
    semi_annual: "semi_annual",
    semi_annually: "semi_annual",
    semiannually: "semi_annual",
    one_off: "lump_sum",
    one_off_lump_sum: "lump_sum",
    lump_sum: "lump_sum",
  };
  return map[key] || key;
};

const normalizeInterestPeriod = (v) => {
  const key = normalizeEnumKey(v);
  if (!key) return v;
  // LoanProduct uses per_loan_cycle but Loan form expects per_loan
  if (key === "per_loan_cycle") return "per_loan";
  return key;
};

// Component to show product constraints
const ProductConstraints = ({ selectedProduct }) => {
  if (!selectedProduct) return null;

  const customDetails = parseCustomDetails(selectedProduct);
  const constraints = [];

  // Principal constraints - only show range if customer can edit amount
  if (customDetails.allowCustomerAmountEdit) {
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
  } else {
    // Show fixed amount when customer cannot edit
    if (selectedProduct.principalAmountDefault) {
      constraints.push({
        label: "Fixed Loan Amount",
        value: formatCurrency(selectedProduct.principalAmountDefault),
      });
    }
  }

  // Duration constraints - only show range if customer can edit duration
  if (customDetails.allowCustomerDurationEdit) {
    if (selectedProduct.termDurationMin || selectedProduct.termDurationMax) {
      const period = selectedProduct.durationPeriod || "months";
      const min = selectedProduct.termDurationMin || 1;
      const max = selectedProduct.termDurationMax || "N/A";
      constraints.push({
        label: "Duration Range",
        value: `${min} - ${max} ${period}`,
      });
    }
  } else {
    // Show fixed duration when customer cannot edit
    if (selectedProduct.termDurationDefault) {
      const period = selectedProduct.durationPeriod || "months";
      constraints.push({
        label: "Fixed Duration",
        value: `${selectedProduct.termDurationDefault} ${period}`,
      });
    }
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
    <Box sx={{ mb: 2, borderRadius: 1 }}>
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
        const customDetails = parseCustomDetails(selectedProduct);

        // For amount: Set default if customer cannot edit OR if no value yet
        if (!customDetails.allowCustomerAmountEdit) {
          // Locked - always use product default
          if (selectedProduct.principalAmountDefault) {
            setFieldValue(
              "principalAmount",
              selectedProduct.principalAmountDefault,
            );
          }
        } else if (
          selectedProduct.principalAmountDefault &&
          !values.principalAmount
        ) {
          // Editable - only set default if empty
          setFieldValue(
            "principalAmount",
            selectedProduct.principalAmountDefault,
          );
        }

        // For duration: Set default if customer cannot edit OR if no value yet
        if (!customDetails.allowCustomerDurationEdit) {
          // Locked - always use product default
          if (selectedProduct.termDurationDefault) {
            setFieldValue("loanDuration", selectedProduct.termDurationDefault);
          }
        } else if (
          selectedProduct.termDurationDefault &&
          !values.loanDuration
        ) {
          // Editable - only set default if empty
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
  const customDetails = parseCustomDetails(selectedProduct);

  let principalValidation = Yup.number()
    .required("Principal amount is required")
    .min(1, "Amount must be greater than 0");

  let durationValidation = Yup.number()
    .required("Loan duration is required")
    .min(1, "Duration must be at least 1");

  if (selectedProduct) {
    // Only apply min/max validation if customer can edit the field
    if (customDetails.allowCustomerAmountEdit) {
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
    }

    if (customDetails.allowCustomerDurationEdit) {
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
  }

  return Yup.object().shape({
    loanProduct: Yup.string().required("Please select a loan product"),
    principalAmount: principalValidation,
    loanDuration: durationValidation,
    durationPeriod: Yup.string().required("Duration period is required"),
    loanStartDate: Yup.string().required("Start date is required"),
    interestRate: Yup.number().nullable(),
    loanPurpose: Yup.string().nullable(),
  });
};

const renderFormField = (field, selectedProduct) => {
  const customDetails = parseCustomDetails(selectedProduct);

  switch (field.type) {
    case "label":
      return <FormLabel label={field.label} />;
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
      // For principal amount, check if customer can edit
      if (field.name === "principalAmount") {
        const isLocked =
          selectedProduct && !customDetails.allowCustomerAmountEdit;
        return (
          <TextInput
            {...field}
            type="number"
            disabled={isLocked}
            helperText={
              isLocked
                ? `Fixed amount set by loan product: ${formatCurrency(selectedProduct.principalAmountDefault)}`
                : field.helperText
            }
          />
        );
      }
      return <TextInput {...field} type="number" />;
    case "textarea":
      return <TextInput {...field} multiline rows={4} />;
    case "date":
      return (
        <DateInput
          {...field}
          min={field.minToday ? getTodayDate() : field.min}
        />
      );
    case "textAndDropdown":
      // For loan duration, check if customer can edit
      if (field.textName === "loanDuration") {
        const isLocked =
          selectedProduct && !customDetails.allowCustomerDurationEdit;
        return (
          <TextAndDropdown
            {...field}
            textDisabled={isLocked}
            textHelperText={
              isLocked
                ? `Fixed duration set by loan product: ${selectedProduct.termDurationDefault} ${selectedProduct.durationPeriod || "months"}`
                : field.textHelperText
            }
          />
        );
      }
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
  const [step, setStep] = useState("form"); // "form" or "preview"
  const [formValues, setFormValues] = useState(null);
  const [submitting, setSubmitting] = useState(false);
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

  // Called when user clicks "View Schedule" on the form - validates and moves to preview
  const handleViewSchedule = async (
    values,
    { setSubmitting: setFormSubmitting },
  ) => {
    setSubmitError("");
    setSubmitSuccess("");
    setFormSubmitting(true);

    try {
      const product = loanProducts.find((p) => p.id === values.loanProduct);

      // Normalize values using the helpers - CRITICAL for matching backend calculation logic
      const interestType = normalizeInterestType(
        product?.interestType || "percentage",
      );
      const interestPeriod = normalizeInterestPeriod(
        product?.interestPeriod || "per_month",
      );
      const durationPeriod = normalizeDurationPeriod(
        values.durationPeriod || product?.durationPeriod || "months",
      );
      const repaymentFrequencyRaw = normalizeRepaymentFrequency(
        product?.repaymentFrequency || "monthly",
      );

      let repaymentFrequencyType = "interval";
      let repaymentFrequency = repaymentFrequencyRaw;

      // Special handling for lump sum to match UseLoanProduct.jsx logic
      if (repaymentFrequencyRaw === "lump_sum") {
        repaymentFrequencyType = "lumpSum";
        repaymentFrequency = "";
      }

      // Build the draft record for preview - matching add-loan workflow structure
      const draftRecord = {
        borrower: borrower.id,
        loanProduct: values.loanProduct,
        principalAmount: Number(values.principalAmount),
        loanPurpose: values.loanPurpose || null,
        // Use termDuration for consistency with add-loan workflow
        termDuration: Number(values.loanDuration),
        loanDuration: Number(values.loanDuration),
        durationPeriod: durationPeriod,
        loanStartDate: values.loanStartDate,
        startDate: values.loanStartDate,
        disbursementDate: values.loanStartDate,
        // Interest configuration from loan product
        interestRate: Number(product?.interestRateDefault || 0),
        interestMethod: product?.interestCalculationMethod || "flat",
        interestCalculationMethod: product?.interestCalculationMethod || "flat",
        interestType: interestType,
        interestPeriod: interestPeriod,
        // Repayment configuration from loan product (normalized)
        repaymentFrequency: repaymentFrequency,
        repaymentFrequencyType: repaymentFrequencyType,
      };

      setFormValues(draftRecord);
      setStep("preview");
    } catch (err) {
      console.error("Error preparing schedule preview:", err);
      setSubmitError("Failed to prepare schedule preview. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Called from the preview screen when user confirms submission
  const handleFinalSubmit = async () => {
    setSubmitError("");
    setSubmitSuccess("");
    setSubmitting(true);

    try {
      const userDetails = {
        id: customerUser.id,
        institutionUsersId: institution.id,
        branchUsersId: branches[0]?.id || null,
      };

      // Create with DRAFT status - customer applications need staff approval
      await createLoanDraft({
        userDetails,
        draftRecord: formValues,
        source: "CUSTOMER_PORTAL",
        status: "In review",
      });

      setSubmitSuccess(
        "Loan application submitted successfully! Your application is now pending review. You'll be notified once it's processed.",
      );

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

  // Go back to form from preview
  const handleBackToForm = () => {
    setStep("form");
    setSubmitError("");
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

  // Show schedule preview step
  if (step === "preview" && formValues) {
    return (
      <Box>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          Please review your loan schedule below. You can export it as a PDF or
          go back to edit your application.
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {submitSuccess}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <CustomerLoanSchedulePreview
            draftValues={formValues}
            borrower={borrower}
            institution={institution}
            currency={institution?.currencyCode || "$"}
            onBack={handleBackToForm}
            onSubmit={handleFinalSubmit}
            submitLabel="Submit Loan Application"
            submitting={submitting}
          />
        </Paper>
      </Box>
    );
  }

  // Show the form step
  return (
    <Formik
      initialValues={baseInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleViewSchedule}
      enableReinitialize={false}
      validateOnMount={true}
    >
      {(formik) => (
        <Form>
          {/* Product change handler to update defaults and constraints */}
          <ProductChangeHandler
            loanProducts={loanProducts}
            onProductChange={handleProductChange}
          />

          <Grid container spacing={2}>
            {/* Render all form fields in order */}
            {updatedForm.map((field, index) => (
              <React.Fragment
                key={field.name || field.textName || `field-${index}`}
              >
                <FormGrid size={{ xs: 12, md: field.span || 12 }}>
                  {renderFormField(
                    {
                      ...field,
                      editing: true,
                      isEditMode: false,
                    },
                    selectedProduct,
                  )}
                </FormGrid>

                {/* Show product constraints after loan product select */}
                {field.name === "loanProduct" && selectedProduct && (
                  <Grid size={{ xs: 12 }}>
                    <ProductConstraints selectedProduct={selectedProduct} />
                  </Grid>
                )}
              </React.Fragment>
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

            {/* View Schedule button */}
            <Box
              sx={{
                display: "flex",
                pr: 2,
                justifyContent: { xs: "center", md: "flex-end" },
                width: "100%",
                mt: 2,
              }}
            >
              <PlusButtonMain
                buttonText="View Loan Schedule"
                //   variant="contained"
                onClick={formik.handleSubmit}
                disabled={formik.isSubmitting || !formik.isValid}
              />
            </Box>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
