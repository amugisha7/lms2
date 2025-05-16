import './App.css';
import Onboarding from './Screens/Onboarding/Onboarding';
import Dashboard from './muiTemplates/dashboard/Dashboard';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { createContext, useEffect, useState } from 'react';
import { NotificationProvider } from './ComponentAssets/NotificationContext';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { SnackbarProvider } from './ComponentAssets/SnackbarContext';
import { generateClient } from 'aws-amplify/api';
import myLogo from './Resources/loantabs_logo.png'; // Add this import at the top

function App({ signOut, user }) {
  const [checking, setChecking] = useState(true);
  const [userExists, setUserExists] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        setChecking(false);
        setUserExists(false);
        setUserDetails(null);
        return;
      }
      try {
        const client = generateClient();
        const res = await client.graphql({
          query: `query GetUser($id: ID!) { 
            getUser(id: $id) { 
              id 
              userType 
              status 
              institutionUsersId 
              branchUsersId 
            } 
          }`,
          variables: { id: user.userId }
        });
        const userData = res.data.getUser;
        setUserExists(!!userData);
        setUserDetails(userData || null);
      } catch (err) {
        setUserExists(false);
        setUserDetails(null);
      } finally {
        setChecking(false);
      }
    };
    checkUser();
  }, [user]);

  if (checking) {
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

  return (
    <UserContext.Provider value={{ signOut, user, userDetails }}>
      <SnackbarProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/" element={userExists ? <Navigate to="/dashboard" replace /> : <Onboarding />} />
              <Route path="/dashboard" element={userExists ? <Dashboard /> : <Navigate to="/" replace />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </SnackbarProvider>
    </UserContext.Provider>
  );
}
export const UserContext = createContext();

export default withAuthenticator(App);