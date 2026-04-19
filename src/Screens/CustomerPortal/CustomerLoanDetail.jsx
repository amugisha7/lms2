import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { CustomerContext } from "../../CustomerApp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { fetchCustomerLoanById } from "./customerLoanData";
import LoanStatementScreen from "../../Models/Loans/LoanStatements/LoanStatementScreen";

export default function CustomerLoanDetail() {
  const { loanId, institutionId } = useParams();
  const { borrower, institution } = useContext(CustomerContext);
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const fetchLoanDetails = async () => {
      if (!borrower?.id || !loanId) {
        if (active) {
          setLoan(null);
          setLoading(false);
        }
        return;
      }

      if (active) {
        setLoading(true);
        setError("");
      }

      try {
        const loanData = await fetchCustomerLoanById({
          borrowerId: borrower.id,
          loanId,
        });

        if (!active) {
          return;
        }

        if (!loanData) {
          setLoan(null);
          setLoading(false);
          return;
        }

        setLoan(loanData);
      } catch (err) {
        console.error("Error fetching loan details:", err);
        if (active) {
          setError("Unable to load this loan statement right now.");
          setLoan(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchLoanDetails();

    return () => {
      active = false;
    };
  }, [borrower?.id, loanId]);

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
          Loan statement unavailable
        </Typography>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
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
        Loan Statement
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This statement is view only. Payments and internal loan comments are not
        available in the customer portal.
      </Alert>

      <LoanStatementScreen
        loan={loan}
        embedded
        institutionOverride={institution}
        showHeaderControls={false}
        showDetailControls={false}
      />
    </Box>
  );
}
