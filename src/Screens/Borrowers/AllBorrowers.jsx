import { Box, Typography } from '@mui/material'
import { 
  DataGrid, 
  ExportCsv, 
  QuickFilter
} from '@mui/x-data-grid'
import React, { useEffect, useState, useContext } from 'react'
import { generateClient } from 'aws-amplify/api'
import { UserContext } from '../../App'
import CustomToolbar from '../../ComponentAssets/CustomToolbar'
import DownloadIcon from '@mui/icons-material/Download';

function myToolbar() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pr: 2,
      }}
    >
      <Box sx={{ maxWidth: 300, width: '100%' }}>
        <CustomToolbar />
      </Box>
      <Box
        sx={{
          maxWidth: 300,
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          '@media (max-width:600px)': { display: 'none' }, // Hide on mobile
        }}
      >
        <ExportCsv>
          <DownloadIcon />
        </ExportCsv>
      </Box>
    </Box>
  );
}

function AllBorrowers() {
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userDetails } = useContext(UserContext);

  const columns = [
    { 
      field: 'combinedName', 
      headerName: 'Full Name / Business Name', 
      width: 300,
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
      width: 120 
    }
  ];

  useEffect(() => {
    const fetchBorrowers = async () => {
      try {
        const client = generateClient();
        const response = await client.graphql({
          query: `
            query ListBorrowers($branchId: ID!) {
              listBorrowers(filter: { branchBorrowersId: { eq: $branchId } }) {
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
          `,
          variables: {
            branchId: userDetails.branchUsersId
          }
        });
        const fetchedBorrowers = response.data?.listBorrowers?.items || [];
        const processedBorrowers = fetchedBorrowers.map(borrower => ({
          ...borrower,
          combinedName: (borrower.firstname || borrower.othername)
            ? `${[borrower.firstname, borrower.othername].filter(Boolean).join(' ')}${borrower.businessName ? ` / ${borrower.businessName}` : ''}`
            : borrower.businessName || ''
        }));
        
        setBorrowers(processedBorrowers);
      } catch (error) {
        console.error('Error fetching borrowers:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userDetails?.branchUsersId) {
      fetchBorrowers();
    }
  }, [userDetails]);

  return (
    <Box sx={{width: '100%', maxWidth: { sm: '100%', md: '1200px' } }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
           View/Manage Borrowers
        </Typography>
        {borrowers.length > 0 && (
          <DataGrid
            rows={borrowers}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 25,
                },
              },
            }}
            pageSizeOptions={[25, 50, 100]}
            slots={{ toolbar: myToolbar }}
            showToolbar
          />
        )}
    </Box>
  )
}

export default AllBorrowers