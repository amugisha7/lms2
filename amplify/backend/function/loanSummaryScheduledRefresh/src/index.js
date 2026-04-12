import { listDueLoanSummaryIds, syncLoanSummaryByLoanId } from "./syncRuntime.js";

const MAX_BATCHES = 10;
const PAGE_SIZE = 100;

export const handler = async () => {
  const processedLoanIds = new Set();
  let nextToken;
  let batches = 0;

  do {
    const page = await listDueLoanSummaryIds({
      dueBefore: new Date().toISOString(),
      limit: PAGE_SIZE,
      exclusiveStartKey: nextToken,
    });

    nextToken = page.nextToken;
    const loanIds = page.items
      .map((item) => item.loanID || item.id)
      .filter(Boolean)
      .filter((loanId) => !processedLoanIds.has(loanId));

    for (const loanId of loanIds) {
      processedLoanIds.add(loanId);
      await syncLoanSummaryByLoanId(loanId, {
        logger: console,
        reason: "scheduled-refresh",
      });
    }

    batches += 1;
  } while (nextToken && batches < MAX_BATCHES);

  return {
    refreshedLoans: processedLoanIds.size,
    hasMore: Boolean(nextToken),
    batchesProcessed: batches,
  };
};