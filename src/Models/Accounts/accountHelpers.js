import { generateClient } from "aws-amplify/api";

// Constants
export const ACCOUNT_STATUS_ACTIVE = "active";
export const ACCOUNT_TYPE_USER = "user";

// GraphQL queries and mutations
export const LIST_ACCOUNTS_QUERY = `
  query ListAccounts($institutionId: ID!, $nextToken: String) {
    listAccounts(
      filter: { institutionAccountsId: { eq: $institutionId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
        id
        name
        openingBalance
        status
        currency
        accountType
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const CREATE_ACCOUNT_MUTATION = `
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      id
      name
      openingBalance
      status
      currency
      accountType
      description
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_ACCOUNT_MUTATION = `
  mutation DeleteAccount($input: DeleteAccountInput!) {
    deleteAccount(input: $input) {
      id
    }
  }
`;

export const UPDATE_ACCOUNT_MUTATION = `
  mutation UpdateAccount($input: UpdateAccountInput!) {
    updateAccount(input: $input) {
      id
      name
      openingBalance
      status
      currency
      accountType
      description
      createdAt
      updatedAt
    }
  }
`;

/**
 * Fetch all accounts with pagination support
 * @param {Object} client - The GraphQL client instance
 * @param {Object} variables - Query variables including institutionId
 * @param {Function} setAccountsLoading - State setter for loading status
 * @returns {Promise<Array>} - List of all accounts
 */
export const fetchAccounts = async (client, variables = {}, setAccountsLoading) => {
  console.log("Fetching accounts with pagination...");
  if (setAccountsLoading) setAccountsLoading(true);
  
  try {
    let allAccountsList = [];
    let nextToken = null;
    let iteration = 0;
    
    while (true) {
      const queryVariables = {
        ...variables,
        ...(nextToken && { nextToken }),
      };
      
      console.log(
        `Fetching batch ${iteration + 1} with nextToken: ${
          nextToken || "null"
        }`
      );
      console.log("API Query: LIST_ACCOUNTS_QUERY", {
        variables: queryVariables,
      });
      
      const result = await client.graphql({
        query: LIST_ACCOUNTS_QUERY,
        variables: queryVariables,
      });
      
      // Defensive: handle unexpected shapes
      const listResult = result?.data?.listAccounts || {};
      const batchItems = Array.isArray(listResult.items)
        ? listResult.items
        : [];
      allAccountsList.push(...batchItems);
      
      const newNextToken = listResult.nextToken || null;
      console.log(
        `Fetched ${batchItems.length} accounts in this batch. Total: ${allAccountsList.length}. NextToken: ${newNextToken}`
      );
      
      // Break conditions
      if (!newNextToken) {
        console.log("No nextToken returned. Pagination complete.");
        break;
      }
      if (newNextToken === nextToken) {
        console.warn(
          "Next token did not advance. Stopping to prevent infinite loop."
        );
        break;
      }
      if (++iteration > 50) {
        console.warn(
          "Safety cap (50 iterations) reached. Stopping pagination."
        );
        break;
      }
      nextToken = newNextToken;
    }
    
    console.log(
      `Finished fetching all accounts. Total count: ${allAccountsList.length}`
    );
    return allAccountsList;
  } catch (err) {
    console.error("Error fetching accounts with pagination:", err);
    throw err;
  } finally {
    if (setAccountsLoading) setAccountsLoading(false);
  }
};

/**
 * Create a new account
 * @param {Object} client - The GraphQL client instance
 * @param {Object} values - Form values for the new account
 * @param {Object} userDetails - User details including institution info
 * @returns {Promise<Object>} - Created account data
 */
export const createAccount = async (client, values, userDetails) => {
  if (!userDetails?.institutionUsersId) {
    throw new Error("Error: Please try refreshing the page.");
  }

  const input = {
    institutionAccountsId: userDetails.institutionUsersId,
    name: values.name?.trim() || null,
    openingBalance: parseFloat(values.openingBalance) || 0,
    status: ACCOUNT_STATUS_ACTIVE,
    currency: values.currency || userDetails.institution.currencyCode,
    accountType: ACCOUNT_TYPE_USER,
    description: values.description?.trim() || null,
  };

  console.log("API Mutation: CREATE_ACCOUNT_MUTATION", {
    variables: { input },
  });
  
  const result = await client.graphql({
    query: CREATE_ACCOUNT_MUTATION,
    variables: { input },
  });

  return result.data.createAccount;
};

/**
 * Update an existing account
 * @param {Object} client - The GraphQL client instance
 * @param {Object} values - Updated form values
 * @param {Object} initialValues - Original account data
 * @param {Object} userDetails - User details including institution info
 * @returns {Promise<Object>} - Updated account data
 */
export const updateAccount = async (client, values, initialValues, userDetails) => {
  const input = {
    id: initialValues.id,
    name: values.name?.trim() || null,
    openingBalance: parseFloat(values.openingBalance) || 0,
    status: values.status || ACCOUNT_STATUS_ACTIVE,
    currency: values.currency || userDetails.institution.currencyCode,
    accountType: ACCOUNT_TYPE_USER,
    description: values.description?.trim() || null,
  };

  console.log("API Mutation: UPDATE_ACCOUNT_MUTATION", {
    variables: { input },
  });
  
  const result = await client.graphql({
    query: UPDATE_ACCOUNT_MUTATION,
    variables: { input },
  });

  return result.data.updateAccount;
};
