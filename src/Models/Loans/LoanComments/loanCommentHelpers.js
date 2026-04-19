export const formatCommentDate = (dateString) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateString;
  }
};

const parseCommentDetails = (details) => {
  if (!details) {
    return null;
  }

  try {
    const parsed = typeof details === "string" ? JSON.parse(details) : details;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

export const formatEmployeeName = (employee, customLoanCommentDetails) => {
  const commentDetails = parseCommentDetails(customLoanCommentDetails);

  if (employee) {
    const name = [employee.firstName, employee.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (name) {
      return name;
    }

    if (employee.email) {
      return employee.email;
    }
  }

  const fallbackName = [
    commentDetails?.firstName,
    commentDetails?.lastName,
    commentDetails?.otherName || commentDetails?.othername,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    fallbackName ||
    commentDetails?.displayName ||
    commentDetails?.userName ||
    commentDetails?.email ||
    "Unknown"
  );
};

export const sortCommentsByDate = (comments, order = "desc") => {
  if (!Array.isArray(comments)) return [];

  return [...comments].sort((left, right) => {
    const leftTime = new Date(left.commentAt || left.createdAt).getTime();
    const rightTime = new Date(right.commentAt || right.createdAt).getTime();

    return order === "asc" ? leftTime - rightTime : rightTime - leftTime;
  });
};