import React, { useRef } from "react";
import { UserContext } from "../../App";
import ClickableText from "../../ModelAssets/ClickableText";
import CreateBranches from "./CreateBranches/CreateBranch";
import { useTheme } from "@mui/material/styles";
import CollectionsTemplate from "../../ModelAssets/CollectionsTemplate";
import { useCrudOperations } from "../../hooks/useCrudOperations";
import { generateClient } from "aws-amplify/api";
import NotificationBar from "../../ModelAssets/NotificationBar";

// Guard to ensure we only fetch branches once per page load (even under React StrictMode)
let __branchesFetchedOnce = false;

const LIST_BRANCHES_QUERY = `
  query ListBranches($institutionId: ID!, $nextToken: String) {
    listBranches(
      filter: { institutionBranchesId: { eq: $institutionId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

const CREATE_BRANCH_MUTATION = `
  mutation CreateBranch($input: CreateBranchInput!) {
    createBranch(input: $input) {
      id
      name
      branchCode
      address
      status
      createdAt
      updatedAt
    }
  }
`;

const DELETE_BRANCH_MUTATION = `
  mutation DeleteBranch($input: DeleteBranchInput!) {
    deleteBranch(input: $input) {
      id
    }
  }
`;

const UPDATE_BRANCH_MUTATION = `
  mutation UpdateBranch($input: UpdateBranchInput!) {
    updateBranch(input: $input) {
      id
      name
      branchCode
      address
      status
      createdAt
      updatedAt
    }
  }
`;

const LIST_BRANCH_LOAN_PRODUCTS_QUERY = `
  query ListBranchLoanProducts($filter: ModelBranchLoanProductFilterInput) {
    listBranchLoanProducts(filter: $filter) {
      items {
        id
      }
    }
  }
`;

const DELETE_BRANCH_LOAN_PRODUCT_MUTATION = `
  mutation DeleteBranchLoanProduct($input: DeleteBranchLoanProductInput!) {
    deleteBranchLoanProduct(input: $input) {
      branchId
    }
  }
`;

export default function Branches() {
  const [editMode, setEditMode] = React.useState(false);
  const formRef = useRef();
  const { userDetails } = React.useContext(UserContext);
  const theme = useTheme();
  const [processedBranches, setProcessedBranches] = React.useState([]);
  const [allBranches, setAllBranches] = React.useState([]);
  const [branchesLoading, setBranchesLoading] = React.useState(true);
  const [notification, setNotification] = React.useState({
    message: "",
    color: "green",
  });
  const client = React.useMemo(() => generateClient(), []); // stabilize client so effect does not re-trigger infinitely

  const {
    items: branches,
    loading,
    editDialogOpen,
    editDialogRow,
    createDialogOpen,
    deleteDialogOpen,
    deleteDialogRow,
    deleteLoading,
    deleteError,
    fetchItems: originalFetchBranches,
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
    "Branch",
    LIST_BRANCHES_QUERY,
    null,
    UPDATE_BRANCH_MUTATION,
    DELETE_BRANCH_MUTATION,
    "listBranches"
  );

  // Custom fetch function with pagination support
  const fetchBranches = React.useCallback(
    async (variables = {}) => {
      console.log("Fetching branches with pagination...");
      setBranchesLoading(true);
      try {
        let allBranchesList = [];
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
          console.log("API Query: LIST_BRANCHES_QUERY", {
            variables: queryVariables,
          });
          const result = await client.graphql({
            query: LIST_BRANCHES_QUERY,
            variables: queryVariables,
          });
          // Defensive: handle unexpected shapes
          const listResult = result?.data?.listBranches || {};
          const batchItems = Array.isArray(listResult.items)
            ? listResult.items
            : [];
          allBranchesList.push(...batchItems);
          const newNextToken = listResult.nextToken || null;
          console.log(
            `Fetched ${batchItems.length} branches in this batch. Total: ${allBranchesList.length}. NextToken: ${newNextToken}`
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
          `Finished fetching all branches. Total count: ${allBranchesList.length}`
        );
        setAllBranches(allBranchesList);
        return allBranchesList;
      } catch (err) {
        console.error("Error fetching branches with pagination:", err);
        setAllBranches([]);
        throw err;
      } finally {
        setBranchesLoading(false);
      }
    },
    [client]
  );

  // API handler for creating branch
  const handleCreateBranchAPI = async (values) => {
    if (!userDetails?.institutionUsersId) {
      throw new Error("Error: Please try refreshing the page.");
    }

    const input = {
      name: values.name?.trim() || null,
      branchCode: values.branchCode?.trim() || null,
      address: values.address?.trim() || null,
      status: values.status || "active",
      institutionBranchesId: userDetails.institutionUsersId,
    };

    console.log("API Mutation: CREATE_BRANCH_MUTATION", {
      variables: { input },
    });
    const result = await client.graphql({
      query: CREATE_BRANCH_MUTATION,
      variables: { input },
    });

    return result.data.createBranch;
  };

  // API handler for updating branch
  const handleUpdateBranchAPI = async (values, initialValues) => {
    const input = {
      id: initialValues.id,
      name: values.name?.trim() || null,
      branchCode: values.branchCode?.trim() || null,
      address: values.address?.trim() || null,
      status: values.status || "active",
    };

    console.log("API Mutation: UPDATE_BRANCH_MUTATION", {
      variables: { input },
    });
    const result = await client.graphql({
      query: UPDATE_BRANCH_MUTATION,
      variables: { input },
    });

    return result.data.updateBranch;
  };

  // Custom handleCreateSuccess to update allBranches state and show notification
  const handleCreateSuccess = (newBranch) => {
    setAllBranches((prev) => [...prev, newBranch]);
    setNotification({
      message: `${newBranch.name} created successfully!`,
      color: "green",
    });
    originalHandleCreateSuccess(newBranch);
  };

  // Custom handleDeleteConfirm to update allBranches state and show notification
  const handleDeleteConfirm = async () => {
    try {
      // First, clear relationships with loan products
      console.log(
        "Clearing BranchLoanProducts for branch:",
        deleteDialogRow.id
      );
      const branchLoanProductsResult = await client.graphql({
        query: LIST_BRANCH_LOAN_PRODUCTS_QUERY,
        variables: { filter: { branchId: { eq: deleteDialogRow.id } } },
      });
      const items = branchLoanProductsResult.data.listBranchLoanProducts.items;
      console.log(`Found ${items.length} BranchLoanProducts to delete`);
      for (const item of items) {
        console.log("Deleting BranchLoanProduct:", item.id);
        await client.graphql({
          query: DELETE_BRANCH_LOAN_PRODUCT_MUTATION,
          variables: { input: { id: item.id } },
        });
      }
      console.log("Finished clearing BranchLoanProducts");

      console.log("API Mutation: DELETE_BRANCH_MUTATION", {
        variables: { input: { id: deleteDialogRow.id } },
      });
      await originalHandleDeleteConfirm();
      if (deleteDialogRow) {
        setAllBranches((prev) =>
          prev.filter((branch) => branch.id !== deleteDialogRow.id)
        );
        setNotification({
          message: `${deleteDialogRow.name} deleted successfully!`,
          color: "green",
        });
      }
    } catch (error) {
      console.error("Error deleting branch:", error);
      setNotification({
        message: `Error deleting ${deleteDialogRow?.name || "branch"}: ${
          error.message
        }`,
        color: "red",
      });
    }
  };

  // Custom handleEditSuccess to update allBranches state and show notification
  const handleEditSuccess = (updatedBranch) => {
    setAllBranches((prev) =>
      prev.map((branch) =>
        branch.id === updatedBranch.id ? updatedBranch : branch
      )
    );
    setNotification({
      message: `${updatedBranch.name} updated successfully!`,
      color: "green",
    });
    originalHandleEditSuccess(updatedBranch);
  };

  React.useEffect(() => {
    if (userDetails?.institutionUsersId && !__branchesFetchedOnce) {
      __branchesFetchedOnce = true;
      fetchBranches({ institutionId: userDetails.institutionUsersId });
    }
  }, [userDetails?.institutionUsersId, fetchBranches]);

  React.useEffect(() => {
    if (allBranches && Array.isArray(allBranches)) {
      const processed = [...allBranches];
      processed.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        })
      );
      setProcessedBranches(processed);
    }
  }, [allBranches]);

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
      field: "branchCode",
      headerName: "Branch Code",
      width: 180,
    },
    {
      field: "address",
      headerName: "Address",
      width: 250,
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

  // Check if a branch can be deleted (system branches cannot be deleted)
  const canDeleteBranch = (branch) => branch?.status !== "system";

  return (
    <>
      <NotificationBar
        message={notification.message}
        color={notification.color}
      />
      <CollectionsTemplate
        title="Branches"
        createButtonText="Create Branch"
        onCreateClick={handleCreateDialogOpen}
        // Data props
        items={processedBranches}
        loading={branchesLoading}
        columns={columns}
        searchFields={["name", "branchCode", "address"]}
        noDataMessage="No branches found. Please create a branch to get started."
        // Create dialog props
        createDialogOpen={createDialogOpen}
        onCreateDialogClose={handleCreateDialogClose}
        createDialogTitle="Create Branch"
        CreateFormComponent={CreateBranches}
        createFormProps={{
          onClose: handleCreateDialogClose,
          onCreateSuccess: handleCreateSuccess,
          onCreateBranchAPI: handleCreateBranchAPI,
          ref: formRef,
          isEditMode: false,
          setNotification, // pass down if needed
        }}
        // Edit dialog props
        editDialogOpen={editDialogOpen}
        editDialogRow={editDialogRow}
        onEditDialogClose={handleEditDialogClose}
        EditFormComponent={CreateBranches}
        editFormProps={{
          onClose: handleEditDialogClose,
          onEditSuccess: handleEditSuccess,
          onUpdateBranchAPI: handleUpdateBranchAPI,
          initialValues: editDialogRow,
          isEditMode: true,
          ref: formRef,
          setNotification, // pass down if needed
        }}
        onEditClick={handleEditClick}
        // reactivate to enable deleting of branches
        // onPopupDeleteClick={handlePopupDeleteClick}
        onPopupDeleteClick={
          canDeleteBranch(editDialogRow) ? handlePopupDeleteClick : null
        }
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
        searchPlaceholder="Search branches..."
      />
    </>
  );
}
