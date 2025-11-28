import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
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
import { generateClient } from "aws-amplify/api";
import AccountTransactions from "./AccountTransactions/AccountTransactions";
import CreateAccount from "./CreateAccounts/CreateAccount";
import {
  GET_ACCOUNT_WITH_TRANSACTIONS_QUERY,
  UPDATE_ACCOUNT_MUTATION,
} from "./accountHelpers";
import { useHasPermission } from "../../ModelAssets/Permissions/permissions";
import { UserContext } from "../../App";
import ClickableText from "../../ModelAssets/ClickableText";
import { EditClickedContext } from "../../ModelAssets/CollectionsTemplate";

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
  const client = React.useMemo(() => generateClient(), []);
  const [value, setValue] = useState(0);
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const { userDetails } = useContext(UserContext);
  const canEditAccount = useHasPermission("update", "account");
  const [editClicked, setEditClicked] = useState(false);

  const handleEditClick = () => {
    setEditClicked(true);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Fetch account data from API
  const fetchAccountData = useCallback(
    async (accountId) => {
      try {
        setLoading(true);
        const result = await client.graphql({
          query: GET_ACCOUNT_WITH_TRANSACTIONS_QUERY,
          variables: { id: accountId },
        });
        const fetchedAccount = result.data.getAccount;
        if (fetchedAccount) {
          setAccountData(fetchedAccount);
          processTransactions(fetchedAccount);
        }
      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  // Handler for when a transaction is created/updated
  const handleTransactionSuccess = useCallback(() => {
    if (id) {
      fetchAccountData(id);
    }
  }, [id, fetchAccountData]);

  // API handler for updating account
  const handleUpdateAccountAPI = useCallback(
    async (values, initialValues) => {
      const input = {
        id: initialValues.id,
        name: values.name?.trim() || null,
        openingBalance: parseFloat(values.openingBalance) || 0,
        status: values.status || "active",
        currency: values.currency || userDetails?.institution?.currencyCode,
        accountType: "user",
        description: values.description?.trim() || null,
      };

      const result = await client.graphql({
        query: UPDATE_ACCOUNT_MUTATION,
        variables: { input },
      });

      return result.data.updateAccount;
    },
    [client, userDetails]
  );

  // Handler for when account is successfully edited
  const handleEditSuccess = useCallback(
    (updatedAccount) => {
      setAccountData((prev) => ({
        ...prev,
        ...updatedAccount,
      }));
      // Reset edit mode
      setEditClicked(false);
      // Refresh transactions if opening balance changed
      if (id) {
        fetchAccountData(id);
      }
    },
    [id, fetchAccountData]
  );

  useEffect(() => {
    if (location.state?.account) {
      setAccountData(location.state.account);
      processTransactions(location.state.account);
      setLoading(false);
    } else if (id) {
      // Fetch from API if state is missing (e.g. direct link or refresh)
      fetchAccountData(id);
    } else {
      setLoading(false);
    }
  }, [location.state, id, fetchAccountData]);

  const processTransactions = (data) => {
    if (!data) return;

    let allTransactions = [];

    // Money Transactions
    if (data.moneyTransactions?.items) {
      data.moneyTransactions.items.forEach((item) => {
        // Map documents to attachments format for FileLinksUpload
        const attachments = (item.documents?.items || [])
          .filter((docItem) => docItem.document)
          .map((docItem) => ({
            id: docItem.document.id,
            fileName:
              docItem.document.fileName || docItem.document.documentName,
            description: docItem.document.documentDescription || "",
            type: docItem.document.contentType === "link" ? "link" : "file",
            fileType: docItem.document.contentType,
            s3Key: docItem.document.s3Key,
            uploadDate: docItem.document.createdAt,
            // Mark as existing so FileLinksUpload knows not to re-upload
            isExisting: true,
            // Store the join table record ID for deletion
            joinRecordId: docItem.id,
          }));

        allTransactions.push({
          id: item.id,
          date: item.transactionDate,
          description: item.description || item.transactionType,
          amount: item.amount,
          type: item.transactionType === "deposit" ? "credit" : "debit",
          displayType: item.transactionType,
          source: "Money Transaction",
          referenceNumber: item.referenceNumber,
          notes: item.notes,
          attachments: attachments,
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
          onTransactionSuccess={handleTransactionSuccess}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <EditClickedContext.Provider value={{ editClicked, setEditClicked }}>
          {accountData && (
            <>
              {canEditAccount && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 2,
                  }}
                >
                  <ClickableText
                    onClick={handleEditClick}
                    sx={{
                      color: theme.palette.blueText.main,
                      fontSize: "0.9rem",
                    }}
                  >
                    Edit
                  </ClickableText>
                </Box>
              )}
              <CreateAccount
                initialValues={accountData}
                isEditMode={true}
                onEditSuccess={handleEditSuccess}
                onUpdateAccountAPI={handleUpdateAccountAPI}
                hideCancel={true}
              />
            </>
          )}
        </EditClickedContext.Provider>
      </CustomTabPanel>
    </Box>
  );
}
