import React, { useContext } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../../App";
import CreateBorrower from "./CreateBorrower";
import NotificationBar from "../../../ModelAssets/NotificationBar";
import { CREATE_BORROWER_MUTATION } from "../borrowerQueries";

export default function CreateBorrowerPage() {
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);
  const client = React.useMemo(() => generateClient(), []);
  const [notification, setNotification] = React.useState({
    message: "",
    color: "green",
  });

  // Valid borrower fields for GraphQL input
  const validBorrowerFields = [
    "firstname",
    "othername",
    "businessName",
    "typeOfBusiness",
    "uniqueIdNumber",
    "phoneNumber",
    "otherPhoneNumber",
    "email",
    "gender",
    "dateOfBirth",
    "nationality",
    "address",
    "city",
    "state",
    "title",
    "zipcode",
    "employmentStatus",
    "employerName",
    "creditScore",
    "customFieldsData",
    "status",
    "nationalIdPicture",
    "passportPicture",
    "points",
    "borrowerOpeningBalance",
    "borrowerClosingBalance",
    "borrowerInterestRate",
    "additionalNote1",
    "additionalNote2",
    "borrowerDocuments",
    "branchBorrowersId",
  ];

  const getBorrowerDisplayName = (borrower) => {
    const fullName = [borrower.firstname, borrower.othername]
      .filter(Boolean)
      .join(" ");
    return fullName
      ? `${fullName}${
          borrower.businessName ? ` (${borrower.businessName})` : ""
        }`
      : borrower.businessName || "Unnamed Borrower";
  };

  const handleCreate = async (formData) => {
    try {
      // Filter to only include valid GraphQL fields
      const filteredData = Object.keys(formData)
        .filter((key) => validBorrowerFields.includes(key))
        .reduce((obj, key) => {
          if (
            formData[key] !== "" &&
            formData[key] !== null &&
            formData[key] !== undefined
          ) {
            obj[key] = formData[key];
          }
          return obj;
        }, {});

      const input = {
        ...filteredData,
      };

      // Ensure branchBorrowersId is set for non-Admin users
      if (userDetails.userType !== "Admin" && !input.branchBorrowersId) {
        input.branchBorrowersId = userDetails.branchUsersId;
      }

      console.log("API Call: Creating borrower");

      const result = await client.graphql({
        query: CREATE_BORROWER_MUTATION,
        variables: { input },
      });

      const newBorrower = result.data.createBorrower;
      const displayName = getBorrowerDisplayName(newBorrower);

      setNotification({
        message: `${displayName} created successfully!`,
        color: "green",
      });

      // Navigate back to borrowers list after a short delay
      setTimeout(() => {
        navigate("/borrowers");
      }, 1500);
    } catch (error) {
      console.error("Error creating borrower:", error);
      setNotification({ message: "Error creating borrower", color: "red" });
    }
  };

  const handleClose = () => {
    navigate("/borrowers");
  };

  return (
    <>
      <NotificationBar
        message={notification.message}
        color={notification.color}
      />
      <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 0, sm: 3 } }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Create New Borrower
        </Typography>
        <Paper elevation={2} sx={{ p: 3 }}>
          <CreateBorrower
            onCreateBorrowerAPI={handleCreate}
            onClose={handleClose}
            isEditMode={false}
            forceEditMode={true}
          />
        </Paper>
      </Box>
    </>
  );
}
