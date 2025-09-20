import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ViewBorrowerForm from "./ViewBorrowerForm";
import { generateClient } from "aws-amplify/api";
import Switch from "@mui/material/Switch";
import { Checkbox } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import AddIcon from "@mui/icons-material/Add"; // Add this import
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";

export default function ViewBorrower() {
  const { borrowerId } = useParams();
  const [tab, setTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [borrower, setBorrower] = useState(null);
  const [loading, setLoading] = useState(true);
  const formRef = useRef();
  const [formSubmitting, setFormSubmitting] = useState(false); // Add this state
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchBorrower = async () => {
      if (!borrowerId) return;

      try {
        const client = generateClient();
        const response = await client.graphql({
          query: `
            query GetBorrower($borrowerId: ID!) {
              getBorrower(id: $borrowerId) {
                id
                firstname
                othername
                businessName
                typeOfBusiness
                uniqueIdNumber
                phoneNumber
                otherPhoneNumber
                email
                gender
                dateOfBirth
                nationality
                address
                city
                title
                state
                zipcode
                employmentStatus
                employerName
                creditScore
                customFieldsData
                borrowerStatus
              }
            }
          `,
          variables: {
            borrowerId,
          },
        });

        setBorrower(response.data.getBorrower);
      } catch (error) {
        console.error("Error fetching borrower:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrower();
  }, [borrowerId]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleBackToDetails = () => {
    setTab(0);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  // Move tab content rendering outside of Tabs, and keep components mounted
  const tabPanels = [
    <ViewBorrowerForm
      key="details"
      editing={editing}
      borrower={borrower}
      formSubmitRef={formRef}
      setEditing={setEditing}
      setFormSubmitting={setFormSubmitting}
    />,
    <Button key="docs" variant="contained" onClick={handleBackToDetails}>
      You must first create the borrower
    </Button>,
    <Button key="loans" variant="contained" onClick={handleBackToDetails}>
      You must first create the borrower
    </Button>,
  ];

  return (
    <Box
      sx={{
        maxWidth: { xs: "100%", md: 800 },
        mx: "auto",
        width: "100%",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
        {borrower?.firstname || borrower?.othername
          ? `${borrower?.firstname || ""}${
              borrower?.othername ? " " + borrower.othername : ""
            }${borrower?.businessName ? " / " + borrower.businessName : ""}`
          : borrower?.businessName || "View Borrower"}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row", // column on mobile, row on desktop
          gap: 3,
          justifyContent: "flex-end",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={editing}
            onChange={() => setEditing((prev) => !prev)}
            // color="primary"
            // sx={{backgroundColor:'lightblue', border: '1px solid lightgrey !important'}}
            disabled={formSubmitting}
          />
          {editing ? (
            <Typography
              variant="caption"
              sx={{ color: colors.blueAccent[300] }}
            >
              Editing Enabled
            </Typography>
          ) : (
            <Typography variant="caption">Enable Editing</Typography>
          )}
        </Box>
        {!editing && (
          <Button
            variant="outlined"
            startIcon={<AddIcon sx={{ color: theme.palette.blueText.main }} />}
            // onClick={() => navigate('/addBorrower')}
            sx={{
              borderColor: theme.palette.blueText.main,
              color: theme.palette.blueText.main,
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "transparent",
                borderColor: theme.palette.blueText.main,
                borderWidth: "2px", // Make border 2px on hover
              },
            }}
          >
            New Loan
          </Button>
        )}
      </Box>
      {/* Floating Save Changes button and Cancel icon */}
      {editing && (
        <Box
          sx={{
            position: "fixed",
            bottom: 32,
            right: 48,
            display: "flex",
            alignItems: "center",
            zIndex: 1300,
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            sx={{
              minWidth: 140,
              boxShadow: 4,
            }}
            disabled={formSubmitting}
            onClick={async () => {
              if (formRef.current) {
                setFormSubmitting(true);
                await formRef.current();
                setFormSubmitting(false);
              }
            }}
          >
            Save Changes
          </Button>
          <IconButton
            color="error"
            sx={{
              // backgroundColor: 'background.paper',
              borderRadius: "50%",
              boxShadow: 3,
              ml: 1,
              "&:hover": {
                backgroundColor: "error.light",
              },
            }}
            aria-label="Cancel editing"
            onClick={() => setEditing(false)}
            disabled={formSubmitting}
          >
            <CancelIcon />
          </IconButton>
        </Box>
      )}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: 1,
          borderColor: colors.blueAccent[600],
          mb: 2,
          "& .MuiTabs-indicator": {
            backgroundColor: colors.blueAccent[100], // Blue accent indicator
            height: 4,
            // borderRadius: 1,
          },
          "& .MuiTab-root.Mui-selected": {
            color: colors.blueAccent[100] + " !important", // Active tab text color
          },
        }}
      >
        <Tab sx={{ mx: 1 }} label="BORROWER DETAILS" />
        <Tab sx={{ mx: 1 }} label="DOCUMENTS" />
        <Tab sx={{ mx: 1 }} label="LOANS" />
      </Tabs>
      <Box sx={{ mt: 0 }}>
        {/* Render all tab panels, only show the active one, but keep state */}
        {tabPanels.map((panel, idx) => (
          <Box
            key={idx}
            sx={{ display: tab === idx ? "block" : "none", width: "100%" }}
          >
            {panel}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
