import * as React from 'react';
import Box from '@mui/material/Box';
import myLogo from '../Resources/loantabs_logo.png'; // Adjust path if needed
import { Typography } from '@mui/material';

export default function CustomIcon() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: '2rem',
          height: '2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          overflow: 'hidden',
        }}
      >
        <img
          src={myLogo}
          alt="LoanTabs Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </Box>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          color: 'text.primary',
          display: { xs: 'block', md: 'none' }, // Hide on desktop, show on mobile/tablet
        }}
      >
        LoanTabs
      </Typography>
    </Box>
  );
}