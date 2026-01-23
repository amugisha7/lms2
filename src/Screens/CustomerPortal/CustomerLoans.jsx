import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Paper, Button, Chip } from "@mui/material";
import { generateClient } from "aws-amplify/api";
import { useNavigate, useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { CustomerContext } from "../../CustomerApp";
import { formatMoney } from "../../Resources/formatting";

export default function CustomerLoans() {
  const { borrower, institution } = useContext(CustomerContext);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { institutionId } = useParams();

  useEffect(() => {
    const fetchLoans = async () => {
      if (!borrower) {
        setLoading(false);
        return;
      }

      const client = generateClient();

      try {
        let allLoans = [];
        let nextToken = null;

        while (true) {
          const result = await client.graphql({
            query: `query ListLoans($filter: ModelLoanFilterInput, $nextToken: String) {
              listLoans(filter: $filter, nextToken: $nextToken) {
                items {
                  id
                  loanNumber
                  principal
                  loanStatusEnum
                  approvalStatusEnum
                  startDate
                  maturityDate
                  loanCurrency
                  createdAt
                }
                nextToken
              }
            }`,
            variables: {
              filter: {
                borrowerID: { eq: borrower.id },
              },
              nextToken,
            },
          });

          const items = result?.data?.listLoans?.items || [];
          allLoans.push(...items);

          nextToken = result?.data?.listLoans?.nextToken;
          if (!nextToken) break;
        }

        setLoans(allLoans);
      } catch (err) {
        console.error("Error fetching loans:", err);
      }

      setLoading(false);
    };

    fetchLoans();
  }, [borrower]);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "success";
      case "DRAFT":
      case "PENDING":
        return "warning";
      case "CLOSED":
      case "PAID_OFF":
        return "default";
      case "DEFAULTED":
      case "WRITTEN_OFF":
        return "error";
      default:
        return "default";
    }
  };

  const columns = [
    {
      field: "loanNumber",
      headerName: "Loan Number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "principal",
      headerName: "Amount",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return formatMoney(params.value, params.row.loanCurrency || "");
      },
    },
    {
      field: "loanStatusEnum",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value || "N/A"}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: "approvalStatusEnum",
      headerName: "Approval",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value || "N/A"}
          color={getStatusColor(params.value)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        if (!params.value) return "N/A";
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() =>
            navigate(`/client/${institutionId}/loans/${params.row.id}`)
          }
        >
          View
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!borrower) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          My Loans
        </Typography>
        <Paper sx={{ p: 3, bgcolor: "warning.light" }}>
          <Typography>
            Please complete your profile to view your loans.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My Loans
      </Typography>

      {loans.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography>
            You don't have any loans yet. Apply for a loan to get started.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate(`/client/${institutionId}/apply`)}
          >
            Apply for Loan
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ p: 2, height: 600 }}>
          <DataGrid
            rows={loans}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            loading={loading}
            sx={{
              border: "none",
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid rgba(224, 224, 224, 0.4)",
              },
            }}
          />
        </Paper>
      )}
    </Box>
  );
}
