import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import ClickableText from "../../ModelAssets/ClickableText";
import CreateAccounts from "./CreateAccounts/CreateAccount";
import { useTheme } from "@mui/material/styles";
import CollectionsTemplate from "../../ModelAssets/CollectionsTemplate";
import { useCrudOperations } from "../../hooks/useCrudOperations";
import { generateClient } from "aws-amplify/api";
import { Formik, Form, useField } from "formik";
import NotificationBar from "../../ModelAssets/NotificationBar";
import PlusButtonSmall from "../../ModelAssets/PlusButtonSmall";
import PlusButtonMain from "../../ModelAssets/PlusButtonMain";
import CustomPopUp from "../../ModelAssets/CustomPopUp";
import MoneyTransactions from "./MoneyTransactions/MoneyTransactions";
import { Box, Typography } from "@mui/material";
import Remove from "@mui/icons-material/Remove";
import Add from "@mui/icons-material/Add";
import { listBranches } from "../../graphql/queries";
import MultipleDropDownSearchable from "../../Resources/FormComponents/MultipleDropDownSearchable";
import {
  LIST_ACCOUNTS_QUERY,
  LIST_ACCOUNTS_BY_BRANCH_QUERY,
  CREATE_ACCOUNT_MUTATION,
  DELETE_ACCOUNT_MUTATION,
  UPDATE_ACCOUNT_MUTATION,
  CREATE_ACCOUNT_BRANCH_MUTATION,
  DELETE_ACCOUNT_BRANCH_MUTATION,
  LIST_ACCOUNT_BRANCHES_QUERY,
} from "./accountHelpers";

// Guard to ensure we only fetch accounts once per page load (even under React StrictMode)
let __accountsFetchedOnce = false;

function FormikEffect({ onChange, fieldName }) {
  const [field] = useField(fieldName);
  const prevValueRef = React.useRef(field.value);

  React.useEffect(() => {
    if (JSON.stringify(field.value) !== JSON.stringify(prevValueRef.current)) {
      prevValueRef.current = field.value;
      onChange(field.value);
    }
  }, [field.value, onChange]);

  return null;
}

function BranchFilterWrapper({ branches, onFilterChange, selectedCount }) {
  return (
    <Box sx={{ mb: 3, width: "100%" }}>
      <Formik initialValues={{ branchFilter: [] }} enableReinitialize>
        <Form>
          <FormikEffect onChange={onFilterChange} fieldName="branchFilter" />
          <MultipleDropDownSearchable
            label="Filter by Branch"
            name="branchFilter"
            options={branches.map((branch) => ({
              value: branch.id,
              label: branch.name,
            }))}
            placeholder={selectedCount === 0 ? "All Branches" : ""}
            editing={true}
            helperText={
              selectedCount === 0
                ? "Showing all branches"
                : `Showing ${selectedCount} branch(es)`
            }
          />
        </Form>
      </Formik>
    </Box>
  );
}

export default function Accounts() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = React.useState(false);
  const formRef = useRef();
  const hasFetchedRef = useRef(false);
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
  const [branches, setBranches] = React.useState([]);
  const [selectedBranchFilter, setSelectedBranchFilter] = React.useState([]);

  const handleTransactionClick = (account, type) => {
    setSelectedAccount(account);
    setTransactionType(type);
    setTransactionDialogOpen(true);
  };

  const handleTransactionClose = () => {
    setTransactionDialogOpen(false);
    setSelectedAccount(null);
  };

  const handleTransactionSuccess = () => {
    const isAdmin = userDetails?.userType === "Admin";
    const institutionId =
      userDetails?.institutionUsersId || userDetails?.institution?.id;

    if (isAdmin && institutionId) {
      fetchAccounts({ institutionId });
    } else if (!isAdmin && userDetails?.branchUsersId) {
      fetchAccounts({ branchId: userDetails.branchUsersId });
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
    workingOverlay,
  } = useCrudOperations(
    "Account",
    LIST_ACCOUNTS_QUERY,
    null,
    UPDATE_ACCOUNT_MUTATION,
    DELETE_ACCOUNT_MUTATION,
    "listAccounts",
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

        // Determine query based on whether user is admin or fetching by branch
        const isAdmin = userDetails?.userType === "Admin";
        const useAccountBranchQuery = variables.branchId && !isAdmin;
        const query = useAccountBranchQuery
          ? LIST_ACCOUNTS_BY_BRANCH_QUERY
          : LIST_ACCOUNTS_QUERY;
        const queryName = useAccountBranchQuery
          ? "listAccountBranches"
          : "listAccounts";

        console.log(
          `User type: ${isAdmin ? "Admin" : "Non-Admin"}, Using query: ${queryName}`,
        );

        while (true) {
          const queryVariables = {
            ...variables,
            ...(nextToken && { nextToken }),
          };
          console.log(
            `Fetching batch ${iteration + 1} with nextToken: ${
              nextToken || "null"
            }`,
          );
          console.log(`API Query: ${queryName}`, {
            variables: queryVariables,
          });
          const result = await client.graphql({
            query: query,
            variables: queryVariables,
          });

          // Defensive: handle unexpected shapes
          let batchItems = [];
          if (useAccountBranchQuery) {
            // Extract accounts from AccountBranch join table
            const listResult = result?.data?.listAccountBranches || {};
            const items = Array.isArray(listResult.items)
              ? listResult.items
              : [];
            // Extract accounts from the nested structure
            batchItems = items
              .map((item) => item.account)
              .filter((account) => account != null);
            nextToken = listResult.nextToken || null;
          } else {
            // Direct account query
            const listResult = result?.data?.listAccounts || {};
            batchItems = Array.isArray(listResult.items)
              ? listResult.items
              : [];
            nextToken = listResult.nextToken || null;
          }

          allAccountsList.push(...batchItems);
          console.log(
            `Fetched ${batchItems.length} accounts in this batch. Total: ${allAccountsList.length}. NextToken: ${nextToken}`,
          );

          // Break conditions
          if (!nextToken) {
            console.log("No nextToken returned. Pagination complete.");
            break;
          }
          if (nextToken === queryVariables.nextToken) {
            console.warn(
              "Next token did not advance. Stopping to prevent infinite loop.",
            );
            break;
          }
          if (++iteration > 50) {
            console.warn(
              "Safety cap (50 iterations) reached. Stopping pagination.",
            );
            break;
          }
        }
        console.log(
          `Finished fetching all accounts. Total count: ${allAccountsList.length}`,
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
    [client, userDetails?.userType],
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
      currency: userDetails.institution.currencyCode,
      accountType: "user",
      description: values.description?.trim() || null,
    };

    const result = await client.graphql({
      query: CREATE_ACCOUNT_MUTATION,
      variables: { input },
    });

    const createdAccount = result.data.createAccount;

    // Create AccountBranch join table entries if branches are provided
    if (
      values.branches &&
      Array.isArray(values.branches) &&
      values.branches.length > 0
    ) {
      for (const branchId of values.branches) {
        try {
          await client.graphql({
            query: CREATE_ACCOUNT_BRANCH_MUTATION,
            variables: {
              input: {
                accountId: createdAccount.id,
                branchId: branchId,
              },
            },
          });
        } catch (err) {
          console.error(
            `Error creating AccountBranch for branch ${branchId}:`,
            err,
          );
          // Continue with other branches even if one fails
        }
      }
    }

    return createdAccount;
  };

  // API handler for updating account
  const handleUpdateAccountAPI = async (values, initialValues) => {
    const input = {
      id: initialValues.id,
      name: values.name?.trim() || null,
      openingBalance: parseFloat(values.openingBalance) || 0,
      status: values.status || "active",
      currency: userDetails.institution.currencyCode,
      accountType: "user",
      description: values.description?.trim() || null,
    };

    const result = await client.graphql({
      query: UPDATE_ACCOUNT_MUTATION,
      variables: { input },
    });

    const updatedAccount = result.data.updateAccount;

    // Handle branch relationships if branches are provided
    if (values.branches && Array.isArray(values.branches)) {
      // 1. Get existing AccountBranch entries
      let existingBranches = [];
      try {
        const branchesResult = await client.graphql({
          query: LIST_ACCOUNT_BRANCHES_QUERY,
          variables: { accountId: initialValues.id },
        });
        existingBranches = branchesResult.data.listAccountBranches.items || [];
      } catch (err) {
        console.error("Error fetching existing AccountBranch entries:", err);
      }

      const existingBranchIds = existingBranches.map((ab) => ab.branchId);
      const newBranchIds = values.branches;

      // 2. Delete removed branches
      const branchesToDelete = existingBranches.filter(
        (ab) => !newBranchIds.includes(ab.branchId),
      );
      for (const accountBranch of branchesToDelete) {
        try {
          await client.graphql({
            query: DELETE_ACCOUNT_BRANCH_MUTATION,
            variables: { input: { id: accountBranch.id } },
          });
        } catch (err) {
          console.error(
            `Error deleting AccountBranch ${accountBranch.id}:`,
            err,
          );
        }
      }

      // 3. Add new branches
      const branchesToAdd = newBranchIds.filter(
        (branchId) => !existingBranchIds.includes(branchId),
      );
      for (const branchId of branchesToAdd) {
        try {
          await client.graphql({
            query: CREATE_ACCOUNT_BRANCH_MUTATION,
            variables: {
              input: {
                accountId: initialValues.id,
                branchId: branchId,
              },
            },
          });
        } catch (err) {
          console.error(
            `Error creating AccountBranch for branch ${branchId}:`,
            err,
          );
        }
      }
    }

    return updatedAccount;
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
    await originalHandleDeleteConfirm();
    if (deleteDialogRow) {
      setAllAccounts((prev) =>
        prev.filter((account) => account.id !== deleteDialogRow.id),
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
        account.id === updatedAccount.id ? updatedAccount : account,
      ),
    );
    setNotification({
      message: `${updatedAccount.name} updated successfully!`,
      color: "green",
    });
    originalHandleEditSuccess(updatedAccount);
  };

  const calculateCurrentBalance = (data) => {
    if (!data) return 0;

    let allTransactions = [];

    // Money Transactions
    if (data.moneyTransactions?.items) {
      data.moneyTransactions.items.forEach((item) => {
        allTransactions.push({
          amount: item.amount,
          type: item.transactionType === "deposit" ? "credit" : "debit",
        });
      });
    }

    // Payments (Credit)
    if (data.payments?.items) {
      data.payments.items.forEach((item) => {
        allTransactions.push({
          amount: item.amount,
          type: "credit",
        });
      });
    }

    // Penalties (Debit)
    if (data.penalties?.items) {
      data.penalties.items.forEach((item) => {
        allTransactions.push({
          amount: item.amount,
          type: "debit",
        });
      });
    }

    // Loans (Credit - Disbursement)
    if (data.loans?.items) {
      data.loans.items.forEach((item) => {
        const loan = item.loan;
        if (loan) {
          allTransactions.push({
            amount: loan.principal,
            type: "credit",
          });
        }
      });
    }

    // Loan Fees (Debit)
    if (data.loanFees?.items) {
      data.loanFees.items.forEach((item) => {
        allTransactions.push({
          amount: item.amount,
          type: "debit",
        });
      });
    }

    // Expenses (Debit)
    if (data.expenses?.items) {
      data.expenses.items.forEach((item) => {
        allTransactions.push({
          amount: item.amount,
          type: "debit",
        });
      });
    }

    // Calculate Running Balance
    let runningBalance = data.openingBalance || 0;

    allTransactions.forEach((tx) => {
      if (tx.type === "credit") {
        runningBalance += tx.amount;
      } else {
        runningBalance -= tx.amount;
      }
    });

    return runningBalance;
  };

  React.useEffect(() => {
    const isAdmin = userDetails?.userType === "Admin";
    const institutionId =
      userDetails?.institutionUsersId || userDetails?.institution?.id;

    if (isAdmin && institutionId && !hasFetchedRef.current) {
      // Admin: fetch all accounts in the institution
      hasFetchedRef.current = true;
      fetchAccounts({ institutionId });
    } else if (
      !isAdmin &&
      userDetails?.branchUsersId &&
      !hasFetchedRef.current
    ) {
      // Non-admin: fetch accounts linked to their branch
      hasFetchedRef.current = true;
      fetchAccounts({ branchId: userDetails.branchUsersId });
    }
  }, [
    userDetails?.institutionUsersId,
    userDetails?.institution?.id,
    userDetails?.branchUsersId,
    userDetails?.userType,
    fetchAccounts,
  ]);

  React.useEffect(() => {
    const fetchBranchesForAdmin = async () => {
      const isAdmin = userDetails?.userType === "Admin";
      const institutionId =
        userDetails?.institution?.id || userDetails?.institutionUsersId;

      if (!isAdmin || !institutionId) {
        setBranches([]);
        setSelectedBranchFilter([]);
        return;
      }

      try {
        const branchData = await client.graphql({
          query: listBranches,
          variables: {
            limit: 1000,
            filter: {
              institutionBranchesId: { eq: institutionId },
            },
          },
        });
        const items = branchData?.data?.listBranches?.items || [];
        setBranches(items);
        setSelectedBranchFilter([]);
      } catch (error) {
        console.error("Error fetching branches:", error);
        setBranches([]);
      }
    };

    if (userDetails) {
      fetchBranchesForAdmin();
    }
  }, [userDetails, client]);

  React.useEffect(() => {
    if (allAccounts && Array.isArray(allAccounts)) {
      let processed = allAccounts.map((account) => ({
        ...account,
        currentBalance: calculateCurrentBalance(account),
      }));

      if (
        userDetails?.userType === "Admin" &&
        selectedBranchFilter.length > 0
      ) {
        processed = processed.filter((account) => {
          const accountBranches = account?.branches?.items || [];
          return accountBranches.some((item) =>
            selectedBranchFilter.includes(item?.branchId),
          );
        });
      }

      processed.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        }),
      );
      setProcessedAccounts(processed);
    }
  }, [allAccounts, selectedBranchFilter, userDetails?.userType]);

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
        <ClickableText
          onClick={() =>
            navigate(`/admin/accounts/${params.row.id}`, {
              state: { account: params.row },
            })
          }
        >
          {params.value}
        </ClickableText>
      ),
    },
    {
      field: "currentBalance",
      headerName: "Current Balance",
      width: 180,
      type: "number",
      valueFormatter: (value) => {
        if (value == null) return "";
        return value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
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
          disabled={params.row.status?.toLowerCase() === "inactive"}
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
          onClick={() => handleTransactionClick(params.row, "withdrawal")}
          disabled={params.row.status?.toLowerCase() === "inactive"}
        />
      ),
    },
  ];

  return (
    <>
      <NotificationBar
        message={notification.message}
        color={notification.color}
      />
      {workingOverlay}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Accounts
        </Typography>
        <PlusButtonMain
          onClick={handleCreateDialogOpen}
          buttonText="CREATE ACCOUNT"
        />
      </Box>

      {userDetails?.userType === "Admin" && branches.length > 0 && (
        <BranchFilterWrapper
          branches={branches}
          onFilterChange={setSelectedBranchFilter}
          selectedCount={selectedBranchFilter.length}
        />
      )}
      <CollectionsTemplate
        title="Accounts"
        createButtonText="Create Account"
        hideHeader={true}
        // Data props
        items={processedAccounts}
        loading={accountsLoading}
        columns={columns}
        searchFields={["name", "description"]}
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
        <MoneyTransactions
          onClose={handleTransactionClose}
          onSuccess={handleTransactionSuccess}
          type={transactionType}
          account={selectedAccount}
        />
      </CustomPopUp>
    </>
  );
}
