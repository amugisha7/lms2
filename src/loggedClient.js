// Logged API client for debugging GraphQL calls.

import resilientClient from "./resilientClient";

const getDocumentString = (query) => {
  if (typeof query === "string") {
    return query.trim();
  }

  return query?.loc?.source?.body?.trim?.() || "";
};

const getOperationMetadata = (document) => {
  const match = document.match(
    /^(query|mutation|subscription)\s+([A-Za-z0-9_]+)?\s*(?:\(([\s\S]*?)\))?/m,
  );

  if (!match) {
    return {
      operationType: "graphql",
      operationName: "AnonymousOperation",
      schema: null,
    };
  }

  const [, operationType, operationName, variableDefinitions] = match;

  return {
    operationType,
    operationName: operationName || "AnonymousOperation",
    schema: variableDefinitions
      ? variableDefinitions.replace(/\s+/g, " ").trim()
      : null,
  };
};

const logGraphqlRequest = (options) => {
  const document = getDocumentString(options?.query);
  const metadata = getOperationMetadata(document);

  console.groupCollapsed(
    `[API Call] ${metadata.operationType} ${metadata.operationName}`,
  );
  console.log("Schema:", metadata.schema || "No variables");
  console.log("Variables:", options?.variables || null);
  console.log("Document:", document || options?.query || "Unknown query");
  console.groupEnd();

  return metadata;
};

const loggedClient = {
  ...resilientClient,
  graphql: async (options) => {
    const metadata = logGraphqlRequest(options);

    try {
      const result = await resilientClient.graphql(options);
      console.log(
        `[API Response] ${metadata.operationType} ${metadata.operationName}`,
        result,
      );
      return result;
    } catch (error) {
      console.error(
        `[API Error] ${metadata.operationType} ${metadata.operationName}`,
        error,
      );
      throw error;
    }
  },
};

export default loggedClient;