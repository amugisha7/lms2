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

import editLoanProductForm from "./editLoanProductForm";
import TextInput from "../../../Resources/FormComponents/TextInput";
import Dropdown from "../../../Resources/FormComponents/Dropdown";
import CustomEditFormButtons from "../../../ComponentAssets/CustomEditFormButtons";
import { UserContext } from "../../../App";
import {
  updateLoanProduct,
  getLoanProductById,
  buildLoanProductUpdateInput,
} from "./editLoanProductHelpers";
import {
  associateBranchWithLoanProduct,
  associateFeeWithLoanProduct,
} from "../CreateLoanProduct/createLoanProductHelpers"; // Re-use association helpers

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

const baseInitialValues = editLoanProductForm.reduce((acc, field) => {
  acc[field.name] = field.defaultValue || "";
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
  query ListLoanFees($institutionId: ID!, $nextToken: String) {
    listLoanFees(
      filter: { institutionLoanFeesId: { eq: $institutionId } }
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

const EditLoanProduct = forwardRef(
  (
    {
      onEditSuccess,
      initialValues: propInitialValues,
      isEditMode = true,
      onCancel,
    },
    ref
  ) => {
    const [initialValues, setInitialValues] = useState(baseInitialValues);
    const { userDetails } = useContext(UserContext);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [branches, setBranches] = useState([]);
    const [loanFees, setLoanFees] = useState([]);
    const client = React.useMemo(() => generateClient(), []);
    const [editMode, setEditMode] = useState(isEditMode);

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

            const listResult = result?.data?.listLoanFees || {};
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

    const mapDbFieldsToFormFields = (dbData) => {
      if (!dbData) return {};

      return {
        name: dbData.name || "",
        minPrincipal: dbData.principalAmountMin || "",
        maxPrincipal: dbData.principalAmountMax || "",
        defaultPrincipal: dbData.principalAmountDefault || "",
        minInterest: dbData.interestRateMin || "",
        maxInterest: dbData.interestRateMax || "",
        defaultInterest: dbData.interestRateDefault || "",
        interestType: dbData.interestType || "",
        interestPeriod: dbData.interestPeriod || "",
        minDuration: dbData.termDurationMin || "",
        maxDuration: dbData.termDurationMax || "",
        defaultDuration: dbData.termDurationDefault || "",
        durationPeriod: dbData.durationPeriod || "",
        repaymentFrequency: dbData.repaymentFrequency || "",
        extendLoanAfterMaturity: dbData.extendLoanAfterMaturity
          ? "true"
          : "false",
        interestTypeMaturity: dbData.interestTypeMaturity || "",
        calculateInterestOn: dbData.calculateInterestOn || "",
        loanInterestRateAfterMaturity:
          dbData.loanInterestRateAfterMaturity || "",
        recurringPeriodAfterMaturityUnit:
          dbData.recurringPeriodAfterMaturityUnit || "",
        branch: dbData.Branches?.items.map((b) => b.branchId) || [],
        loanFees: dbData.LoanFees?.items.map((f) => f.loanFeesId) || [],
      };
    };

    const formInitialValues = propInitialValues
      ? {
          ...baseInitialValues,
          ...mapDbFieldsToFormFields(propInitialValues),
        }
      : initialValues;

    useEffect(() => {
      if (propInitialValues) {
        const newInitialValues = {
          ...baseInitialValues,
          ...mapDbFieldsToFormFields(propInitialValues),
        };
        setInitialValues(newInitialValues);
      }
    }, [propInitialValues]);

    useImperativeHandle(ref, () => ({
      toggleEdit: () => {
        setEditMode((prev) => !prev);
      },
      getEditMode: () => editMode,
    }));

    const updatedEditLoanProductForm = React.useMemo(() => {
      return editLoanProductForm.map((field) => {
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

    const handleSubmit = async (values, { setSubmitting }) => {
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);

      try {
        const input = buildLoanProductUpdateInput(
          values,
          userDetails,
          propInitialValues.id
        );
        const result = await updateLoanProduct(input);

        // This is a simplified version. In a real app, you'd want to diff the arrays and only add/remove what's necessary.
        // For now, we remove all and re-add.
        const client = generateClient();
        const existingBranches = await client.graphql({
          query: `query ListBranchLoanProducts($loanProductId: ID!) {
            listBranchLoanProducts(filter: {loanProductId: {eq: $loanProductId}}) {
                items { id }
            }
        }`,
          variables: { loanProductId: propInitialValues.id },
        });
        for (const item of existingBranches.data.listBranchLoanProducts.items) {
          await client.graphql({
            query: `mutation DeleteBranchLoanProduct($input: DeleteBranchLoanProductInput!) {
                deleteBranchLoanProduct(input: $input) { id }
            }`,
            variables: { input: { id: item.id } },
          });
        }

        if (values.branch && Array.isArray(values.branch)) {
          for (const branchId of values.branch) {
            await associateBranchWithLoanProduct(
              propInitialValues.id,
              branchId
            );
          }
        }

        const existingFees = await client.graphql({
          query: `query ListLoanProductLoanFees($loanProductId: ID!) {
            listLoanProductLoanFees(filter: {loanProductId: {eq: $loanProductId}}) {
                items { id }
            }
        }`,
          variables: { loanProductId: propInitialValues.id },
        });
        for (const item of existingFees.data.listLoanProductLoanFees.items) {
          await client.graphql({
            query: `mutation DeleteLoanProductLoanFees($input: DeleteLoanProductLoanFeesInput!) {
                deleteLoanProductLoanFees(input: $input) { id }
            }`,
            variables: { input: { id: item.id } },
          });
        }

        if (values.loanFees && Array.isArray(values.loanFees)) {
          for (const feeId of values.loanFees) {
            await associateFeeWithLoanProduct(propInitialValues.id, feeId);
          }
        }

        setSubmitSuccess("Loan product updated successfully!");
        setEditMode(false);
        if (onEditSuccess) onEditSuccess(result);
      } catch (err) {
        console.error("Error updating loan product:", err);
        setSubmitError("Failed to update loan product. Please try again.");
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
                {editMode ? (
                  <CustomEditFormButtons
                    formik={formik}
                    setEditMode={setEditMode}
                    setSubmitError={setSubmitError}
                    setSubmitSuccess={setSubmitSuccess}
                    onCancel={onCancel}
                  />
                ) : null}
                <Grid container spacing={1}>
                  {updatedEditLoanProductForm.map((field) => (
                    <FormGrid item xs={12} md={field.span} key={field.name}>
                      {renderFormField({ ...field, formik, editing: editMode })}
                    </FormGrid>
                  ))}
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

EditLoanProduct.displayName = "EditLoanProduct";

export default EditLoanProduct;
