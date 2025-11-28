import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import { generateClient } from "aws-amplify/api";
import CreateMoneyTransaction from "./CreateMoneyTransactions/CreateMoneyTransaction";
import { GET_MONEY_TRANSACTION_WITH_DOCUMENTS } from "./moneyTransactionHelpes";
import MoneyTransactionsFiles from "./MoneyTransactionsFiles/MoneyTransactionsFiles";
import NotificationBar from "../../../ComponentAssets/NotificationBar";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`transaction-tabpanel-${index}`}
      aria-labelledby={`transaction-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MoneyTransactions({
  transactionId: propTransactionId,
  type,
  account,
  onSuccess,
  onClose,
  editMode = false,
}) {
  const { transactionId: paramTransactionId } = useParams();
  const transactionId = propTransactionId || paramTransactionId;
  const navigate = useNavigate();
  const theme = useTheme();
  const client = React.useMemo(() => generateClient(), []);

  const [tabValue, setTabValue] = useState(0);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({
    message: "",
    color: "green",
  });

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching transaction with id:", transactionId);
        const result = await client.graphql({
          query: GET_MONEY_TRANSACTION_WITH_DOCUMENTS,
          variables: { id: transactionId },
        });
        console.log("Fetch transaction result:", result);

        const transactionData = result.data.getMoneyTransaction;
        if (transactionData) {
          setTransaction(transactionData);
        } else {
          setError("Transaction not found");
        }
      } catch (err) {
        console.error("Error fetching transaction:", err);
        setError(err.message || "Failed to load transaction details");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  const handleTabChange = (event, newValue) => {
    // Don't allow tab change when in edit mode
    if (editMode) return;
    setTabValue(newValue);
  };

  // Reset to first tab when entering edit mode
  useEffect(() => {
    if (editMode) {
      setTabValue(0);
    }
  }, [editMode]);

  const handleUpdateSuccess = (updatedValues) => {
    if (onSuccess) onSuccess(updatedValues);

    // If updatedValues are returned, update local state
    if (updatedValues) {
      setTransaction((prev) => ({ ...prev, ...updatedValues }));
    } else {
      // Re-fetch or just keep as is if we trust the optimistic update
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">Error</Typography>
        </Box>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <NotificationBar
        message={notification.message}
        color={notification.color}
      />

      <Box sx={{ width: "100%" }}>
        {/* Tabs */}
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: theme.palette.divider,
              backgroundColor: theme.palette.background.paper,
              borderRadius: "8px 8px 0 0",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="transaction details tabs"
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
                },
                "& .MuiTabs-flexContainer": {
                  gap: 1,
                },
              }}
            >
              <Tab label="Transaction Details" id="transaction-tab-0" />
              {!editMode && <Tab label="Files" id="transaction-tab-1" />}
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            <CreateMoneyTransaction
              initialValues={transaction}
              isEditMode={!!transactionId}
              onSuccess={handleUpdateSuccess}
              onClose={onClose}
              setNotification={setNotification}
              // Pass type and account if needed, but they should be in initialValues for edit
              type={type || transaction?.transactionType}
              account={account || transaction?.account}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {transactionId ? (
              <MoneyTransactionsFiles
                transaction={transaction}
                setTransaction={setTransaction}
                setNotification={setNotification}
              />
            ) : (
              <Box sx={{ textAlign: "center", p: 3 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  The transaction must be created first. Files can be uploaded
                  after creating the transaction.
                </Typography>
                <Button variant="contained" onClick={() => setTabValue(0)}>
                  Go to Transaction Details
                </Button>
              </Box>
            )}
          </TabPanel>
        </Box>
      </Box>
    </>
  );
}
