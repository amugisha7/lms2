import React, { useState, useEffect, useContext, useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/api";

import selectAccountsForm from "./selectAccountsForm";
import DropDownSearchable from "../../../Resources/FormComponents/DropDownSearchable";
import FormLabel from "../../../Resources/FormComponents/FormLabel";
import WorkingOverlay from "../../../ModelAssets/WorkingOverlay";
import NotificationBar from "../../../ModelAssets/NotificationBar";
import { UserContext } from "../../../App";
import { useNotification } from "../../../ModelAssets/NotificationContext";
import { convertDraftToLoan } from "../LoanDrafts/loanDraftHelpers";
import { CREATE_MONEY_TRANSACTION_MUTATION } from "../../Accounts/MoneyTransactions/moneyTransactionHelpes";
import { createLoanDisbursement, createLoanEvent } from "../loanHelpers";

const LIST_ACCOUNTS_SIMPLE_QUERY = `
  query ListAccounts($institutionId: ID!, $nextToken: String) {
    listAccounts(
      filter: { institutionAccountsId: { eq: $institutionId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
        id
        name
        accountType
        currency
        status
      }
      nextToken
    }
  }
`;

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

const validationSchemaWithFees = Yup.object().shape({
  principalAccountId: Yup.string().required(
    "Please select a principal disbursement account.",
  ),
  feesAccountId: Yup.string().required("Please select a loan fees account."),
});

const validationSchemaWithoutFees = Yup.object().shape({
  principalAccountId: Yup.string().required(
    "Please select a principal disbursement account.",
  ),
});

export default function SelectAccounts({
  loanDraft,
  userDetails,
  borrower,
  totalLoanFee = 0,
  onClose,
  onSuccess,
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState("Working...");
  const [notification, setNotification] = useState(null);

  const hasLoanFees = totalLoanFee > 0;

  // Build borrower display name
  const borrowerName = useMemo(() => {
    if (!borrower) return "Unknown Borrower";
    const parts = [
      borrower.firstname,
      borrower.othername,
      borrower.businessName,
    ].filter(Boolean);
    return parts.join(" ").trim() || "Unknown Borrower";
  }, [borrower]);

  // Fetch accounts for the institution
  useEffect(() => {
    let cancelled = false;
    const fetchAccounts = async () => {
      if (!userDetails?.institutionUsersId) return;
      setAccountsLoading(true);
      try {
        const client = generateClient();
        let allAccounts = [];
        let nextToken = null;

        do {
          const result = await client.graphql({
            query: LIST_ACCOUNTS_SIMPLE_QUERY,
            variables: {
              institutionId: userDetails.institutionUsersId,
              nextToken,
            },
          });
          const items = result?.data?.listAccounts?.items || [];
          allAccounts = [...allAccounts, ...items];
          nextToken = result?.data?.listAccounts?.nextToken;
        } while (nextToken);

        if (!cancelled) {
          setAccounts(allAccounts);
        }
      } catch (err) {
        console.error("Error fetching accounts:", err);
      } finally {
        if (!cancelled) setAccountsLoading(false);
      }
    };

    fetchAccounts();
    return () => {
      cancelled = true;
    };
  }, [userDetails?.institutionUsersId]);

  // Build dropdown options from accounts
  const accountOptions = useMemo(() => {
    return accounts
      .filter((a) => a.status !== "inactive" && a.status !== "closed")
      .map((a) => ({
        value: a.id,
        label: `${a.name}${a.accountType ? ` (${a.accountType})` : ""}`,
      }));
  }, [accounts]);

  const initialValues = {
    principalAccountId: "",
    feesAccountId: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setOverlayOpen(true);
    setOverlayMessage("Creating loan and disbursing funds...");

    try {
      const client = generateClient();

      // Step 1: Convert draft to loan (creates installments, events, sets status to "Current")
      setOverlayMessage("Creating loan and installments...");
      const loan = await convertDraftToLoan({
        loanDraft,
        userDetails,
      });

      if (!loan?.id) {
        throw new Error("Failed to create loan.");
      }

      const loanId = loan.id;
      const loanNumber = loan.loanNumber || loanId;
      const principalAmount =
        loanDraft.principal || parseFloat(loan.principal) || 0;
      const today = new Date().toISOString().split("T")[0];

      // Step 2: Create principal disbursement transaction (withdrawal from the principal account)
      setOverlayMessage("Disbursing principal...");
      const principalDescription = `Loan #${loanNumber} - Principal Disbursement to ${borrowerName} (Loan ID: ${loanId})`;

      await client.graphql({
        query: CREATE_MONEY_TRANSACTION_MUTATION,
        variables: {
          input: {
            amount: principalAmount,
            transactionType: "withdrawal",
            transactionDate: today,
            description: principalDescription,
            referenceNumber: `DISB-${loanNumber}`,
            status: "completed",
            accountMoneyTransactionsId: values.principalAccountId,
            loanID: loanId,
            relatedEntityType: "LOAN_DISBURSEMENT",
            category: "Loan Disbursement",
          },
        },
      });

      // Step 3: Create a LoanDisbursement record
      await client.graphql({
        query: createLoanDisbursement,
        variables: {
          input: {
            loanID: loanId,
            disbursedAt: new Date().toISOString(),
            amount: principalAmount,
            status: "COMPLETED",
            method: "Account Transfer",
            reference: `DISB-${loanNumber}`,
            accountID: values.principalAccountId,
          },
        },
      });

      // Step 4: Create loan fees transaction if applicable
      if (hasLoanFees && values.feesAccountId) {
        setOverlayMessage("Recording loan fees...");
        const feesDescription = `Loan #${loanNumber} - Loan Fees received from ${borrowerName} (Loan ID: ${loanId})`;

        await client.graphql({
          query: CREATE_MONEY_TRANSACTION_MUTATION,
          variables: {
            input: {
              amount: totalLoanFee,
              transactionType: "deposit",
              transactionDate: today,
              description: feesDescription,
              referenceNumber: `FEES-${loanNumber}`,
              status: "completed",
              accountMoneyTransactionsId: values.feesAccountId,
              loanID: loanId,
              relatedEntityType: "LOAN_FEES",
              category: "Loan Fees",
            },
          },
        });
      }

      // Step 5: Create a DISBURSED loan event
      await client.graphql({
        query: createLoanEvent,
        variables: {
          input: {
            loanID: loanId,
            eventAt: new Date().toISOString(),
            eventType: "DISBURSED",
            actorEmployeeID: userDetails?.id || null,
            summary: `Loan disbursed. Principal of ${principalAmount} withdrawn from account.${hasLoanFees ? ` Loan fees of ${totalLoanFee} deposited.` : ""}`,
            payload: JSON.stringify({
              principalAccountId: values.principalAccountId,
              feesAccountId: values.feesAccountId || null,
              principalAmount,
              totalLoanFee: hasLoanFees ? totalLoanFee : 0,
              borrowerName,
            }),
          },
        },
      });

      setOverlayOpen(false);
      showNotification("Loan created and disbursed successfully!", "green");

      if (onSuccess) onSuccess(loan);
      navigate("/loans");
    } catch (err) {
      console.error("Error disbursing loan:", err);
      setOverlayOpen(false);
      const errorMessage =
        err?.message || "Failed to disburse loan. Please try again.";
      showNotification(errorMessage, "red");
      setNotification({ message: errorMessage, color: "red" });
    } finally {
      setSubmitting(false);
    }
  };

  // Parse draft principal for display
  const draftRecord = useMemo(() => {
    if (!loanDraft?.draftRecord) return {};
    if (typeof loanDraft.draftRecord === "string") {
      try {
        return JSON.parse(loanDraft.draftRecord);
      } catch {
        return {};
      }
    }
    return loanDraft.draftRecord || {};
  }, [loanDraft]);

  const principalDisplay =
    loanDraft?.principal || draftRecord?.principalAmount || 0;

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      <WorkingOverlay open={overlayOpen} message={overlayMessage} />

      {notification && (
        <NotificationBar
          message={notification.message}
          color={notification.color}
        />
      )}

      {/* Summary Info */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Disburse Loan
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select the accounts for loan disbursement and fee collection. This
          will activate the loan and create the corresponding transactions.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            p: 2,
            borderRadius: 1,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.04)"
                : "#f5f5f5",
            border: `1px solid ${theme.palette.divider}`,
            mb: 2,
          }}
        >
          <Typography variant="body2">
            <strong>Borrower:</strong> {borrowerName}
          </Typography>
          <Typography variant="body2">
            <strong>Principal Amount:</strong>{" "}
            {Number(principalDisplay).toLocaleString()}
          </Typography>
          {hasLoanFees && (
            <Typography variant="body2">
              <strong>Total Loan Fees:</strong>{" "}
              {Number(totalLoanFee).toLocaleString()}
            </Typography>
          )}
          <Typography variant="body2">
            <strong>Loan Number:</strong> {loanDraft?.loanNumber || "Pending"}
          </Typography>
        </Box>
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={
          hasLoanFees ? validationSchemaWithFees : validationSchemaWithoutFees
        }
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <Grid container spacing={2}>
              {selectAccountsForm.map((field, index) => {
                // Handle conditional rendering
                if (field.showWhen === "hasLoanFees" && !hasLoanFees) {
                  return null;
                }

                if (field.type === "label") {
                  return (
                    <Grid size={{ xs: 12 }} key={`label-${index}`}>
                      <FormLabel label={field.label} />
                    </Grid>
                  );
                }

                if (field.type === "dropdownSearchable") {
                  const fieldError =
                    formik.touched[field.name] && formik.errors[field.name];
                  return (
                    <Grid size={{ xs: 12 }} key={field.name}>
                      <DropDownSearchable
                        label={field.label}
                        name={field.name}
                        options={accountOptions}
                        required={field.required}
                        placeholder={
                          accountsLoading
                            ? "Loading accounts..."
                            : field.placeholder
                        }
                        disabled={accountsLoading}
                        helperText={fieldError || field.helperText}
                        value={formik.values[field.name]}
                        onChange={(e) =>
                          formik.setFieldValue(field.name, e.target.value)
                        }
                        onBlur={() => formik.setFieldTouched(field.name, true)}
                      />
                      {fieldError && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ ml: 1 }}
                        >
                          {fieldError}
                        </Typography>
                      )}
                    </Grid>
                  );
                }

                return null;
              })}
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 4,
                pt: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Button
                variant="outlined"
                onClick={onClose}
                disabled={formik.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={formik.isSubmitting || accountsLoading}
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#76B1D3" : "#1976d2",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#5a9bc2" : "#1565c0",
                  },
                }}
              >
                Disburse & Activate Loan
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
