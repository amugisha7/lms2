import React, { useState, useEffect } from 'react';
import myLogo from './loantabs_logo.png';

export default function LoadingScreen({ onSignOut }) {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  const handleSignOut = () => {
    window.location.href = '/';
    onSignOut();
  };

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
        color: '#1a237e',
        marginBottom: 16
      }}>
        Loading your workspace...
      </div>
      <div className="lds-ring" style={{ display: 'inline-block', width: 64, height: 64 }}>
        <div style={{
          boxSizing: 'border-box',
          display: 'block',
          position: 'absolute',
          width: 48,
          height: 48,
          margin: 8,
          border: '6px solid #1976d2',
          borderRadius: '50%',
          animation: 'lds-ring 1.2s linear infinite',
          borderColor: '#1976d2 transparent transparent transparent'
        }} />
      </div>
      
      {showTimeout && (
        <div style={{ 
          marginTop: 24, 
          textAlign: 'center',
          maxWidth: 400
        }}>
          <p style={{ 
            color: '#666', 
            marginBottom: 16 
          }}>
            This is taking longer than usual. You may want to try signing out and back in.
          </p>
          <button
            onClick={handleSignOut}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            Sign Out
          </button>
        </div>
      )}
      
      <style>
        {`
          @keyframes lds-ring {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
          .lds-ring div {
            box-sizing: border-box;
            display: block;
            position: absolute;
            width: 48px;
            height: 48px;
            margin: 8px;
            border: 6px solid #1976d2;
            border-radius: 50%;
            animation: lds-ring 1.2s linear infinite;
            border-color: #1976d2 transparent transparent transparent;
          }
        `}
      </style>
    </div>
  );
}