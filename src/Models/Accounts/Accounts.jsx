import React, { useRef } from "react";
import { UserContext } from "../../App";
import ClickableText from "../../ModelAssets/ClickableText";
import CreateAccounts from "./CreateAccounts/CreateAccount";
import { useTheme } from "@mui/material/styles";
import CollectionsTemplate from "../../ModelAssets/CollectionsTemplate";
import { useCrudOperations } from "../../hooks/useCrudOperations";
import { generateClient } from "aws-amplify/api";
import NotificationBar from "../../ModelAssets/NotificationBar";
import {
  LIST_ACCOUNTS_QUERY,
  CREATE_ACCOUNT_MUTATION,
  DELETE_ACCOUNT_MUTATION,
  UPDATE_ACCOUNT_MUTATION,
  fetchAccounts as fetchAccountsHelper,
  createAccount,
  updateAccount,
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
      try {
        const allAccountsList = await fetchAccountsHelper(client, variables, setAccountsLoading);
        setAllAccounts(allAccountsList);
        return allAccountsList;
      } catch (err) {
        setAllAccounts([]);
        throw err;
      }
    },
    [client]
  );

  // API handler for creating account
  const handleCreateAccountAPI = async (values) => {
    return await createAccount(client, values, userDetails);
  };

  // API handler for updating account
  const handleUpdateAccountAPI = async (values, initialValues) => {
    return await updateAccount(client, values, initialValues, userDetails);
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
  ];

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
    </>
  );
}
