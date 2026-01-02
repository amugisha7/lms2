import "./App.css";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { createContext, useEffect, useState, useRef } from "react";
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
  LIST_NOTIFICATIONS_QUERY,
  SUBSCRIBE_TO_NEW_NOTIFICATIONS,
} from "./Screens/Notifications/notificationQueries";

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

  const checkedUserIds = useRef(new Set());
  const processedUserIds = useRef(new Set());

  const fetchMessages = async (userId) => {
    try {
      const client = generateClient();
      // Fetch messages where user is sender
      console.log("API Call: LIST_NOTIFICATIONS_QUERY sent messages", {
        senderUserId: userId,
      });
      const sentResponse = await client.graphql({
        query: LIST_NOTIFICATIONS_QUERY,
        variables: {
          filter: { senderUserId: { eq: userId } },
          limit: 100,
        },
      });

      // Fetch messages where user is recipient
      console.log("API Call: LIST_NOTIFICATIONS_QUERY received messages", {
        recipientUserId: userId,
      });
      const receivedResponse = await client.graphql({
        query: LIST_NOTIFICATIONS_QUERY,
        variables: {
          filter: { recipientUserId: { eq: userId } },
          limit: 100,
        },
      });

      const sent = sentResponse.data.listNotifications.items || [];
      const received = receivedResponse.data.listNotifications.items || [];

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
    if (checkedUserIds.current.has(user.userId)) return;

    const checkUser = async () => {
      let retries = 3;
      while (retries > 0) {
        try {
          const client = generateClient();
          console.log("API Call: GetUser", { id: user.userId });
          const res = await client.graphql({
            query: `query GetUser($id: ID!) { 
              getUser(id: $id) { 
                id
                firstName
                lastName
                middleName
                dateOfBirth
                phoneNumber1
                phoneNumber2
                email
                nationalID
                status
                userType
                userPermissions
                createdAt
                updatedAt
                institutionUsersId
                branchUsersId
                branch {
                  id
                  name
                  branchCode
                  address
                  status
                  createdAt
                  updatedAt
                  institutionBranchesId
                }
                institution {
                  id
                  name
                  currencyCode
                  subscriptionTier
                  subscriptionStatus
                  trialEndDate
                  nextBillingDate
                  stripeCustomerID
                  stripeSubscriptionID
                  defaultDateFormat
                  defaultCurrencyFormat
                  defaultLanguage
                  regulatoryRegion
                  maxUsers
                  maxBranches
                  maxStaffPerBranch
                  saccoFeaturesEnabled
                  staffManagementEnabled
                  payrollEnabled
                  collectionsModuleEnabled
                  customWorkflowsEnabled
                  advancedReportingEnabled
                  apiIntegrationSettings
                  status
                  createdAt
                  updatedAt
                }
              } 
            }`,
            variables: { id: user.userId },
          });
          console.log("GetUser response:", res);
          const userData = res.data.getUser;
          setUserDetails(userData || null);
          setError(false);
          setUserExists(!!userData?.id);
          setChecking(false);
          checkedUserIds.current.add(user.userId);
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
    if (processedUserIds.current.has(userDetails.id)) return;

    fetchMessages(userDetails.id);

    const client = generateClient();
    console.log("API Call: SUBSCRIBE_TO_NEW_NOTIFICATIONS", {
      recipientUserId: userDetails.id,
    });
    const notificationSubscription = client
      .graphql({
        query: SUBSCRIBE_TO_NEW_NOTIFICATIONS,
        variables: { filter: { recipientUserId: { eq: userDetails.id } } },
      })
      .subscribe({
        next: ({ data }) => {
          console.log(
            "Subscription received new message:",
            data.onCreateNotification
          );
          const newMessage = data.onCreateNotification;
          setAllMessages((prev) => [newMessage, ...prev]);
        },
        error: (error) => {
          console.error("Notification subscription error:", error);
        },
      });

    console.log("API Call: SUBSCRIBE_TO_USER_UPDATES", {
      id: userDetails.id,
    });
    const userUpdateSubscription = client
      .graphql({
        query: `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      id
      firstName
      lastName
      middleName
      dateOfBirth
      phoneNumber1
      phoneNumber2
      email
      addressLine1
      addressLine2
      city
      stateProvince
      postalCode
      nationalID
      passportNumber
      status
      userType
      userPermissions
      description
      institution {
        id
        name
        currencyCode
        subscriptionTier
        subscriptionStatus
        trialEndDate
        nextBillingDate
        stripeCustomerID
        stripeSubscriptionID
        defaultDateFormat
        defaultCurrencyFormat
        defaultLanguage
        regulatoryRegion
        maxUsers
        maxBranches
        maxStaffPerBranch
        saccoFeaturesEnabled
        staffManagementEnabled
        payrollEnabled
        collectionsModuleEnabled
        customWorkflowsEnabled
        advancedReportingEnabled
        apiIntegrationSettings
        status
        createdAt
        updatedAt
        __typename
      }
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
        __typename
      }
      userNotifications {
        nextToken
        __typename
      }
      sentMessages {
        nextToken
        __typename
      }
      receivedMessages {
        nextToken
        __typename
      }
      sentNotifications {
        nextToken
        __typename
      }
      receivedNotifications {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      institutionUsersId
      branchUsersId
      __typename
    }
  }
`,
        variables: { filter: { id: { eq: userDetails.id } } },
      })
      .subscribe({
        next: ({ data }) => {
          console.log("Subscription received user update:", data.onUpdateUser);
          const updatedUser = data.onUpdateUser;
          setUserDetails((prevDetails) => ({
            ...prevDetails,
            ...updatedUser,
          }));
        },
        error: (error) => {
          console.error("User update subscription error:", error);
        },
      });

    processedUserIds.current.add(userDetails.id);

    return () => {
      notificationSubscription.unsubscribe();
      userUpdateSubscription.unsubscribe();
    };
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
