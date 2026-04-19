import React from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { formatMoney } from "../../Resources/formatting";
import { resolveLoanSchedule } from "../../Models/Loans/LoanStatements/statementHelpers";

const PREVIEW_INSTALLMENT_LIMIT = 6;
const PREVIEW_PAYMENT_LIMIT = 5;

const formatDisplayDate = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString();
};

const getStatusColor = (statusKey, statusLabel) => {
  switch (statusKey || statusLabel?.toUpperCase()) {
    case "current":
    case "ACTIVE":
    case "PAID":
    case "APPROVED":
      return "success";
    case "missed_payment":
    case "DRAFT":
    case "IN REVIEW":
    case "PENDING":
    case "PARTIALLY_PAID":
      return "warning";
    case "closed":
    case "CLOSED":
    case "PAID_OFF":
      return "default";
    case "overdue":
    case "written_off":
    case "DEFAULTED":
    case "WRITTEN_OFF":
    case "OVERDUE":
      return "error";
    default:
      return "default";
  }
};

export default function CustomerLoanStatementView({
  loan,
  institution,
  preview = false,
  onOpenFullStatement,
}) {
  const installments = React.useMemo(
    () =>
      resolveLoanSchedule(loan).sort(
        (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      ),
    [loan],
  );

  const payments = React.useMemo(() => {
    const paymentItems = Array.isArray(loan?.payments?.items)
      ? loan.payments.items.filter(Boolean)
      : [];

    return paymentItems.sort(
      (a, b) =>
        new Date(b.paymentDate || b.createdAt || 0) -
        new Date(a.paymentDate || a.createdAt || 0),
    );
  }, [loan]);

  if (!loan) {
    return null;
  }

  const currencyCode = loan.loanCurrency || institution?.currencyCode || "";
  const statusLabel = loan.uiStatusLabel || loan.status || "N/A";
  const statusColor = getStatusColor(loan.uiStatusFilterKey, loan.status);
  const visibleInstallments = preview
    ? installments.slice(0, PREVIEW_INSTALLMENT_LIMIT)
    : installments;
  const visiblePayments = preview
    ? payments.slice(0, PREVIEW_PAYMENT_LIMIT)
    : payments;

  return (
    <Box>
      {preview ? (
        <Alert severity="info" sx={{ mb: 2, borderRadius: 0 }}>
          Preview only. Open the full statement for the complete schedule and
          full payment history.
        </Alert>
      ) : null}

      <Paper sx={{ p: preview ? 2.5 : 3, mb: 3, borderRadius: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h6">Account Summary</Typography>
          {preview && onOpenFullStatement ? (
            <Button
              variant="outlined"
              size="small"
              sx={{ borderRadius: 0 }}
              onClick={onOpenFullStatement}
            >
              Open Full Statement
            </Button>
          ) : null}
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Loan Number
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {loan.loanNumber || "N/A"}
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
              {formatMoney(loan.principal, currencyCode)}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Interest Rate
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {loan.interestRate != null ? `${loan.interestRate}%` : "N/A"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Total Paid
            </Typography>
            <Typography variant="body1" sx={{ mb: 0 }}>
              {formatMoney(loan.totalPaidComputed, currencyCode)}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip label={statusLabel} color={statusColor} size="small" />
            </Box>

            <Typography variant="body2" color="text.secondary">
              Start Date
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {formatDisplayDate(loan.startDate)}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Maturity Date
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {formatDisplayDate(loan.maturityDate)}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Amount Due
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {formatMoney(loan.amountDueComputed, currencyCode)}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Principal Balance
            </Typography>
            <Typography variant="body1" sx={{ mb: 0 }}>
              {formatMoney(loan.loanBalanceComputed, currencyCode)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {visibleInstallments.length > 0 ? (
        <Paper sx={{ p: preview ? 2.5 : 3, mb: 3, borderRadius: 0 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {preview ? "Schedule Preview" : "Payment Schedule"}
          </Typography>
          <TableContainer sx={preview ? { maxHeight: 260 } : undefined}>
            <Table size="small" stickyHeader={preview}>
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
                {visibleInstallments.map((installment) => (
                  <TableRow key={installment.id}>
                    <TableCell>
                      {formatDisplayDate(installment.dueDate)}
                    </TableCell>
                    <TableCell align="right">
                      {formatMoney(installment.principalDue, currencyCode)}
                    </TableCell>
                    <TableCell align="right">
                      {formatMoney(installment.interestDue, currencyCode)}
                    </TableCell>
                    <TableCell align="right">
                      {formatMoney(installment.totalDue, currencyCode)}
                    </TableCell>
                    <TableCell align="right">
                      {formatMoney(installment.totalPaid, currencyCode)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={installment.status || "N/A"}
                        color={getStatusColor(null, installment.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {preview && installments.length > visibleInstallments.length ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Showing {visibleInstallments.length} of {installments.length}{" "}
              scheduled payments.
            </Typography>
          ) : null}
        </Paper>
      ) : null}

      {visiblePayments.length > 0 ? (
        <Paper sx={{ p: preview ? 2.5 : 3, borderRadius: 0 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {preview ? "Recent Payments" : "Payment History"}
          </Typography>
          <TableContainer sx={preview ? { maxHeight: 240 } : undefined}>
            <Table size="small" stickyHeader={preview}>
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
                {visiblePayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {formatDisplayDate(
                        payment.paymentDate || payment.createdAt,
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {formatMoney(payment.amount, currencyCode)}
                    </TableCell>
                    <TableCell>{payment.paymentMethod || "N/A"}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          payment.paymentStatusEnum || payment.status || "N/A"
                        }
                        color={getStatusColor(
                          null,
                          payment.paymentStatusEnum || payment.status,
                        )}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {payment.notes || payment.description || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {preview && payments.length > visiblePayments.length ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Showing {visiblePayments.length} of {payments.length} payments.
            </Typography>
          ) : null}
        </Paper>
      ) : null}
    </Box>
  );
}
