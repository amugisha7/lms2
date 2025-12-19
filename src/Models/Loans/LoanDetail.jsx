import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogContent,
} from "@mui/material";
import { generateClient } from "aws-amplify/api";
import { getLoan } from "./loanHelpers";
import PaymentForm from "../Payments/PaymentForm";
import { UserContext } from "../../App";
import {
  exportLoanStatement,
  exportSchedule,
  exportPaymentHistory,
} from "./exportHelpers";

const LoanDetail = ({ loanId, onClose }) => {
  const [loan, setLoan] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const { userDetails } = useContext(UserContext);

  const fetchLoan = async () => {
    if (!loanId) return;
    const client = generateClient();
    try {
      const result = await client.graphql({
        query: getLoan,
        variables: { id: loanId },
      });
      setLoan(result.data.getLoan);
    } catch (err) {
      console.error("Error fetching loan:", err);
    }
  };

  useEffect(() => {
    fetchLoan();
  }, [loanId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!loan) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Loan {loan.loanNumber}</Typography>
        <Box>
          <Button onClick={() => exportLoanStatement(loan)}>Statement</Button>
          <Button onClick={() => exportSchedule(loan)}>Schedule</Button>
          <Button onClick={() => exportPaymentHistory(loan)}>History</Button>
          <Button onClick={onClose}>Close</Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Principal</Typography>
            <Typography variant="h6">{loan.principal}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Status</Typography>
            <Typography variant="h6">
              {loan.loanStatusEnum || loan.status}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Outstanding</Typography>
            <Typography variant="h6">
              {loan.balanceSnapshots?.items?.[0]?.totalOutstanding ||
                loan.principal}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Schedule" />
          <Tab label="Payments" />
          <Tab label="Events" />
        </Tabs>
      </Box>

      <Box sx={{ p: 3 }}>
        {tabValue === 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Principal</TableCell>
                  <TableCell>Interest</TableCell>
                  <TableCell>Total Due</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loan.installments?.items
                  ?.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                  .map((inst) => (
                    <TableRow key={inst.id}>
                      <TableCell>{inst.dueDate}</TableCell>
                      <TableCell>{inst.principalDue}</TableCell>
                      <TableCell>{inst.interestDue}</TableCell>
                      <TableCell>{inst.totalDue}</TableCell>
                      <TableCell>{inst.totalPaid}</TableCell>
                      <TableCell>{inst.status}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabValue === 1 && (
          <Box>
            <Button
              variant="contained"
              onClick={() => setPaymentDialogOpen(true)}
              sx={{ mb: 2 }}
            >
              Post Payment
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Reference</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loan.payments?.items
                    ?.sort(
                      (a, b) =>
                        new Date(b.paymentDate) - new Date(a.paymentDate)
                    )
                    .map((pmt) => (
                      <TableRow key={pmt.id}>
                        <TableCell>{pmt.paymentDate}</TableCell>
                        <TableCell>{pmt.amount}</TableCell>
                        <TableCell>{pmt.paymentMethod}</TableCell>
                        <TableCell>{pmt.referenceNumber}</TableCell>
                        <TableCell>{pmt.status}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {tabValue === 2 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Summary</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loan.events?.items
                  ?.sort((a, b) => new Date(b.eventAt) - new Date(a.eventAt))
                  .map((evt) => (
                    <TableRow key={evt.id}>
                      <TableCell>
                        {new Date(evt.eventAt).toLocaleString()}
                      </TableCell>
                      <TableCell>{evt.eventType}</TableCell>
                      <TableCell>{evt.summary}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Dialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <PaymentForm
            loanId={loanId}
            onClose={() => setPaymentDialogOpen(false)}
            onPaymentSuccess={() => {
              fetchLoan();
              setPaymentDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LoanDetail;
