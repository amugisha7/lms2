import { generateClient } from "aws-amplify/api";

const UPDATE_LOAN_CUSTOM_DETAILS_MUTATION = `
  mutation UpdateLoanCustomDetails($input: UpdateLoanInput!) {
    updateLoan(input: $input) {
      id
      customLoanDetails
      updatedAt
    }
  }
`;

export const parseCustomLoanDetails = (raw) => {
  if (raw == null) return {};
  if (typeof raw === "object") return { ...raw };
  if (typeof raw !== "string" || !raw.trim()) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const safeJsonStringify = (value) => {
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
};

const nowIso = () => new Date().toISOString();

// Returns the current stop-interest state from a loan record, or null when
// interest has never been paused. `resumedAt` set means a previously paused
// loan has been resumed.
export const getStopInterestState = (loan) => {
  const details = parseCustomLoanDetails(loan?.customLoanDetails);
  const stop = details?.stopInterest;
  if (!stop || typeof stop !== "object") return null;
  return {
    stoppedAt: stop.stoppedAt || null,
    resumedAt: stop.resumedAt || null,
    reason: stop.reason || null,
  };
};

// True when the loan currently has interest paused (stoppedAt set and no
// subsequent resumedAt).
export const isInterestStopped = (loan) => {
  const state = getStopInterestState(loan);
  if (!state?.stoppedAt) return false;
  if (!state.resumedAt) return true;
  return new Date(state.resumedAt) < new Date(state.stoppedAt);
};

// Pause interest accrual on the loan. Stores `{ stoppedAt, reason, resumedAt: null }`
// inside `loan.customLoanDetails.stopInterest`. Reversible via `resumeInterest`.
export const stopInterest = async ({ loan, reason, client } = {}) => {
  if (!loan?.id) {
    throw new Error("stopInterest requires a loan id");
  }

  const details = parseCustomLoanDetails(loan.customLoanDetails);
  const stoppedAt = nowIso();
  const nextStopInterest = {
    stoppedAt,
    resumedAt: null,
    reason: reason ? String(reason).trim() : null,
  };
  const history = Array.isArray(details.stopInterestHistory)
    ? details.stopInterestHistory.slice()
    : [];
  history.push({ ...nextStopInterest, action: "STOP" });

  const nextDetails = {
    ...details,
    stopInterest: nextStopInterest,
    stopInterestHistory: history,
  };

  const resolvedClient = client || generateClient();
  const result = await resolvedClient.graphql({
    query: UPDATE_LOAN_CUSTOM_DETAILS_MUTATION,
    variables: {
      input: {
        id: loan.id,
        customLoanDetails: safeJsonStringify(nextDetails),
      },
    },
  });

  return {
    customLoanDetails: result?.data?.updateLoan?.customLoanDetails || null,
    state: nextStopInterest,
  };
};

// Resume interest accrual on the loan. Stamps `resumedAt` onto the current
// stopInterest record so historic periods remain paused but accrual resumes
// from this date forward.
export const resumeInterest = async ({ loan, client } = {}) => {
  if (!loan?.id) {
    throw new Error("resumeInterest requires a loan id");
  }

  const details = parseCustomLoanDetails(loan.customLoanDetails);
  const existing = details?.stopInterest;
  if (!existing?.stoppedAt) {
    throw new Error("Loan has no active stop-interest entry to resume");
  }

  const resumedAt = nowIso();
  const nextStopInterest = {
    ...existing,
    resumedAt,
  };
  const history = Array.isArray(details.stopInterestHistory)
    ? details.stopInterestHistory.slice()
    : [];
  history.push({ ...nextStopInterest, action: "RESUME" });

  const nextDetails = {
    ...details,
    stopInterest: nextStopInterest,
    stopInterestHistory: history,
  };

  const resolvedClient = client || generateClient();
  const result = await resolvedClient.graphql({
    query: UPDATE_LOAN_CUSTOM_DETAILS_MUTATION,
    variables: {
      input: {
        id: loan.id,
        customLoanDetails: safeJsonStringify(nextDetails),
      },
    },
  });

  return {
    customLoanDetails: result?.data?.updateLoan?.customLoanDetails || null,
    state: nextStopInterest,
  };
};
