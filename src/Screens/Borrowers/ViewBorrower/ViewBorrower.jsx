import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ViewBorrowerForm from './ViewBorrowerForm';
import { generateClient } from 'aws-amplify/api';
import Switch from '@mui/material/Switch';

export default function ViewBorrower() {
  const { borrowerId } = useParams();
  const [tab, setTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [borrower, setBorrower] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrower = async () => {
      if (!borrowerId) return;

      try {
        const client = generateClient();
        const response = await client.graphql({
          query: `
            query GetBorrower($borrowerId: ID!) {
              getBorrower(id: $borrowerId) {
                id
                firstname
                othername
                businessName
                typeOfBusiness
                uniqueIdNumber
                phoneNumber
                otherPhoneNumber
                email
                gender
                dateOfBirth
                nationality
                address
                city
                state
                zipcode
                employmentStatus
                employerName
                creditScore
                customFieldsData
                borrowerStatus
              }
            }
          `,
          variables: {
            borrowerId
          }
        });

        setBorrower(response.data.getBorrower);
      } catch (error) {
        console.error('Error fetching borrower:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrower();
  }, [borrowerId]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleBackToDetails = () => {
    setTab(0);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        maxWidth: { xs: '100%', md: 800 },
        mx: 'auto',
        width: '100%',

      }}
    >
      <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
        {borrower?.firstname || borrower?.othername
          ? `${borrower?.firstname || ''}${borrower?.othername ? ' ' + borrower.othername : ''}${borrower?.businessName ? ' / ' + borrower.businessName : ''}`
          : borrower?.businessName || 'View Borrower'}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Switch
          checked={editing}
          onChange={() => setEditing((prev) => !prev)}
          color="primary"
        />
        <Typography sx={{ ml: 1 }}>
          {editing ? "Editing Enabled" : "Editing Disabled"}
        </Typography>
      </Box>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        variant='scrollable'
        scrollButtons="auto"

        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          mb: 2,
          // '& .MuiTab-root': { color: '#fff' },
          // '& .Mui-selected': { color: '#1de9b6' }
        }}
      >
        <Tab sx={{mx: 1}} label="BORROWER DETAILS" />
        <Tab sx={{mx: 1}} label="DOCUMENTS" />
        <Tab sx={{mx: 1}} label="LOANS" />
      </Tabs>
      <Box sx={{ mt: 0 }}>
        {tab === 0 && <ViewBorrowerForm editing={editing} borrower={borrower} />}
        {tab === 1 && (
          <Button variant="contained" onClick={handleBackToDetails}>
            You must first create the borrower
          </Button>
        )}
        {tab === 2 && (
          <Button variant="contained" onClick={handleBackToDetails}>
            You must first create the borrower
          </Button>
        )}
      </Box>
    </Box>
  );
}