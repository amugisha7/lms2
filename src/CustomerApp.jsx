import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { createContext, useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { ThemeProvider, Box, Typography, Paper, Link } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import CustomerRoutes from "./CustomerRoutes";
import LoadingScreen from "./Resources/LoadingScreen";

export const CustomerContext = createContext();

// Custom Header Component for Login Screen
function LoginHeader({ institutionName }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        mb: 4,
        mt: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          mb: 1.5,
          color: "#ffffff",
          px: 2,
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
          letterSpacing: 1,
        }}
      >
        {institutionName || "LOANTABS"}
      </Typography>
      <Box
        sx={{
          p: 2,
          border: "1px solid rgba(144, 214, 233, 0.3)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: "#d59234",
            px: 2,
            letterSpacing: 2,
            mb: 1,
          }}
        >
          CUSTOMER PORTAL
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "rgba(255, 255, 255, 0.95)",
            fontWeight: 500,
            fontSize: "0.9rem",
          }}
        >
          Apply for Loans • View Statements • Manage Your Account
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: "0.95rem",
          my: 2,
        }}
      >
        Please sign in to continue or create a new account to get started.
      </Typography>
    </Box>
  );
}

// Custom Footer Component for Login Screen
function LoginFooter() {
  return (
    <Box sx={{ textAlign: "center", mt: 4, mb: 4 }}>
      <Typography
        sx={{
          color: "rgba(255, 255, 255, 0.6)",
          fontSize: "0.85rem",
          letterSpacing: 0.5,
        }}
      >
        Powered by{" "}
        <Link
          href="https://www.loantabs.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: "#ffd54f",
            textDecoration: "none",
            fontWeight: 500,
            transition: "all 0.2s ease",
            "&:hover": {
              color: "#d6af73",
              textDecoration: "underline",
            },
          }}
        >
          www.LoanTabs.com
        </Link>
      </Typography>
    </Box>
  );
}

function CustomerApp({ signOut, user }) {
  const [theme, colorMode] = useMode();
  const [institution, setInstitution] = useState(null);
  const [customerUser, setCustomerUser] = useState(null);
  const [borrower, setBorrower] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract institutionId from URL path /client/:institutionId/...
  const pathParts = window.location.pathname.split("/");
  const institutionId = pathParts[2]; // /client/[institutionId]/...

  useEffect(() => {
    const init = async () => {
      const client = generateClient();

      try {
        // Fetch institution
        const instRes = await client.graphql({
          query: `query GetInstitution($id: ID!) { 
            getInstitution(id: $id) { 
              id 
              name 
              customInstitutionDetails 
            } 
          }`,
          variables: { id: institutionId },
        });
        setInstitution(instRes.data.getInstitution);

        // Fetch or create customer user
        const userRes = await client.graphql({
          query: `query GetUser($id: ID!) { 
            getUser(id: $id) { 
              id 
              userType 
              customUserDetails 
              institutionUsersId
              email
            } 
          }`,
          variables: { id: user.userId },
        });

        if (userRes.data.getUser) {
          // Check if user is a Customer type
          if (userRes.data.getUser.userType !== "Customer") {
            console.log(
              "Non-customer user attempted to access customer portal",
            );
            signOut();
            return;
          }

          setCustomerUser(userRes.data.getUser);
          // If user has borrowerId, fetch borrower
          const customDetails = JSON.parse(
            userRes.data.getUser.customUserDetails || "{}",
          );
          if (customDetails.borrowerId) {
            const borrowerRes = await client.graphql({
              query: `query GetBorrower($id: ID!) { 
                getBorrower(id: $id) { 
                  id 
                  firstname 
                  businessName 
                  lastname
                  email
                  phoneNumber
                  borrowerType
                } 
              }`,
              variables: { id: customDetails.borrowerId },
            });
            setBorrower(borrowerRes.data.getBorrower);
          }
        } else {
          // Create new customer user
          const createRes = await client.graphql({
            query: `mutation CreateUser($input: CreateUserInput!) { 
              createUser(input: $input) { 
                id 
                userType 
                email
                customUserDetails
                institutionUsersId
              } 
            }`,
            variables: {
              input: {
                id: user.userId,
                email: user.signInDetails?.loginId,
                userType: "Customer",
                status: "active",
                institutionUsersId: institutionId,
              },
            },
          });
          setCustomerUser(createRes.data.createUser);
        }
      } catch (err) {
        console.error("Error initializing customer app:", err);
      }

      setLoading(false);
    };
    init();
  }, [institutionId, user]);

  if (loading) return <LoadingScreen />;

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CustomerContext.Provider
          value={{
            signOut,
            user,
            customerUser,
            institution,
            borrower,
            setBorrower,
          }}
        >
          <CustomerRoutes />
        </CustomerContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

// Wrapper to fetch institution and pass to authenticator
function CustomerAppWrapper() {
  console.log("CustomerAppWrapper is rendering!");
  const [theme, colorMode] = useMode();
  const [institutionName, setInstitutionName] = useState("");
  const [loadingInstitution, setLoadingInstitution] = useState(true);

  useEffect(() => {
    const fetchInstitution = async () => {
      const pathParts = window.location.pathname.split("/");
      const institutionId = pathParts[2];

      console.log("Fetching institution for ID:", institutionId);

      if (!institutionId) {
        console.log("No institution ID found in URL");
        setLoadingInstitution(false);
        return;
      }

      try {
        const client = generateClient();
        const instRes = await client.graphql({
          query: `query GetInstitution($id: ID!) { 
            getInstitution(id: $id) { 
              id 
              name 
            } 
          }`,
          variables: { id: institutionId },
        });
        console.log("Institution fetch result:", instRes);
        const name = instRes.data.getInstitution?.name || "";
        console.log("Setting institution name to:", name);
        setInstitutionName(name);
      } catch (err) {
        console.error("Error fetching institution:", err);
        console.error("Error details:", err.message, err.errors);
        // Set a fallback name so at least something shows
        setInstitutionName("Customer Portal");
      }
      setLoadingInstitution(false);
    };

    fetchInstitution();
  }, []);

  if (loadingInstitution) {
    return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <LoadingScreen />
        </ThemeProvider>
      </ColorModeContext.Provider>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #0e1e31 0%, #05070a 50%, #143255 100%)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "radial-gradient(circle at 20% 50%, rgba(144, 214, 233, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(213, 146, 52, 0.08) 0%, transparent 50%)",
              pointerEvents: "none",
            },
          }}
        >
          <Box sx={{ width: "100%", position: "relative", zIndex: 1 }}>
            <Authenticator
              components={{
                Header: () => <LoginHeader institutionName={institutionName} />,
                Footer: LoginFooter,
              }}
              formFields={{
                signUp: {
                  email: {
                    order: 1,
                    isRequired: true,
                  },
                  password: {
                    order: 2,
                    isRequired: true,
                  },
                  confirm_password: {
                    order: 3,
                    isRequired: true,
                  },
                },
              }}
            >
              {({ signOut, user }) => (
                <CustomerApp signOut={signOut} user={user} />
              )}
            </Authenticator>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default CustomerAppWrapper;
