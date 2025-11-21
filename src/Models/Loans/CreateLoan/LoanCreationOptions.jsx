import React, { useState, useContext, useEffect } from "react";
import { Box, Tabs, Tab, Typography, useTheme } from "@mui/material";
import CreateLoan from "./CreateLoan";
import UseLoanProduct from "./UseLoanProduct";
import { UserContext } from "../../../App";
import { fetchBorrowers } from "./createLoanHelpers";

export default function LoanCreationOptions(props) {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const { userDetails } = useContext(UserContext);
  const [borrowers, setBorrowers] = useState([]);
  const [borrowersLoading, setBorrowersLoading] = useState(true);

  useEffect(() => {
    const loadBorrowers = async () => {
      if (!userDetails?.branchUsersId) {
        setBorrowersLoading(false);
        return;
      }

      try {
        const borrowersList = await fetchBorrowers(userDetails.branchUsersId);
        setBorrowers(borrowersList);
      } catch (err) {
        console.error("Error loading borrowers:", err);
      } finally {
        setBorrowersLoading(false);
      }
    };

    loadBorrowers();
  }, [userDetails?.branchUsersId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Create a new Loan
      </Typography>
      <Box sx={{ width: "100%", mb: 2 }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.background.paper,
            borderRadius: "8px 8px 0 0",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="loan creation options tabs"
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: theme.palette.blueText.main,
                height: 3,
                borderRadius: "1.5px",
              },
              "& .MuiTab-root": {
                fontFamily: theme.typography.fontFamily,
                fontSize: "0.875rem",
                fontWeight: 500,
                textTransform: "none",
                letterSpacing: "0.02em",
                color: theme.palette.text.secondary,
                minHeight: 48,
                padding: "12px 24px",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  color: theme.palette.blueText.main,
                },
                "&.Mui-selected": {
                  color: theme.palette.blueText.main,
                  fontWeight: 600,
                },
                "&.Mui-focusVisible": {
                  backgroundColor: theme.palette.action.focus,
                },
              },
              "& .MuiTabs-flexContainer": {
                gap: 1,
              },
            }}
          >
            <Tab label="Use blank form" />
            <Tab label="Use Loan Product template" />
          </Tabs>
        </Box>
      </Box>

      {tabValue === 0 && (
        <CreateLoan
          {...props}
          borrowers={borrowers}
          borrowersLoading={borrowersLoading}
        />
      )}
      {tabValue === 1 && (
        <UseLoanProduct
          {...props}
          borrowers={borrowers}
          borrowersLoading={borrowersLoading}
        />
      )}
    </Box>
  );
}
