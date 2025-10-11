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
import {
  LIST_MESSAGES_QUERY,
  SUBSCRIBE_TO_NEW_MESSAGES,
} from "./Screens/Messaging/messagingQueries";

// Create UserContext once at the top level
export const UserContext = createContext();

function App({ signOut, user }) {
  const [checking, setChecking] = useState(true);
  const [userExists, setUserExists] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(false);
  const [online, setOnline] = useState(window.navigator.onLine);
  const [allMessages, setAllMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [theme, colorMode] = useMode();

  const fetchMessages = async (userId) => {
    try {
      const client = generateClient();
      // Fetch messages where user is sender
      const sentResponse = await client.graphql({
        query: LIST_MESSAGES_QUERY,
        variables: {
          filter: { senderUserId: { eq: userId } },
          limit: 100,
        },
      });

      // Fetch messages where user is recipient
      const receivedResponse = await client.graphql({
        query: LIST_MESSAGES_QUERY,
        variables: {
          filter: { recipientUserId: { eq: userId } },
          limit: 100,
        },
      });

      const sent = sentResponse.data.listMessages.items || [];
      const received = receivedResponse.data.listMessages.items || [];

      // Combine and deduplicate
      const allMsgs = [...sent, ...received];
      const uniqueMessages = Array.from(
        new Map(allMsgs.map((msg) => [msg.id, msg])).values()
      );

      setAllMessages(uniqueMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

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
    const count = allMessages.filter(
      (m) => m.recipientUserId === userDetails?.id && m.status === "unread"
    ).length;
    setUnreadCount(count);
  }, [allMessages, userDetails?.id]);

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

  useEffect(() => {
    if (!userDetails?.id) return;

    fetchMessages(userDetails.id);

    const client = generateClient();
    const subscription = client
      .graphql({
        query: SUBSCRIBE_TO_NEW_MESSAGES,
        variables: { filter: { recipientUserId: { eq: userDetails.id } } },
      })
      .subscribe({
        next: ({ data }) => {
          const newMessage = data.onCreateMessage;
          setAllMessages((prev) => [newMessage, ...prev]);
        },
        error: (error) => {
          console.error("Subscription error:", error);
        },
      });

    return () => subscription.unsubscribe();
  }, [userDetails?.id]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <UserContext.Provider
          value={{
            signOut,
            user,
            userDetails,
            setUserDetails,
            allMessages,
            unreadCount,
          }}
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
