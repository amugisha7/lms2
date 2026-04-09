import React, { useContext } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../../App";
import CreateBorrower from "./CreateBorrower";
import NotificationBar from "../../../ModelAssets/NotificationBar";
import DropDownSearchable from "../../../Resources/FormComponents/DropDownSearchable";
import { CREATE_BORROWER_MUTATION } from "../borrowerQueries";
import { listBranches } from "../../../graphql/queries";
import {
  resolveEmployeeIdForUser,
  syncBorrowerEmployeeAssignment,
} from "../../Employees/employeeHelpers";

export default function CreateBorrowerPage() {
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);
  const client = React.useMemo(() => generateClient(), []);
  const isAdmin = String(userDetails?.userType || "").toLowerCase() === "admin";
  const [notification, setNotification] = React.useState({
    message: "",
    color: "green",
  });
  const [branches, setBranches] = React.useState([]);
  const [selectedBranchId, setSelectedBranchId] = React.useState("");

  React.useEffect(() => {
    if (!userDetails) return;

    if (!isAdmin) {
      setSelectedBranchId(
        userDetails.branchUsersId || userDetails.branch?.id || "",
      );
    }
  }, [isAdmin, userDetails]);

  React.useEffect(() => {
    if (!isAdmin || !userDetails?.institution?.id) {
      setBranches([]);
      return;
    }

    let cancelled = false;

    const fetchBranches = async () => {
      try {
        const branchData = await client.graphql({
          query: listBranches,
          variables: {
            limit: 1000,
            filter: {
              institutionBranchesId: { eq: userDetails.institution.id },
            },
          },
        });

        if (cancelled) return;

        const items = branchData?.data?.listBranches?.items || [];
        setBranches(
          items.map((branch) => ({ value: branch.id, label: branch.name })),
        );
      } catch (error) {
        console.error("Error fetching branches", error);
      }
    };

    fetchBranches();

    return () => {
      cancelled = true;
    };
  }, [client, isAdmin, userDetails?.institution?.id]);

  const branchOptions = React.useMemo(() => branches, [branches]);
  const effectiveBranchId =
    selectedBranchId ||
    userDetails?.branchUsersId ||
    userDetails?.branch?.id ||
    "";

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
      const resolvedEmployeeId = await resolveEmployeeIdForUser({
        userDetails,
        preferredEmployeeId: employeeId,
        branchId: input.branchBorrowersId,
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

        {isAdmin && (
          <Box sx={{ width: "100%", mb: 2 }}>
            <DropDownSearchable
              label="Select Branch"
              name="branchBorrowersId"
              placeholder="type to search branches..."
              required={true}
              options={branchOptions}
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              helperText="Choose a branch before creating a borrower."
            />
          </Box>
        )}

        {effectiveBranchId ? (
          <Paper
            elevation={2}
            sx={{ p: 3, backgroundColor: "background.paper" }}
          >
            <CreateBorrower
              key={effectiveBranchId}
              onCreateBorrowerAPI={handleCreate}
              onClose={handleClose}
              isEditMode={false}
              forceEditMode={true}
              selectedBranchId={effectiveBranchId}
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
              Please select a branch above to proceed with creating a borrower.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
}
