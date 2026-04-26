/**
 * Shared reporting utilities.
 * - Scope resolution from UserContext
 * - Date window filtering
 * - CSV export
 * - Money / date formatting for reports
 */

/**
 * Resolves the active institution/branch scope for reports from userDetails.
 * Admin users work institution-wide; branch users are limited to their own branch.
 */
export function resolveReportScope(userDetails) {
  const userType = (userDetails?.userType || "").toLowerCase();
  const isAdmin = userType === "admin";
  const institutionId =
    userDetails?.institution?.id || userDetails?.institutionUsersId || null;
  const branchId =
    userDetails?.branchUsersId || userDetails?.branch?.id || null;
  const currencyCode =
    userDetails?.institution?.currencyCode || userDetails?.currencyCode || null;

  return {
    isAdmin,
    // Admin → supply institutionId so queries fan out to the whole institution.
    // Branch user → supply only branchId.
    institutionId: isAdmin ? institutionId : null,
    branchId: isAdmin ? null : branchId,
    currencyCode,
  };
}

/**
 * Filters a list of LoanSummary rows by the report date window.
 * Rows with no startDate are not excluded (they are still active portfolio).
 * The window is checked against `startDate` so that loans created inside the window are captured.
 * If startDate/endDate parameters are null/empty the full list is returned unchanged.
 */
export function filterSummariesByDateWindow(summaries, startDate, endDate) {
  if (!startDate && !endDate) return summaries;
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate + "T23:59:59") : null;

  return summaries.filter((s) => {
    if (!s?.startDate) return true; // include if no start date
    const loanStart = new Date(s.startDate);
    if (start && loanStart < start) return false;
    if (end && loanStart > end) return false;
    return true;
  });
}

/**
 * Formats a date string as DD-Mon-YY for display in report tables.
 */
export function fmtReportDate(dateStr) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
    ];
    const day = String(d.getDate()).padStart(2, "0");
    return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

/**
 * Formats a monetary value with a thousands separator.
 */
export function fmtMoney(value, currencyCode = "") {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "0.00";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Formats a percentage value to 2 decimal places.
 */
export function fmtPct(value) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "0.00%";
  return `${num.toFixed(2)}%`;
}

/**
 * Converts an array of objects to a CSV string.
 * @param {Array<Object>} rows - Data rows
 * @param {Array<{key: string, label: string}>} columns - Column definitions
 * @returns {string} CSV string
 */
export function toCsv(rows, columns) {
  if (!rows?.length || !columns?.length) return "";
  const header = columns.map((c) => JSON.stringify(c.label)).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          const value = row[c.key];
          if (value == null) return "";
          return JSON.stringify(String(value));
        })
        .join(","),
    )
    .join("\n");
  return `${header}\n${body}`;
}

/**
 * Triggers a browser download of a CSV or JSON string.
 * @param {string} content - Text content
 * @param {string} filename - Filename including extension
 * @param {string} mimeType - e.g. 'text/csv' or 'application/json'
 */
export function downloadFile(content, filename, mimeType = "text/csv") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Normalizes a money value to a safe number.
 */
export function safeNum(value) {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num : 0;
}
