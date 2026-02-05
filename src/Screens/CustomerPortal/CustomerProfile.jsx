import { useContext, useState, useEffect } from "react";
import { CustomerContext } from "../../CustomerApp";
import CreateBorrower from "../../Models/Borrowers/CreateBorrower/CreateBorrower";
import { generateClient } from "aws-amplify/api";

import {
  Box,
  Typography,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import PlusButtonSmall from "../../ModelAssets/PlusButtonSmall";
import EditIcon from "@mui/icons-material/Edit";

export default function CustomerProfile() {
  const { customerUser, borrower, setBorrower, institution } =
    useContext(CustomerContext);
  const [error, setError] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize editing state
  useEffect(() => {
    // Only allow editing if no borrower exists (creating new profile)
    // or if borrower status is not "active" (pending profiles can be edited)
    setIsEditing(!borrower);
  }, [borrower]);

  // Fetch branches for the institution - only needed when creating new profile
  useEffect(() => {
    // Only fetch branches if no borrower exists (creating new profile)
    if (borrower) {
      setLoadingBranches(false);
      return;
    }

    const fetchBranches = async () => {
      if (!institution?.id) {
        setLoadingBranches(false);
        return;
      }

      const client = generateClient();
      try {
        const result = await client.graphql({
          query: `query ListBranches($filter: ModelBranchFilterInput) {
            listBranches(filter: $filter) {
              items {
                id
                name
                branchCode
                status
              }
            }
          }`,
          variables: {
            filter: {
              institutionBranchesId: { eq: institution.id },
            },
          },
        });

        const branchList = result?.data?.listBranches?.items || [];
        setBranches(branchList);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }

      setLoadingBranches(false);
    };

    fetchBranches();
  }, [institution, borrower]);

  const handleCreateOrUpdateSuccess = async (savedBorrower) => {
    try {
      const client = generateClient();

      // Update user's customUserDetails with borrowerId
      const customDetails = JSON.parse(customerUser.customUserDetails || "{}");
      customDetails.borrowerId = savedBorrower.id;

      await client.graphql({
        query: `mutation UpdateUser($input: UpdateUserInput!) { 
          updateUser(input: $input) { 
            id 
            customUserDetails
          } 
        }`,
        variables: {
          input: {
            id: customerUser.id,
            customUserDetails: JSON.stringify(customDetails),
          },
        },
      });

      setBorrower(savedBorrower);
      setIsEditing(false);
      setSaveSuccess(true);

      // Clear success message after 5 seconds
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err) {
      console.error("Error updating user with borrower ID:", err);
      setError(
        "Profile saved, but there was an error linking it to your account. Please refresh the page.",
      );
    }
  };

  const createBorrowerAPI = async (values) => {
    const client = generateClient();

    const input = {
      firstname: values.firstname || null,
      othername: values.othername || null,
      businessName: values.businessName || null,
      typeOfBusiness: values.typeOfBusiness || null,
      uniqueIdNumber: values.uniqueIdNumber || null,
      phoneNumber: values.phoneNumber || null,
      otherPhoneNumber: values.otherPhoneNumber || null,
      email: values.email || customerUser.email || null,
      gender: values.gender || null,
      dateOfBirth: values.dateOfBirth || null,
      nationality: values.nationality || null,
      address: values.address || null,
      city: values.city || null,
      state: values.state || null,
      title: values.title || null,
      zipcode: values.zipcode || null,
      employmentStatus: values.employmentStatus || null,
      employerName: values.employerName || null,
      status: "pending",
      branchBorrowersId: selectedBranchId || null,
    };

    const result = await client.graphql({
      query: `mutation CreateBorrower($input: CreateBorrowerInput!) {
        createBorrower(input: $input) {
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
          state
          title
          zipcode
          employmentStatus
          employerName
          status
          branchBorrowersId
        }
      }`,
      variables: { input },
    });

    return result.data.createBorrower;
  };

  const updateBorrowerAPI = async (values, initialValues) => {
    const client = generateClient();

    const input = {
      id: initialValues.id,
      firstname: values.firstname || null,
      othername: values.othername || null,
      businessName: values.businessName || null,
      typeOfBusiness: values.typeOfBusiness || null,
      uniqueIdNumber: values.uniqueIdNumber || null,
      phoneNumber: values.phoneNumber || null,
      otherPhoneNumber: values.otherPhoneNumber || null,
      email: values.email || null,
      gender: values.gender || null,
      dateOfBirth: values.dateOfBirth || null,
      nationality: values.nationality || null,
      address: values.address || null,
      city: values.city || null,
      state: values.state || null,
      title: values.title || null,
      zipcode: values.zipcode || null,
      employmentStatus: values.employmentStatus || null,
      employerName: values.employerName || null,
      branchBorrowersId: initialValues.branchBorrowersId || null,
    };

    const result = await client.graphql({
      query: `mutation UpdateBorrower($input: UpdateBorrowerInput!) {
        updateBorrower(input: $input) {
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
          state
          title
          zipcode
          employmentStatus
          employerName
          status
          branchBorrowersId
        }
      }`,
      variables: { input },
    });

    return result.data.updateBorrower;
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {borrower ? "My Profile" : "Create Your Profile"}
        </Typography>
        {borrower && !isEditing && borrower.status === "pending" && (
          <PlusButtonSmall
            label="EDIT"
            onClick={() => setIsEditing(true)}
            IconComponent={EditIcon}
            iconSx={{ fontSize: "0.9rem" }}
          />
        )}
      </Box>

      {borrower && (
        <Typography variant="body1" sx={{ mb: 2 }}>
          Borrower Key: {borrower.id}
        </Typography>
      )}

      {!borrower && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "info.light" }}>
          <Typography color="black">
            Please select your branch and complete your profile to access loan
            application and management features.
          </Typography>
        </Paper>
      )}

      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "error.light" }}>
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        </Paper>
      )}

      {saveSuccess && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "success.light" }}>
          <Typography variant="body2" sx={{ color: "success.dark" }}>
            Profile saved successfully!
          </Typography>
        </Paper>
      )}

      {/* Status-based messages */}
      {borrower?.status === "pending" && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "warning.light" }}>
          <Typography
            variant="body1"
            sx={{ fontWeight: 600, mb: 1, color: "#000" }}
          >
            📋 Profile Under Review
          </Typography>
          <Typography variant="body2" sx={{ color: "#000" }}>
            Your profile has been submitted and is awaiting approval from{" "}
            {institution?.name || "the institution"}. You can still edit your
            profile while it's pending approval. Once approved, you will NOT be
            able to edit your profile for security purposes.
          </Typography>
        </Paper>
      )}

      {borrower?.status === "active" && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "success.light" }}>
          <Typography
            variant="body1"
            sx={{ fontWeight: 600, mb: 1, color: "success.dark" }}
          >
            ✅ Profile Approved
          </Typography>
          <Typography variant="body2" sx={{ color: "success.dark" }}>
            Your profile has been approved by{" "}
            {institution?.name || "the institution"}. For security reasons,
            profile editing is locked after approval. If you need to update your
            information, please contact {institution?.name || "the institution"}{" "}
            directly.
          </Typography>
        </Paper>
      )}

      {/* Branch Selector - Only show if not editing existing borrower */}
      {!borrower && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Select Your Branch
          </Typography>
          <FormControl fullWidth required disabled={loadingBranches}>
            <InputLabel>Branch</InputLabel>
            <Select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              label="Branch"
            >
              {branches.map((branch) => (
                <MenuItem
                  key={branch.id}
                  value={branch.id}
                  sx={{ "&:hover": { color: "white" } }}
                >
                  {branch.name}{" "}
                  {branch.branchCode ? `(${branch.branchCode})` : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {branches.length === 0 && !loadingBranches && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              No branches available. Please contact the institution.
            </Typography>
          )}
        </Paper>
      )}

      {/* Read-only Branch Name for saved profiles */}
      {borrower && (
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Branch:</strong> {borrower.branch?.name || "N/A"}
        </Typography>
      )}

      {/* Edit Profile button moved to heading */}

      {/* Only show form if branch is selected or if editing existing borrower */}
      {(borrower || selectedBranchId) && (
        <CreateBorrower
          isCustomerPortal={true}
          prefilledEmail={customerUser?.email}
          initialValues={borrower}
          isEditMode={!!borrower}
          onCreateBorrowerAPI={createBorrowerAPI}
          onUpdateBorrowerAPI={updateBorrowerAPI}
          onCreateSuccess={handleCreateOrUpdateSuccess}
          onEditSuccess={handleCreateOrUpdateSuccess}
          hideCancel={true}
          forceEditMode={isEditing}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {/* Message when no branch selected */}
      {!borrower && !selectedBranchId && branches.length > 0 && (
        <Paper sx={{ p: 3, textAlign: "center", bgcolor: "grey.100" }}>
          <Typography variant="body1" color="text.secondary">
            Please select a branch above to continue with your profile.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
