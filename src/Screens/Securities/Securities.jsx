import React from "react";
import { UserContext } from "../../App";
import ClickableText from "../../ModelAssets/ClickableText";
import CreateSecurities from "./CreateSecurities/CreateSecurities";
import { useTheme } from "@mui/material/styles";
import CollectionsTemplate from "../../ModelAssets/CollectionsTemplate";
import { useCrudOperations } from "../../hooks/useCrudOperations";

const LIST_SECURITIES_QUERY = `
  query ListSecurities($borrowerId: ID!) {
    listSecurities(
      filter: { borrowerSecuritiesId: { eq: $borrowerId } }
      limit: 100
    ) {
      items {
        id
        name
        type
        description
        value
        status
      }
    }
  }
`;

const DELETE_SECURITY_MUTATION = `
  mutation DeleteSecurity($input: DeleteSecurityInput!) {
    deleteSecurity(input: $input) {
      id
    }
  }
`;

const UPDATE_SECURITY_MUTATION = `
  mutation UpdateSecurity($input: UpdateSecurityInput!) {
    updateSecurity(input: $input) {
      id
      name
      type
      description
      value
      status
    }
  }
`;

export default function Securities() {
  const [editMode, setEditMode] = React.useState(false);
  const formRef = React.useRef();
  const { userDetails } = React.useContext(UserContext);
  const theme = useTheme();

  const {
    items: securities,
    loading,
    editDialogOpen,
    editDialogRow,
    createDialogOpen,
    deleteDialogOpen,
    deleteDialogRow,
    deleteLoading,
    deleteError,
    fetchItems: fetchSecurities,
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
    "Security",
    LIST_SECURITIES_QUERY,
    null, // create mutation
    UPDATE_SECURITY_MUTATION, // update mutation
    DELETE_SECURITY_MUTATION,
    "listSecurities", // Explicitly specify the query key
  );

  React.useEffect(() => {
    if (userDetails?.borrowerId) {
      fetchSecurities({
        borrowerId: userDetails.borrowerId,
      });
    } else {
      // If no borrowerId, set loading to false so noDataMessage can show
      if (loading) {
        // If loading is true, set it to false
        if (typeof fetchSecurities.setLoading === "function") {
          fetchSecurities.setLoading(false);
        }
      }
    }
  }, [userDetails?.borrowerId, fetchSecurities, loading]);

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
      field: "type",
      headerName: "Type",
      width: 180,
    },
    {
      field: "description",
      headerName: "Description",
      width: 250,
    },
    {
      field: "value",
      headerName: "Value",
      width: 120,
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
      title="Securities"
      createButtonText="Create Security"
      onCreateClick={handleCreateDialogOpen}
      // Data props
      items={securities}
      loading={loading}
      columns={columns}
      searchFields={["name", "type", "description"]}
      noDataMessage="No securities found. Please create a security to get started."
      // Create dialog props
      createDialogOpen={createDialogOpen}
      onCreateDialogClose={handleCreateDialogClose}
      createDialogTitle="Create Security"
      CreateFormComponent={CreateSecurities}
      createFormProps={{
        onClose: handleCreateDialogClose,
        onCreateSuccess: handleCreateSuccess,
      }}
      // Edit dialog props
      editDialogOpen={editDialogOpen}
      editDialogRow={editDialogRow}
      onEditDialogClose={handleEditDialogClose}
      EditFormComponent={CreateSecurities}
      editFormProps={{
        onClose: handleEditDialogClose,
        onEditSuccess: handleEditSuccess,
        isEditMode: true,
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
      searchPlaceholder="Search securities..."
    />
  );
}
