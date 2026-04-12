import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  ListTablesCommand,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { buildLoanSummaryRecord } from "./projection.js";

const dynamo = new DynamoDBClient({});

const TABLE_MODEL_NAMES = Object.freeze({
  loan: "Loan",
  borrower: "Borrower",
  branch: "Branch",
  institution: "Institution",
  employee: "Employee",
  loanProduct: "LoanProduct",
  payment: "Payment",
  penalty: "Penalty",
  loanSummary: "LoanSummary",
});

const TABLE_NAME_OVERRIDES = Object.freeze({
  loan: process.env.LOAN_TABLE_NAME,
  borrower: process.env.BORROWER_TABLE_NAME,
  branch: process.env.BRANCH_TABLE_NAME,
  institution: process.env.INSTITUTION_TABLE_NAME,
  employee: process.env.EMPLOYEE_TABLE_NAME,
  loanProduct: process.env.LOAN_PRODUCT_TABLE_NAME,
  payment: process.env.PAYMENT_TABLE_NAME,
  penalty: process.env.PENALTY_TABLE_NAME,
  loanSummary: process.env.LOAN_SUMMARY_TABLE_NAME,
});

const tableNameCache = new Map();
let activeApiIdCache;

const PAYMENT_BY_LOAN_INDEX = process.env.PAYMENT_BY_LOAN_INDEX || "byLoan";
const PENALTY_BY_LOAN_INDEX =
  process.env.PENALTY_BY_LOAN_INDEX || "gsi-Loan.penalties";
const PENALTY_BY_LOAN_INDEX_FALLBACKS = Array.from(
  new Set([PENALTY_BY_LOAN_INDEX, "gsi-Loan.penalties", "byLoan"].filter(Boolean)),
);
const PENALTY_LOAN_KEY = process.env.PENALTY_LOAN_KEY || "loanPenaltiesId";
const REFRESH_SCOPE = "LOAN_SUMMARY";

const isDeletedItem = (item) => Boolean(item?._deleted);

const loadAllTableNames = async () => {
  const tableNames = [];
  let ExclusiveStartTableName;

  do {
    const result = await dynamo.send(
      new ListTablesCommand({ ExclusiveStartTableName }),
    );
    tableNames.push(...(result.TableNames || []));
    ExclusiveStartTableName = result.LastEvaluatedTableName;
  } while (ExclusiveStartTableName);

  return tableNames;
};

const getEnvSuffix = () => (process.env.ENV ? `-${process.env.ENV}` : null);

const extractApiIdFromTableName = ({ tableName, modelName }) => {
  if (!tableName || !modelName || !tableName.startsWith(`${modelName}-`)) {
    return null;
  }

  const envSuffix = getEnvSuffix();
  const withoutPrefix = tableName.slice(`${modelName}-`.length);

  if (envSuffix && withoutPrefix.endsWith(envSuffix)) {
    return withoutPrefix.slice(0, -envSuffix.length) || null;
  }

  return withoutPrefix || null;
};

const resolveActiveApiId = async (tableNames) => {
  if (activeApiIdCache !== undefined) {
    return activeApiIdCache;
  }

  const summaryOverride = TABLE_NAME_OVERRIDES.loanSummary;
  if (summaryOverride) {
    activeApiIdCache = extractApiIdFromTableName({
      tableName: summaryOverride,
      modelName: TABLE_MODEL_NAMES.loanSummary,
    });
    return activeApiIdCache;
  }

  const envSuffix = getEnvSuffix();
  const summaryMatches = (tableNames || []).filter(
    (name) =>
      name.startsWith(`${TABLE_MODEL_NAMES.loanSummary}-`) &&
      (!envSuffix || name.endsWith(envSuffix)),
  );

  activeApiIdCache = extractApiIdFromTableName({
    tableName: summaryMatches[0],
    modelName: TABLE_MODEL_NAMES.loanSummary,
  });

  return activeApiIdCache;
};

const resolveTableName = async (tableKey) => {
  if (tableNameCache.has(tableKey)) {
    return tableNameCache.get(tableKey);
  }

  const overrideName = TABLE_NAME_OVERRIDES[tableKey];
  if (overrideName) {
    tableNameCache.set(tableKey, overrideName);
    return overrideName;
  }

  const modelName = TABLE_MODEL_NAMES[tableKey];
  if (!modelName) {
    throw new Error(`Unknown table key ${tableKey}`);
  }

  const envSuffix = process.env.ENV ? `-${process.env.ENV}` : null;
  const tableNames = await loadAllTableNames();
  const matches = tableNames.filter((name) => name.startsWith(`${modelName}-`));
  const activeApiId = await resolveActiveApiId(tableNames);
  const activeMatch = activeApiId
    ? matches.find(
        (name) => name === `${modelName}-${activeApiId}${envSuffix || ""}`,
      )
    : null;

  const preferredMatch =
    activeMatch ||
    matches.find((name) => (envSuffix ? name.endsWith(envSuffix) : false)) ||
    matches.find((name) => name.endsWith("-NONE")) ||
    matches.find((name) => /^.+-[A-Za-z0-9]+-[A-Za-z0-9]+$/.test(name)) ||
    matches[0];

  if (!preferredMatch) {
    throw new Error(`Unable to resolve DynamoDB table name for ${modelName}`);
  }

  tableNameCache.set(tableKey, preferredMatch);
  return preferredMatch;
};

const getItemById = async (tableKey, id) => {
  if (!id) return null;
  const tableName = await resolveTableName(tableKey);
  const result = await dynamo.send(
    new GetItemCommand({
      TableName: tableName,
      Key: marshall({ id }),
    }),
  );

  if (!result.Item) return null;
  const item = unmarshall(result.Item);
  return isDeletedItem(item) ? null : item;
};

const queryItems = async ({ tableName, indexName, keyName, keyValue }) => {
  if (!keyValue) return [];

  const resolvedTableName = await resolveTableName(tableName);

  const items = [];
  let nextKey;
  do {
    const result = await dynamo.send(
      new QueryCommand({
        TableName: resolvedTableName,
        IndexName: indexName,
        KeyConditionExpression: "#key = :keyValue",
        ExpressionAttributeNames: {
          "#key": keyName,
        },
        ExpressionAttributeValues: marshall({
          ":keyValue": keyValue,
        }),
        ExclusiveStartKey: nextKey,
      }),
    );

    const pageItems = (result.Items || [])
      .map((item) => unmarshall(item))
      .filter(Boolean)
      .filter((item) => !isDeletedItem(item));

    items.push(...pageItems);
    nextKey = result.LastEvaluatedKey;
  } while (nextKey);

  return items;
};

const queryPenaltyItems = async ({ loanId }) => {
  let lastError;

  for (const indexName of PENALTY_BY_LOAN_INDEX_FALLBACKS) {
    try {
      return await queryItems({
        tableName: "penalty",
        indexName,
        keyName: PENALTY_LOAN_KEY,
        keyValue: loanId,
      });
    } catch (error) {
      if (error?.name !== "ValidationException") {
        throw error;
      }

      lastError = error;
    }
  }

  throw lastError;
};

const fetchLoanSource = async (loanId) => {
  const loan = await getItemById("loan", loanId);
  if (!loan || isDeletedItem(loan)) {
    return null;
  }

  const [payments, penalties] = await Promise.all([
    queryItems({
      tableName: "payment",
      indexName: PAYMENT_BY_LOAN_INDEX,
      keyName: "loanID",
      keyValue: loanId,
    }),
    queryPenaltyItems({ loanId }),
  ]);

  const [borrower, branch, employee, loanProduct] = await Promise.all([
    getItemById("borrower", loan.borrowerID),
    getItemById("branch", loan.branchID),
    getItemById("employee", loan.createdByEmployeeID),
    getItemById("loanProduct", loan.loanProductID),
  ]);

  const institutionId =
    loan.institutionID ||
    branch?.institutionBranchesId ||
    branch?.institutionID ||
    null;
  const institution = await getItemById("institution", institutionId);

  return {
    ...loan,
    borrower,
    branch: branch
      ? {
          ...branch,
          institution,
        }
      : null,
    createdByEmployee: employee,
    loanProduct,
    payments: {
      items: payments,
    },
    penalties: {
      items: penalties,
    },
  };
};

const getExistingSummary = async (loanId) => getItemById("loanSummary", loanId);

export const deleteLoanSummaryByLoanId = async (loanId, logger = console) => {
  if (!loanId) return false;
  const loanSummaryTableName = await resolveTableName("loanSummary");
  await dynamo.send(
    new DeleteItemCommand({
      TableName: loanSummaryTableName,
      Key: marshall({ id: loanId }),
    }),
  );
  logger.info?.(`[loanSummarySync] deleted summary for ${loanId}`);
  return true;
};

export const syncLoanSummaryByLoanId = async (loanId, options = {}) => {
  const logger = options.logger || console;
  if (!loanId) {
    return { loanId, action: "skipped", reason: "missing-loan-id" };
  }

  const sourceLoan = await fetchLoanSource(loanId);
  if (!sourceLoan) {
    await deleteLoanSummaryByLoanId(loanId, logger);
    return { loanId, action: "deleted", reason: "loan-missing" };
  }

  const summaryRecord = buildLoanSummaryRecord(sourceLoan, {
    defaultInstitutionId:
      sourceLoan.institutionID || sourceLoan.branch?.institution?.id || null,
    defaultCurrencyCode:
      sourceLoan.loanCurrency || sourceLoan.branch?.institution?.currencyCode || null,
  });

  if (!summaryRecord) {
    await deleteLoanSummaryByLoanId(loanId, logger);
    return { loanId, action: "deleted", reason: "loan-not-summary-candidate" };
  }

  const existingSummary = await getExistingSummary(loanId);
  const nowIso = new Date().toISOString();
  const loanSummaryTableName = await resolveTableName("loanSummary");
  const persistedRecord = {
    ...existingSummary,
    ...summaryRecord,
    id: loanId,
    loanID: loanId,
    refreshScope: REFRESH_SCOPE,
    __typename: "LoanSummary",
    createdAt: existingSummary?.createdAt || nowIso,
    updatedAt: nowIso,
  };

  await dynamo.send(
    new PutItemCommand({
      TableName: loanSummaryTableName,
      Item: marshall(persistedRecord, { removeUndefinedValues: true }),
    }),
  );

  logger.info?.(
    `[loanSummarySync] synced summary for ${loanId}` +
      (options.reason ? ` (${options.reason})` : ""),
  );

  return {
    loanId,
    action: existingSummary ? "updated" : "created",
    summary: persistedRecord,
  };
};

export const listDueLoanSummaryIds = async ({
  dueBefore = new Date().toISOString(),
  limit = 100,
  exclusiveStartKey,
} = {}) => {
  const loanSummaryTableName = await resolveTableName("loanSummary");
  const result = await dynamo.send(
    new QueryCommand({
      TableName: loanSummaryTableName,
      IndexName: "byRefreshScope",
      KeyConditionExpression:
        "refreshScope = :refreshScope AND nextStatusTransitionAt <= :dueBefore",
      ExpressionAttributeValues: marshall({
        ":refreshScope": REFRESH_SCOPE,
        ":dueBefore": dueBefore,
      }),
      Limit: limit,
      ExclusiveStartKey: exclusiveStartKey,
    }),
  );

  return {
    items: (result.Items || []).map((item) => unmarshall(item)),
    nextToken: result.LastEvaluatedKey,
  };
};

export const getTableNameFromStreamArn = (streamArn) => {
  if (!streamArn || typeof streamArn !== "string") return null;
  const marker = ":table/";
  const markerIndex = streamArn.indexOf(marker);
  if (markerIndex === -1) return null;
  return streamArn.slice(markerIndex + marker.length).split("/")[0] || null;
};

export const getLoanIdFromStreamRecord = (record) => {
  const tableName = getTableNameFromStreamArn(record?.eventSourceARN);
  const newImage = record?.dynamodb?.NewImage ? unmarshall(record.dynamodb.NewImage) : null;
  const oldImage = record?.dynamodb?.OldImage ? unmarshall(record.dynamodb.OldImage) : null;

  if (tableName?.startsWith("Loan-") && !tableName.startsWith("LoanSummary-")) {
    return [newImage?.id || oldImage?.id].filter(Boolean);
  }

  if (tableName?.startsWith("Payment-")) {
    return [newImage?.loanID, oldImage?.loanID].filter(Boolean);
  }

  if (tableName?.startsWith("Penalty-")) {
    return [newImage?.[PENALTY_LOAN_KEY], oldImage?.[PENALTY_LOAN_KEY]].filter(Boolean);
  }

  return [];
};