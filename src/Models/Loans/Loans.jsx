import React from "react";
import { generateClient } from "aws-amplify/api";
import { listLoans } from "./loanHelpers";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { UserContext } from "../../App";
import CustomDataGrid from "../../ModelAssets/CustomDataGrid";
import CustomSlider from "../../ModelAssets/CustomSlider";
import DeleteDialog from "../../ModelAssets/DeleteDialog";
import { useTheme } from "@mui/material/styles";
import CollectionsTemplate from "../../ModelAssets/CollectionsTemplate";
import LoanDetail from "./LoanDetail";
import ListBorrowers from "./CreateLoan/ListBorrowers";
import CreateLoan from "./CreateLoan/CreateLoan";
import LoanCreationOptions from "./CreateLoan/LoanCreationOptions";
import NotificationBar from "../../ModelAssets/NotificationBar";

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
  const [loanDetailOpen, setLoanDetailOpen] = React.useState(false);
  const [detailLoanRow, setDetailLoanRow] = React.useState(null);
  const [detailInitialTab, setDetailInitialTab] = React.useState(0);
  const [notification, setNotification] = React.useState(null);
  const [selectedTab, setSelectedTab] = React.useState("all");

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const fetchLoans = async () => {
    if (!userDetails?.branchUsersId) return;

    setLoading(true);
    try {
      const client = generateClient();

      // Fetch borrowers
      const resultBorrowers = await client.graphql({
        query: `
          query ListBorrowers($branchId: ID!) {
            listBorrowers(
              filter: { branchBorrowersId: { eq: $branchId } }
              limit: 1000
            ) {
              items {
                id
                firstname
                othername
                businessName
                uniqueIdNumber
              }
            }
          }
        `,
        variables: {
          branchId: userDetails.branchUsersId,
        },
      });
      setBorrowers(resultBorrowers.data.listBorrowers.items || []);

      // Fetch loans
      let allLoans = [];
      let nextToken = null;
      do {
        const resultLoans = await client.graphql({
          query: listLoans,
          variables: {
            filter: {
              branchID: { eq: userDetails.branchUsersId },
            },
            limit: 100,
            nextToken,
          },
        });
        const loansBatch = resultLoans.data.listLoans.items;
        allLoans.push(...loansBatch);
        nextToken = resultLoans.data.listLoans.nextToken;
      } while (nextToken);

      setLoans(allLoans);
    } catch (err) {
      console.error("Error fetching loans or borrowers:", err);
      setLoans([]);
      setBorrowers([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (
      userDetails?.branchUsersId &&
      userDetails.branchUsersId !== hasFetchedRef.current
    ) {
      fetchLoans();
      hasFetchedRef.current = userDetails.branchUsersId;
    }
  }, [userDetails?.branchUsersId]);

  const filteredRows = React.useMemo(() => {
    if (selectedTab === "all") {
      // All Loans: current (ACTIVE), payment due, past due (OVERDUE), cleared (CLOSED)
      return loans.filter((loan) => {
        const status = (loan.loanStatusEnum || loan.status || "").toUpperCase();
        return (
          [
            "ACTIVE",
            "CLOSED",
            // Include installment-based statuses if they're stored in the loan status field
          ].includes(status) || !status
        );
      });
    }
    if (selectedTab === "active") {
      return loans.filter((loan) => {
        const status = (loan.loanStatusEnum || loan.status || "").toUpperCase();
        return status === "ACTIVE";
      });
    }
    if (selectedTab === "closed") {
      return loans.filter((loan) => {
        const status = (loan.loanStatusEnum || loan.status || "").toUpperCase();
        return status === "CLOSED";
      });
    }
    if (selectedTab === "written_off") {
      return loans.filter((loan) => {
        const status = (loan.loanStatusEnum || loan.status || "").toUpperCase();
        return status === "WRITTEN_OFF";
      });
    }
    if (selectedTab === "voided") {
      return loans.filter((loan) => {
        const status = (loan.loanStatusEnum || loan.status || "").toUpperCase();
        return status === "VOIDED";
      });
    }
    return loans;
  }, [loans, selectedTab]);

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
      prev.map((row) => (row.id === updatedRow.id ? updatedRow : row)),
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
    // Show a success notification (persist to sessionStorage so it shows after page reload/navigation)
    const msg = `Loan ${
      newLoan?.loanNumber || newLoan?.id
    } created successfully.`;
    const note = { message: msg, color: "green" };
    setNotification(note);
    try {
      sessionStorage.setItem("loanCreatedNotification", JSON.stringify(note));
    } catch (e) {
      // ignore storage errors
    }

    fetchLoans();
    handleCreateDialogClose();
  };

  // On mount, check for a persisted create-notification and show it once
  React.useEffect(() => {
    try {
      const stored = sessionStorage.getItem("loanCreatedNotification");
      if (stored) {
        const obj = JSON.parse(stored);
        if (obj && obj.message) setNotification(obj);
        sessionStorage.removeItem("loanCreatedNotification");
      }
    } catch (e) {
      // ignore parse/storage errors
    }
  }, []);

  const openLoanDetail = (row, tab = 0) => {
    setDetailLoanRow(row);
    setDetailInitialTab(tab);
    setLoanDetailOpen(true);
  };

  const closeLoanDetail = () => {
    setLoanDetailOpen(false);
    setDetailLoanRow(null);
    setDetailInitialTab(0);
  };

  const handleViewStatementClick = (event, row) => {
    event?.stopPropagation();
    openLoanDetail(row, 0);
  };

  const handleMakePaymentClick = (event, row) => {
    event?.stopPropagation();
    openLoanDetail(row, 1);
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
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={(event) => handleViewStatementClick(event, params.row)}
          >
            Statement
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={(event) => handleMakePaymentClick(event, params.row)}
          >
            Pay
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="loan status tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Loans" value="all" />
          <Tab label="Active" value="active" />
          <Tab label="Closed" value="closed" />
          <Tab label="Written Off" value="written_off" />
          <Tab label="Voided" value="voided" />
        </Tabs>
      </Box>
      <CollectionsTemplate
        title="Loans"
        createButtonText="Add Loan"
        items={filteredRows}
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
      ></CollectionsTemplate>

      <CustomSlider
        open={loanDetailOpen}
        onClose={closeLoanDetail}
        title={
          detailLoanRow
            ? `Loan ${detailLoanRow.loanNumber || detailLoanRow.id}`
            : "Loan Detail"
        }
        showEdit={false}
        showDelete={false}
        showPdf={false}
        maxWidth="lg"
        fullWidth
      >
        {detailLoanRow && (
          <LoanDetail
            loanId={detailLoanRow.id}
            onClose={closeLoanDetail}
            initialTab={detailInitialTab}
          />
        )}
      </CustomSlider>

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

      {/* Loan Creation Options Slider (omit title when showing create form inside) */}
      <CustomSlider
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
        /* title intentionally omitted so CreateLoan can control its heading */
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
