import { generateClient } from "aws-amplify/api";

const UPDATE_USER_MUTATION = `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      firstName
      lastName
      middleName
      dateOfBirth
      phoneNumber1
      phoneNumber2
      email
      addressLine1
      addressLine2
      city
      stateProvince
      postalCode
      nationalID
      passportNumber
      nationality
      status
      userType
      userPermissions
      description
      customFieldsData
      userDocuments
      institution {
        id
        name
        currencyCode
        subscriptionTier
        subscriptionStatus
        trialEndDate
        nextBillingDate
        stripeCustomerID
        stripeSubscriptionID
        defaultDateFormat
        defaultCurrencyFormat
        defaultLanguage
        regulatoryRegion
        maxUsers
        maxBranches
        maxStaffPerBranch
        saccoFeaturesEnabled
        staffManagementEnabled
        payrollEnabled
        collectionsModuleEnabled
        customWorkflowsEnabled
        advancedReportingEnabled
        apiIntegrationSettings
        status
        createdAt
        updatedAt
      }
      branch {
        id
        name
        branchCode
        address
        status
        createdAt
        updatedAt
        institutionBranchesId
      }
      userNotifications {
        nextToken
      }
      sentMessages {
        nextToken
      }
      receivedMessages {
        nextToken
      }
      sentNotifications {
        nextToken
      }
      receivedNotifications {
        nextToken
      }
      customUserDetails
      createdAt
      updatedAt
      institutionUsersId
      branchUsersId
    }
  }
`;

/**
 * Updates user details
 * @param {Object} userData - The user data to update
 * @param {string} userData.id - User ID (required)
 * @param {string} userData.firstName - First name
 * @param {string} userData.lastName - Last name
 * @param {string} userData.phoneNumber1 - Phone number
 * @param {string} userData.dateOfBirth - Date of birth
 * @param {string} userData.nationalID - National ID
 * @returns {Promise<Object>} Updated user data
 */
export const updateUser = async (userData) => {
  // Validate that user ID is provided
  if (!userData.id) {
    throw new Error("User ID is required to update user information");
  }

  console.log("Updating user with ID:", userData.id);

  const client = generateClient();

  // Only include fields that should be updated
  const updateInput = {
    id: userData.id,
  };

  // Add only the editable fields that are provided
  if (userData.firstName !== undefined && userData.firstName !== "N/A") {
    updateInput.firstName = userData.firstName;
  }
  if (userData.lastName !== undefined && userData.lastName !== "N/A") {
    updateInput.lastName = userData.lastName;
  }
  if (userData.phoneNumber1 !== undefined && userData.phoneNumber1 !== "N/A") {
    updateInput.phoneNumber1 = userData.phoneNumber1;
  }
  if (userData.dateOfBirth !== undefined && userData.dateOfBirth !== "N/A") {
    updateInput.dateOfBirth = userData.dateOfBirth;
  }
  if (userData.nationalID !== undefined && userData.nationalID !== "N/A") {
    updateInput.nationalID = userData.nationalID;
  }

  console.log("Update user input:", updateInput);

  try {
    const response = await client.graphql({
      query: UPDATE_USER_MUTATION,
      variables: { input: updateInput },
    });

    console.log("Update user response:", response.data.updateUser);
    return response.data.updateUser;
  } catch (error) {
    console.error("Error in updateUser API call:", error);
    throw new Error(`Failed to update user: ${error.message}`);
  }
};
