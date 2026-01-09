import { generateClient } from "aws-amplify/api";

const UPDATE_INSTITUTION_MUTATION = `
  mutation UpdateInstitution($input: UpdateInstitutionInput!) {
    updateInstitution(input: $input) {
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
      customDocumentHeader
      customInstitutionDetails
      status
      createdAt
      updatedAt
    }
  }
`;

/**
 * Updates institution settings
 * @param {Object} institutionData - The institution data to update
 * @param {string} institutionData.id - Institution ID (required)
 * @param {string} institutionData.name - Institution name
 * @param {string} institutionData.regulatoryRegion - Country/region
 * @param {string} institutionData.currencyCode - Currency code
 * @param {string} institutionData.defaultCurrencyFormat - Currency format
 * @param {string} institutionData.defaultDateFormat - Date format
 * @param {string} institutionData.defaultLanguage - Default language
 * @returns {Promise<Object>} Updated institution data
 */
export const updateInstitution = async (institutionData) => {
  // Validate that institution ID is provided
  if (!institutionData.id) {
    throw new Error("Institution ID is required to update institution settings");
  }

  console.log("Updating institution with ID:", institutionData.id);

  const client = generateClient();

  // Only include fields that should be updated
  const updateInput = {
    id: institutionData.id,
  };

  // Add only the fields that are provided and should be updated
  if (institutionData.name !== undefined) {
    updateInput.name = institutionData.name;
  }
  if (institutionData.regulatoryRegion !== undefined) {
    updateInput.regulatoryRegion = institutionData.regulatoryRegion;
  }
  if (institutionData.currencyCode !== undefined) {
    updateInput.currencyCode = institutionData.currencyCode;
  }
  if (institutionData.defaultCurrencyFormat !== undefined) {
    updateInput.defaultCurrencyFormat = institutionData.defaultCurrencyFormat;
  }
  if (institutionData.defaultDateFormat !== undefined) {
    updateInput.defaultDateFormat = institutionData.defaultDateFormat;
  }

  if (institutionData.defaultLanguage !== undefined) {
    updateInput.defaultLanguage = institutionData.defaultLanguage;
  }
  // Allow updating customDocumentHeader
  if (institutionData.customDocumentHeader !== undefined) {
    updateInput.customDocumentHeader = institutionData.customDocumentHeader;
  }

  console.log("Update institution input:", updateInput);

  try {
    const response = await client.graphql({
      query: UPDATE_INSTITUTION_MUTATION,
      variables: { input: updateInput },
    });

    console.log("Update institution response:", response.data.updateInstitution);
    return response.data.updateInstitution;
  } catch (error) {
    console.error("Error in updateInstitution API call:", error);
    throw new Error(`Failed to update institution: ${error.message}`);
  }
};
