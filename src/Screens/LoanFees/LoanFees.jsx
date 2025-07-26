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

const CATEGORY_LABELS = {
  non_deductable: "Non-Deductable Fee",
  deductable: "Deductable Fee",
  capitalized: "Capitalized Fee",
};

const CALCULATION_LABELS = {
  fixed: "Fixed",
  percentage: "Percentage (%)",
};

export default function LoanFees() {
  const [loanFees, setLoanFees] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
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
                  percentageBase
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

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 220,
      renderCell: (params) => (
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
    },
    {
      field: "percentageBase",
      headerName: "% Base",
      width: 120,
    },
    {
      field: "category",
      headerName: "Category",
      width: 160,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
    },
    {
      field: "actions",
      headerName: "",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" sx={{ mr: 1 }}>
            <EditIcon fontSize="small" color="primary" />
          </IconButton>
          <IconButton size="small">
            <DeleteIcon fontSize="small" color="error" />
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
            sx={{
              "& .MuiDataGrid-cell": {
                borderBottom: `1px solid ${
                  theme.palette.primary?.gridBottomBorder || "#e0e0e0"
                }`,
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
