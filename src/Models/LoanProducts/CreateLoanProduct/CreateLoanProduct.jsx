import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useContext,
  useRef,
} from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import { generateClient } from "aws-amplify/api";
import { Link } from "react-router-dom";

import createLoanProductForm from "./createLoanProductForm";
import TextInput from "../../../Resources/FormComponents/TextInput";
import Dropdown from "../../../Resources/FormComponents/Dropdown";
import DropDownSearchable from "../../../Resources/FormComponents/DropDownSearchable";
import MultipleDropDown from "../../../Resources/FormComponents/MultipleDropDown";
import OrderedList from "../../../Resources/FormComponents/OrderedList";
import RadioGroup from "../../../Resources/FormComponents/RadioGroup";
import RadioGroupNoLabel from "../../../Resources/FormComponents/RadioGroupNoLabel";
import CreateFormButtons from "../../../ModelAssets/CreateFormButtons";
import CustomEditFormButtons from "../../../ModelAssets/CustomEditFormButtons";
import { UserContext } from "../../../App";
import {
  createLoanProduct,
  associateFeeWithLoanProduct,
  associateBranchWithLoanProduct,
  buildLoanProductInput,
} from "./createLoanProductHelpers";
import FormLabel from "../../../Resources/FormComponents/FormLabel";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

const baseInitialValues = createLoanProductForm.reduce((acc, field) => {
  // Skip label fields as they don't need values
  if (field.type === "label") return acc;
  // For multi-select fields, use an empty array instead of empty string
  acc[field.name] =
    field.multiple || field.type === "selectMultiple"
      ? []
      : field.defaultValue || "";
  return acc;
}, {});

const buildValidationSchema = () => {
  const validationShape = {
    name: Yup.string()
      .required("Loan Product Name is required")
      .max(100, "Name too long"),
    branch: Yup.array()
      .min(1, "At least one branch is required")
      .required("Branch is required"),
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
    minInterest: Yup.number()
      .min(0, "Minimum Interest must be at least 0")
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      ),
    maxInterest: Yup.number()
      .min(0, "Maximum Interest must be at least 0")
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
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
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
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
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      ),
    maxDuration: Yup.number()
      .min(0, "Maximum Duration must be at least 0")
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
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
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
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
  };

  return Yup.object().shape(validationShape);
};

const baseValidationSchema = buildValidationSchema();

const renderFormField = (field, formikValues) => {
  // Check if field should be disabled based on dependencies
  const isDisabled =
    field.dependsOn && formikValues[field.dependsOn] !== field.dependsOnValue;

  // Handle dynamic labels
  let displayLabel = field.label;
  if (field.dynamicLabel && field.name === "calculateInterestOn") {
    displayLabel =
      formikValues.interestTypeMaturity === "fixed"
        ? "Calculate Interest if there is"
        : "Calculate Interest on";
  } else if (
    field.dynamicLabel &&
    field.name === "loanInterestRateAfterMaturity"
  ) {
    displayLabel =
      formikValues.interestTypeMaturity === "fixed"
        ? "Interest Amount After Maturity"
        : "Interest Rate After Maturity";
  }

  const { dynamicHelperText, ...fieldProps } = field;

  switch (field.type) {
    case "text":
    case "number":
      return (
        <TextInput {...fieldProps} label={displayLabel} disabled={isDisabled} />
      );
    case "select":
      // if (field.name === "branch") {
      //   return (
      //     <DropDownSearchable
      //       {...fieldProps}
      //       label={displayLabel}
      //       disabled={isDisabled}
      //       placeholder={"Type to search branches"}
      //     />
      //   );
      // }
      return (
        <Dropdown {...fieldProps} label={displayLabel} disabled={isDisabled} />
      );
    case "selectMultiple":
      return (
        <>
          <MultipleDropDown {...fieldProps} disabled={isDisabled} />
          {field.name === "loanFees" &&
            field.options?.length === 0 &&
            field.editing && (
              <Alert severity="info" sx={{ mt: 1 }}>
                No loan fees found.{" "}
                <Link to="/admin/add-loan-fee" style={{ fontWeight: "bold" }}>
                  Click here to create loan fees
                </Link>
              </Alert>
            )}
        </>
      );
    case "radio":
      return <RadioGroup {...fieldProps} disabled={isDisabled} />;
    case "radioNoLabel":
      return <RadioGroupNoLabel {...fieldProps} disabled={isDisabled} />;
    case "orderedList":
      return (
        <OrderedList
          label={field.label}
          items={field.formik.values[field.name] || field.defaultValue || []}
          onChange={(newOrder) =>
            field.formik.setFieldValue(field.name, newOrder)
          }
          helperText={field.helperText}
          required={field.required}
          editing={field.editing}
        />
      );
    case "label":
      return <FormLabel label={field.label} />;
    default:
      return <TextInput {...fieldProps} />;
  }
};

const LIST_BRANCHES_QUERY = `
  query ListBranches($institutionId: ID!, $nextToken: String) {
    listBranches(
      filter: { institutionBranchesId: { eq: $institutionId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
        id
        name
      }
      nextToken
    }
  }
`;

const LIST_LOAN_FEES_QUERY = `
  query ListLoanFeesConfigs($institutionId: ID!, $nextToken: String) {
    listLoanFeesConfigs(
      filter: { institutionLoanFeesConfigsId: { eq: $institutionId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
        id
        name
      }
      nextToken
    }
  }
`;

const CreateLoanProduct = forwardRef(
  (
    {
      onClose,
      onCreateSuccess,
      onEditSuccess,
      onCreateLoanProductAPI,
      onUpdateLoanProductAPI,
      initialValues: propInitialValues,
      isEditMode = false,
      hideCancel,
      onCancel,
      forceEditMode = false,
    },
    ref
  ) => {
    const { userDetails } = useContext(UserContext);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [branches, setBranches] = useState([]);
    const [loanFees, setLoanFees] = useState([]);
    const [editMode, setEditMode] = useState(forceEditMode || !isEditMode);
    const client = React.useMemo(() => generateClient(), []);
    const hasFetchedRef = useRef(false);

    // Scroll to top on component mount
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {
      const fetchBranchesAndFees = async () => {
        if (!userDetails?.institutionUsersId || hasFetchedRef.current) return;

        hasFetchedRef.current = true;

        try {
          // Fetch Branches
          let allBranchesList = [];
          let nextToken = null;
          while (true) {
            console.log("API Call: LIST_BRANCHES_QUERY", {
              institutionId: userDetails.institutionUsersId,
              nextToken,
            });
            const result = await client.graphql({
              query: LIST_BRANCHES_QUERY,
              variables: {
                institutionId: userDetails.institutionUsersId,
                nextToken,
              },
            });

            const listResult = result?.data?.listBranches || {};
            const batchItems = Array.isArray(listResult.items)
              ? listResult.items
              : [];
            allBranchesList.push(...batchItems);

            const newNextToken = listResult.nextToken || null;
            if (!newNextToken) {
              break;
            }
            nextToken = newNextToken;
          }
          setBranches(allBranchesList);

          // Fetch Loan Fees
          let allLoanFeesList = [];
          nextToken = null;
          while (true) {
            console.log("API Call: LIST_LOAN_FEES_QUERY", {
              institutionId: userDetails.institutionUsersId,
              nextToken,
            });
            const result = await client.graphql({
              query: LIST_LOAN_FEES_QUERY,
              variables: {
                institutionId: userDetails.institutionUsersId,
                nextToken,
              },
            });

            const listResult = result?.data?.listLoanFeesConfigs || {};
            const batchItems = Array.isArray(listResult.items)
              ? listResult.items
              : [];
            allLoanFeesList.push(...batchItems);

            const newNextToken = listResult.nextToken || null;
            if (!newNextToken) {
              break;
            }
            nextToken = newNextToken;
          }
          setLoanFees(allLoanFeesList);
        } catch (err) {
          console.error("Error fetching branches or fees:", err);
        }
      };

      fetchBranchesAndFees();
    }, [userDetails?.institutionUsersId, client]);

    // Map database field names to form field names
    const mapDbFieldsToFormFields = (dbData) => {
      if (!dbData) return {};

      return {
        name: dbData.name || "",
        status: dbData.status || "Active",
        minPrincipal: dbData.minPrincipal || "",
        maxPrincipal: dbData.maxPrincipal || "",
        defaultPrincipal: dbData.defaultPrincipal || "",
        minInterest: dbData.minInterest || "",
        maxInterest: dbData.maxInterest || "",
        defaultInterest: dbData.defaultInterest || "",
        interestMethod: dbData.interestCalculationMethod || "",
        interestType: dbData.interestType || "",
        interestPeriod: dbData.interestPeriod || "",
        durationPeriod: dbData.durationPeriod || "",
        minDuration: dbData.minDuration || "",
        maxDuration: dbData.maxDuration || "",
        defaultDuration: dbData.defaultDuration || "",
        repaymentFrequency: dbData.repaymentFrequency || "",
        repaymentOrder: dbData.repaymentOrder
          ? typeof dbData.repaymentOrder === "string"
            ? JSON.parse(dbData.repaymentOrder)
            : dbData.repaymentOrder
          : ["Penalty", "Fees", "Interest", "Principal"],
        branch: dbData.branches?.items?.map((b) => b.branch.id) || [],
        loanFees: dbData.loanFees || [],
        extendLoanAfterMaturity: dbData.extendLoanAfterMaturity ? "yes" : "no",
        interestTypeMaturity: dbData.interestTypeMaturity || "percentage",
        calculateInterestOn: dbData.calculateInterestOn || "",
        loanInterestRateAfterMaturity:
          dbData.loanInterestRateAfterMaturity || "",
        recurringPeriodAfterMaturityUnit:
          dbData.recurringPeriodAfterMaturityUnit || "",
      };
    };

    // Use prop initialValues if provided, otherwise use default
    const formInitialValues = propInitialValues
      ? {
          ...baseInitialValues,
          ...mapDbFieldsToFormFields(propInitialValues),
        }
      : baseInitialValues;

    useImperativeHandle(ref, () => ({
      toggleEdit: () => {
        setEditMode((prev) => !prev);
      },
      getEditMode: () => editMode,
    }));

    const updatedCreateLoanProductForm = React.useMemo(() => {
      return createLoanProductForm.map((field) => {
        if (field.name === "branch") {
          return {
            ...field,
            options: branches.map((branch) => ({
              value: branch.id,
              label: branch.name,
            })),
          };
        }
        if (field.name === "loanFees") {
          return {
            ...field,
            options: loanFees.map((fee) => ({
              value: fee.id,
              label: fee.name,
            })),
          };
        }
        return field;
      });
    }, [branches, loanFees]);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);

      console.log("CreateLoanProduct Form Values:", values);

      try {
        if (isEditMode && propInitialValues && onUpdateLoanProductAPI) {
          // Update existing loan product using parent-provided API function
          console.log("API Call: onUpdateLoanProductAPI", {
            values,
            propInitialValues,
          });
          const result = await onUpdateLoanProductAPI(
            values,
            propInitialValues
          );
          setSubmitSuccess("Loan product updated!");
          setEditMode(false);
          setTimeout(() => setSubmitSuccess(""), 2000);
          if (onEditSuccess) {
            onEditSuccess(result);
          }
        } else if (!isEditMode && onCreateLoanProductAPI) {
          // Create new loan product using parent-provided API function
          console.log("API Call: onCreateLoanProductAPI", { values });
          const result = await onCreateLoanProductAPI(values);
          setSubmitSuccess("Loan product created!");
          resetForm();
          if (onCreateSuccess) {
            onCreateSuccess(result);
          }
        } else {
          // Fallback to direct creation if no API function provided
          const input = buildLoanProductInput(values, userDetails);
          console.log("API Call: createLoanProduct", { input });
          const result = await createLoanProduct(input);
          const loanProductId = result?.id;

          if (loanProductId) {
            // Associate loan fees
            const feeAssociations = [];
            if (values.loanFees && Array.isArray(values.loanFees)) {
              for (const feeId of values.loanFees) {
                console.log("API Call: associateFeeWithLoanProduct", {
                  loanProductId,
                  feeId,
                });
                await associateFeeWithLoanProduct(loanProductId, feeId);
                // Find the fee details from the loanFees state
                const feeDetails = loanFees.find((f) => f.id === feeId);
                if (feeDetails) {
                  feeAssociations.push({
                    loanFeesConfig: {
                      id: feeDetails.id,
                      name: feeDetails.name,
                    },
                  });
                }
              }
            }

            // Associate branches
            const branchAssociations = [];
            if (values.branch && Array.isArray(values.branch)) {
              for (const branchId of values.branch) {
                console.log("API Call: associateBranchWithLoanProduct", {
                  loanProductId,
                  branchId,
                });
                await associateBranchWithLoanProduct(loanProductId, branchId);
                // Find the branch details from the branches state
                const branchDetails = branches.find((b) => b.id === branchId);
                if (branchDetails) {
                  branchAssociations.push({
                    branch: {
                      id: branchDetails.id,
                      name: branchDetails.name,
                    },
                  });
                }
              }
            }

            // Construct the complete loan product object with associations
            const completeLoanProduct = {
              ...result,
              branches: {
                items: branchAssociations,
              },
              loanFeesConfigs: {
                items: feeAssociations,
              },
            };

            setSubmitSuccess("Loan product created successfully!");
            resetForm();
            if (onCreateSuccess) {
              onCreateSuccess(completeLoanProduct);
            }
          } else {
            setSubmitSuccess("Loan product created successfully!");
            resetForm();
            if (onCreateSuccess) {
              onCreateSuccess(result);
            }
          }
        }
      } catch (err) {
        console.error("Error creating/updating loan product:", err);
        setSubmitError(
          err.message ||
            `Failed to ${
              isEditMode ? "update" : "create"
            } loan product. Please try again.`
        );
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <>
        <Formik
          initialValues={formInitialValues}
          validationSchema={baseValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {(formik) => (
            <Form>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  flex: 1,
                }}
              >
                {isEditMode && editMode ? (
                  <CustomEditFormButtons
                    formik={formik}
                    setEditMode={setEditMode}
                    setSubmitError={setSubmitError}
                    setSubmitSuccess={setSubmitSuccess}
                    onCancel={onCancel}
                  />
                ) : null}
                <Grid container spacing={1}>
                  {updatedCreateLoanProductForm.map((field, index) => {
                    let helperText = field.helperText;
                    if (field.dynamicHelperText) {
                      const currentValue = formik.values[field.name];
                      if (
                        currentValue &&
                        field.dynamicHelperText[currentValue]
                      ) {
                        helperText = field.dynamicHelperText[currentValue];
                      }
                    }

                    return (
                      <FormGrid
                        size={{ xs: 12, md: field.span }}
                        key={`${field.name}-${index}`}
                      >
                        {renderFormField(
                          { ...field, formik, editing: editMode, helperText },
                          formik.values
                        )}
                      </FormGrid>
                    );
                  })}
                  <Box
                    sx={{
                      display: "flex",
                      pr: 2,
                      justifyContent: { xs: "center", md: "flex-end" },
                      width: "100%",
                    }}
                  >
                    {!isEditMode ? (
                      <CreateFormButtons
                        formik={formik}
                        setEditMode={setEditMode}
                        setSubmitError={setSubmitError}
                        setSubmitSuccess={setSubmitSuccess}
                        onClose={onClose}
                        hideCancel={hideCancel}
                      />
                    ) : null}
                  </Box>
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
                </Grid>
              </Box>
            </Form>
          )}
        </Formik>
      </>
    );
  }
);

CreateLoanProduct.displayName = "CreateLoanProduct";

export default CreateLoanProduct;
