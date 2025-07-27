import "./App.css";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { createContext, useEffect, useState } from "react";
import { NotificationProvider } from "./ComponentAssets/NotificationContext";
import { SnackbarProvider } from "./ComponentAssets/SnackbarContext";
import { generateClient } from "aws-amplify/api";
import AppRoutes from "./Routes";
import LoadingScreen from "./Resources/LoadingScreen";
import ErrorLoadingWorkspace from "./Resources/ErrorLoadingWorkspace";
import NoInternet from "./Resources/NoInternet";
import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider } from "@mui/material";

// Create UserContext once at the top level
export const UserContext = createContext();

function App({ signOut, user }) {
  const [checking, setChecking] = useState(true);
  const [userExists, setUserExists] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(false);
  const [online, setOnline] = useState(window.navigator.onLine);

  const [theme, colorMode] = useMode();

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      let retries = 3;
      while (retries > 0) {
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
                institution {
                  name
                  currencyCode
                }
              } 
            }`,
            variables: { id: user.userId },
          });
          const userData = res.data.getUser;
          setUserDetails(userData || null);
          setError(false);
          setUserExists(!!userData?.id);
          setChecking(false);
          return; // Success - exit the retry loop
        } catch (err) {
          console.log("Error fetching user:", err);
          retries--;
          if (retries === 0) {
            setError(true);
            setChecking(false);
            setUserExists(false); // Make sure to set userExists to false on error
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    };
    checkUser();
  }, [user?.userId]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <UserContext.Provider
          value={{ signOut, user, userDetails, setUserDetails }}
        >
          {checking && <LoadingScreen onSignOut={signOut} />}
          {!checking && (
            <SnackbarProvider>
              <NotificationProvider>
                {error ? (
                  <ErrorLoadingWorkspace onSignOut={signOut} />
                ) : (
                  <>
                    {!online && <NoInternet />}
                    <div style={{ display: online ? "block" : "none" }}>
                      <AppRoutes userExists={userExists} />
                    </div>
                  </>
                )}
              </NotificationProvider>
            </SnackbarProvider>
          )}
        </UserContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default withAuthenticator(App);
