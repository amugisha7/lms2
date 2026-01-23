import { useContext, useState } from "react";
import { CustomerContext } from "../../CustomerApp";
import CreateBorrower from "../../Models/Borrowers/CreateBorrower/CreateBorrower";
import { generateClient } from "aws-amplify/api";
import { Box, Typography, Paper } from "@mui/material";

export default function CustomerProfile() {
  const { customerUser, borrower, setBorrower, institution } =
    useContext(CustomerContext);
  const [error, setError] = useState("");

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
    };

    const result = await client.graphql({
      query: `mutation CreateBorrower($input: CreateBorrowerInput!) {
        createBorrower(input: $input) {
          id
          firstname
          othername
          businessName
          email
          phoneNumber
          status
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
    };

    const result = await client.graphql({
      query: `mutation UpdateBorrower($input: UpdateBorrowerInput!) {
        updateBorrower(input: $input) {
          id
          firstname
          othername
          businessName
          email
          phoneNumber
          status
        }
      }`,
      variables: { input },
    });

    return result.data.updateBorrower;
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {borrower ? "My Profile" : "Create Your Profile"}
      </Typography>

      {!borrower && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "info.light" }}>
          <Typography color="black">
            Please complete your profile to access loan application and
            management features.
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
        forceEditMode={!borrower}
      />
    </Box>
  );
}
