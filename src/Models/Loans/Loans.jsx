import React from "react";
import { generateClient } from "aws-amplify/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { UserContext } from "../../App";
import CustomDataGrid from "../../ModelAssets/CustomDataGrid";
import CustomSlider from "../../ModelAssets/CustomSlider";
import DeleteDialog from "../../ModelAssets/DeleteDialog";
import { useTheme } from "@mui/material/styles";
import ClickableText from "../../ModelAssets/ClickableText";
import CollectionsTemplate from "../../ModelAssets/CollectionsTemplate";
import EditLoan from "./EditLoan/EditLoan";
import ListBorrowers from "./CreateLoan/ListBorrowers";
import CreateLoan from "./CreateLoan/CreateLoan";
import LoanCreationOptions from "./CreateLoan/LoanCreationOptions";

const LIST_LOAN_LOAN_FEES_QUERY = `
  query ListLoanLoanFees($filter: ModelLoanLoanFeesFilterInput) {
    listLoanLoanFees(filter: $filter) {
      items {
        id
      }
    }
  }
`;

const DELETE_LOAN_LOAN_FEES_MUTATION = `
  mutation DeleteLoanLoanFees($input: DeleteLoanLoanFeesInput!) {
    deleteLoanLoanFees(input: $input)
  }
`;

const LIST_LOAN_PENALTIES_QUERY = `
  query ListLoanPenalties($filter: ModelLoanPenaltyFilterInput) {
    listLoanPenalties(filter: $filter) {
      items {
        id
      }
    }
  }
`;

const DELETE_LOAN_PENALTY_MUTATION = `
  mutation DeleteLoanPenalty($input: DeleteLoanPenaltyInput!) {
    deleteLoanPenalty(input: $input) {
      penaltyId
    }
  }
`;

export default function Loans() {
  const [loans, setLoans] = React.useState([]);
  const [borrowers, setBorrowers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editDialogRow, setEditDialogRow] = React.useState(null);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [listBorrowersOpen, setListBorrowersOpen] = React.useState(false);
  const [selectedBorrower, setSelectedBorrower] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteDialogRow, setDeleteDialogRow] = React.useState(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState("");
  const [editMode, setEditMode] = React.useState(false);
  const formRef = React.useRef();
  const hasFetchedRef = React.useRef();
  const { userDetails } = React.useContext(UserContext);
  const theme = useTheme();

  React.useEffect(() => {
    const fetchLoans = async () => {
      if (!userDetails?.branchUsersId) return;

      setLoading(true);
      try {
        const client = generateClient();

        let allLoans = [];
        let nextToken = null;

        do {
          console.log("API Call: Fetching loans");
          const result = await client.graphql({
            query: `
              query ListBorrowers($branchId: ID!, $nextToken: String) {
                listBorrowers(
                  filter: { branchBorrowersId: { eq: $branchId } }
                  limit: 100
                  nextToken: $nextToken
                ) {
                  nextToken
                  items {
                    id
                    firstname
                    othername
                    businessName
                    phoneNumber
                    loans {
                      items {
                        id
                        principal
                        interestRate
                        duration
                        durationInterval
                        startDate
                        maturityDate
                        status
                        paymentFrequency
                        loanProduct {
                          name
                        }
                        createdByEmployee {
                          firstName
                          lastName
                        }
                      }
                    }
                  }
                }
              }
            `,
            variables: {
              branchId: userDetails.branchUsersId,
              nextToken: nextToken,
            },
          });

          const borrowers = result.data.listBorrowers.items || [];
          setBorrowers((prev) => [...prev, ...borrowers]);
          const loansFromBorrowers = borrowers.flatMap((borrower) =>
            borrower.loans.items.map((loan) => ({
              ...loan,
              borrower: {
                firstname: borrower.firstname,
                othername: borrower.othername,
                businessName: borrower.businessName,
              },
            }))
          );
          allLoans = [...allLoans, ...loansFromBorrowers];
          nextToken = result.data.listBorrowers.nextToken;
        } while (nextToken);

        setLoans(allLoans);
        console.log("allLoans::: ", allLoans);
      } catch (err) {
        console.log("err::: ", err);
        setLoans([]);
      } finally {
        setLoading(false);
      }
    };

    if (
      userDetails?.branchUsersId &&
      userDetails.branchUsersId !== hasFetchedRef.current
    ) {
      fetchLoans();
      hasFetchedRef.current = userDetails.branchUsersId;
    }
  }, [userDetails?.branchUsersId]);

  const handleEditDialogOpen = (row) => {
    setEditDialogRow(row);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditDialogRow(null);
  };

  const handleEditSuccess = (updatedRow) => {
    setLoans((prev) =>
      prev.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
    handleEditDialogClose();
  };

  const handleDeleteDialogOpen = (row) => {
    setDeleteDialogRow(row);
    setDeleteDialogOpen(true);
    setDeleteError("");
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setDeleteDialogRow(null);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const client = generateClient();

      // First, clear relationships with loan fees
      console.log("Clearing LoanLoanFees for loan:", deleteDialogRow.id);
      const loanFeesResult = await client.graphql({
        query: LIST_LOAN_LOAN_FEES_QUERY,
        variables: { filter: { loanId: { eq: deleteDialogRow.id } } },
      });
      const feeItems = loanFeesResult.data.listLoanLoanFees.items;
      console.log(`Found ${feeItems.length} LoanLoanFees to delete`);
      for (const item of feeItems) {
        console.log("Deleting LoanLoanFees:", item.id);
        await client.graphql({
          query: DELETE_LOAN_LOAN_FEES_MUTATION,
          variables: { input: { id: item.id } },
        });
      }
      console.log("Finished clearing LoanLoanFees");

      // Then, clear relationships with penalties
      console.log("Clearing LoanPenalties for loan:", deleteDialogRow.id);
      const penaltiesResult = await client.graphql({
        query: LIST_LOAN_PENALTIES_QUERY,
        variables: { filter: { loanId: { eq: deleteDialogRow.id } } },
      });
      const penaltyItems = penaltiesResult.data.listLoanPenalties.items;
      console.log(`Found ${penaltyItems.length} LoanPenalties to delete`);
      for (const item of penaltyItems) {
        console.log("Deleting LoanPenalty:", item.id);
        await client.graphql({
          query: DELETE_LOAN_PENALTY_MUTATION,
          variables: { input: { id: item.id } },
        });
      }
      console.log("Finished clearing LoanPenalties");

      // Delete the loan
      await client.graphql({
        query: `
          mutation DeleteLoan($input: DeleteLoanInput!) {
            deleteLoan(input: $input) {
              id
            }
          }
        `,
        variables: {
          input: { id: deleteDialogRow.id },
        },
      });
      setLoans((prev) => prev.filter((row) => row.id !== deleteDialogRow.id));
      handleDeleteDialogClose();
    } catch (err) {
      console.error("Error deleting loan:", err);
      setDeleteError("Failed to delete. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditClick = () => {
    if (formRef.current && formRef.current.toggleEdit) {
      formRef.current.toggleEdit();
      setEditMode(formRef.current.getEditMode());
    }
  };

  const handlePopupDeleteClick = () => {
    handleDeleteDialogOpen(editDialogRow);
  };

  const handleCreateDialogOpen = () => {
    setListBorrowersOpen(true);
  };

  const handleListBorrowersClose = () => {
    setListBorrowersOpen(false);
  };

  const handleBorrowerSelect = (borrower) => {
    setSelectedBorrower(borrower);
    setListBorrowersOpen(false);
    setCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
    setSelectedBorrower(null);
  };

  const handleCreateSuccess = (newLoan) => {
    setLoans((prev) => [...prev, newLoan]);
    handleCreateDialogClose();
  };

  // Updated columns to show relevant loan information
  const columns = [
    {
      field: "borrowerName",
      headerName: "Borrower",
      width: 200,
      renderCell: (params) => {
        const borrower = params.row.borrower;
        const name = borrower
          ? `${borrower.firstname || ""} ${borrower.othername || ""} ${
              borrower.businessName || ""
            }`.trim()
          : "Unknown";
        return <>{name}</>;
      },
    },
    {
      field: "loanProduct",
      headerName: "Loan Product",
      width: 200,
      renderCell: (params) => {
        return params.row.loanProduct?.name || "N/A";
      },
    },
    {
      field: "principal",
      headerName: "Principal Amount",
      width: 150,
      renderCell: (params) => {
        return params.value ? `$${params.value.toLocaleString()}` : "N/A";
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const status = params.row.status || "Active";
        return status;
      },
    },
    {
      field: "maturityDate",
      headerName: "Maturity Date",
      width: 120,
      renderCell: (params) => {
        return params.value || "N/A";
      },
    },
  ];

  return (
    <>
      <CollectionsTemplate
        title="Loans"
        createButtonText="Add Loan"
        items={loans}
        loading={loading}
        columns={columns}
        searchFields={[
          "borrower.firstname",
          "borrower.othername",
          "loanProduct.name",
        ]}
        noDataMessage="No loans found. Please create a loan to get started."
        // Create
        onCreateClick={handleCreateDialogOpen}
        createDialogOpen={createDialogOpen}
        onCreateDialogClose={handleCreateDialogClose}
        createDialogTitle="Create Loan"
        // Edit
        editDialogOpen={editDialogOpen}
        editDialogRow={editDialogRow}
        onEditDialogClose={handleEditDialogClose}
        onEditClick={handleEditClick}
        onPopupDeleteClick={handlePopupDeleteClick}
        editMode={editMode}
        // Delete
        deleteDialogOpen={deleteDialogOpen}
        onDeleteDialogClose={handleDeleteDialogClose}
        onDeleteConfirm={handleDeleteConfirm}
        deleteLoading={deleteLoading}
        deleteError={deleteError}
        deleteDialogRow={deleteDialogRow}
      >
        {/* Edit Dialog - using CollectionsTemplate's EditFormComponent would require adapting EditLoan */}
        {editDialogRow && (
          <EditLoan
            ref={formRef}
            initialValues={editDialogRow}
            onClose={handleEditDialogClose}
            onEditSuccess={handleEditSuccess}
            isEditMode={true}
          />
        )}
      </CollectionsTemplate>

      {/* Borrower Selection Slider */}
      <CustomSlider
        open={listBorrowersOpen}
        onClose={handleListBorrowersClose}
        title="Select Borrower to receive the Loan"
        showEdit={false}
        showDelete={false}
        maxWidth="md"
        fullWidth
      >
        <ListBorrowers
          borrowers={borrowers}
          onSelect={handleBorrowerSelect}
          onClose={handleListBorrowersClose}
        />
      </CustomSlider>

      {/* Loan Creation Options Slider */}
      <CustomSlider
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
        title="Create Loan"
        showEdit={false}
        showDelete={false}
        maxWidth="md"
        fullWidth
      >
        <LoanCreationOptions
          borrower={selectedBorrower}
          onClose={handleCreateDialogClose}
          onCreateSuccess={handleCreateSuccess}
        />
      </CustomSlider>
    </>
  );
}
