// GraphQL queries for Borrowers
export const GET_BRANCH_BORROWERS_QUERY = `
  query GetBranchBorrowers($id: ID!, $limit: Int, $nextToken: String) {
    getBranch(id: $id) {
      id
      borrowers(limit: $limit, nextToken: $nextToken) {
        items {
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
          status
          branchBorrowersId
          branch {
            id
            name
            institutionBranchesId
          }
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;

export const LIST_BORROWERS_QUERY = `
  query ListBorrowers($filter: ModelBorrowerFilterInput, $limit: Int, $nextToken: String) {
    listBorrowers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        status
        branchBorrowersId
        branch {
          id
          name
          institutionBranchesId
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const CREATE_BORROWER_MUTATION = `
  mutation CreateBorrower($input: CreateBorrowerInput!) {
    createBorrower(input: $input) {
      id
      firstname
      othername
      businessName
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
      status
      branchBorrowersId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_BORROWER_MUTATION = `
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
      status
      branchBorrowersId
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_BORROWER_MUTATION = `
  mutation DeleteBorrower($input: DeleteBorrowerInput!) {
    deleteBorrower(input: $input) {
      id
    }
  }
`;