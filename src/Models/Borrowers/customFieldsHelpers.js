import { generateClient } from "aws-amplify/api";
import * as Yup from "yup";

// Fetch custom fields for borrower forms
export const fetchCustomFieldsForBorrower = async (institutionId, branchId) => {
  if (!institutionId || !branchId) {
    return [];
  }

  const client = generateClient();
  
  try {
    console.log("API Call: Fetching custom fields for borrower"); // <-- Add this log
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
            { formKey: { eq: "CreateBorrowerForm" } },
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

// Map borrower custom fields data to form values
export const mapCustomFieldsToFormValues = (borrower, customFields) => {
  if (!borrower || !customFields || customFields.length === 0) {
    return {};
  }

  const customFieldsData = {};
  
  // Initialize all custom fields with empty values
  customFields.forEach((field) => {
    customFieldsData[field.fieldName] = "";
  });

  // Parse and map existing custom fields data if it exists
  if (borrower.customFieldsData) {
    try {
      const existingCustomFields = JSON.parse(borrower.customFieldsData);
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

// Update borrower custom fields API call
export const updateBorrowerCustomFields = async (borrowerId, customFields, formValues) => {
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
    id: borrowerId,
    customFieldsData: JSON.stringify(customFieldsData),
  };

  console.log("API Call: Updating borrower custom fields"); // <-- Add this log

  const UPDATE_BORROWER_CUSTOM_FIELDS_MUTATION = `
    mutation UpdateBorrower($input: UpdateBorrowerInput!) {
      updateBorrower(input: $input) {
        id
        customFieldsData
        updatedAt
      }
    }
  `;

  const result = await client.graphql({
    query: UPDATE_BORROWER_CUSTOM_FIELDS_MUTATION,
    variables: { input },
  });

  return result.data.updateBorrower;
};