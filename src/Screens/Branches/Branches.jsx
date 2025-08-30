import React from "react";
import { UserContext } from "../../App";
import EditBranchesForm from "./EditBranchesForm";
import ClickableText from "../../ComponentAssets/ClickableText";
import CreateBranchesForm from "./CreateBranchesForm";
import { useTheme } from "@mui/material/styles";
import CollectionsTemplate from "../../ComponentAssets/CollectionsTemplate";
import { useCrudOperations } from "../../hooks/useCrudOperations";

const LIST_BRANCHES_QUERY = `
  query ListBranches($institutionId: ID!) {
    listBranches(
      filter: { institutionBranchesId: { eq: $institutionId } }
      limit: 100
    ) {
      items {
        id
        name
        branchCode
        address
        status
      }
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

export default function Branches() {
  const [editMode, setEditMode] = React.useState(false);
  const formRef = React.useRef();
  const { userDetails } = React.useContext(UserContext);
  const theme = useTheme();

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
    fetchItems: fetchBranches,
    handleEditDialogOpen,
    handleEditDialogClose,
    handleEditSuccess,
    handleDeleteDialogOpen,
    handleDeleteDialogClose,
    handleDeleteConfirm,
    handleCreateDialogOpen,
    handleCreateDialogClose,
    handleCreateSuccess,
  } = useCrudOperations(
    "Branch",
    LIST_BRANCHES_QUERY,
    null, // create mutation
    null, // update mutation
    DELETE_BRANCH_MUTATION,
    "listBranches" // Explicitly specify the query key
  );

  React.useEffect(() => {
    if (userDetails?.institutionUsersId) {
      fetchBranches({
        institutionId: userDetails.institutionUsersId,
      });
    }
  }, [userDetails?.institutionUsersId, fetchBranches]);

  const handleEditClick = () => {
    if (formRef.current) {
      formRef.current.toggleEdit();
      setEditMode(formRef.current.getEditMode());
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

  return (
    <CollectionsTemplate
      title="Branches"
      createButtonText="Create Branch"
      onCreateClick={handleCreateDialogOpen}
      // Data props
      items={branches}
      loading={loading}
      columns={columns}
      searchFields={["name", "branchCode", "address"]}
      noDataMessage="No branches found. Please create a branch to get started."
      // Create dialog props
      createDialogOpen={createDialogOpen}
      onCreateDialogClose={handleCreateDialogClose}
      createDialogTitle="Create Branch"
      CreateFormComponent={CreateBranchesForm}
      createFormProps={{
        onClose: handleCreateDialogClose,
        onCreateSuccess: handleCreateSuccess,
      }}
      // Edit dialog props
      editDialogOpen={editDialogOpen}
      editDialogRow={editDialogRow}
      onEditDialogClose={handleEditDialogClose}
      EditFormComponent={EditBranchesForm}
      editFormProps={{
        onClose: handleEditDialogClose,
        onEditSuccess: handleEditSuccess,
        isEditMode: false,
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
      searchPlaceholder="Search branches..."
    />
  );
}
