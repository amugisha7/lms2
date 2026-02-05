import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { createContext, useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";
import {
  ThemeProvider,
  Box,
  Typography,
  Paper,
  Link,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
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
function LoginFooter({ onBorrowerIdLogin }) {
  return (
    <Box sx={{ textAlign: "center", mt: 4, mb: 4 }}>
      {onBorrowerIdLogin && (
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "0.9rem",
              mb: 1,
            }}
          >
            Already a borrower with a key?
          </Typography>
          <Button
            variant="outlined"
            onClick={onBorrowerIdLogin}
            sx={{
              borderColor: "#d59234",
              // color: "#d59234",
              backgroundColor: "rgba(213, 146, 52, 0.1)",
              textTransform: "none",
              "&:hover": {
                borderColor: "#ffd54f",
                backgroundColor: "rgba(213, 146, 52, 0.1)",
              },
            }}
          >
            Login with Borrower Key
          </Button>
        </Box>
      )}
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

// Borrower ID Login Screen
function BorrowerIdLoginScreen({
  institutionName,
  onSuccess,
  onSwitchToEmail,
  institutionId,
}) {
  const [borrowerId, setBorrowerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!borrowerId.trim()) {
      setError("Please enter your Borrower Key");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const client = generateClient();

      // Fetch borrower by ID
      const borrowerRes = await client.graphql({
        query: `query GetBorrower($id: ID!) { 
          getBorrower(id: $id) { 
            id 
            firstname 
            othername
            businessName 
            email
            phoneNumber
            address
            city
            state
            status
            branchBorrowersId
            title
            gender
            dateOfBirth
            nationality
            uniqueIdNumber
            otherPhoneNumber
            typeOfBusiness
            zipcode
            employmentStatus
            employerName
            branch {
              id
              name
              branchCode
              institutionBranchesId
            }
          } 
        }`,
        variables: { id: borrowerId.trim() },
      });

      const borrower = borrowerRes.data.getBorrower;

      if (!borrower) {
        setError("Borrower Key not found. Please check and try again.");
        setLoading(false);
        return;
      }

      // Verify the borrower belongs to this institution
      if (
        institutionId &&
        borrower.branch?.institutionBranchesId !== institutionId
      ) {
        setError("This Borrower Key is not associated with this institution.");
        setLoading(false);
        return;
      }

      // Success - pass borrower data to parent
      onSuccess(borrower);
    } catch (err) {
      console.error("Error fetching borrower:", err);
      setError("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <LoginHeader institutionName={institutionName} />

      <Paper
        elevation={3}
        sx={{
          background: "linear-gradient(135deg, #1a2a3a 0%, #0d1520 100%)",
          border: "1px solid rgba(144, 214, 233, 0.2)",
          borderRadius: 2,
          width: "100%",
          maxWidth: 400,
          p: 4,
          mb: 4,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#d59234",
            fontWeight: 600,
            textAlign: "center",
            mb: 1,
          }}
        >
          Login with Borrower Key
        </Typography>

        <Typography
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            mb: 3,
            fontSize: "0.9rem",
            textAlign: "center",
          }}
        >
          Enter your unique Borrower Key to access your account.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TextField
          autoFocus={true}
          fullWidth
          label="Borrower Key"
          value={borrowerId}
          onChange={(e) => setBorrowerId(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          disabled={loading}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": {
                borderColor: "rgba(144, 214, 233, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(144, 214, 233, 0.5)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#d59234",
              },
            },
            "& .MuiInputLabel-root": {
              color: "rgba(255, 255, 255, 0.7)",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#d59234",
            },
            "& input": {
              color: "white",
            },
          }}
        />

        <Button
          onClick={handleSubmit}
          disabled={loading}
          fullWidth
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#d59234",
            height: 48,
            fontSize: "1rem",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#c47f2a",
            },
            mb: 3,
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>

        <Box
          sx={{
            textAlign: "center",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            pt: 3,
          }}
        >
          <Typography
            sx={{ color: "rgba(255,255,255,0.6)", mb: 1, fontSize: "0.85rem" }}
          >
            Don't have a Borrower Key?
          </Typography>
          <Button
            variant="outlined"
            onClick={onSwitchToEmail}
            sx={{
              borderColor: "#d59234",
              // color: "#d59234",
              backgroundColor: "rgba(213, 146, 52, 0.1)",
              textTransform: "none",
              "&:hover": {
                borderColor: "#ffd54f",
                backgroundColor: "rgba(213, 146, 52, 0.1)",
              },
            }}
          >
            Login with Account
          </Button>
        </Box>
      </Paper>

      <LoginFooter onBorrowerIdLogin={null} />
    </Box>
  );
}

// CustomerApp variant for borrowers who logged in with their Borrower ID
function CustomerAppBorrowerId({ borrower, institution, onLogout }) {
  const [theme, colorMode] = useMode();

  // Create a mock signOut function
  const signOut = () => {
    onLogout();
  };

  // Create a mock user object
  const user = {
    userId: `borrower-${borrower.id}`,
    signInDetails: {
      loginId: borrower.email || borrower.id,
    },
  };

  // Create a mock customerUser object
  const customerUser = {
    id: `borrower-user-${borrower.id}`,
    userType: "Customer",
    email: borrower.email,
    customUserDetails: JSON.stringify({ borrowerId: borrower.id }),
    institutionUsersId: institution.id,
  };

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
            setBorrower: () => {}, // Read-only for borrower ID login
            isBorrowerIdLogin: true, // Flag to indicate borrower ID login mode
          }}
        >
          <CustomerRoutes />
        </CustomerContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
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
                  othername
                  businessName 
                  email
                  phoneNumber
                  address
                  city
                  state
                  status
                  branchBorrowersId
                  title
                  gender
                  dateOfBirth
                  nationality
                  uniqueIdNumber
                  otherPhoneNumber
                  typeOfBusiness
                  zipcode
                  employmentStatus
                  employerName
                  branch {
                    id
                    name
                    branchCode
                  }
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
  const [institution, setInstitution] = useState(null);
  const [loadingInstitution, setLoadingInstitution] = useState(true);

  // Authentication and Login View States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loginView, setLoginView] = useState("borrower"); // "borrower" or "amplify"
  const [borrowerIdLoginData, setBorrowerIdLoginData] = useState(null);

  // Extract institutionId from URL path
  const pathParts = window.location.pathname.split("/");
  const institutionId = pathParts[2];

  // Check Authentication Status on Mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    try {
      await getCurrentUser();
      setIsAuthenticated(true);
    } catch (e) {
      setIsAuthenticated(false);
    }
    setIsCheckingAuth(false);
  }

  useEffect(() => {
    const fetchInstitution = async () => {
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
        const inst = instRes.data.getInstitution;
        const name = inst?.name || "";
        console.log("Setting institution name to:", name);
        setInstitutionName(name);
        setInstitution(inst);
      } catch (err) {
        console.error("Error fetching institution:", err);
        console.error("Error details:", err.message, err.errors);
        // Set a fallback name so at least something shows
        setInstitutionName("Customer Portal");
      }
      setLoadingInstitution(false);
    };

    fetchInstitution();
  }, [institutionId]);

  const handleBorrowerIdLoginSuccess = (borrower) => {
    setBorrowerIdLoginData(borrower);
  };

  const handleBorrowerIdLogout = () => {
    setBorrowerIdLoginData(null);
    setLoginView("borrower");
  };

  if (loadingInstitution || isCheckingAuth) {
    return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <LoadingScreen />
        </ThemeProvider>
      </ColorModeContext.Provider>
    );
  }

  // If logged in via Borrower ID, show the borrower ID version of CustomerApp
  if (borrowerIdLoginData && institution) {
    return (
      <CustomerAppBorrowerId
        borrower={borrowerIdLoginData}
        institution={institution}
        onLogout={handleBorrowerIdLogout}
      />
    );
  }

  // If authenticated via Amplify, show Authenticator -> CustomerApp
  if (isAuthenticated) {
    return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <Authenticator>
            {({ signOut, user }) => (
              <CustomerApp signOut={signOut} user={user} />
            )}
          </Authenticator>
        </ThemeProvider>
      </ColorModeContext.Provider>
    );
  }

  // Not authenticated: Show Login Screens (Borrower ID or Amplify Login)
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
          <Box
            sx={{
              width: "100%",
              position: "relative",
              zIndex: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {loginView === "borrower" ? (
              <BorrowerIdLoginScreen
                institutionName={institutionName}
                institutionId={institutionId}
                onSuccess={handleBorrowerIdLoginSuccess}
                onSwitchToEmail={() => setLoginView("amplify")}
              />
            ) : (
              <Authenticator
                components={{
                  Header: () => (
                    <LoginHeader institutionName={institutionName} />
                  ),
                  Footer: () => (
                    <LoginFooter
                      onBorrowerIdLogin={() => setLoginView("borrower")}
                    />
                  ),
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
            )}
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default CustomerAppWrapper;
