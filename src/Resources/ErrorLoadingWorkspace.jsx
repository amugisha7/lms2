import React from 'react';
import myLogo from './loantabs_logo.png';
import Button from '@mui/material/Button';

export default function ErrorLoadingWorkspace({ onSignOut }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#f7f9fb'
    }}>
      <img src={myLogo} alt="LoanTabs Logo" style={{ width: 80, marginBottom: 24 }} />
      <div style={{
        fontWeight: 600,
        fontSize: 22,
        color: '#b71c1c',
        marginBottom: 16
      }}>
        Error Loading Workspace
      </div>
      <div style={{
        color: '#333',
        fontSize: 16,
        marginBottom: 32,
        textAlign: 'center',
        maxWidth: 320
      }}>
        There was a problem loading your workspace.<br />
        Please sign out and try again.
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={onSignOut}
        sx={{ minWidth: 160 }}
      >
        Sign Out
      </Button>
    </div>
  );
}