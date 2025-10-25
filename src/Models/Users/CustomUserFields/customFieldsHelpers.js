import { generateClient } from "aws-amplify/api";
import * as Yup from "yup";

// Fetch custom fields for user forms
export const fetchCustomFieldsForUser = async (institutionId, branchId) => {
  if (!institutionId || !branchId) {
    return [];
  }

  const client = generateClient();

  try {
    console.log("API Call: Fetching custom fields for user"); // <-- Add this log
    const res = await client.graphql({
      query: `
        query ListCustomFormFields(
          $filter: ModelCustomFormFieldFilterInput
          $limit: Int
          $nextToken: String
        ) {
          listCustomFormFields(filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
              id
              formKey
              label
              fieldType
              options
              required
              createdAt
            }
          }
        }
      `,
      variables: {
        filter: {
          and: [
            { formKey: { eq: "CreateUserForm" } },
            {
              or: [
                { institutionCustomFormFieldsId: { eq: institutionId } },
                { branchCustomFormFieldsId: { eq: branchId } },
              ],
            },
          ],
        },
      },
    });

    if (res.data.listCustomFormFields.items.length > 0) {
      const sortedFields = res.data.listCustomFormFields.items.sort(
        (a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
      );

      const fieldsWithParsedOptions = sortedFields.map((field) => ({
        ...field,
        options: field.options ? JSON.parse(field.options) : null,
        fieldName: `custom_${field.id}`, // Use unique field name based on ID
      }));

      return fieldsWithParsedOptions;
    }

    return [];
  } catch (error) {
    console.error("Error fetching custom fields:", error);
    return [];
  }
};

// Map user custom fields data to form values
export const mapCustomFieldsToFormValues = (user, customFields) => {
  if (!user || !customFields || customFields.length === 0) {
    return {};
  }

  const customFieldsData = {};

  // Initialize all custom fields with empty values
  customFields.forEach((field) => {
    customFieldsData[field.fieldName] = "";
  });

  // Parse and map existing custom fields data if it exists
  if (user.customFieldsData) {
    try {
      const existingCustomFields = JSON.parse(user.customFieldsData);
      customFields.forEach((field) => {
        const fieldData = existingCustomFields[field.id];
        if (fieldData && fieldData.value !== undefined) {
          customFieldsData[field.fieldName] = fieldData.value || "";
        }
      });
    } catch (e) {
      console.warn("Error parsing custom fields data:", e);
    }
  }

  return customFieldsData;
};

// Update user custom fields API call
export const updateUserCustomFields = async (userId, customFields, formValues, institutionUsersId, branchUsersId) => {
  const client = generateClient();

  const customFieldsData = {};
  customFields.forEach((field) => {
    const value = formValues[field.fieldName];
    customFieldsData[field.id] = {
      fieldId: field.id,
      label: field.label,
      fieldType: field.fieldType,
      value: typeof value === "string" ? value.trim() || null : value || null,
    };
  });

  const input = {
    id: userId,
    customFieldsData: JSON.stringify(customFieldsData),
    institutionUsersId,
    branchUsersId,
  };

  console.log("API Call: Updating user custom fields"); // <-- Add this log

  const UPDATE_USER_CUSTOM_FIELDS_MUTATION = `
    mutation UpdateUser($input: UpdateUserInput!) {
      updateUser(input: $input) {
        id
        userType
        status
        institutionUsersId
        branchUsersId
        customFieldsData
        updatedAt
        institution {
          id
          name
          currencyCode
        }
        branch {
          id
          name
        }
      }
    }
  `;

  const result = await client.graphql({
    query: UPDATE_USER_CUSTOM_FIELDS_MUTATION,
    variables: { input },
  });

  return result.data.updateUser;
};