import React, { useState, useEffect, useContext, useRef } from "react";
import { generateClient } from "aws-amplify/api";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

import CollectionsTemplate, {
  EditClickedContext,
} from "../../ModelAssets/CollectionsTemplate";
import ClickableText from "../../ModelAssets/ClickableText";
import CustomSlider from "../../ModelAssets/CustomSlider";
import { UserContext } from "../../App";
import CreateLoanFeesForm from "./CreateLoanFeesForm";
import EditLoanFeesForm from "./EditLoanFeesForm";

const CATEGORY_LABELS = {
  non_deductable: "Non-Deductable Fee",
  deductable: "Deductable Fee",
  capitalized: "Capitalized Fee",
};

const CALCULATION_LABELS = {
  fixed: "Fixed",
  percentage: "%",
};

const PERCENTAGE_BASE_LABELS = {
  principal: "Principal",
  interest: "Interest",
  principal_interest: "(Principal + Interest)",
};

const LIST_LOAN_PRODUCT_LOAN_FEES_CONFIGS_QUERY = `
  query ListLoanProductLoanFeesConfigs($filter: ModelLoanProductLoanFeesConfigFilterInput) {
    listLoanProductLoanFeesConfigs(filter: $filter) {
      items {
        id
      }
    }
  }
`;

const DELETE_LOAN_PRODUCT_LOAN_FEES_CONFIG_MUTATION = `
  mutation DeleteLoanProductLoanFeesConfig($input: DeleteLoanProductLoanFeesConfigInput!) {
    deleteLoanProductLoanFeesConfig(input: $input)
  }
`;

export default function LoanFees() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userDetails } = useContext(UserContext);
  const theme = useTheme();

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogRow, setEditDialogRow] = useState(null);
  const [deleteDialogRow, setDeleteDialogRow] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // View dialog states (CustomSlider for view-only mode)
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedLoanFee, setSelectedLoanFee] = useState(null);
  const [editClicked, setEditClicked] = useState(false);
  const formRef = useRef();

  // Popover state for info icon
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [popoverContent, setPopoverContent] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const client = generateClient();
      if (!userDetails?.institutionUsersId) {
        setItems([]);
        setLoading(false);
        return;
      }
      const result = await client.graphql({
        query: `
            query ListLoanFeesConfigs($institutionId: ID!) {
              listLoanFeesConfigs(
                filter: { institutionLoanFeesConfigsId: { eq: $institutionId } }
                limit: 100
              ) {
                items {
                  id
                  name
                  calculationMethod
                  category
                  status
                  description
                  percentageBase
                  rate
                }
              }
            }
          `,
        variables: {
          institutionId: userDetails.institutionUsersId,
        },
      });
      setItems(result.data.listLoanFeesConfigs.items || []);
    } catch (err) {
      console.error("Error fetching loan fees", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userDetails?.institutionUsersId) {
      fetchItems();
    }
  }, [userDetails?.institutionUsersId]);

  const handleCreateSuccess = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
    setCreateDialogOpen(false);
  };

  const handleEditSuccess = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setEditDialogOpen(false);
  };

  const initiateDelete = (row) => {
    setDeleteDialogRow(row);
    setDeleteDialogOpen(true);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const client = generateClient();

      // Clear relationships first
      const loanProductFeesResult = await client.graphql({
        query: LIST_LOAN_PRODUCT_LOAN_FEES_CONFIGS_QUERY,
        variables: { filter: { loanFeesConfigId: { eq: deleteDialogRow.id } } },
      });
      const relations =
        loanProductFeesResult.data.listLoanProductLoanFeesConfigs.items;
      
      for (const item of relations) {
        await client.graphql({
          query: DELETE_LOAN_PRODUCT_LOAN_FEES_CONFIG_MUTATION,
          variables: { input: { id: item.id } },
        });
      }

      await client.graphql({
        query: `
          mutation DeleteLoanFeesConfig($input: DeleteLoanFeesConfigInput!) {
            deleteLoanFeesConfig(input: $input) {
              id
            }
          }
        `,
        variables: {
          input: { id: deleteDialogRow.id },
        },
      });

      setItems((prev) => prev.filter((item) => item.id !== deleteDialogRow.id));
      setDeleteDialogOpen(false);
      setDeleteDialogRow(null);
    } catch (err) {
      console.error("Error deleting loan fee:", err);
      setDeleteError("Failed to delete. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleInfoClick = (event, description) => {
    setPopoverAnchorEl(event.currentTarget);
    setPopoverContent(description);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
    setPopoverContent("");
  };

  // Handle clicking on a loan fee to view details
  const handleLoanFeeClick = (loanFee) => {
    setSelectedLoanFee(loanFee);
    setViewDialogOpen(true);
    setEditClicked(false);
  };

  // Handle closing the view dialog
  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setSelectedLoanFee(null);
    setEditClicked(false);
  };

  // Handle edit click in the slider
  const handleEditClick = () => {
    setEditClicked(true);
    if (formRef.current?.toggleEdit) {
      formRef.current.toggleEdit();
    }
  };

  // Handle successful edit from view mode
  const handleViewEditSuccess = (updatedLoanFee) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedLoanFee.id ? updatedLoanFee : item))
    );
    setEditClicked(false);
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 250,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <ClickableText
            onClick={() => {
              handleLoanFeeClick(params.row);
            }}
          >
            {params.value}
          </ClickableText>
          {params.row.description && (
            <IconButton
              size="small"
              onClick={(e) => handleInfoClick(e, params.row.description)}
              sx={{ ml: 1 }}
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 220,
      renderCell: (params) => {
        const currency = userDetails?.institution?.currencyCode || "$";
        const value =
          params.row.rate !== undefined && params.row.rate !== null
            ? Number(params.row.rate).toLocaleString()
            : "-";
        if (params.row.calculationMethod === "percentage") {
          const base =
            PERCENTAGE_BASE_LABELS[params.row.percentageBase] ||
            params.row.percentageBase ||
            "";
          return value !== "-" ? `${value}% of ${base}` : "-";
        }
        if (params.row.calculationMethod === "fixed") {
          return value !== "-" ? `${currency} ${value}` : "-";
        }
        return "-";
      },
    },
    {
      field: "calculationMethod",
      headerName: "Type",
      width: 70,
      renderCell: (params) => CALCULATION_LABELS[params.value] || params.value,
    },
    {
      field: "category",
      headerName: "Category",
      width: 160,
      renderCell: (params) => CATEGORY_LABELS[params.value] || params.value,
    },
    {
      field: "status",
      headerName: "Status",
      width: 80,
      renderCell: (params) =>
        params.value
          ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
          : "",
    },
  ];

  return (
    <>
      <CollectionsTemplate
        title="Loan Fees"
        createButtonText="Add Loan Fee"
        items={items}
        loading={loading}
        columns={columns}
        searchFields={["name"]}
        noDataMessage="No Loan Fees found"
        
        // Create
        onCreateClick={() => setCreateDialogOpen(true)}
        createDialogOpen={createDialogOpen}
        onCreateDialogClose={() => setCreateDialogOpen(false)}
        createDialogTitle="Create Loan Fee"
        CreateFormComponent={CreateLoanFeesForm}
        createFormProps={{
            onSuccess: handleCreateSuccess,
            onClose: () => setCreateDialogOpen(false)
        }}

        // Edit
        editDialogOpen={editDialogOpen}
        editDialogRow={editDialogRow}
        onEditDialogClose={() => setEditDialogOpen(false)}
        EditFormComponent={EditLoanFeesForm}
        editFormProps={{
            onSuccess: handleEditSuccess,
            onClose: () => setEditDialogOpen(false)
        }}

        // Delete
        deleteDialogOpen={deleteDialogOpen}
        onDeleteDialogClose={() => setDeleteDialogOpen(false)}
        onDeleteConfirm={handleDeleteConfirm}
        deleteLoading={deleteLoading}
        deleteError={deleteError}
        deleteDialogRow={deleteDialogRow}
      />
      
      <Popover
        open={Boolean(popoverAnchorEl)}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2, maxWidth: 350, fontSize: "0.875rem" }}>
          {popoverContent}
        </Typography>
      </Popover>

      {/* View/Edit Loan Fee Slider */}
      <EditClickedContext.Provider value={{ editClicked, setEditClicked }}>
        {selectedLoanFee && (
          <CustomSlider
            open={viewDialogOpen}
            onClose={handleViewDialogClose}
            title={selectedLoanFee.name || "Loan Fee Details"}
            onEdit={handleEditClick}
            showEdit={true}
            showDelete={false}
            showPdf={false}
            editMode={editClicked}
          >
            <EditLoanFeesForm
              ref={formRef}
              initialValues={selectedLoanFee}
              onSuccess={handleViewEditSuccess}
              onClose={handleViewDialogClose}
              isEditMode={true}
            />
          </CustomSlider>
        )}
      </EditClickedContext.Provider>
    </>
  );
}
