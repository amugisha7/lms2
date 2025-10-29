import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useContext,
} from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { generateClient } from "aws-amplify/api";

import createLoanProductForm from "./createLoanProductForm";
import TextInput from "../../../Resources/FormComponents/TextInput";
import Dropdown from "../../../Resources/FormComponents/Dropdown";
import MultipleDropDown from "../../../Resources/FormComponents/MultipleDropDown";
import CreateFormButtons from "../../../ModelAssets/CreateFormButtons";
import CustomEditFormButtons from "../../../ModelAssets/CustomEditFormButtons";
import { UserContext } from "../../../App";
import {
  createLoanProduct,
  associateBranchWithLoanProduct,
  associateFeeWithLoanProduct,
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
  acc[field.name] = field.multiple ? [] : field.defaultValue || "";
  return acc;
}, {});

const buildValidationSchema = () => {
  const validationShape = {
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

const renderFormField = (field) => {
  switch (field.type) {
    case "text":
    case "number":
      return <TextInput {...field} />;
    case "select":
      return <Dropdown {...field} />;
    case "selectMultiple":
      return <MultipleDropDown {...field} />;
    case "label":
      return <FormLabel label={field.label} />;
    default:
      return <TextInput {...field} />;
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

    // Scroll to top on component mount
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {
      const fetchBranchesAndFees = async () => {
        if (!userDetails?.institutionUsersId) return;

        try {
          // Fetch Branches
          let allBranchesList = [];
          let nextToken = null;
          while (true) {
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
        minPrincipal: dbData.minPrincipal || "",
        maxPrincipal: dbData.maxPrincipal || "",
        defaultPrincipal: dbData.defaultPrincipal || "",
        minInterest: dbData.minInterest || "",
        maxInterest: dbData.maxInterest || "",
        defaultInterest: dbData.defaultInterest || "",
        durationPeriod: dbData.durationPeriod || "",
        minDuration: dbData.minDuration || "",
        maxDuration: dbData.maxDuration || "",
        defaultDuration: dbData.defaultDuration || "",
        repaymentFrequency: dbData.repaymentFrequency || "",
        branch: dbData.branch || [],
        loanFees: dbData.loanFees || [],
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
          const result = await onCreateLoanProductAPI(values);
          setSubmitSuccess("Loan product created!");
          resetForm();
          if (onCreateSuccess) {
            onCreateSuccess(result);
          }
        } else {
          // Fallback to direct creation if no API function provided
          const input = buildLoanProductInput(values, userDetails);
          const result = await createLoanProduct(input);
          const loanProductId = result?.id;

          if (loanProductId) {
            // Associate branches
            if (values.branch && Array.isArray(values.branch)) {
              for (const branchId of values.branch) {
                await associateBranchWithLoanProduct(loanProductId, branchId);
              }
            }

            // Associate loan fees
            if (values.loanFees && Array.isArray(values.loanFees)) {
              for (const feeId of values.loanFees) {
                await associateFeeWithLoanProduct(loanProductId, feeId);
              }
            }
          }

          setSubmitSuccess("Loan product created successfully!");
          resetForm();
          if (onCreateSuccess) {
            onCreateSuccess(result);
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
                  {updatedCreateLoanProductForm.map((field) => (
                    <FormGrid
                      size={{ xs: 12, md: field.span }}
                      key={field.name}
                    >
                      {renderFormField({ ...field, formik, editing: editMode })}
                    </FormGrid>
                  ))}
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
