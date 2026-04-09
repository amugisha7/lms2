import React, { useState, useEffect, useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/api";

import selectAccountsForm from "./selectAccountsForm";
import DropDownSearchable from "../../../Resources/FormComponents/DropDownSearchable";
import FormLabel from "../../../Resources/FormComponents/FormLabel";
import CreateFormButtons from "../../../ModelAssets/CreateFormButtons";
import WorkingOverlay from "../../../ModelAssets/WorkingOverlay";
import NotificationBar from "../../../ModelAssets/NotificationBar";
import { useSnackbar } from "../../../ModelAssets/SnackbarContext";
import { useNotification } from "../../../ModelAssets/NotificationContext";
import { convertDraftToLoan } from "../LoanDrafts/loanDraftHelpers";
import { CREATE_MONEY_TRANSACTION_MUTATION } from "../../Accounts/MoneyTransactions/moneyTransactionHelpes";
import { createLoanEvent } from "../loanHelpers";

const LIST_ACCOUNT_BRANCHES_QUERY = `
  query ListAccountBranches($branchId: ID!, $nextToken: String) {
    listAccountBranches(
      filter: { branchId: { eq: $branchId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
        account {
          id
          name
          accountType
          currency
          status
        }
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

const useBranchLinkedAccounts = (branchId) => {
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchAccounts = async () => {
      if (!branchId) {
        setAccounts([]);
        setAccountsLoading(false);
        return;
      }

      setAccountsLoading(true);
      try {
        const client = generateClient();
        let allAccounts = [];
        let nextToken = null;

        do {
          const result = await client.graphql({
            query: LIST_ACCOUNT_BRANCHES_QUERY,
            variables: {
              branchId,
              nextToken,
            },
          });

          const items = result?.data?.listAccountBranches?.items || [];
          const accountsBatch = items
            .map((item) => item.account)
            .filter((account) => account != null);

          allAccounts = [...allAccounts, ...accountsBatch];
          nextToken = result?.data?.listAccountBranches?.nextToken;
        } while (nextToken);

        if (!cancelled) {
          setAccounts(allAccounts);
        }
      } catch (err) {
        console.error("Error fetching accounts for branch:", err);
        if (!cancelled) {
          setAccounts([]);
        }
      } finally {
        if (!cancelled) setAccountsLoading(false);
      }
    };

    fetchAccounts();
    return () => {
      cancelled = true;
    };
  }, [branchId]);

  return { accounts, accountsLoading };
};

export function BranchLinkedAccountSelection({
  borrower,
  totalLoanFee = 0,
  onConfirm,
  onCancel,
}) {
  const theme = useTheme();
  const hasLoanFees = totalLoanFee > 0;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [principalAccountId, setPrincipalAccountId] = useState("");
  const [feesAccountId, setFeesAccountId] = useState("");
  const branchId = borrower?.branchBorrowersId || null;
  const { accounts, accountsLoading } = useBranchLinkedAccounts(branchId);

  const accountOptions = useMemo(() => {
    return accounts
      .filter(
        (account) => account.status === "active" || account.status === "system",
      )
      .map((account) => ({
        value: account.id,
        label: account.name,
      }));
  }, [accounts]);

  const formikLike = useMemo(
    () => ({
      isSubmitting,
      resetForm: () => {
        setPrincipalAccountId("");
        setFeesAccountId("");
      },
    }),
    [isSubmitting],
  );

  const submitDisabled =
    isSubmitting ||
    accountsLoading ||
    !principalAccountId ||
    (hasLoanFees && !feesAccountId);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitDisabled) return;

    setIsSubmitting(true);
    try {
      await onConfirm?.({
        principalAccountId,
        feesAccountId: hasLoanFees ? feesAccountId : null,
        totalLoanFee,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        mt: 2,
        mb: 2,
        p: 3,
        borderRadius: 1,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(118, 177, 211, 0.08)"
            : "#f8f9ff",
        border: `2px solid ${theme.palette.mode === "dark" ? "#76B1D3" : "#1976d2"}`,
      }}
    >
      <WorkingOverlay
        open={isSubmitting}
        message="Creating loan and disbursing funds..."
      />

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Account Selection (Required)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select the accounts for disbursement and fee collection before creating
        the loan.
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <DropDownSearchable
          label="Principal Account"
          name="principalAccountId"
          options={accountOptions}
          required={true}
          placeholder={
            accountsLoading ? "Loading accounts..." : "Search for an account..."
          }
          helperText="Select the account from which the loan principal will be disbursed."
          value={principalAccountId}
          onChange={(e) => setPrincipalAccountId(e.target.value)}
          editing={true}
          disabled={accountsLoading}
        />

        {hasLoanFees && (
          <DropDownSearchable
            label="Loan Fees Account"
            name="feesAccountId"
            options={accountOptions}
            required={true}
            placeholder={
              accountsLoading
                ? "Loading accounts..."
                : "Search for an account..."
            }
            helperText="Select the account where the loan fees will be received."
            value={feesAccountId}
            onChange={(e) => setFeesAccountId(e.target.value)}
            editing={true}
            disabled={accountsLoading}
          />
        )}

        {(!principalAccountId || (hasLoanFees && !feesAccountId)) && (
          <Alert severity="warning" sx={{ mt: 1 }}>
            Please select all required accounts before creating the loan.
          </Alert>
        )}

        <CreateFormButtons
          formik={formikLike}
          onClose={onCancel}
          submitLabel="CONFIRM LOAN"
          submitDisabled={submitDisabled}
        />
      </Box>
    </Box>
  );
}

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
  const { showSnackbar } = useSnackbar();
  const { showNotification } = useNotification();
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState("Working...");
  const [notification, setNotification] = useState(null);

  const hasLoanFees = totalLoanFee > 0;
  const branchId = borrower?.branchBorrowersId || null;
  const { accounts, accountsLoading } = useBranchLinkedAccounts(branchId);

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

  // Build dropdown options from accounts
  const accountOptions = useMemo(() => {
    return accounts
      .filter((a) => a.status === "active" || a.status === "system")
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
    let createdLoan = null;
    let principalDisbursed = false;
    let feesRecorded = !hasLoanFees;
    let disbursementEventRecorded = false;

    try {
      const client = generateClient();

      // Step 1: Convert draft to loan (creates installments, events, sets status to "Current")
      setOverlayMessage("Creating loan and installments...");
      const loan = await convertDraftToLoan({
        loanDraft,
        userDetails,
      });
      createdLoan = loan;

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
      principalDisbursed = true;

      // Step 3: Create loan fees transaction if applicable
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
        feesRecorded = true;
      }

      // Step 4: Create a DISBURSED loan event
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
      disbursementEventRecorded = true;

      setOverlayOpen(false);
      const successMessage =
        hasLoanFees && values.feesAccountId
          ? `Loan ${loanNumber} created, principal disbursed, and loan fees recorded successfully.`
          : `Loan ${loanNumber} created and principal disbursed successfully.`;

      if (onSuccess) onSuccess(loan);
      showNotification(successMessage, "green");
      navigate("/loans", {
        state: {
          notification: {
            message: successMessage,
            color: "green",
          },
        },
      });
    } catch (err) {
      console.error("Error disbursing loan:", err);
      setOverlayOpen(false);
      let errorMessage =
        err?.message || "Failed to disburse loan. Please try again.";

      if (createdLoan?.id) {
        const loanNumber = createdLoan.loanNumber || createdLoan.id;
        if (!principalDisbursed) {
          errorMessage = `Loan ${loanNumber} was created, but principal disbursement did not complete. Review the loan before retrying.`;
        } else if (!feesRecorded) {
          errorMessage = `Loan ${loanNumber} was created and principal was disbursed, but loan fee posting did not complete. Review the loan transactions.`;
        } else if (!disbursementEventRecorded) {
          errorMessage = `Loan ${loanNumber} was created and funds were posted, but the final disbursement event was not recorded. Review the loan activity.`;
        }
      }

      showSnackbar(errorMessage, "red");
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

        {!accountsLoading &&
          accounts.length === 0 &&
          borrower?.branchBorrowersId && (
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 152, 0, 0.1)"
                    : "#fff3e0",
                border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 152, 0, 0.3)" : "#ffb74d"}`,
                mb: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No accounts found for this borrower&apos;s branch. Please ensure
                accounts are linked to the borrower&apos;s branch before
                disbursing the loan.
              </Typography>
            </Box>
          )}

        {!accountsLoading && accounts.length > 0 && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(33, 150, 243, 0.1)"
                  : "#e3f2fd",
              border: `1px solid ${theme.palette.mode === "dark" ? "rgba(33, 150, 243, 0.3)" : "#90caf9"}`,
              mb: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing accounts linked to this borrower&apos;s branch only.
            </Typography>
          </Box>
        )}
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
                mt: 4,
                pt: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <CreateFormButtons
                formik={formik}
                onClose={onClose}
                submitLabel="Disburse & Activate Loan"
                submitDisabled={accountsLoading || accounts.length === 0}
                setSubmitError={() => {}}
                setSubmitSuccess={() => {}}
                setEditMode={() => {}}
              />
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
