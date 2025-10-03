import { generateClient } from "aws-amplify/api";

// Fetch borrower by ID
export const fetchBorrowerById = async (borrowerId) => {
  if (!borrowerId) throw new Error("No borrower ID provided");

  const client = generateClient();
  const GET_BORROWER_QUERY = `
    query GetBorrower($id: ID!) {
      getBorrower(id: $id) {
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
        creditScore
        customFieldsData
        borrowerDocuments
        createdAt
        updatedAt
      }
    }
  `;

  console.log("API Call: Fetching borrower details");
  const result = await client.graphql({
    query: GET_BORROWER_QUERY,
    variables: { id: borrowerId },
  });

  if (result.data.getBorrower) {
    // Parse borrowerDocuments if present
    const borrower = result.data.getBorrower;
    if (borrower.borrowerDocuments) {
      try {
        borrower.borrowerDocuments = JSON.parse(borrower.borrowerDocuments);
      } catch (e) {
        borrower.borrowerDocuments = [];
      }
    } else {
      borrower.borrowerDocuments = [];
    }
    return borrower;
  } else {
    throw new Error("Borrower not found");
  }
};

// Update borrower by ID
export const updateBorrowerById = async (values, initialValues) => {
  const client = generateClient();
  const UPDATE_BORROWER_MUTATION = `
    mutation UpdateBorrower($input: UpdateBorrowerInput!) {
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
        creditScore
        customFieldsData
        createdAt
        updatedAt
      }
    }
  `;

  console.log("UpdateBorrower Form Values:", values);
  console.log("API Call: Updating borrower");

  const input = {
    id: initialValues.id,
    firstname: values.firstname?.trim() || null,
    othername: values.othername?.trim() || null,
    businessName: values.businessName?.trim() || null,
    typeOfBusiness: values.typeOfBusiness?.trim() || null,
    uniqueIdNumber: values.uniqueIdNumber?.trim() || null,
    phoneNumber: values.phoneNumber?.trim() || null,
    otherPhoneNumber: values.otherPhoneNumber?.trim() || null,
    email: values.email?.trim() || null,
    gender: values.gender || null,
    dateOfBirth: values.dateOfBirth || null,
    nationality: values.nationality || null,
    address: values.address?.trim() || null,
    city: values.city?.trim() || null,
    state: values.state?.trim() || null,
    title: values.title || null,
    zipcode: values.zipcode?.trim() || null,
    employmentStatus: values.employmentStatus || null,
    employerName: values.employerName?.trim() || null,
    creditScore: values.creditScore?.trim() || null,
  };

  const customFieldsData = {};
  Object.keys(values).forEach((key) => {
    if (key.startsWith("custom_")) {
      const fieldId = key.replace("custom_", "");
      customFieldsData[fieldId] = {
        fieldId,
        value:
          typeof values[key] === "string"
            ? values[key].trim() || null
            : values[key] || null,
      };
    }
  });
  if (Object.keys(customFieldsData).length > 0) {
    input.customFieldsData = JSON.stringify(customFieldsData);
  }

  const result = await client.graphql({
    query: UPDATE_BORROWER_MUTATION,
    variables: { input },
  });

  return result.data.updateBorrower;
};
