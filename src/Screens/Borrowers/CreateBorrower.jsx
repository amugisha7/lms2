import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CreateBorrowerForm from './CreateBorrowerForm';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';

export default function CreateBorrower() {
  const [tab, setTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
        variant="h4" 
        sx={{ mb: 2, fontWeight: 600,}}
      >
        CREATE A NEW BORROWER
      </Typography>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant='scrollable'
        scrollButtons="auto"
        sx={{
          borderBottom: 1,
          borderColor: colors.blueAccent[600],
          mb: 2,
          '& .MuiTabs-indicator': {
            backgroundColor: colors.blueAccent[100], // Blue accent indicator
            height: 4,
            // borderRadius: 1,
          },
          '& .MuiTab-root.Mui-selected': {
            color: colors.blueAccent[100] + ' !important', // Active tab text color
          },
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