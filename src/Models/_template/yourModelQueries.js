// GraphQL queries template for new models
// Copy this file and replace all instances of "YourModel" with your actual model name

export const LIST_YOUR_MODELS_QUERY = `
  query ListYourModels($branchId: ID!, $nextToken: String) {
    listYourModels(
      filter: { branchYourModelsId: { eq: $branchId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
        id
        name
        email
        # TODO: Add all fields for your model
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const GET_YOUR_MODEL_QUERY = `
  query GetYourModel($id: ID!) {
    getYourModel(id: $id) {
      id
      name
      email
      # TODO: Add all fields for your model
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_YOUR_MODEL_MUTATION = `
  mutation CreateYourModel($input: CreateYourModelInput!) {
    createYourModel(input: $input) {
      id
      name
      email
      # TODO: Add all fields for your model
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_YOUR_MODEL_MUTATION = `
  mutation UpdateYourModel($input: UpdateYourModelInput!) {
    updateYourModel(input: $input) {
      id
      name
      email
      # TODO: Add all fields for your model
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_YOUR_MODEL_MUTATION = `
  mutation DeleteYourModel($input: DeleteYourModelInput!) {
    deleteYourModel(input: $input) {
      id
    }
  }
`;