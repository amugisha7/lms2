import React, { useState, useContext, useEffect } from "react";
import { Box, Tabs, Tab, Typography, Paper, useTheme } from "@mui/material";
import { CustomerContext } from "../../CustomerApp";
import CustomerLoanProductForm from "./CustomerLoanProductForm";
import CustomerBlankLoanForm from "./CustomerBlankLoanForm";

export default function CustomerLoanApplication() {
  const theme = useTheme();
  const { borrower, institution } = useContext(CustomerContext);
  const [tabValue, setTabValue] = useState(0);
  const [hideBlankForm, setHideBlankForm] = useState(false);

  // Check institution settings for hideBlankForm option
  useEffect(() => {
    if (institution?.customInstitutionDetails) {
      try {
        const settings = JSON.parse(institution.customInstitutionDetails);
        setHideBlankForm(settings.hideBlankForm === true);
        // If blank form is hidden and we're on tab 0, switch to loan products tab
        if (settings.hideBlankForm === true && tabValue === 0) {
          setTabValue(0); // Keep at 0, but this will now be the loan products tab
        }
      } catch (e) {
        console.error("Error parsing institution settings:", e);
      }
    }
  }, [institution]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!borrower) {
    return (
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Apply for Loan
        </Typography>
        <Paper sx={{ p: 3, bgcolor: "warning.light" }}>
          <Typography>
            Please complete your profile to apply for a loan.
          </Typography>
        </Paper>
      </Box>
    );
  }

  // If blank form is hidden, just show the loan product form directly
  if (hideBlankForm) {
    return (
      <Box sx={{ width: "100%" }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Apply for Loan
        </Typography>
        <CustomerLoanProductForm />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Apply for Loan
      </Typography>

      <Box sx={{ width: "100%", mb: 2 }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="loan application options tabs"
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor:
                  theme.palette.blueText?.main || theme.palette.primary.main,
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
                  color:
                    theme.palette.blueText?.main || theme.palette.primary.main,
                },
                "&.Mui-selected": {
                  color:
                    theme.palette.blueText?.main || theme.palette.primary.main,
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
            <Tab label="Use Blank Form" />
            <Tab label="Use Loan Product" />
          </Tabs>
        </Box>
      </Box>

      {tabValue === 0 && <CustomerBlankLoanForm />}
      {tabValue === 1 && <CustomerLoanProductForm />}
    </Box>
  );
}
