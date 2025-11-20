import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useContext,
} from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { generateClient } from "aws-amplify/api";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

import createLoanForm from "./createLoanForm";
import TextInput from "../../../Resources/FormComponents/TextInput";
import Dropdown from "../../../Resources/FormComponents/Dropdown";
import DropDownSearchable from "../../../Resources/FormComponents/DropDownSearchable";
import OrderedList from "../../../Resources/FormComponents/OrderedList";
import CreateFormButtons from "../../../ModelAssets/CreateFormButtons";
import { UserContext } from "../../../App";
import { createLoan, buildLoanInput } from "./createLoanHelpers";
import FormLabel from "../../../Resources/FormComponents/FormLabel";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

const baseInitialValues = createLoanForm.reduce((acc, field) => {
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
      return <TextInput {...field} />;
    case "select":
      // Use DropDownSearchable for borrower field, regular Dropdown for others
      if (field.name === "borrower") {
        return <DropDownSearchable {...field} />;
      }
      return <Dropdown {...field} />;
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
      return <TextInput {...field} />;
  }
};

const LIST_BORROWERS_QUERY = `
  query ListBorrowers($branchId: ID!, $nextToken: String) {
    listBorrowers(
      filter: { branchBorrowersId: { eq: $branchId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
        id
        firstname
        othername
        businessName
        uniqueIdNumber
      }
      nextToken
    }
  }
`;

const LIST_LOAN_PRODUCTS_QUERY = `
  query ListLoanProducts($institutionId: ID!, $nextToken: String) {
    listLoanProducts(
      filter: { institutionLoanProductsId: { eq: $institutionId } }
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

const CreateLoan = forwardRef(
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
    },
    ref
  ) => {
    const { userDetails } = useContext(UserContext);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [borrowers, setBorrowers] = useState([]);
    const [loanProducts, setLoanProducts] = useState([]);
    const [borrowersLoaded, setBorrowersLoaded] = useState(false);
    const client = React.useMemo(() => generateClient(), []);

    // Scroll to top on component mount
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {
      const fetchBorrowersAndProducts = async () => {
        if (!userDetails?.institutionUsersId) return;

        try {
          // Fetch Loan Products always
          let allLoanProductsList = [];
          let nextToken = null;
          while (true) {
            console.log("API Call: LIST_LOAN_PRODUCTS_QUERY", {
              institutionId: userDetails.institutionUsersId,
              nextToken,
            });
            const result = await client.graphql({
              query: LIST_LOAN_PRODUCTS_QUERY,
              variables: {
                institutionId: userDetails.institutionUsersId,
                nextToken,
              },
            });

            const listResult = result?.data?.listLoanProducts || {};
            const batchItems = Array.isArray(listResult.items)
              ? listResult.items
              : [];
            allLoanProductsList.push(...batchItems);

            const newNextToken = listResult.nextToken || null;
            if (!newNextToken) {
              break;
            }
            nextToken = newNextToken;
          }
          setLoanProducts(allLoanProductsList);

          // Only fetch Borrowers if no borrower is pre-selected
          if (!propBorrower) {
            let allBorrowersList = [];
            nextToken = null;
            while (true) {
              console.log("API Call: LIST_BORROWERS_QUERY", {
                branchId: userDetails.branchUsersId,
                nextToken,
              });
              const result = await client.graphql({
                query: LIST_BORROWERS_QUERY,
                variables: {
                  branchId: userDetails.branchUsersId,
                  nextToken,
                },
              });

              const listResult = result?.data?.listBorrowers || {};
              const batchItems = Array.isArray(listResult.items)
                ? listResult.items
                : [];
              allBorrowersList.push(...batchItems);

              const newNextToken = listResult.nextToken || null;
              if (!newNextToken) {
                break;
              }
              nextToken = newNextToken;
            }
            setBorrowers(allBorrowersList);
            setBorrowersLoaded(true);
          } else {
            // If borrower is pre-selected, mark as loaded
            setBorrowersLoaded(true);
          }
        } catch (err) {
          console.error("Error fetching borrowers or loan products:", err);
          setBorrowersLoaded(true); // Set loaded even on error to show form
        }
      };

      fetchBorrowersAndProducts();
    }, [userDetails?.institutionUsersId, client, propBorrower]);

    // Use prop initialValues if provided, otherwise use default
    const formInitialValues = React.useMemo(() => {
      const base = propInitialValues
        ? {
            ...baseInitialValues,
            ...propInitialValues,
          }
        : baseInitialValues;
      if (propBorrower) {
        base.borrower =
          `${propBorrower.firstname || ""} ${propBorrower.othername || ""} ${
            propBorrower.businessName || ""
          }`.trim() || propBorrower.uniqueIdNumber;
      }
      return base;
    }, [propInitialValues, propBorrower]);

    const updatedCreateLoanForm = React.useMemo(() => {
      return createLoanForm.map((field) => {
        if (field.name === "borrower") {
          if (propBorrower) {
            return {
              ...field,
              type: "text",
              readOnly: true,
            };
          } else {
            const borrowerOptions = borrowers.map((borrower) => ({
              value: borrower.id,
              label:
                `${borrower.firstname || ""} ${borrower.othername || ""} ${
                  borrower.businessName || ""
                }`.trim() || borrower.uniqueIdNumber,
            }));
            return {
              ...field,
              options: borrowerOptions,
            };
          }
        }
        if (field.name === "loanProduct") {
          return {
            ...field,
            options: loanProducts.map((product) => ({
              value: product.id,
              label: product.name,
            })),
          };
        }
        return field;
      });
    }, [borrowers, loanProducts, propBorrower]);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);

      // If borrower is pre-selected, use the ID instead of the display name
      if (propBorrower) {
        values.borrower = propBorrower.id;
      }

      console.log("CreateLoan Form Values:", values);

      try {
        if (onCreateLoanAPI) {
          // Use parent-provided API function
          console.log("API Call: onCreateLoanAPI", { values });
          const result = await onCreateLoanAPI(values);
          setSubmitSuccess("Loan created!");
          resetForm();
          if (onCreateSuccess) {
            onCreateSuccess(result);
          }
        } else {
          // Fallback to direct creation
          const input = buildLoanInput(values, userDetails);
          console.log("API Call: createLoan", { input });
          const result = await createLoan(input);

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

    // Show loading state while checking for borrowers
    if (!borrowersLoaded) {
      return (
        <>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
            Create a new Loan
          </Typography>
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
        </>
      );
    }

    return (
      <>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Create a new Loan
        </Typography>
        {!propBorrower && borrowersLoaded && borrowers.length === 0 && (
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
              No borrowers found in the system.{" "}
              <Link
                component={RouterLink}
                to="/borrowers"
                sx={{
                  color: "#0056b3",
                  fontWeight: 600,
                  textDecoration: "underline",
                  "&:hover": {
                    color: "#003d82",
                  },
                }}
              >
                Add a borrower
              </Link>{" "}
              before creating a loan.
            </Typography>
          </Box>
        )}
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
                <Grid container spacing={1}>
                  {updatedCreateLoanForm.map((field, index) => (
                    <FormGrid
                      size={{ xs: 12, md: field.span }}
                      key={`${field.name}-${index}`}
                    >
                      {renderFormField(
                        { ...field, formik, editing: true },
                        formik.values
                      )}
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
                    <CreateFormButtons
                      formik={formik}
                      setEditMode={() => {}}
                      setSubmitError={setSubmitError}
                      setSubmitSuccess={setSubmitSuccess}
                      onClose={onClose}
                      hideCancel={hideCancel}
                    />
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

CreateLoan.displayName = "CreateLoan";

export default CreateLoan;
