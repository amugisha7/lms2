import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CreateBorrowerForm from './CreateBorrowerForm';

export default function CreateBorrower() {
  const [tab, setTab] = useState(0);
  const [editing, setEditing] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleBackToDetails = () => {
    setTab(0);
  };

  return (
    <Box
      sx={{
        maxWidth: { xs: '100%', md: 800 },
        mx: 'auto',
        width: '100%',
        flex: 1

      }}
    >
      <Typography 
        variant="h3" 
        sx={{ mb: 2, fontWeight: 600, color: (theme) => theme.palette.neutral.light  }}
      >
        Create a new Borrower
      </Typography>
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
        {tab === 0 && <CreateBorrowerForm editing={editing} />}
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