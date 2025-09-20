import React, { useRef } from "react";
import { UserContext } from "../../App";
import ClickableText from "../../ComponentAssets/ClickableText";
import CreateBorrower from "./CreateBorrower/CreateBorrower";
import { useTheme } from "@mui/material/styles";
import CollectionsTemplate from "../../ComponentAssets/CollectionsTemplate";
import { useCrudOperations } from "../../hooks/useCrudOperations";

const LIST_BORROWERS_QUERY = `
  query ListBorrowers($branchId: ID!) {
    listBorrowers(
      filter: { branchBorrowersId: { eq: $branchId } }
      limit: 100
    ) {
      items {
        id
                  firstname
                  othername
                  businessName
                  phoneNumber
                  otherPhoneNumber
                  email
                  borrowerStatus
      }
    }
  }
`;

const DELETE_BORROWER_MUTATION = `
  mutation DeleteBorrower($input: DeleteBorrowerInput!) {
    deleteBorrower(input: $input) {
      id
    }
  }
`;

const UPDATE_BORROWER_MUTATION = `
  mutation UpdateBorrower($input: UpdateBorrowerInput!) {
    updateBorrower(input: $input) {
      id
                  firstname
                  othername
                  businessName
                  phoneNumber
                  otherPhoneNumber
                  email
                  borrowerStatus
    }
  }
`;

export default function Borrowers() {
  const [editMode, setEditMode] = React.useState(false);
  const formRef = useRef();
  const { userDetails } = React.useContext(UserContext);
  const theme = useTheme();
  const [processedBorrowers, setProcessedBorrowers] = React.useState([]);

  const {
    items: borrowers,
    loading,
    editDialogOpen,
    editDialogRow,
    createDialogOpen,
    deleteDialogOpen,
    deleteDialogRow,
    deleteLoading,
    deleteError,
    fetchItems: fetchBorrowers,
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
    "Borrower",
    LIST_BORROWERS_QUERY,
    null,
    UPDATE_BORROWER_MUTATION,
    DELETE_BORROWER_MUTATION,
    "listBorrowers"
  );

  React.useEffect(() => {
    if (userDetails?.branchUsersId) {
      fetchBorrowers({ branchId: userDetails.branchUsersId });
    }
  }, [userDetails?.branchUsersId, fetchBorrowers]);

  React.useEffect(() => {
    if (borrowers && Array.isArray(borrowers)) {
      const allBorrowers = borrowers;
      const processed = allBorrowers.map((borrower) => ({
        ...borrower,
        combinedName:
          borrower.firstname || borrower.othername
            ? `${[borrower.firstname, borrower.othername]
                .filter(Boolean)
                .join(" ")}${
                borrower.businessName ? ` (${borrower.businessName})` : ""
              }`
            : borrower.businessName || "",
      }));
      processed.sort((a, b) =>
        a.combinedName.localeCompare(b.combinedName, undefined, {
          sensitivity: "base",
        })
      );
      setProcessedBorrowers(processed);
    }
  }, [borrowers]);

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
      field: "combinedName",
      headerName: "Full Name / Business Name",
      width: 280,
      renderCell: (params) => (
        <ClickableText
          onClick={() => {
            // Set name to combinedName before opening edit dialog
            handleEditDialogOpen({
              ...params.row,
              name: `Borrower: ${params.row.combinedName}`,
            });
          }}
        >
          {params.value}
        </ClickableText>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "Phone No.",
      width: 140,
    },
    {
      field: "otherPhoneNumber",
      headerName: "Alt. Phone No.",
      width: 140,
    },
    {
      field: "email",
      headerName: "Email",
      width: 240,
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   width: 100,
    //   renderCell: (params) =>
    //     params.value
    //       ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
    //       : "",
    // },
  ];

  return (
    <CollectionsTemplate
      title="Borrowers"
      createButtonText="Create Borrower"
      onCreateClick={handleCreateDialogOpen}
      items={processedBorrowers}
      loading={loading}
      columns={columns}
      searchFields={["firstname", "businessName", "phoneNumber", "email"]}
      noDataMessage="No borrowers found. Please create a borrower to get started."
      createDialogOpen={createDialogOpen}
      onCreateDialogClose={handleCreateDialogClose}
      createDialogTitle="Create Borrower"
      CreateFormComponent={CreateBorrower}
      createFormProps={{
        onClose: handleCreateDialogClose,
        onCreateSuccess: handleCreateSuccess,
        ref: formRef,
        isEditMode: false,
      }}
      editDialogOpen={editDialogOpen}
      editDialogRow={editDialogRow}
      onEditDialogClose={handleEditDialogClose}
      EditFormComponent={CreateBorrower}
      editFormProps={{
        onClose: handleEditDialogClose,
        onEditSuccess: handleEditSuccess,
        initialValues: editDialogRow,
        isEditMode: true,
        ref: formRef,
      }}
      onEditClick={handleEditClick}
      onPopupDeleteClick={handlePopupDeleteClick}
      editMode={editMode}
      deleteDialogOpen={deleteDialogOpen}
      onDeleteDialogClose={handleDeleteDialogClose}
      onDeleteConfirm={handleDeleteConfirm}
      deleteLoading={deleteLoading}
      deleteError={deleteError}
      deleteDialogRow={deleteDialogRow}
      enableSearch={true}
      searchPlaceholder="Search borrowers..."
    />
  );
}
