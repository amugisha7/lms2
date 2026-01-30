import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import { generateClient } from "aws-amplify/api";
import { useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { CustomerContext } from "../../CustomerApp";
import { formatMoney } from "../../Resources/formatting";

export default function CustomerApplications() {
  const { borrower, institution } = useContext(CustomerContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { institutionId } = useParams();

  useEffect(() => {
    const fetchApplications = async () => {
      if (!borrower) {
        setLoading(false);
        return;
      }

      const client = generateClient();

      try {
        let allApplications = [];
        let nextToken = null;

        // Query loans with DRAFT status (not yet disbursed) for this borrower
        while (true) {
          const result = await client.graphql({
            query: `query LoansByBorrowerIDAndStartDate(
              $borrowerID: ID!
              $sortDirection: ModelSortDirection
              $filter: ModelLoanFilterInput
              $limit: Int
              $nextToken: String
            ) {
              loansByBorrowerIDAndStartDate(
                borrowerID: $borrowerID
                sortDirection: $sortDirection
                filter: $filter
                limit: $limit
                nextToken: $nextToken
              ) {
                items {
                  id
                  loanNumber
                  principal
                  interestRate
                  loanStatusEnum
                  approvalStatusEnum
                  startDate
                  loanCurrency
                  loanComputationRecord
                  createdAt
                }
                nextToken
              }
            }`,
            variables: {
              borrowerID: borrower.id,
              sortDirection: "DESC",
              filter: {
                loanStatusEnum: { eq: "DRAFT" },
              },
              limit: 100,
              nextToken,
            },
          });

          const items = result?.data?.loansByBorrowerIDAndStartDate?.items || [];
          allApplications.push(...items);

          nextToken = result?.data?.loansByBorrowerIDAndStartDate?.nextToken;
          if (!nextToken) break;
        }

        setApplications(allApplications);
      } catch (err) {
        console.error("Error fetching applications:", err);
      }

      setLoading(false);
    };

    fetchApplications();
  }, [borrower]);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "success";
      case "PENDING":
        return "warning";
      case "DRAFT":
        return "info";
      case "REJECTED":
        return "error";
      default:
        return "default";
    }
  };

  const getApprovalLabel = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "Approved";
      case "PENDING":
        return "Pending Review";
      case "REJECTED":
        return "Rejected";
      default:
        return status || "Pending";
    }
  };

  const columns = [
    {
      field: "loanNumber",
      headerName: "Application ID",
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
      field: "interestRate",
      headerName: "Interest Rate",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        if (params.value === null || params.value === undefined) return "N/A";
        return `${params.value}%`;
      },
    },
    {
      field: "approvalStatusEnum",
      headerName: "Status",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Chip
          label={getApprovalLabel(params.value)}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Applied Date",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        if (!params.value) return "N/A";
        return new Date(params.value).toLocaleDateString();
      },
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
          My Applications
        </Typography>
        <Paper sx={{ p: 3, bgcolor: "warning.light" }}>
          <Typography>
            Please complete your profile to view your loan applications.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My Applications
      </Typography>

      {applications.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography>
            You don't have any pending loan applications.
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 2, height: 600 }}>
          <DataGrid
            rows={applications}
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
