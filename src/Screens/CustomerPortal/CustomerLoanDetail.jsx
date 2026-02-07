import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { generateClient } from "aws-amplify/api";
import { useParams, useNavigate } from "react-router-dom";
import { CustomerContext } from "../../CustomerApp";
import { formatMoney } from "../../Resources/formatting";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function CustomerLoanDetail() {
  const { loanId, institutionId } = useParams();
  const { borrower } = useContext(CustomerContext);
  const [loan, setLoan] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoanDetails = async () => {
      const client = generateClient();

      try {
        // Fetch loan details
        const loanResult = await client.graphql({
          query: `query GetLoan($id: ID!) {
            getLoan(id: $id) {
              id
              loanNumber
              principal
              interestRate
              loanStatusEnum
              approvalStatusEnum
              startDate
              maturityDate
              duration
              durationInterval
              paymentFrequency
              loanCurrency
              borrowerID
              loanProduct {
                name
              }
              createdAt
            }
          }`,
          variables: { id: loanId },
        });

        const loanData = loanResult?.data?.getLoan;

        // Verify this loan belongs to the current customer
        if (loanData?.borrowerID !== borrower?.id) {
          navigate(`/client/${institutionId}/loans`);
          return;
        }

        setLoan(loanData);

        // Fetch installments (payment schedule)
        const installmentsResult = await client.graphql({
          query: `query ListLoanInstallments($filter: ModelLoanInstallmentFilterInput) {
            listLoanInstallments(filter: $filter) {
              items {
                id
                dueDate
                principalDue
                interestDue
                totalDue
                principalPaid
                interestPaid
                totalPaid
                status
              }
            }
          }`,
          variables: {
            filter: {
              loanID: { eq: loanId },
            },
          },
        });

        const installmentItems =
          installmentsResult?.data?.listLoanInstallments?.items || [];
        setInstallments(
          installmentItems.sort(
            (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
          ),
        );

        // Fetch payments
        const paymentsResult = await client.graphql({
          query: `query ListPayments($filter: ModelPaymentFilterInput) {
            listPayments(filter: $filter) {
              items {
                id
                paymentDate
                amount
                paymentMethod
                status
                notes
              }
            }
          }`,
          variables: {
            filter: {
              loanPaymentsId: { eq: loanId },
            },
          },
        });

        const paymentItems = paymentsResult?.data?.listPayments?.items || [];
        setPayments(
          paymentItems.sort(
            (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate),
          ),
        );
      } catch (err) {
        console.error("Error fetching loan details:", err);
      }

      setLoading(false);
    };

    if (borrower) {
      fetchLoanDetails();
    }
  }, [loanId, borrower, institutionId, navigate]);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
      case "PAID":
      case "APPROVED":
        return "success";
      case "DRAFT":
      case "IN REVIEW":
      case "PENDING":
      case "PARTIALLY_PAID":
        return "warning";
      case "CLOSED":
      case "PAID_OFF":
        return "default";
      case "DEFAULTED":
      case "WRITTEN_OFF":
      case "OVERDUE":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!loan) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Loan not found
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/client/${institutionId}/loans`)}
        >
          Back to Loans
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/client/${institutionId}/loans`)}
        sx={{ mb: 2 }}
      >
        Back to Loans
      </Button>

      <Typography variant="h4" sx={{ mb: 3 }}>
        Loan Details
      </Typography>

      {/* Loan Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Loan Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Loan Number
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {loan.loanNumber}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Loan Product
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {loan.loanProduct?.name || "N/A"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Principal Amount
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {formatMoney(loan.principal, loan.loanCurrency || "")}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Interest Rate
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {loan.interestRate}%
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={loan.status || "N/A"}
                color={getStatusColor(loan.status)}
                size="small"
              />
            </Box>

            <Typography variant="body2" color="text.secondary">
              Start Date
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {loan.startDate
                ? new Date(loan.startDate).toLocaleDateString()
                : "N/A"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Maturity Date
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {loan.maturityDate
                ? new Date(loan.maturityDate).toLocaleDateString()
                : "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Payment Schedule */}
      {installments.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Payment Schedule
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Due Date</TableCell>
                  <TableCell align="right">Principal</TableCell>
                  <TableCell align="right">Interest</TableCell>
                  <TableCell align="right">Total Due</TableCell>
                  <TableCell align="right">Total Paid</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {installments.map((installment) => (
                  <TableRow key={installment.id}>
                    <TableCell>
                      {new Date(installment.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      {formatMoney(installment.principalDue, loan.loanCurrency)}
                    </TableCell>
                    <TableCell align="right">
                      {formatMoney(installment.interestDue, loan.loanCurrency)}
                    </TableCell>
                    <TableCell align="right">
                      {formatMoney(installment.totalDue, loan.loanCurrency)}
                    </TableCell>
                    <TableCell align="right">
                      {formatMoney(installment.totalPaid, loan.loanCurrency)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={installment.status || "N/A"}
                        color={getStatusColor(installment.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Payment History */}
      {payments.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Payment History
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Payment Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      {formatMoney(payment.amount, loan.loanCurrency)}
                    </TableCell>
                    <TableCell>{payment.paymentMethod || "N/A"}</TableCell>
                    <TableCell>
                      <Chip
                        label={payment.status || "N/A"}
                        color={getStatusColor(payment.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{payment.notes || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}
