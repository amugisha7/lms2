import React from 'react';
import NavBar from '../ComponentAssets/Menu/NavBar';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

function Home() {
  return (
    <>
      <NavBar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column', // <-- add this
          flex: 1,                 // <-- add this
          backgroundColor: 'background.default',
          minHeight: '100vh',
          width: '100%',
          p:2
        }}>
          <Outlet />
      </Box>
    </>
  );
}

export default Home;