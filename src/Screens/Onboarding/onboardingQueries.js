export const CREATE_INSTITUTION_MUTATION = `mutation CreateInstitution($input: CreateInstitutionInput!) {
  createInstitution(input: $input) { id }
}`;

export const CREATE_BRANCH_MUTATION = `mutation CreateBranch($input: CreateBranchInput!) {
  createBranch(input: $input) { id }
}`;

export const CREATE_USER_MUTATION = `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) { 
    id
    userType
    status
    institutionUsersId
    branchUsersId
  }
}`;

export const CREATE_ACCOUNT_MUTATION = `mutation CreateAccount($input: CreateAccountInput!) {
  createAccount(input: $input) { id }
}`;

export const GET_INSTITUTION_QUERY = `query GetInstitution($id: ID!) {
  getInstitution(id: $id) { id }
}`;

export const LIST_USERS_QUERY = `query ListUsers($filter: ModelUserFilterInput) {
  listUsers(filter: $filter) {
    items {
      id
      email
    }
  }
}`;

export const CREATE_LOAN_PRODUCT_MUTATION = `mutation CreateLoanProduct($input: CreateLoanProductInput!) {
  createLoanProduct(input: $input) { id }
}`;

export const CREATE_BRANCH_LOAN_PRODUCT_MUTATION = `mutation CreateBranchLoanProduct($input: CreateBranchLoanProductInput!) {
  createBranchLoanProduct(input: $input) { id }
}`;
