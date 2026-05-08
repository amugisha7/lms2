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

export function parseReportDate(dateValue, { endOfDay = false } = {}) {
  if (!dateValue) return null;
  if (typeof dateValue === "string" && !dateValue.includes("T")) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue.trim());
    if (!match) return null;
    const [, year, month, day] = match;
    const parsed = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      endOfDay ? 23 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 999 : 0,
    );
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getReportAsOfDate(endDate, fallbackDate = new Date()) {
  const reportDate = parseReportDate(endDate) || new Date(fallbackDate);
  reportDate.setHours(0, 0, 0, 0);
  return reportDate;
}

export function formatReportDateKey(dateValue) {
  const date =
    dateValue instanceof Date ? new Date(dateValue) : parseReportDate(dateValue);
  if (!date || Number.isNaN(date.getTime())) return "";
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isDateWithinWindow(dateStr, startDate, endDate) {
  const current = parseReportDate(dateStr);
  if (!current) return false;
  const start = parseReportDate(startDate);
  const end = parseReportDate(endDate, { endOfDay: true });
  if (start && current < start) return false;
  if (end && current > end) return false;
  return true;
}

export function filterRowsByDateWindow(
  rows,
  getDateValue,
  startDate,
  endDate,
) {
  if (!startDate && !endDate) return rows;
  return rows.filter((row) =>
    isDateWithinWindow(getDateValue(row), startDate, endDate),
  );
}

/**
 * Filters a list of LoanSummary rows by the report date window.
 * Rows with no startDate are not excluded (they are still active portfolio).
 * The window is checked against `startDate` so that loans created inside the window are captured.
 * If startDate/endDate parameters are null/empty the full list is returned unchanged.
 */
export function filterSummariesByDateWindow(summaries, startDate, endDate) {
  if (!startDate && !endDate) return summaries;
  const start = parseReportDate(startDate);
  const end = parseReportDate(endDate, { endOfDay: true });

  return summaries.filter((s) => {
    if (!s?.startDate) return true; // include if no start date
    const loanStart = parseReportDate(s.startDate);
    if (!loanStart) return true;
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
