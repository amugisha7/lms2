import { generateClient } from "aws-amplify/api";
import { remove } from "aws-amplify/storage";

// Fetch user by ID
export const fetchUserById = async (userId) => {
  if (!userId) throw new Error("No user ID provided");

  const client = generateClient();
  const GET_USER_QUERY = `
    query GetUser($id: ID!) {
      getUser(id: $id) {
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
        createdAt
        updatedAt
      }
    }
  `;

  console.log("API Call: Fetching user details");
  const result = await client.graphql({
    query: GET_USER_QUERY,
    variables: { id: userId },
  });

  if (result.data.getUser) {
    return result.data.getUser;
  } else {
    throw new Error("User not found");
  }
};

// Update user by ID
export const updateUserById = async (userId, updateData) => {
  if (!userId) throw new Error("No user ID provided");

  const client = generateClient();
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
        createdAt
        updatedAt
      }
    }
  `;

  console.log("API Call: Updating user");
  const result = await client.graphql({
    query: UPDATE_USER_MUTATION,
    variables: {
      input: {
        id: userId,
        ...updateData,
      },
    },
  });

  return result.data.updateUser;
};

// Delete user by ID
export const deleteUserById = async (userId) => {
  if (!userId) throw new Error("No user ID provided");

  const client = generateClient();
  const DELETE_USER_MUTATION = `
    mutation DeleteUser($input: DeleteUserInput!) {
      deleteUser(input: $input) {
        id
      }
    }
  `;

  console.log("API Call: Deleting user");
  const result = await client.graphql({
    query: DELETE_USER_MUTATION,
    variables: {
      input: { id: userId },
    },
  });

  return result.data.deleteUser;
};