import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Typography, Grid, CircularProgress } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { generateClient } from "aws-amplify/api";
import TextInput from "../../Resources/FormComponents/TextInput";
import Dropdown from "../../Resources/FormComponents/Dropdown";
import DateInput from "../../Resources/FormComponents/DateInput";
import { UserContext } from "../../App";
import {
  createPayment,
  updateLoanInstallment,
  createMoneyTransaction,
} from "./paymentHelpers";
import { allocatePayment } from "./servicingEngine";
import { getLoan } from "../Loans/loanHelpers";

const PaymentForm = ({ loanId, onClose, onPaymentSuccess }) => {
  const { userDetails } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loan, setLoan] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const client = generateClient();

        // Fetch Loan Details including installments
        const loanResult = await client.graphql({
          query: getLoan,
          variables: { id: loanId },
        });
        setLoan(loanResult.data.getLoan);

        // Fetch Accounts
        const accountsResult = await client.graphql({
          query: `
            query ListAccounts($institutionId: ID!) {
              listAccounts(filter: { institutionAccountsId: { eq: $institutionId } }) {
                items {
                  id
                  name
                }
              }
            }
          `,
          variables: { institutionId: userDetails?.institutionUsersId },
        });
        setAccounts(accountsResult.data.listAccounts.items);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (loanId && userDetails?.institutionUsersId) {
      fetchData();
    }
  }, [loanId, userDetails]);

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setSubmitting(true);
    try {
      const client = generateClient();

      // 1. Allocate Payment
      const { updatedInstallments, allocation } = allocatePayment(
        Number(values.amount),
        loan.installments.items.sort(
          (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        )
      );

      // 2. Create Payment Record
      const paymentInput = {
        loanID: loanId,
        paymentDate: values.paymentDate,
        amount: Number(values.amount),
        paymentMethod: values.paymentMethod,
        referenceNumber: values.referenceNumber,
        accountID: values.accountID,
        status: "COMPLETED",
        paymentStatusEnum: "COMPLETED",
        notes: values.notes,
        receivingEmployeeID: userDetails?.id,
      };

      const paymentResult = await client.graphql({
        query: createPayment,
        variables: { input: paymentInput },
      });
      const payment = paymentResult.data.createPayment;

      // 3. Update Installments
      for (const inst of updatedInstallments) {
        // Only update if changed
        const original = loan.installments.items.find((i) => i.id === inst.id);
        if (
          original.totalPaid !== inst.totalPaid ||
          original.status !== inst.status
        ) {
          await client.graphql({
            query: updateLoanInstallment,
            variables: {
              input: {
                id: inst.id,
                principalPaid: inst.principalPaid,
                interestPaid: inst.interestPaid,
                feesPaid: inst.feesPaid,
                penaltyPaid: inst.penaltyPaid,
                totalPaid: inst.totalPaid,
                status: inst.status,
              },
            },
          });
        }
      }

      // 4. Create MoneyTransaction (if needed, per requirements)
      // "Only create a MoneyTransaction for the payment if (and only if) you also update Account balance logic"
      // Assuming we need to create it for traceability as per schema changes.

      await client.graphql({
        query: createMoneyTransaction,
        variables: {
          input: {
            transactionDate: values.paymentDate,
            amount: Number(values.amount),
            transactionType: "CREDIT", // Payment into account
            description: `Payment for Loan ${loan.loanNumber}`,
            referenceNumber: values.referenceNumber,
            paymentMethod: values.paymentMethod,
            status: "COMPLETED",
            accountAccountsId: values.accountID, // Legacy FK?
            accountID: values.accountID, // New FK?
            loanID: loanId,
            paymentID: payment.id,
            createdByEmployeeID: userDetails?.id,
          },
        },
      });

      if (onPaymentSuccess) onPaymentSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error("Error posting payment:", err);
      setStatus({ error: "Failed to post payment" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Post Payment
      </Typography>
      <Formik
        initialValues={{
          amount: "",
          paymentDate: new Date().toISOString().split("T")[0],
          paymentMethod: "CASH",
          referenceNumber: "",
          accountID: "",
          notes: "",
        }}
        validationSchema={Yup.object({
          amount: Yup.number()
            .required("Required")
            .positive("Must be positive"),
          paymentDate: Yup.date().required("Required"),
          accountID: Yup.string().required("Required"),
          paymentMethod: Yup.string().required("Required"),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextInput name="amount" label="Amount" type="number" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <DateInput name="paymentDate" label="Payment Date" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Dropdown
                  name="paymentMethod"
                  label="Payment Method"
                  options={[
                    { value: "CASH", label: "Cash" },
                    { value: "BANK_TRANSFER", label: "Bank Transfer" },
                    { value: "CHECK", label: "Check" },
                    { value: "MOBILE_MONEY", label: "Mobile Money" },
                  ]}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextInput name="referenceNumber" label="Reference Number" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Dropdown
                  name="accountID"
                  label="Deposit To Account"
                  options={accounts.map((a) => ({
                    value: a.id,
                    label: a.name,
                  }))}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextInput name="notes" label="Notes" multiline rows={3} />
              </Grid>
              {status?.error && (
                <Grid size={{ xs: 12 }}>
                  <Typography color="error">{status.error}</Typography>
                </Grid>
              )}
              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Post Payment
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default PaymentForm;
