// GraphQL queries for Users
export const LIST_USERS_QUERY = `
  query ListUsers($branchId: ID!, $nextToken: String) {
    listUsers(
      filter: { branchUsersId: { eq: $branchId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;

export const CREATE_USER_MUTATION = `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
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

export const UPDATE_USER_MUTATION = `
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

export const DELETE_USER_MUTATION = `
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      id
    }
  }
`;