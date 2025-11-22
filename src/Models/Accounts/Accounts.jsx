import React, { useRef, useState } from "react";
import { UserContext } from "../../App";
import ClickableText from "../../ModelAssets/ClickableText";
import CreateAccounts from "./CreateAccounts/CreateAccount";
import { useTheme } from "@mui/material/styles";
import CollectionsTemplate from "../../ModelAssets/CollectionsTemplate";
import { useCrudOperations } from "../../hooks/useCrudOperations";
import { generateClient } from "aws-amplify/api";
import NotificationBar from "../../ModelAssets/NotificationBar";
import PlusButtonSmall from "../../ModelAssets/PlusButtonSmall";
import CustomPopUp from "../../ModelAssets/CustomPopUp";
import NumberInput from "../../Resources/FormComponents/NumberInput";
import TextInput from "../../Resources/FormComponents/TextInput";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Button } from "@mui/material";
import Remove from "@mui/icons-material/Remove";
import Add from "@mui/icons-material/Add";
import {
  LIST_ACCOUNTS_QUERY,
  CREATE_ACCOUNT_MUTATION,
  DELETE_ACCOUNT_MUTATION,
  UPDATE_ACCOUNT_MUTATION,
  CREATE_MONEY_TRANSACTION_MUTATION,
} from "./accountHelpers";

// Guard to ensure we only fetch accounts once per page load (even under React StrictMode)
let __accountsFetchedOnce = false;

export default function Accounts() {
  const [editMode, setEditMode] = React.useState(false);
  const formRef = useRef();
  const { userDetails } = React.useContext(UserContext);
  const theme = useTheme();
  const [processedAccounts, setProcessedAccounts] = React.useState([]);
  const [allAccounts, setAllAccounts] = React.useState([]);
  const [accountsLoading, setAccountsLoading] = React.useState(true);
  const [notification, setNotification] = React.useState({
    message: "",
    color: "green",
  });
  const client = React.useMemo(() => generateClient(), []); // stabilize client so effect does not re-trigger infinitely

  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("deposit");
  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleTransactionClick = (account, type) => {
    setSelectedAccount(account);
    setTransactionType(type);
    setTransactionDialogOpen(true);
  };

  const handleTransactionClose = () => {
    setTransactionDialogOpen(false);
    setSelectedAccount(null);
  };

  const handleTransactionSubmit = async (values, { setSubmitting }) => {
    try {
      const input = {
        amount: parseFloat(values.amount),
        accountMoneyTransactionsId: selectedAccount.id,
        transactionType: transactionType,
        description: values.description,
        transactionDate: new Date().toISOString().split("T")[0],
        status: "completed",
      };

      await client.graphql({
        query: CREATE_MONEY_TRANSACTION_MUTATION,
        variables: { input },
      });

      setNotification({
        message: `${
          transactionType === "deposit" ? "Deposit" : "Withdrawal"
        } successful!`,
        color: "green",
      });
      handleTransactionClose();
      fetchAccounts({ institutionId: userDetails.institutionUsersId });
    } catch (error) {
      console.error("Transaction error:", error);
      setNotification({
        message: `Error processing transaction: ${error.message}`,
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const {
    items: accounts,
    loading,
    editDialogOpen,
    editDialogRow,
    createDialogOpen,
    deleteDialogOpen,
    deleteDialogRow,
    deleteLoading,
    deleteError,
    fetchItems: originalFetchAccounts,
    handleEditDialogOpen,
    handleEditDialogClose,
    handleEditSuccess: originalHandleEditSuccess,
    handleDeleteDialogOpen,
    handleDeleteDialogClose,
    handleDeleteConfirm: originalHandleDeleteConfirm,
    handleCreateDialogOpen,
    handleCreateDialogClose,
    handleCreateSuccess: originalHandleCreateSuccess,
  } = useCrudOperations(
    "Account",
    LIST_ACCOUNTS_QUERY,
    null,
    UPDATE_ACCOUNT_MUTATION,
    DELETE_ACCOUNT_MUTATION,
    "listAccounts"
  );

  // Custom fetch function with pagination support
  const fetchAccounts = React.useCallback(
    async (variables = {}) => {
      console.log("Fetching accounts with pagination...");
      setAccountsLoading(true);
      try {
        let allAccountsList = [];
        let nextToken = null;
        let iteration = 0;
        while (true) {
          const queryVariables = {
            ...variables,
            ...(nextToken && { nextToken }),
          };
          console.log(
            `Fetching batch ${iteration + 1} with nextToken: ${
              nextToken || "null"
            }`
          );
          console.log("API Query: LIST_ACCOUNTS_QUERY", {
            variables: queryVariables,
          });
          const result = await client.graphql({
            query: LIST_ACCOUNTS_QUERY,
            variables: queryVariables,
          });
          // Defensive: handle unexpected shapes
          const listResult = result?.data?.listAccounts || {};
          const batchItems = Array.isArray(listResult.items)
            ? listResult.items
            : [];
          allAccountsList.push(...batchItems);
          const newNextToken = listResult.nextToken || null;
          console.log(
            `Fetched ${batchItems.length} accounts in this batch. Total: ${allAccountsList.length}. NextToken: ${newNextToken}`
          );
          // Break conditions
          if (!newNextToken) {
            console.log("No nextToken returned. Pagination complete.");
            break;
          }
          if (newNextToken === nextToken) {
            console.warn(
              "Next token did not advance. Stopping to prevent infinite loop."
            );
            break;
          }
          if (++iteration > 50) {
            console.warn(
              "Safety cap (50 iterations) reached. Stopping pagination."
            );
            break;
          }
          nextToken = newNextToken;
        }
        console.log(
          `Finished fetching all accounts. Total count: ${allAccountsList.length}`
        );
        setAllAccounts(allAccountsList);
        return allAccountsList;
      } catch (err) {
        console.error("Error fetching accounts with pagination:", err);
        setAllAccounts([]);
        throw err;
      } finally {
        setAccountsLoading(false);
      }
    },
    [client]
  );

  // API handler for creating account
  const handleCreateAccountAPI = async (values) => {
    if (!userDetails?.institutionUsersId) {
      throw new Error("Error: Please try refreshing the page.");
    }

    const input = {
      institutionAccountsId: userDetails.institutionUsersId,
      name: values.name?.trim() || null,
      openingBalance: parseFloat(values.openingBalance) || 0,
      status: "active",
      currency: values.currency || userDetails.institution.currencyCode,
      accountType: "user",
      description: values.description?.trim() || null,
    };

    console.log("API Mutation: CREATE_ACCOUNT_MUTATION", {
      variables: { input },
    });
    const result = await client.graphql({
      query: CREATE_ACCOUNT_MUTATION,
      variables: { input },
    });

    return result.data.createAccount;
  };

  // API handler for updating account
  const handleUpdateAccountAPI = async (values, initialValues) => {
    const input = {
      id: initialValues.id,
      name: values.name?.trim() || null,
      openingBalance: parseFloat(values.openingBalance) || 0,
      status: values.status || "active",
      currency: values.currency || userDetails.institution.currencyCode,
      accountType: "user",
      description: values.description?.trim() || null,
    };

    console.log("API Mutation: UPDATE_ACCOUNT_MUTATION", {
      variables: { input },
    });
    const result = await client.graphql({
      query: UPDATE_ACCOUNT_MUTATION,
      variables: { input },
    });

    return result.data.updateAccount;
  };

  // Custom handleCreateSuccess to update allAccounts state and show notification
  const handleCreateSuccess = (newAccount) => {
    setAllAccounts((prev) => [...prev, newAccount]);
    setNotification({
      message: `${newAccount.name} created successfully!`,
      color: "green",
    });
    originalHandleCreateSuccess(newAccount);
  };

  // Custom handleDeleteConfirm to update allAccounts state and show notification
  const handleDeleteConfirm = async () => {
    console.log("API Mutation: DELETE_ACCOUNT_MUTATION", {
      variables: { input: { id: deleteDialogRow.id } },
    });
    await originalHandleDeleteConfirm();
    if (deleteDialogRow) {
      setAllAccounts((prev) =>
        prev.filter((account) => account.id !== deleteDialogRow.id)
      );
      setNotification({
        message: `${deleteDialogRow.name} deleted successfully!`,
        color: "green",
      });
    }
  };

  // Custom handleEditSuccess to update allAccounts state and show notification
  const handleEditSuccess = (updatedAccount) => {
    setAllAccounts((prev) =>
      prev.map((account) =>
        account.id === updatedAccount.id ? updatedAccount : account
      )
    );
    setNotification({
      message: `${updatedAccount.name} updated successfully!`,
      color: "green",
    });
    originalHandleEditSuccess(updatedAccount);
  };

  React.useEffect(() => {
    if (userDetails?.institutionUsersId && !__accountsFetchedOnce) {
      __accountsFetchedOnce = true;
      fetchAccounts({ institutionId: userDetails.institutionUsersId });
    }
  }, [userDetails?.institutionUsersId, fetchAccounts]);

  React.useEffect(() => {
    if (allAccounts && Array.isArray(allAccounts)) {
      const processed = [...allAccounts];
      processed.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        })
      );
      setProcessedAccounts(processed);
    }
  }, [allAccounts]);

  const handleEditClick = (form) => {
    if (form) {
      form.toggleEdit();
      setEditMode(form.getEditMode());
    }
  };

  const handlePopupDeleteClick = () => {
    handleEditDialogClose();
    if (editDialogRow) {
      handleDeleteDialogOpen(editDialogRow);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 220,
      renderCell: (params) => (
        <ClickableText onClick={() => handleEditDialogOpen(params.row)}>
          {params.value}
        </ClickableText>
      ),
    },
    {
      field: "openingBalance",
      headerName: "Opening Balance",
      width: 180,
    },
    {
      field: "currency",
      headerName: "Currency",
      width: 100,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) =>
        params.value
          ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
          : "",
    },
    {
      field: "deposit",
      headerName: "",
      width: 120,
      renderCell: (params) => (
        <PlusButtonSmall
          label="DEPOSIT"
          IconComponent={Add}
          onClick={() => handleTransactionClick(params.row, "deposit")}
        />
      ),
    },
    {
      field: "withdraw",
      headerName: "",
      width: 120,
      renderCell: (params) => (
        <PlusButtonSmall
          label="WITHDRAW"
          IconComponent={Remove}
          onClick={() => handleTransactionClick(params.row, "withdraw")}
        />
      ),
    },
  ];

  const TransactionForm = ({ onClose, onSubmit, type, account }) => {
    const theme = useTheme();

    const validationSchema = Yup.object().shape({
      amount: Yup.number()
        .required("Amount is required")
        .positive("Amount must be positive"),
      description: Yup.string(),
    });

    return (
      <Formik
        initialValues={{ amount: "", description: "" }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, handleChange, touched, errors, isSubmitting }) => (
          <Form>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <NumberInput
                label="Amount"
                name="amount"
                value={values.amount}
                onChange={handleChange}
                error={touched.amount && Boolean(errors.amount)}
                helperText={touched.amount && errors.amount}
                fullWidth
              />
              <TextInput
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
                fullWidth
                multiline
                rows={3}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button onClick={onClose} color="inherit">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {type === "deposit" ? "Deposit" : "Withdraw"}
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    );
  };

  return (
    <>
      <NotificationBar
        message={notification.message}
        color={notification.color}
      />
      <CollectionsTemplate
        title="Accounts"
        createButtonText="Create Account"
        onCreateClick={handleCreateDialogOpen}
        // Data props
        items={processedAccounts}
        loading={accountsLoading}
        columns={columns}
        searchFields={["name", "currency", "description"]}
        noDataMessage="No accounts found. Please create an account to get started."
        // Create dialog props
        createDialogOpen={createDialogOpen}
        onCreateDialogClose={handleCreateDialogClose}
        createDialogTitle="Create Account"
        CreateFormComponent={CreateAccounts}
        createFormProps={{
          onClose: handleCreateDialogClose,
          onCreateSuccess: handleCreateSuccess,
          onCreateAccountAPI: handleCreateAccountAPI,
          ref: formRef,
          isEditMode: false,
          setNotification, // pass down if needed
        }}
        // Edit dialog props
        editDialogOpen={editDialogOpen}
        editDialogRow={editDialogRow}
        onEditDialogClose={handleEditDialogClose}
        EditFormComponent={CreateAccounts}
        editFormProps={{
          onClose: handleEditDialogClose,
          onEditSuccess: handleEditSuccess,
          onUpdateAccountAPI: handleUpdateAccountAPI,
          initialValues: editDialogRow,
          isEditMode: true,
          ref: formRef,
          setNotification, // pass down if needed
        }}
        onEditClick={handleEditClick}
        onPopupDeleteClick={handlePopupDeleteClick}
        editMode={editMode}
        // Delete dialog props
        deleteDialogOpen={deleteDialogOpen}
        onDeleteDialogClose={handleDeleteDialogClose}
        onDeleteConfirm={handleDeleteConfirm}
        deleteLoading={deleteLoading}
        deleteError={deleteError}
        deleteDialogRow={deleteDialogRow}
        // Search props
        enableSearch={true}
        searchPlaceholder="Search accounts..."
      />
      <CustomPopUp
        open={transactionDialogOpen}
        onClose={handleTransactionClose}
        title={`${
          transactionType === "deposit" ? "Deposit to" : "Withdraw from"
        } ${selectedAccount?.name}`}
        showEdit={false}
        showDelete={false}
      >
        <TransactionForm
          onClose={handleTransactionClose}
          onSubmit={handleTransactionSubmit}
          type={transactionType}
          account={selectedAccount}
        />
      </CustomPopUp>
    </>
  );
}
