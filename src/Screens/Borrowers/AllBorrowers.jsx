import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../App";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import CustomDataGrid from "../../ComponentAssets/CustomDataGrid";
import ClickableText from "../../ComponentAssets/ClickableText"; // Add this import

function AllBorrowers() {
  const navigate = useNavigate();
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userDetails } = useContext(UserContext);
  const theme = useTheme();

  const columns = [
    {
      field: "combinedName",
      headerName: "Full Name / Business Name",
      width: 280,
      renderCell: (params) => (
        <ClickableText
          onClick={() => navigate(`/viewBorrower/${params.row.id}`)}
        >
          {params.value}
        </ClickableText>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "Phone No.",
      width: 150,
    },
    {
      field: "otherPhoneNumber",
      headerName: "Alt. Phone No.",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "borrowerStatus",
      headerName: "Status",
      width: 100,
    },
  ];

  useEffect(() => {
    const fetchBorrowersPage = async (nextToken = null, accumulator = []) => {
      try {
        const client = generateClient();
        const response = await client.graphql({
          query: `
            query ListBorrowers($branchId: ID!, $nextToken: String, $limit: Int) {
              listBorrowers(
                filter: { branchBorrowersId: { eq: $branchId } }
                nextToken: $nextToken
                limit: $limit
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
                nextToken
              }
            }
          `,
          variables: {
            branchId: userDetails.branchUsersId,
            nextToken,
            limit: 100,
          },
        });

        const newBorrowers = response.data?.listBorrowers?.items || [];
        const updatedResults = [...accumulator, ...newBorrowers];

        if (response.data?.listBorrowers?.nextToken) {
          return fetchBorrowersPage(
            response.data.listBorrowers.nextToken,
            updatedResults
          );
        }

        return updatedResults;
      } catch (error) {
        console.error("Error fetching borrowers:", error);
        return accumulator;
      }
    };

    const initiateFetch = async () => {
      try {
        setLoading(true);
        const allBorrowers = await fetchBorrowersPage();
        const processedBorrowers = allBorrowers.map((borrower) => ({
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
        // Sort by combinedName alphabetically (case-insensitive)
        processedBorrowers.sort((a, b) =>
          a.combinedName.localeCompare(b.combinedName, undefined, {
            sensitivity: "base",
          })
        );
        setBorrowers(processedBorrowers);
      } catch (error) {
        console.error("Error processing borrowers:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userDetails?.branchUsersId) {
      initiateFetch();
    }
  }, [userDetails]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Borrowers
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate("/addBorrower")}
          sx={{
            borderColor: theme.palette.blueText.main,
            color: theme.palette.blueText.main,
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "transparent",
              borderColor: theme.palette.blueText.main,
              borderWidth: "2px",
            },
          }}
        >
          Create Borrower
        </Button>
      </Box>
      {/* Show info text if no borrowers */}
      {!loading && borrowers.length === 0 && (
        <Typography
          sx={{ mb: 2, color: theme.palette.blueText?.main || "#1976d2" }}
        >
          No borrowers found for this branch.
        </Typography>
      )}
      {loading ? (
        <Typography sx={{ mt: 4 }}>Loading borrowers...</Typography>
      ) : (
        <CustomDataGrid
          rows={borrowers}
          columns={columns}
          getRowId={(row) => row.id}
          pageSize={25}
          pageSizeOptions={[25, 50, 100]}
          loading={loading}
        />
      )}
    </Box>
  );
}

export default AllBorrowers;
