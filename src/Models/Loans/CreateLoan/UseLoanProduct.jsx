import React, { useState, forwardRef, useEffect, useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import createLoanForm from "./createLoanForm";
import TextInput from "../../../Resources/FormComponents/TextInput";
import Dropdown from "../../../Resources/FormComponents/Dropdown";
import DropDownSearchable from "../../../Resources/FormComponents/DropDownSearchable";
import OrderedList from "../../../Resources/FormComponents/OrderedList";
import CreateFormButtons from "../../../ModelAssets/CreateFormButtons";
import { UserContext } from "../../../App";
import { createLoan } from "./createLoanHelpers";
import FormLabel from "../../../Resources/FormComponents/FormLabel";
import RadioGroup from "../../../Resources/FormComponents/RadioGroup";
import ClickableText from "../../../ComponentAssets/ClickableText";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

const baseInitialValues = createLoanForm.reduce((acc, field) => {
  if (field.type === "label" || field.type === "formLink") return acc;

  if (field.type === "textAndDropdown") {
    acc[field.textName] =
      field.textDefaultValue !== undefined ? field.textDefaultValue : "";
    acc[field.dropdownName] =
      field.dropdownDefaultValue !== undefined
        ? field.dropdownDefaultValue
        : "";
  } else if (field.type === "textAndRadio") {
    acc[field.textName] =
      field.textDefaultValue !== undefined ? field.textDefaultValue : "";
    acc[field.radioName] =
      field.radioDefaultValue !== undefined ? field.radioDefaultValue : "";
  } else {
    if (field.name) {
      acc[field.name] =
        field.defaultValue !== undefined ? field.defaultValue : "";
    }
  }
  return acc;
}, {});

baseInitialValues.loanProduct = "";

const buildValidationSchema = () => {
  const validationShape = {
    borrower: Yup.string().required("Borrower is required"),
    loanProduct: Yup.string().required("Loan Product is required"),
    accountLoansId: Yup.string().required("Source Account is required"),
    principalAmount: Yup.number()
      .required("Principal Amount is required")
      .min(0, "Principal Amount must be at least 0"),
    interestType: Yup.string()
      .oneOf(["percentage", "fixed"])
      .required("Interest Type is required"),
    interestRate: Yup.number()
      .typeError("Interest Rate is required")
      .required("Interest Rate is required")
      .min(0, "Interest Rate must be at least 0")
      .when("interestType", {
        is: "percentage",
        then: (schema) => schema.max(100, "Interest Rate cannot exceed 100%"),
        otherwise: (schema) => schema,
      }),
    loanStartDate: Yup.string().required("Loan Start Date is required"),
    loanDuration: Yup.number()
      .typeError("Loan Duration is required")
      .required("Loan Duration is required")
      .min(1, "Loan Duration must be at least 1"),
    durationPeriod: Yup.string()
      .oneOf(["days", "weeks", "months", "years"])
      .required("Duration Period is required"),
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
      .required("Repayment Interval is required"),
  };

  return Yup.object().shape(validationShape);
};

const baseValidationSchema = buildValidationSchema();

const renderFormField = (field, formikValues) => {
  // Remove props that shouldn't be forwarded to DOM/MUI elements
  const { dynamicHelperText, dynamicLabel, dynamicLabelMap, ...fieldProps } =
    field;

  // Handle dynamic labels used by createLoanForm
  let displayLabel = field.label;
  if (dynamicLabel) {
    if (field.name === "calculateInterestOn") {
      displayLabel =
        formikValues.interestTypeMaturity === "fixed"
          ? "Calculate Interest if there is"
          : "Calculate Interest on";
    } else if (field.name === "loanInterestRateAfterMaturity") {
      displayLabel =
        formikValues.interestTypeMaturity === "fixed"
          ? "Interest Amount After Maturity"
          : "Interest Rate After Maturity";
    } else if (field.name === "interestRate") {
      displayLabel =
        formikValues.interestType === "fixed"
          ? "Interest Amount"
          : "Interest Rate";
    }
  }

  // Current value from Formik for this field
  const currentValueForField = field.name
    ? formikValues[field.name]
    : undefined;

  // Compute dynamic helper text if provided
  let computedHelperText = field.helperText;
  if (dynamicHelperText && field.name) {
    const currentValue = formikValues[field.name];
    if (currentValue && dynamicHelperText[currentValue]) {
      computedHelperText = dynamicHelperText[currentValue];
    }
  }

  switch (field.type) {
    case "text":
    case "number":
      return (
        <TextInput
          {...fieldProps}
          label={displayLabel}
          helperText={computedHelperText}
        />
      );
    case "select":
      if (field.name === "borrower" || field.name === "loanProduct") {
        return (
          <DropDownSearchable
            {...fieldProps}
            label={displayLabel}
            helperText={computedHelperText}
            value={currentValueForField}
          />
        );
      }
      return (
        <Dropdown
          {...fieldProps}
          label={displayLabel}
          helperText={computedHelperText}
        />
      );
    case "selectMultiple":
      return (
        <Dropdown
          {...fieldProps}
          label={displayLabel}
          helperText={computedHelperText}
        />
      );
    case "orderedList":
      return (
        <OrderedList
          label={field.label}
          items={field.formik.values[field.name] || field.defaultValue || []}
          onChange={(newOrder) =>
            field.formik.setFieldValue(field.name, newOrder)
          }
          helperText={computedHelperText}
          required={field.required}
          editing={field.editing}
        />
      );
    case "label":
      return <FormLabel label={field.label} />;
    case "radio":
      return <RadioGroup {...fieldProps} helperText={computedHelperText} />;
    case "textAndDropdown":
      // Render text part with its explicit name
      return (
        <TextInput
          {...fieldProps}
          name={field.textName}
          label={displayLabel}
          helperText={computedHelperText}
        />
      );
    case "textAndRadio":
      return (
        <TextInput
          {...fieldProps}
          name={field.textName}
          label={displayLabel}
          helperText={computedHelperText}
        />
      );
    default:
      if (!fieldProps.name) return null;
      return <TextInput {...fieldProps} />;
  }
};

const UseLoanProduct = forwardRef(
  (
    {
      onClose,
      onCreateSuccess,
      onCreateLoanAPI,
      initialValues: propInitialValues,
      borrower: propBorrower,
      isEditMode = false,
      hideCancel,
      onCancel,
      borrowers,
      borrowersLoading,
      loanProducts,
      loanProductsLoading,
    },
    ref
  ) => {
    const { userDetails } = useContext(UserContext);
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");

    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const formInitialValues = React.useMemo(() => {
      const base = propInitialValues
        ? {
            ...baseInitialValues,
            ...propInitialValues,
          }
        : { ...baseInitialValues };

      if (propBorrower) {
        base.borrower =
          `${propBorrower.firstname || ""} ${propBorrower.othername || ""} ${
            propBorrower.businessName || ""
          }`.trim() || propBorrower.uniqueIdNumber;
      }
      return base;
    }, [propInitialValues, propBorrower]);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);

      if (propBorrower) {
        values.borrower = propBorrower.id;
      }

      try {
        if (onCreateLoanAPI) {
          const result = await onCreateLoanAPI(values);
          setSubmitSuccess("Loan created!");
          resetForm();
          if (onCreateSuccess) {
            onCreateSuccess(result);
          }
        } else {
          const result = await createLoan(values, userDetails);

          if (result?.id) {
            setSubmitSuccess("Loan created successfully!");
            resetForm();
            if (onCreateSuccess) {
              onCreateSuccess(result);
            }
          } else {
            setSubmitSuccess("Loan created successfully!");
            resetForm();
            if (onCreateSuccess) {
              onCreateSuccess(result);
            }
          }
        }
      } catch (err) {
        console.error("Error creating loan:", err);
        setSubmitError(
          err.message || "Failed to create loan. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    };

    if (borrowersLoading || loanProductsLoading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    return (
      <>
        {!propBorrower && !borrowersLoading && borrowers.length === 0 && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              backgroundColor: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: 1,
            }}
          >
            <Typography variant="body1" sx={{ color: "#856404" }}>
              No borrowers found.
            </Typography>
          </Box>
        )}
        {loanProducts.length === 0 ? (
          <Box
            sx={{
              mb: 3,
              p: 2,
              //   backgroundColor: "#fff3cd",
              border: "1px solid",
              borderRadius: 1,
            }}
          >
            <Typography>
              No loan products found. Manage{" "}
              <ClickableText onClick={() => navigate("/admin/loan-products")}>
                Loan Products.
              </ClickableText>
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <ClickableText onClick={() => navigate("/admin/loan-products")}>
                Manage Loan Products
              </ClickableText>
            </Box>
            <Formik
              initialValues={formInitialValues}
              validationSchema={baseValidationSchema}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {(formik) => {
                const updatedCreateLoanForm = (() => {
                  const formFields = [];

                  // Add Loan Product field at the top
                  formFields.push({
                    label: "Loan Product",
                    name: "loanProduct",
                    type: "select",
                    required: true,
                    span: 12,
                    options: (loanProducts || [])
                      .filter(
                        (p) => (p?.status || "").toLowerCase() === "active"
                      )
                      .map((product) => ({
                        value: product.id,
                        label: product.name,
                      })),
                    helperText:
                      "Select a loan product to auto-populate fields.",
                    onChange: (e, formik) => {
                      const selectedProductId = e.target.value;
                      formik.setFieldValue("loanProduct", selectedProductId);

                      const selectedProduct = loanProducts.find(
                        (p) => p.id === selectedProductId
                      );
                      if (selectedProduct) {
                        // Populate fields
                        if (selectedProduct.principalAmountDefault)
                          formik.setFieldValue(
                            "principalAmount",
                            selectedProduct.principalAmountDefault
                          );
                        if (selectedProduct.interestRateDefault)
                          formik.setFieldValue(
                            "interestRate",
                            selectedProduct.interestRateDefault
                          );
                        if (selectedProduct.termDurationDefault)
                          formik.setFieldValue(
                            "loanDuration",
                            selectedProduct.termDurationDefault
                          );
                        if (selectedProduct.durationPeriod)
                          formik.setFieldValue(
                            "durationPeriod",
                            selectedProduct.durationPeriod
                          );
                        if (selectedProduct.repaymentFrequency)
                          formik.setFieldValue(
                            "repaymentFrequency",
                            selectedProduct.repaymentFrequency
                          );
                        if (selectedProduct.repaymentOrder) {
                          try {
                            // repaymentOrder might be a stringified array or just array
                            const order =
                              typeof selectedProduct.repaymentOrder === "string"
                                ? JSON.parse(selectedProduct.repaymentOrder)
                                : selectedProduct.repaymentOrder;
                            formik.setFieldValue("repaymentOrder", order);
                          } catch (e) {
                            console.error("Error parsing repayment order", e);
                          }
                        }
                      }
                    },
                  });

                  if (formik.values.loanProduct) {
                    createLoanForm.forEach((field) => {
                      if (field.name === "loanProduct") {
                        // Skip original loanProduct field as we added it manually
                      } else {
                        formFields.push(field);
                      }
                    });
                  }

                  return formFields;
                })();

                return (
                  <Form>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        flex: 1,
                      }}
                    >
                      <Grid container spacing={1}>
                        {updatedCreateLoanForm.map((field, index) => (
                          <FormGrid
                            size={{ xs: 12, md: field.span }}
                            key={`${field.name}-${index}`}
                          >
                            {renderFormField(
                              {
                                ...field,
                                formik,
                                editing: true,
                                // Pass custom onChange if defined
                                onChange: field.onChange
                                  ? (e) => field.onChange(e, formik)
                                  : undefined,
                              },
                              formik.values
                            )}
                          </FormGrid>
                        ))}
                        {formik.values.loanProduct && (
                          <Box
                            sx={{
                              display: "flex",
                              pr: 2,
                              justifyContent: { xs: "center", md: "flex-end" },
                              width: "100%",
                            }}
                          >
                            <CreateFormButtons
                              formik={formik}
                              setEditMode={() => {}}
                              setSubmitError={setSubmitError}
                              setSubmitSuccess={setSubmitSuccess}
                              onClose={onClose}
                              hideCancel={hideCancel}
                            />
                          </Box>
                        )}
                        {formik.values.loanProduct && submitError && (
                          <Typography color="error" sx={{ mt: 2 }}>
                            {submitError}
                          </Typography>
                        )}
                        {formik.values.loanProduct && submitSuccess && (
                          <Typography color="primary" sx={{ mt: 2 }}>
                            {submitSuccess}
                          </Typography>
                        )}
                      </Grid>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </>
        )}
      </>
    );
  }
);

UseLoanProduct.displayName = "UseLoanProduct";

export default UseLoanProduct;
