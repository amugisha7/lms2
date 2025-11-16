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

import editLoanForm from "./editLoanForm";
import TextInput from "../../../Resources/FormComponents/TextInput";
import Dropdown from "../../../Resources/FormComponents/Dropdown";
import OrderedList from "../../../Resources/FormComponents/OrderedList";
import Label from "../../../Resources/FormComponents/FormLabel";
import CustomEditFormButtons from "../../../ComponentAssets/CustomEditFormButtons";
import { UserContext } from "../../../App";
import {
  updateLoan,
  buildLoanUpdateInput,
  fetchBorrowersAndProducts,
} from "./editLoanHelpers";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

const baseInitialValues = editLoanForm.reduce((acc, field) => {
  // Skip label fields as they don't need values
  if (field.type === "label") return acc;
  acc[field.name] = field.defaultValue || "";
  return acc;
}, {});

const buildValidationSchema = () => {
  const validationShape = {
    borrower: Yup.string().required("Borrower is required"),
    loanProduct: Yup.string().required("Loan Product is required"),
    principalAmount: Yup.number()
      .required("Principal Amount is required")
      .min(0, "Principal Amount must be at least 0"),
    interestRate: Yup.number()
      .required("Interest Rate is required")
      .min(0, "Interest Rate must be at least 0")
      .max(100, "Interest Rate cannot exceed 100%"),
    termDuration: Yup.number()
      .required("Term Duration is required")
      .min(1, "Term Duration must be at least 1"),
    durationPeriod: Yup.string()
      .oneOf(["days", "weeks", "months", "years"])
      .required("Duration Period is required"),
    disbursementDate: Yup.string().required("Disbursement Date is required"),
    maturityDate: Yup.string().required("Maturity Date is required"),
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
      .required("Repayment Frequency is required"),
    status: Yup.string()
      .oneOf(["Active", "Pending", "Approved", "Rejected", "Closed"])
      .required("Status is required"),
    totalAmountDue: Yup.number()
      .min(0, "Total Amount Due must be at least 0")
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      ),
  };

  return Yup.object().shape(validationShape);
};

const baseValidationSchema = buildValidationSchema();

const renderFormField = (field, formikValues) => {
  switch (field.type) {
    case "text":
    case "number":
      return <TextInput {...field} disabled={!field.editing} />;
    case "select":
      return <Dropdown {...field} disabled={!field.editing} />;
    case "orderedList":
      return (
        <OrderedList
          {...field}
          items={formikValues[field.name]}
          onChange={(value) => field.formik.setFieldValue(field.name, value)}
          editing={field.editing}
        />
      );
    case "label":
      return <Label {...field} />;
    default:
      return <TextInput {...field} disabled={!field.editing} />;
  }
};

const EditLoan = forwardRef(
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
    const [borrowers, setBorrowers] = useState([]);
    const [loanProducts, setLoanProducts] = useState([]);
    const [viewBorrowers, setViewBorrowers] = useState([]);
    const [viewLoanProducts, setViewLoanProducts] = useState([]);
    const [editMode, setEditMode] = useState(isEditMode);

    useEffect(() => {
      const fetchData = async () => {
        if (!editMode || !userDetails?.institutionUsersId) return;

        try {
          const { borrowers: fetchedBorrowers, loanProducts: fetchedProducts } =
            await fetchBorrowersAndProducts(userDetails.institutionUsersId);
          setBorrowers(fetchedBorrowers);
          setLoanProducts(fetchedProducts);
        } catch (err) {
          console.error("Error fetching borrowers or loan products:", err);
        }
      };

      fetchData();
    }, [editMode, userDetails?.institutionUsersId]);

    const mapDbFieldsToFormFields = (dbData) => {
      if (!dbData) return {};

      return {
        borrower: dbData.borrowerLoansId || "",
        loanProduct: dbData.loanProductLoansId || "",
        principalAmount: dbData.principalAmount || "",
        interestRate: dbData.interestRate || "",
        termDuration: dbData.termDuration || "",
        durationPeriod: dbData.durationPeriod || "",
        disbursementDate: dbData.disbursementDate || "",
        maturityDate: dbData.maturityDate || "",
        repaymentFrequency: dbData.repaymentFrequency || "",
        repaymentOrder: dbData.repaymentOrder
          ? typeof dbData.repaymentOrder === "string"
            ? JSON.parse(dbData.repaymentOrder)
            : dbData.repaymentOrder
          : ["Penalty", "Fees", "Interest", "Principal"],
        status: dbData.status || "",
        totalAmountDue: dbData.totalAmountDue || "",
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
        const borrowerOptions = propInitialValues.borrower
          ? [
              {
                value: propInitialValues.borrower.id,
                label:
                  `${propInitialValues.borrower.firstname || ""} ${
                    propInitialValues.borrower.othername || ""
                  } ${propInitialValues.borrower.businessName || ""}`.trim() ||
                  propInitialValues.borrower.uniqueIdNumber,
              },
            ]
          : [];
        setViewBorrowers(borrowerOptions);

        const productOptions = propInitialValues.loanProduct
          ? [
              {
                value: propInitialValues.loanProduct.id,
                label: propInitialValues.loanProduct.name,
              },
            ]
          : [];
        setViewLoanProducts(productOptions);
      }
    }, [propInitialValues]);

    useImperativeHandle(ref, () => ({
      toggleEdit: () => {
        setEditMode((prev) => !prev);
      },
      getEditMode: () => editMode,
    }));

    const updatedEditLoanForm = React.useMemo(() => {
      return editLoanForm.map((field) => {
        if (field.name === "borrower") {
          return {
            ...field,
            options: editMode
              ? borrowers.map((borrower) => ({
                  value: borrower.id,
                  label:
                    `${borrower.firstname || ""} ${borrower.othername || ""} ${
                      borrower.businessName || ""
                    }`.trim() || borrower.uniqueIdNumber,
                }))
              : viewBorrowers,
          };
        }
        if (field.name === "loanProduct") {
          return {
            ...field,
            options: editMode
              ? loanProducts.map((product) => ({
                  value: product.id,
                  label: product.name,
                }))
              : viewLoanProducts,
          };
        }
        return field;
      });
    }, [borrowers, loanProducts, viewBorrowers, viewLoanProducts, editMode]);

    const handleSubmit = async (values, { setSubmitting }) => {
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);

      try {
        const input = buildLoanUpdateInput(
          values,
          userDetails,
          propInitialValues.id
        );
        console.log("API Mutation: updateLoan", { input });
        const result = await updateLoan(input);

        setSubmitSuccess("Loan updated successfully!");
        setEditMode(false);
        if (onEditSuccess) onEditSuccess(result);
      } catch (err) {
        console.error("Error updating loan:", err);
        setSubmitError("Failed to update loan. Please try again.");
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
                  {updatedEditLoanForm.map((field, index) => (
                    <FormGrid
                      size={{ xs: 12, md: field.span }}
                      key={`${field.name}-${index}`}
                    >
                      {renderFormField(
                        { ...field, formik, editing: editMode },
                        formik.values
                      )}
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

EditLoan.displayName = "EditLoan";

export default EditLoan;
