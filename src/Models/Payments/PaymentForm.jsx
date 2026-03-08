import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { generateClient } from "aws-amplify/api";

import { UserContext } from "../../App";
import { useSnackbar } from "../../ModelAssets/SnackbarContext";
import DropDownSearchable from "../../Resources/FormComponents/DropDownSearchable";
import TextInput from "../../Resources/FormComponents/TextInput";
import DateInput from "../../Resources/FormComponents/DateInput";
import TextArea from "../../Resources/FormComponents/TextArea";
import { getLoan } from "../Loans/loanHelpers";
import {
  createPayment,
  LIST_ACCOUNT_BRANCHES_QUERY,
  createMoneyTransaction,
} from "./paymentHelpers";

const client = generateClient();

const validationSchema = Yup.object().shape({
  accountID: Yup.string().required("Please select an account"),
  amount: Yup.string()
    .required("Payment amount is required")
    .test("is-positive", "Must be a positive number", (val) => {
      const num = Number(String(val).replace(/,/g, ""));
      return !isNaN(num) && num > 0;
    }),
  paymentDate: Yup.date().required("Payment date is required"),
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
        let allAccounts = [];
        let nextToken = null;

        do {
          const result = await client.graphql({
            query: LIST_ACCOUNT_BRANCHES_QUERY,
            variables: { branchId, nextToken },
          });

          const items = result?.data?.listAccountBranches?.items || [];
          const batch = items.map((item) => item.account).filter(Boolean);
          allAccounts = [...allAccounts, ...batch];
          nextToken = result?.data?.listAccountBranches?.nextToken;
        } while (nextToken);

        if (!cancelled) setAccounts(allAccounts);
      } catch (error) {
        console.error("Error fetching accounts for branch:", error);
        if (!cancelled) setAccounts([]);
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

export default function PaymentForm({ loanId, onClose, onPaymentSuccess }) {
  const { userDetails } = useContext(UserContext);
  const { showSnackbar } = useSnackbar();
  const [loan, setLoan] = useState(null);
  const [loanLoading, setLoanLoading] = useState(true);

  const fetchLoan = useCallback(async () => {
    if (!loanId) {
      setLoan(null);
      setLoanLoading(false);
      return;
    }

    setLoanLoading(true);
    try {
      const result = await client.graphql({
        query: getLoan,
        variables: { id: loanId },
      });
      setLoan(result?.data?.getLoan || null);
    } catch (error) {
      console.error("Error fetching loan for payment form:", error);
      setLoan(null);
    } finally {
      setLoanLoading(false);
    }
  }, [loanId]);

  useEffect(() => {
    fetchLoan();
  }, [fetchLoan]);

  const branchId = loan?.branch?.id || loan?.branchID || null;
  const { accounts, accountsLoading } = useBranchLinkedAccounts(branchId);

  const activeAccounts = useMemo(
    () =>
      accounts.filter((account) => {
        const status = String(account?.status || "").toLowerCase();
        return status === "active" || status === "system";
      }),
    [accounts],
  );

  const accountOptions = useMemo(
    () =>
      activeAccounts.map((account) => ({
        value: account.id,
        label: account.name || account.id,
      })),
    [activeAccounts],
  );

  const defaultAccountId = useMemo(() => {
    const cashAccount = activeAccounts.find((account) =>
      String(account?.accountType || "")
        .toLowerCase()
        .includes("cash"),
    );
    return cashAccount?.id || activeAccounts[0]?.id || "";
  }, [activeAccounts]);

  const currencyLabel =
    userDetails?.institution?.currencyCode || userDetails?.currencyCode || "";

  if (loanLoading) {
    return (
      <Box
        sx={{
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <CircularProgress size={24} />
        <Typography>Loading payment form...</Typography>
      </Box>
    );
  }

  if (!loan) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography sx={{ mb: 2 }}>Unable to load loan details.</Typography>
        <Button onClick={onClose}>Close</Button>
      </Box>
    );
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        accountID: defaultAccountId,
        amount: "",
        paymentDate: new Date().toISOString().split("T")[0],
        collectedBy: "",
        description: "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, formikHelpers) => {
        try {
          const numericAmount = Number(String(values.amount).replace(/,/g, ""));
          const paymentResult = await client.graphql({
            query: createPayment,
            variables: {
              input: {
                loanID: loan.id,
                paymentDate: values.paymentDate,
                amount: numericAmount,
                accountID: values.accountID,
                description: values.description || null,
                notes: values.collectedBy
                  ? `Collected by: ${values.collectedBy}`
                  : null,
                status: "COMPLETED",
                paymentStatusEnum: "COMPLETED",
                receivingEmployeeID: userDetails?.id || null,
              },
            },
          });

          const newPaymentId = paymentResult?.data?.createPayment?.id;

          await client.graphql({
            query: createMoneyTransaction,
            variables: {
              input: {
                transactionDate: values.paymentDate,
                amount: numericAmount,
                transactionType: "deposit",
                description: `Payment for Loan ${loan.loanNumber || loan.id}`,
                status: "completed",
                accountMoneyTransactionsId: values.accountID,
                loanID: loan.id,
                paymentID: newPaymentId,
                relatedEntityType: "LOAN_PAYMENT",
                category: "Loan Payment",
                createdByEmployeeID: userDetails?.id || null,
              },
            },
          });

          showSnackbar("Payment recorded successfully!", "green");
          onPaymentSuccess?.();
          onClose?.();
        } catch (error) {
          console.error("Failed to record payment:", error);
          showSnackbar("Failed to record payment. Please try again.", "red");
        } finally {
          formikHelpers.setSubmitting(false);
        }
      }}
    >
      {(formik) => (
        <Form>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            <Typography variant="h6">Post Payment</Typography>

            <DropDownSearchable
              label="Receiving Account"
              name="accountID"
              options={accountOptions}
              required={true}
              value={formik.values.accountID}
              onChange={(e) =>
                formik.setFieldValue("accountID", e.target.value)
              }
              onBlur={() => formik.setFieldTouched("accountID", true)}
              editing={true}
              disabled={accountsLoading}
              helperText={
                (formik.submitCount > 0 || formik.touched.accountID) &&
                formik.errors.accountID
                  ? formik.errors.accountID
                  : "Account to receive payment. Showing accounts linked to the loan branch."
              }
              placeholder={
                accountsLoading
                  ? "Loading accounts..."
                  : "Search for an account..."
              }
            />

            <TextInput
              label="Payment Amount"
              name="amount"
              type="number"
              required={true}
              editing={true}
              helperText={currencyLabel}
            />

            <DateInput
              label="Payment Date"
              name="paymentDate"
              required={true}
              editing={true}
            />

            <TextInput
              label="Collected By"
              name="collectedBy"
              editing={true}
              helperText="Optional"
            />

            <TextArea
              label="Description / Comments"
              name="description"
              editing={true}
              rows={3}
              helperText="Optional"
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 2,
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
                type="submit"
                variant="contained"
                disabled={
                  formik.isSubmitting ||
                  accountsLoading ||
                  !accountOptions.length
                }
              >
                {formik.isSubmitting ? "Submitting..." : "Submit Payment"}
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
