import React, { useState, useEffect, useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { generateClient } from "aws-amplify/api";
import { useNavigate } from "react-router-dom";
import { CustomerContext } from "../../CustomerApp";
import customerLoanApplicationForm from "./customerLoanApplicationForm";
import TextInput from "../../Resources/FormComponents/TextInput";
import Dropdown from "../../Resources/FormComponents/Dropdown";
import CreateFormButtons from "../../ModelAssets/CreateFormButtons";
import { createLoanDraft } from "../../Models/Loans/LoanDrafts/loanDraftHelpers";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

const baseInitialValues = {
  loanProduct: "",
  principalAmount: "",
  loanPurpose: "",
};

const validationSchema = Yup.object().shape({
  loanProduct: Yup.string().required("Please select a loan product"),
  principalAmount: Yup.number()
    .required("Principal amount is required")
    .min(1, "Amount must be greater than 0"),
  loanPurpose: Yup.string(),
});

const renderFormField = (field) => {
  switch (field.type) {
    case "select":
      return <Dropdown {...field} />;
    case "number":
      return <TextInput {...field} type="number" />;
    case "textarea":
      return <TextInput {...field} multiline rows={4} />;
    default:
      return <TextInput {...field} />;
  }
};

export default function CustomerLoanApplication() {
  const { borrower, institution, customerUser } = useContext(CustomerContext);
  const [loanProducts, setLoanProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const client = generateClient();

      try {
        // Fetch visible loan products
        let allProducts = [];
        let nextToken = null;

        while (true) {
          const result = await client.graphql({
            query: `query ListLoanProducts($filter: ModelLoanProductFilterInput, $nextToken: String) {
              listLoanProducts(filter: $filter, nextToken: $nextToken) {
                items {
                  id
                  name
                  customLoanProductDetails
                  principalAmountMin
                  principalAmountMax
                  principalAmountDefault
                  status
                }
                nextToken
              }
            }`,
            variables: {
              filter: {
                institutionLoanProductsId: { eq: institution.id },
                status: { eq: "Active" },
              },
              nextToken,
            },
          });

          const items = result?.data?.listLoanProducts?.items || [];
          allProducts.push(...items);

          nextToken = result?.data?.listLoanProducts?.nextToken;
          if (!nextToken) break;
        }

        // Filter to only customer-visible products
        const visibleProducts = allProducts.filter((product) => {
          try {
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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitError("");
    setSubmitSuccess("");
    setSubmitting(true);

    try {
      const selectedProduct = loanProducts.find(
        (p) => p.id === values.loanProduct,
      );

      // Create draft record with minimal required fields
      const draftRecord = {
        borrower: borrower.id,
        loanProduct: values.loanProduct,
        principalAmount: values.principalAmount,
        loanPurpose: values.loanPurpose || null,
        // Use defaults from product
        interestRate: selectedProduct?.interestRateDefault || 0,
        interestMethod: selectedProduct?.interestCalculationMethod || "flat",
        interestType: selectedProduct?.interestType || "percentage",
        interestPeriod: selectedProduct?.interestPeriod || "per_month",
        loanDuration: selectedProduct?.termDurationDefault || 12,
        durationPeriod: selectedProduct?.durationPeriod || "months",
        repaymentFrequency: selectedProduct?.repaymentFrequency || "monthly",
        loanStartDate: new Date().toISOString().split("T")[0],
      };

      const userDetails = {
        id: customerUser.id,
        institutionUsersId: institution.id,
        branchUsersId: branches[0]?.id || null, // Use first branch
      };

      await createLoanDraft({
        userDetails,
        draftRecord,
        source: "CUSTOMER_PORTAL",
        status: "PENDING",
      });

      setSubmitSuccess(
        "Application submitted successfully! You'll be notified once it's reviewed.",
      );
      resetForm();

      // Navigate to loans list after a delay
      setTimeout(() => {
        navigate(`/client/${institution.id}/loans`);
      }, 2000);
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
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Apply for Loan
        </Typography>
        <Paper sx={{ p: 3, bgcolor: "warning.light" }}>
          <Typography>
            No loan products are currently available for customer applications.
            Please contact the institution for assistance.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Apply for Loan
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Formik
          initialValues={baseInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form>
              <Grid container spacing={2}>
                {updatedForm.map((field) => (
                  <FormGrid size={{ xs: 12, md: field.span }} key={field.name}>
                    {renderFormField({
                      ...field,
                      editing: true,
                      isEditMode: false,
                    })}
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
                    hideCancel={true}
                    submitLabel="Submit Application"
                  />
                </Box>

                {submitError && (
                  <Typography color="error" sx={{ mt: 2, px: 2 }}>
                    {submitError}
                  </Typography>
                )}
                {submitSuccess && (
                  <Typography color="primary" sx={{ mt: 2, px: 2 }}>
                    {submitSuccess}
                  </Typography>
                )}
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
}
