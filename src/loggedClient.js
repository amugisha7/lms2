// Logged API client for debugging GraphQL calls

import { generateClient } from "aws-amplify/api";

const originalClient = generateClient();

const loggedClient = {
  ...originalClient,
  graphql: async (options) => {
    console.log('API Call:', options.query?.trim().split('\n')[0] || 'Unknown query', options.variables);
    try {
      const result = await originalClient.graphql(options);
      console.log('API Response:', result);
      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

export default loggedClient;