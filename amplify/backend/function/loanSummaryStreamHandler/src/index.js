import { getLoanIdFromStreamRecord, syncLoanSummaryByLoanId } from "./syncRuntime.js";

export const handler = async (event) => {
  const impactedLoanIds = new Set();

  for (const record of event?.Records || []) {
    const loanIds = getLoanIdFromStreamRecord(record);
    loanIds.forEach((loanId) => impactedLoanIds.add(loanId));
  }

  const results = [];
  for (const loanId of impactedLoanIds) {
    results.push(
      await syncLoanSummaryByLoanId(loanId, {
        logger: console,
        reason: "dynamodb-stream",
      }),
    );
  }

  return {
    processedRecords: event?.Records?.length || 0,
    syncedLoans: results.length,
    results,
  };
};