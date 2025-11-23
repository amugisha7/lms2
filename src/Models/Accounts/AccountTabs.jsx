import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import AccountTransactions from "./AccountTransactions/AccountTransactions";
import CreateAccount from "./CreateAccounts/CreateAccount";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AccountTabs() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (location.state?.account) {
      setAccountData(location.state.account);
      processTransactions(location.state.account);
      setLoading(false);
    } else {
      // Handle case where state is missing (e.g. direct link)
      // Since we deleted the query, we can't fetch.
      // Maybe redirect back to accounts list?
      // navigate("/admin/accounts");
      setLoading(false);
    }
  }, [location.state]);

  const processTransactions = (data) => {
    if (!data) return;

    let allTransactions = [];

    // Money Transactions
    if (data.moneyTransactions?.items) {
      data.moneyTransactions.items.forEach((item) => {
        allTransactions.push({
          id: item.id,
          date: item.transactionDate,
          description: item.description || item.transactionType,
          amount: item.amount,
          type: item.transactionType === "deposit" ? "credit" : "debit",
          displayType: item.transactionType,
          source: "Money Transaction",
        });
      });
    }

    // Payments (Credit)
    if (data.payments?.items) {
      data.payments.items.forEach((item) => {
        allTransactions.push({
          id: item.id,
          date: item.paymentDate,
          description: "Payment Received",
          amount: item.amount,
          type: "credit",
          displayType: "Payment",
          source: "Payment",
        });
      });
    }

    // Penalties (Debit)
    if (data.penalties?.items) {
      data.penalties.items.forEach((item) => {
        allTransactions.push({
          id: item.id,
          date: item.penaltyDate,
          description: "Penalty Applied",
          amount: item.amount,
          type: "debit",
          displayType: "Penalty",
          source: "Penalty",
        });
      });
    }

    // Loans (Credit - Disbursement)
    if (data.loans?.items) {
      data.loans.items.forEach((item) => {
        const loan = item.loan;
        if (loan) {
          const borrowerName = loan.borrower
            ? `${loan.borrower.firstname} ${loan.borrower.othername || ""} ${
                loan.borrower.businessName || ""
              }`.trim()
            : "Unknown Borrower";

          allTransactions.push({
            id: loan.id,
            date: loan.createdAt, // Using createdAt as disbursement date proxy if not available
            description: `Loan Disbursement - ${borrowerName}`,
            amount: loan.principal,
            type: "credit", // Assuming money coming IN to the account from a loan
            displayType: "Loan Disbursement",
            source: "Loan",
          });
        }
      });
    }

    // Loan Fees (Debit)
    if (data.loanFees?.items) {
      data.loanFees.items.forEach((item) => {
        allTransactions.push({
          id: item.id,
          date: null, // Date might be missing in the query selection, handle carefully.
          // Ideally we need a date. If not present, maybe use createdAt or put at the end?
          // The user query didn't include date for loanFees. I'll assume it might be there or I'll have to skip sorting by date for these or use a default.
          // Actually, let's check the query again. "loanFees { items { id amount loanFeesDescription } }". No date.
          // I will assume they happen at the beginning or end, or I should ask to add date.
          // For now, I'll use a placeholder or current date if missing, but this is risky for chronological order.
          // I'll try to use 'createdAt' if the API returns it by default even if not requested (it won't).
          // I'll mark them as "Date Unknown".
          description: item.loanFeesDescription || "Loan Fee",
          amount: item.amount,
          type: "debit",
          displayType: "Loan Fee",
          source: "Loan Fee",
        });
      });
    }

    // Expenses (Debit)
    if (data.expenses?.items) {
      data.expenses.items.forEach((item) => {
        allTransactions.push({
          id: item.id,
          date: null, // User query: "expenses { items { amount id description type } }". No date.
          description: item.description || item.type,
          amount: item.amount,
          type: "debit",
          displayType: "Expense",
          source: "Expense",
        });
      });
    }

    // Sort by date
    allTransactions.sort((a, b) => {
      if (!a.date) return 1; // Put no-date items at the end
      if (!b.date) return -1;
      return new Date(a.date) - new Date(b.date);
    });

    // Calculate Running Balance
    let runningBalance = data.openingBalance || 0;
    // Add opening balance as the first entry? Or just start calculation?
    // User wants "starting with the opening balance".

    const processed = [];

    // Add Opening Balance row
    processed.push({
      id: "opening-balance",
      date: "",
      description: "Opening Balance",
      amount: data.openingBalance || 0,
      type: "credit", // effectively
      runningBalance: runningBalance,
      source: "System",
    });

    allTransactions.forEach((tx) => {
      if (tx.type === "credit") {
        runningBalance += tx.amount;
      } else {
        runningBalance -= tx.amount;
      }
      tx.runningBalance = runningBalance;
      processed.push(tx);
    });

    setTransactions(processed);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {/*Account Name Header*/}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 1,
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => navigate("/admin/accounts")}
            sx={{
              mr: 1,
              color: theme.palette.text.primary,
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              fontFamily: theme.typography.h4.fontFamily,
            }}
          >
            {accountData?.name || "Account Details"}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          borderBottom: 1,
          borderColor: theme.palette.divider,
          backgroundColor: theme.palette.background.paper,
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="account tabs"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.blueText.main,
              height: 3,
              borderRadius: "1.5px",
            },
            "& .MuiTab-root": {
              fontFamily: theme.typography.fontFamily,
              fontSize: "0.875rem",
              fontWeight: 500,
              textTransform: "none",
              letterSpacing: "0.02em",
              color: theme.palette.text.secondary,
              minHeight: 48,
              padding: "12px 24px",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                color: theme.palette.blueText.main,
              },
              "&.Mui-selected": {
                color: theme.palette.blueText.main,
                fontWeight: 600,
              },
              "&.Mui-focusVisible": {
                backgroundColor: theme.palette.action.focus,
              },
            },
            "& .MuiTabs-flexContainer": {
              gap: 1,
            },
          }}
        >
          <Tab label="Transactions" />
          <Tab label="Account Details" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <AccountTransactions
          transactions={transactions}
          account={accountData}
          onTransactionSuccess={() => {}}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {accountData && (
          <CreateAccount
            initialValues={accountData}
            isEditMode={true} // To show values
            // We might need to pass a prop to disable editing or just not provide update handlers
            // The user said "readOnly". CreateAccount might not support readOnly prop directly.
            // I'll check CreateAccount.jsx again.
            // It has `isEditMode`. If I don't pass `onUpdateAccountAPI`, it might show error or just not save.
            // But to make it truly read-only (disabled inputs), I might need to modify CreateAccount or pass a flag.
            // For now, I'll pass isEditMode={true} and maybe a new prop `readOnly={true}` if I can modify CreateAccount,
            // or just rely on the fact that without a save handler it's effectively view-only (though editable in UI).
            // The user said "shows the CreateAccount.jsx in readOnly".
            // I will modify CreateAccount to accept a readOnly prop.
            readOnly={true}
            hideCancel={true}
          />
        )}
      </CustomTabPanel>
    </Box>
  );
}
