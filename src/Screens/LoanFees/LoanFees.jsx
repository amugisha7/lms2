import React from "react";
import { generateClient } from "aws-amplify/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { UserContext } from "../../App"; // Add this import
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const CATEGORY_LABELS = {
  non_deductable: "Non-Deductable Fee",
  deductable: "Deductable Fee",
  capitalized: "Capitalized Fee",
};

const CALCULATION_LABELS = {
  fixed: "Fixed",
  percentage: "Percentage",
};

const PERCENTAGE_BASE_LABELS = {
  principal: "Principal",
  interest: "Interest",
  principal_interest: "Principal + Interest",
};

const CATEGORY_OPTIONS = [
  { value: "non_deductable", label: "Non-Deductable Fee" },
  { value: "deductable", label: "Deductable Fee" },
  { value: "capitalized", label: "Capitalized Fee" },
];

const CALCULATION_OPTIONS = [
  { value: "fixed", label: "Fixed" },
  { value: "percentage", label: "Percentage" },
];

const PERCENTAGE_BASE_OPTIONS = [
  { value: "principal", label: "Principal Amount" },
  { value: "interest", label: "Interest Amount" },
  {
    value: "principal_interest",
    label: "Principal + Interest",
  },
];

export default function LoanFees() {
  const [loanFees, setLoanFees] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [editRowId, setEditRowId] = React.useState(null);
  const [editRowData, setEditRowData] = React.useState({});
  const theme = useTheme();
  const { userDetails } = React.useContext(UserContext); // Get userDetails from context

  React.useEffect(() => {
    const fetchLoanFees = async () => {
      setLoading(true);
      try {
        const client = generateClient();
        if (!userDetails?.institutionUsersId) {
          setLoanFees([]);
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
                  institutionLoanFeesConfigsId
                }
              }
            }
          `,
          variables: {
            institutionId: userDetails.institutionUsersId,
          },
        });
        setLoanFees(result.data.listLoanFeesConfigs.items || []);
        console.log(
          "result.data.listLoanFeesConfigs.items::: ",
          result.data.listLoanFeesConfigs.items
        );
      } catch (err) {
        setLoanFees([]);
      } finally {
        setLoading(false);
      }
    };
    if (userDetails?.institutionUsersId) {
      fetchLoanFees();
    }
  }, []);

  const handleEditClick = (row) => {
    setEditRowId(row.id);
    setEditRowData({ ...row });
  };

  const handleEditChange = (field, value) => {
    setEditRowData((prev) => ({ ...prev, [field]: value }));
    // If calculationMethod changes, reset percentageBase if needed
    if (field === "calculationMethod" && value !== "percentage") {
      setEditRowData((prev) => ({ ...prev, percentageBase: "" }));
    }
  };

  const handleEditCancel = () => {
    setEditRowId(null);
    setEditRowData({});
  };

  const handleEditSave = async () => {
    // TODO: Add API call to update the row in backend
    // For now, update locally
    setLoanFees((prev) =>
      prev.map((fee) =>
        fee.id === editRowId ? { ...fee, ...editRowData } : fee
      )
    );
    setEditRowId(null);
    setEditRowData({});
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 220,
      renderCell: (params) =>
        editRowId === params.row.id ? (
          <TextField
            size="small"
            value={editRowData.name || ""}
            onChange={(e) => handleEditChange("name", e.target.value)}
            sx={{ width: 180 }}
            InputProps={{ sx: { fontSize: "0.8rem" } }}
          />
        ) : (
          <span
            style={{
              color: theme.palette.blueText?.main || "#1976d2",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            {params.value}
          </span>
        ),
    },
    {
      field: "calculationMethod",
      headerName: "Calculation",
      width: 140,
      renderCell: (params) =>
        editRowId === params.row.id ? (
          <TextField
            select
            size="small"
            value={editRowData.calculationMethod || ""}
            onChange={(e) =>
              handleEditChange("calculationMethod", e.target.value)
            }
            sx={{ width: 120 }}
            InputProps={{ sx: { fontSize: "0.8rem" } }}
            SelectProps={{ sx: { fontSize: "0.8rem" } }}
          >
            {CALCULATION_OPTIONS.map((opt) => (
              <MenuItem
                key={opt.value}
                value={opt.value}
                sx={{
                  "&:hover": {
                    color: "white",
                  },
                  fontSize: "0.8rem",
                }}
              >
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          CALCULATION_LABELS[params.value] || params.value
        ),
    },
    {
      field: "percentageBase",
      headerName: "% Base",
      width: 120,
      renderCell: (params) =>
        editRowId === params.row.id ? (
          <TextField
            select
            size="small"
            value={editRowData.percentageBase || ""}
            onChange={(e) => handleEditChange("percentageBase", e.target.value)}
            sx={{ width: 110 }}
            disabled={editRowData.calculationMethod !== "percentage"}
            InputProps={{ sx: { fontSize: "0.8rem" } }}
            SelectProps={{ sx: { fontSize: "0.8rem" } }}
          >
            {PERCENTAGE_BASE_OPTIONS.map((opt) => (
              <MenuItem
                key={opt.value}
                value={opt.value}
                sx={{
                  "&:hover": {
                    color: "white",
                  },
                  fontSize: "0.8rem",
                }}
              >
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          PERCENTAGE_BASE_LABELS[params.value] || params.value
        ),
    },
    {
      field: "category",
      headerName: "Category",
      width: 160,
      renderCell: (params) =>
        editRowId === params.row.id ? (
          <TextField
            select
            size="small"
            value={editRowData.category || ""}
            onChange={(e) => handleEditChange("category", e.target.value)}
            sx={{ width: 150 }}
            InputProps={{ sx: { fontSize: "0.8rem" } }}
            SelectProps={{ sx: { fontSize: "0.8rem" } }}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <MenuItem
                key={opt.value}
                value={opt.value}
                sx={{
                  "&:hover": {
                    color: "white",
                  },
                  fontSize: "0.8rem",
                }}
              >
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          CATEGORY_LABELS[params.value] || params.value
        ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
    },
    {
      field: "actions",
      headerName: "",
      width: 140,
      sortable: false,
      renderCell: (params) =>
        editRowId === params.row.id ? (
          <Box>
            <IconButton size="small" sx={{ mr: 1 }} onClick={handleEditSave}>
              <CheckCircleIcon fontSize="small" sx={{ color: "green" }} />
            </IconButton>
            <IconButton size="small" onClick={handleEditCancel}>
              <CancelIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Box>
            <IconButton
              size="small"
              sx={{ mr: 1 }}
              onClick={() => handleEditClick(params.row)}
            >
              <EditIcon
                fontSize="small"
                sx={{ color: theme.palette.blueText?.main }}
              />
            </IconButton>
            <IconButton size="small">
              <DeleteIcon fontSize="small" sx={{ color: "red" }} />
            </IconButton>
          </Box>
        ),
    },
  ];

  return (
    <Box
      sx={{
        mx: { xs: 0, sm: "auto" },
        mt: { xs: 0, sm: 0 },
        p: { xs: 0, sm: 0 },
        borderRadius: 1,
        display: "flex",
        flexDirection: "column",
        maxWidth: { xs: "100%", md: 1000 },
        width: "100%",
        flex: 1,
        mb: 6,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: 600, my: 2, textTransform: "none" }}
      >
        Loan Fees{" "}
        <Typography variant="caption" sx={{ color: "#90a4ae" }}>
          Help
        </Typography>
      </Typography>
      <Link to="/admin">
        <Typography variant="caption" sx={{ mb: 2, display: "inline-block" }}>
          Back to Admin
        </Typography>
      </Link>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          variant="contained"
          color="success"
          sx={{ mb: 2 }}
          component={Link}
          to="/admin/add-loan-fee"
        >
          Add Loan Fee
        </Button>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 220 }}
        />
      </Box>
      <Box sx={{ height: 520, width: "100%" }}>
        {loading ? (
          <Typography sx={{ mt: 4 }}>Loading loan fees...</Typography>
        ) : (
          <DataGrid
            rows={loanFees}
            columns={columns}
            getRowId={(row) => row.id}
            density="compact"
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 25,
                },
              },
            }}
            pageSizeOptions={[25, 50, 100]}
            disableRowSelectionOnClick
            getRowHeight={(params) =>
              params.id === editRowId ? 50 : undefined
            }
            getRowClassName={(params) =>
              params.id === editRowId ? "editing-row" : ""
            }
            sx={{
              "& .MuiDataGrid-cell": {
                borderBottom: `1px solid ${
                  theme.palette.primary?.gridBottomBorder || "#e0e0e0"
                }`,
              },
              "& .editing-row": {
                paddingTop: "3px",
                paddingBottom: "3px",
              },
              "& .MuiDataGrid-columnHeaders": {
                // borderBottom: '2px solid #bdbdbd',
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
}
