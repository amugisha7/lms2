import React from 'react';
import myLogo from './loantabs_logo.png';

export default function NoInternet() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#f7f9fb',
      zIndex: 9999,
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw'
    }}>
      <img src={myLogo} alt="LoanTabs Logo" style={{ width: 80, marginBottom: 24 }} />
      <div style={{
        fontWeight: 600,
        fontSize: 22,
        color: '#b71c1c',
        marginBottom: 16
      }}>
        No Internet Connection
      </div>
      <div style={{
        color: '#333',
        fontSize: 16,
        marginBottom: 32,
        textAlign: 'center',
        maxWidth: 320
      }}>
        You are currently offline.<br />
        Please check your internet connection.<br />
        The workspace will be re-enabled once you are back online.
      </div>
    </div>
  );
}