// Resilient GraphQL client with automatic retry and exponential backoff.
// Wraps Amplify's generateClient() to handle transient network errors
// like ERR_CONNECTION_RESET, ERR_NETWORK, timeouts, etc.

import { generateClient } from "aws-amplify/api";

const client = generateClient();

const isNetworkError = (error) => {
  if (!error) return false;
  const message = error.message || error.toString?.() || "";
  return (
    message.includes("Network") ||
    message.includes("Failed to fetch") ||
    message.includes("CONNECTION_RESET") ||
    message.includes("ECONNRESET") ||
    message.includes("timeout") ||
    message.includes("ERR_CONNECTION") ||
    message.includes("ERR_NAME_NOT_RESOLVED") ||
    message.includes("Load failed") ||
    error.name === "TypeError" // fetch throws TypeError on network failure
  );
};

const isRetryableError = (error) => {
  if (isNetworkError(error)) return true;
  // Also retry on AppSync throttling (status 429)
  if (error?.errors?.some?.((e) => e.errorType === "ThrottlingException")) return true;
  return false;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const graphqlWithRetry = async (options, maxRetries = 3) => {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await client.graphql(options);
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries && isRetryableError(error)) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 8000) + Math.random() * 500;
        console.warn(
          `[resilientClient] Retry ${attempt + 1}/${maxRetries} after ${Math.round(delay)}ms`,
          error.message || error
        );
        await wait(delay);
      } else {
        throw error;
      }
    }
  }
  throw lastError;
};

const resilientClient = {
  ...client,
  graphql: (options) => graphqlWithRetry(options),
  models: client.models,
};

export default resilientClient;
