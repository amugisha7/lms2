import React, { useContext } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../../App";
import CreateBorrower from "./CreateBorrower";
import NotificationBar from "../../../ModelAssets/NotificationBar";
import { CREATE_BORROWER_MUTATION } from "../borrowerQueries";
import {
  resolveEmployeeIdForUser,
  syncBorrowerEmployeeAssignment,
} from "../../Employees/employeeHelpers";

export default function CreateBorrowerPage() {
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);
  const client = React.useMemo(() => generateClient(), []);
  const [notification, setNotification] = React.useState({
    message: "",
    color: "green",
  });
  const activeBranchId = userDetails?.branchID || userDetails?.branch?.id || "";

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
    "branchID",
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
      const { employeeId, ...borrowerFormData } = formData;

      // Filter to only include valid GraphQL fields
      const filteredData = Object.keys(borrowerFormData)
        .filter((key) => validBorrowerFields.includes(key))
        .reduce((obj, key) => {
          if (
            borrowerFormData[key] !== "" &&
            borrowerFormData[key] !== null &&
            borrowerFormData[key] !== undefined
          ) {
            obj[key] = borrowerFormData[key];
          }
          return obj;
        }, {});

      const input = {
        ...filteredData,
      };

      // Default status to "active" for internally-created borrowers
      if (!input.status) {
        input.status = "active";
      }

      if (!input.branchID) {
        input.branchID = activeBranchId;
      }

      console.log("API Call: Creating borrower");

      const result = await client.graphql({
        query: CREATE_BORROWER_MUTATION,
        variables: { input },
      });

      const newBorrower = result.data.createBorrower;
      const resolvedEmployeeId = await resolveEmployeeIdForUser({
        userDetails,
        preferredEmployeeId: employeeId,
        branchId: input.branchID,
      });
      await syncBorrowerEmployeeAssignment({
        borrowerId: newBorrower.id,
        employeeId: resolvedEmployeeId,
      });
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

        {activeBranchId ? (
          <Paper
            elevation={2}
            sx={{ p: 3, backgroundColor: "background.paper" }}
          >
            <CreateBorrower
              key={activeBranchId}
              onCreateBorrowerAPI={handleCreate}
              onClose={handleClose}
              isEditMode={false}
              forceEditMode={true}
              selectedBranchId={activeBranchId}
              hideBranchField
            />
          </Paper>
        ) : (
          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: "#e3f2fd",
              border: "1px solid #2196f3",
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: "#1565c0" }}>
              No active branch is loaded. Use Change Branch from the top bar to
              continue.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
}
