import "./App.css";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { createContext, useEffect, useState, useRef, useCallback } from "react";
import { NotificationProvider } from "./ModelAssets/NotificationContext";
import { SnackbarProvider } from "./ModelAssets/SnackbarContext";
import { generateClient } from "aws-amplify/api";
import resilientClient from "./resilientClient";
import AppRoutes from "./Routes";
import LoadingScreen from "./Resources/LoadingScreen";
import ErrorLoadingWorkspace from "./Resources/ErrorLoadingWorkspace";
import NoInternet from "./Resources/NoInternet";
import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider } from "@mui/material";
import { LoanExplorerProvider } from "./Models/Loans/LoansDisplay/LoanExplorerContext";
import {
  LIST_NOTIFICATIONS_QUERY,
  SUBSCRIBE_TO_NEW_NOTIFICATIONS,
} from "./Screens/Notifications/notificationQueries";
import { parseCustomInstitutionDetails } from "./utils/customInstitutionDetails";
import {
  getAdminDefaultsRecoveryState,
  repairAdminDefaults as repairAdminDefaultsHelper,
} from "./utils/adminDefaultsRecovery";

const GET_BRANCH_QUERY = `
  query GetBranch($id: ID!) {
    getBranch(id: $id) {
      id
      name
      branchCode
      address
      status
      createdAt
      updatedAt
      institutionID
    }
  }
`;

const GET_USER_QUERY = `
  query GetUser($id: ID!) {
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
      institutionID
      branchID
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionID
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
        customDocumentHeader
        customInstitutionDetails
        status
        createdAt
        updatedAt
      }
    }
  }
`;

const SUBSCRIBE_TO_USER_UPDATES_QUERY = `
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
        customDocumentHeader
        customInstitutionDetails
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
        institutionID
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
      institutionID
      branchID
      __typename
    }
  }
`;

const hydrateActiveBranch = async (userData, graphClient = resilientClient) => {
  if (!userData) {
    return null;
  }

  const institution = userData.institution
    ? {
        ...userData.institution,
        customInstitutionDetails: parseCustomInstitutionDetails(
          userData.institution.customInstitutionDetails,
        ),
      }
    : null;

  const fallbackBranchId = userData.branch?.id || userData.branchID || null;
  const desiredBranchId =
    institution?.customInstitutionDetails?.currentBranchID || fallbackBranchId;

  let activeBranch = userData.branch || null;
  let activeBranchId = fallbackBranchId;

  if (desiredBranchId && activeBranch?.id !== desiredBranchId) {
    try {
      const branchResult = await graphClient.graphql({
        query: GET_BRANCH_QUERY,
        variables: { id: desiredBranchId },
      });
      const fetchedBranch = branchResult?.data?.getBranch;
      if (
        fetchedBranch?.id &&
        (!institution?.id || fetchedBranch.institutionID === institution.id)
      ) {
        activeBranch = fetchedBranch;
        activeBranchId = fetchedBranch.id;
      }
    } catch (error) {
      console.error("Failed to hydrate active branch:", error);
    }
  } else if (desiredBranchId) {
    activeBranchId = desiredBranchId;
  }

  return {
    ...userData,
    branchID: activeBranchId || null,
    branch: activeBranch,
    institution,
  };
};

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
  const [adminDefaultsRecovery, setAdminDefaultsRecovery] = useState({
    required: false,
    missingDefaults: [],
    canAutoRepair: false,
    showRecoveryScreen: false,
    validationFailed: false,
    reason: "ready",
    errorMessage: null,
  });

  const [theme, colorMode] = useMode();

  const checkedUserIds = useRef(new Set());
  const processedUserIds = useRef(new Set());

  const loadAndHydrateUser = useCallback(
    async (userId, graphClient = resilientClient) => {
      const res = await graphClient.graphql({
        query: GET_USER_QUERY,
        variables: { id: userId },
      });

      console.log("GetUser response:", res);
      return hydrateActiveBranch(res.data.getUser, graphClient);
    },
    [],
  );

  const ensureAdminDefaultsReady = useCallback(
    async (nextUserDetails, { attemptRepair = true } = {}) => {
      const recoveryState = await getAdminDefaultsRecoveryState({
        userDetails: nextUserDetails,
        graphClient: resilientClient,
      });

      if (
        !recoveryState.required ||
        !attemptRepair ||
        !nextUserDetails?.id ||
        !recoveryState.canAutoRepair
      ) {
        setAdminDefaultsRecovery(recoveryState);
        return {
          userDetails: nextUserDetails,
          recoveryState,
        };
      }

      console.log(
        "[admin-defaults-recovery] Auto repair triggered during app load",
        {
          userId: nextUserDetails.id,
          missingDefaults: recoveryState.missingDefaults,
        },
      );

      try {
        const repairResult = await repairAdminDefaultsHelper({
          userDetails: nextUserDetails,
          graphClient: resilientClient,
        });

        console.log("[admin-defaults-recovery] Auto repair completed", {
          userId: nextUserDetails.id,
          actions: repairResult?.actions || [],
        });

        const refreshedUserDetails = await loadAndHydrateUser(
          nextUserDetails.id,
          resilientClient,
        );
        const refreshedRecoveryState = await getAdminDefaultsRecoveryState({
          userDetails: refreshedUserDetails,
          graphClient: resilientClient,
        });

        const nextRecoveryState = refreshedRecoveryState.required
          ? {
              ...refreshedRecoveryState,
              showRecoveryScreen: true,
              reason: "repair-incomplete",
            }
          : refreshedRecoveryState;

        setAdminDefaultsRecovery(nextRecoveryState);

        return {
          userDetails: refreshedUserDetails,
          recoveryState: nextRecoveryState,
          repairResult,
        };
      } catch (repairError) {
        console.error(
          "[admin-defaults-recovery] Auto repair failed during app load",
          {
            message: repairError?.message,
            error: repairError,
            graphqlErrors: repairError?.errors,
            data: repairError?.data,
            userId: nextUserDetails.id,
            missingDefaults: recoveryState.missingDefaults,
          },
        );
        const failedRecoveryState = {
          ...recoveryState,
          showRecoveryScreen: true,
          reason: "repair-failed",
          errorMessage:
            repairError?.message || "Automatic admin setup repair failed.",
        };
        setAdminDefaultsRecovery(failedRecoveryState);
        return {
          userDetails: nextUserDetails,
          recoveryState: failedRecoveryState,
          repairError,
        };
      }
    },
    [loadAndHydrateUser],
  );

  const reloadUserContext = useCallback(async () => {
    if (!user?.userId) {
      return null;
    }

    const nextUserDetails = await loadAndHydrateUser(user.userId);
    const resolved = await ensureAdminDefaultsReady(nextUserDetails, {
      attemptRepair: true,
    });
    setUserDetails(resolved.userDetails || null);
    return resolved.userDetails;
  }, [ensureAdminDefaultsReady, loadAndHydrateUser, user?.userId]);

  const repairAdminDefaults = useCallback(async () => {
    if (!userDetails?.id) {
      throw new Error("No admin user is loaded for recovery.");
    }

    const result = await repairAdminDefaultsHelper({
      userDetails,
      graphClient: resilientClient,
    });

    await reloadUserContext();
    return result;
  }, [reloadUserContext, userDetails]);

  const fetchMessages = async (userId) => {
    try {
      // Fetch messages where user is sender
      console.log("API Call: LIST_NOTIFICATIONS_QUERY sent messages", {
        senderUserId: userId,
      });
      const sentResponse = await resilientClient.graphql({
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
      const receivedResponse = await resilientClient.graphql({
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
        new Map(allMsgs.map((msg) => [msg.id, msg])).values(),
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
      (m) => m.recipientUserId === userDetails?.id && m.status === "unread",
    ).length;
    setUnreadCount(count);
  }, [allMessages, userDetails?.id]);

  useEffect(() => {
    if (checkedUserIds.current.has(user.userId)) return;

    const checkUser = async () => {
      try {
        console.log("API Call: GetUser", { id: user.userId });
        const userData = await loadAndHydrateUser(user.userId);
        const resolved = await ensureAdminDefaultsReady(userData, {
          attemptRepair: true,
        });
        setUserDetails(resolved.userDetails || null);
        setError(false);
        setUserExists(!!resolved.userDetails?.id);
        setChecking(false);
        checkedUserIds.current.add(user.userId);
      } catch (err) {
        console.log("Error fetching user:", err);
        setError(true);
        setChecking(false);
        setUserExists(false);
      }
    };
    checkUser();
  }, [ensureAdminDefaultsReady, loadAndHydrateUser, user?.userId]);

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
            data.onCreateNotification,
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
        query: SUBSCRIBE_TO_USER_UPDATES_QUERY,
        variables: { filter: { id: { eq: userDetails.id } } },
      })
      .subscribe({
        next: async ({ data }) => {
          console.log("Subscription received user update:", data.onUpdateUser);
          const updatedUser = await hydrateActiveBranch(
            data.onUpdateUser,
            client,
          );
          const resolved = await ensureAdminDefaultsReady(updatedUser, {
            attemptRepair: true,
          });
          setUserDetails((prevDetails) => ({
            ...prevDetails,
            ...resolved.userDetails,
            institution:
              resolved.userDetails?.institution || prevDetails?.institution,
            branch: resolved.userDetails?.branch || prevDetails?.branch,
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
  }, [ensureAdminDefaultsReady, userDetails?.id]);

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
            adminDefaultsRecovery,
            refreshAdminDefaultsRecovery: reloadUserContext,
            repairAdminDefaults,
          }}
        >
          {checking && <LoadingScreen onSignOut={signOut} />}
          {!checking && (
            <SnackbarProvider>
              <NotificationProvider>
                <LoanExplorerProvider userDetails={userDetails}>
                  {error ? (
                    <ErrorLoadingWorkspace onSignOut={signOut} />
                  ) : (
                    <>
                      {!online && <NoInternet />}
                      <div style={{ display: online ? "block" : "none" }}>
                        <AppRoutes
                          userExists={userExists}
                          userStatus={userDetails?.status}
                          adminDefaultsRecoveryRequired={
                            adminDefaultsRecovery.showRecoveryScreen
                          }
                        />
                      </div>
                    </>
                  )}
                </LoanExplorerProvider>
              </NotificationProvider>
            </SnackbarProvider>
          )}
        </UserContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default withAuthenticator(App);
