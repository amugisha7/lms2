export const parseCustomInstitutionDetails = (value) => {
  if (!value) {
    return {};
  }

  if (typeof value === "object") {
    return value;
  }

  if (typeof value !== "string") {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const stringifyCustomInstitutionDetails = (value) =>
  JSON.stringify(value && typeof value === "object" ? value : {});

export const getInstitutionCurrentBranchId = (institution) => {
  const details = parseCustomInstitutionDetails(
    institution?.customInstitutionDetails,
  );
  return details.currentBranchID || null;
};