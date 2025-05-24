import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CreateCustomFieldsForm from './CreateCustomFieldsForm';

export default function CreateBorrower() {
  const [tab, setTab] = useState(0); 

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

      }}
    >
      <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
        Custom Fields Manager
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
        <Tab sx={{mx: 1}} label="CREATE" />
        <Tab sx={{mx: 1}} label="MODIFY" />
      </Tabs>
      <Box sx={{ mt: 0 }}>
        {tab === 0 && <CreateCustomFieldsForm />}
        {tab === 1 && (
          <Button variant="contained" onClick={handleBackToDetails}>
            You must first create the borrower
          </Button>
        )}
      </Box>
    </Box>
  );
}