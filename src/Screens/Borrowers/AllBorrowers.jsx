import { Box, Typography, IconButton } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react'
import { generateClient } from 'aws-amplify/api'
import { UserContext } from '../../App'
import CustomToolbar from '../../ComponentAssets/CustomToolbar'
import { 
  DataGrid, 
  ExportCsv, 
  QuickFilter
} from '@mui/x-data-grid'
import DownloadIcon from '@mui/icons-material/Download';
import Button from '@mui/material/Button';
import {useTheme} from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add'; // Add this import

function MyToolbar() {

  const theme = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pr: 2,
        backgroundColor: theme.palette.primary.mainbgd, // Use mainbgd from theme
      }}
    >
      <Box sx={{ maxWidth: 300, width: '100%' }}>
        <CustomToolbar />
      </Box>
      <Box
        sx={{
          maxWidth: 20,
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          '@media (max-width:600px)': { display: 'none' }, // Hide on mobile
        }}
      >
        <ExportCsv render={<DownloadIcon sx={{ 
          fontSize: 20, 
          cursor: 'pointer',
          color: theme.palette.blueText.main, // Use blueText from theme
          }} />}>
        </ExportCsv>
      </Box>
    </Box>
  );
}

function AllBorrowers() {
  const navigate = useNavigate();
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userDetails } = useContext(UserContext);
  const theme = useTheme(); // <-- add this

  const columns = [
    { 
      field: 'combinedName', 
      headerName: 'Full Name / Business Name', 
      width: 280,
      renderCell: (params) => (
        <span
          style={{
            color: theme.palette.blueText.main,
            textDecoration: 'none',
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/viewBorrower/${params.row.id}`)}
          onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
        >
          {params.value}
        </span>
      ),
    },
    { 
      field: 'phoneNumber', 
      headerName: 'Phone No.', 
      width: 150 
    },
    { 
      field: 'otherPhoneNumber', 
      headerName: 'Alt. Phone No.', 
      width: 150 
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 200 
    },
    { 
      field: 'borrowerStatus', 
      headerName: 'Status', 
      width: 100 
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
            limit: 100
          }
        });

        const newBorrowers = response.data?.listBorrowers?.items || [];
        const updatedResults = [...accumulator, ...newBorrowers];
        
        if (response.data?.listBorrowers?.nextToken) {
          return fetchBorrowersPage(response.data.listBorrowers.nextToken, updatedResults);
        }

        return updatedResults;
      } catch (error) {
        console.error('Error fetching borrowers:', error);
        return accumulator;
      }
    };

    const initiateFetch = async () => {
      try {
        setLoading(true);
        const allBorrowers = await fetchBorrowersPage();
        const processedBorrowers = allBorrowers.map(borrower => ({
          ...borrower,
          combinedName: (borrower.firstname || borrower.othername)
            ? `${[borrower.firstname, borrower.othername].filter(Boolean).join(' ')}${borrower.businessName ? ` (${borrower.businessName})` : ''}`
            : borrower.businessName || ''
        }));
        // Sort by combinedName alphabetically (case-insensitive)
        processedBorrowers.sort((a, b) =>
          a.combinedName.localeCompare(b.combinedName, undefined, { sensitivity: 'base' })
        );
        setBorrowers(processedBorrowers);
      } catch (error) {
        console.error('Error processing borrowers:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userDetails?.branchUsersId) {
      initiateFetch();
    }
  }, [userDetails]);

  return (
    <Box sx={{width: '100%', maxWidth: { sm: '100%', md: '1200px' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
      <Typography variant="h4" sx={{ my: 2, fontWeight: 600 }}>
          View Borrowers
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon sx={{ color: theme.palette.blueText.main }} />}
          onClick={() => navigate('/addBorrower')}
          sx={{
            borderColor: theme.palette.blueText.main,
            color: theme.palette.blueText.main,
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: "transparent",
              borderColor: theme.palette.blueText.main,
              borderWidth: '2px', // Make border 2px on hover
            },
          }}
        >
          Create Borrower
        </Button>
      </Box>
      {loading ? (
        <Typography sx={{ mt: 4 }}>Loading borrowers...</Typography>
      ) : borrowers.length > 0 ? (
        <DataGrid
          rows={borrowers}
          columns={columns}
          density="compact"
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25,
              },
            },
          }}
          pageSizeOptions={[25, 50, 100]}
          slots={{ toolbar: MyToolbar }}
          showToolbar
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${theme.palette.primary.gridBottomBorder}`, // Use theme color for cell bottom border
            },
            '& .MuiDataGrid-columnHeaders': {
              // borderBottom: '2px solid #bdbdbd', // Slightly darker border for header
            },
          }}
        />
      ) : (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography>No borrowers found for this branch.</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate('/addBorrower')}
          >
            Add New Borrower
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default AllBorrowers