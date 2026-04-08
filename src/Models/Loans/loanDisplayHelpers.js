const fmtDateCompact = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = String(d.getDate()).padStart(2, "0");
    const mon = months[d.getMonth()];
    const year = String(d.getFullYear()).slice(-2);
    return `${day}${mon}${year}`;
  } catch {
    return dateStr;
  }
};

export const buildLoanDisplayName = (loan, currencyCode) => {
  const borrower = loan?.borrower || {};
  const borrowerName =
    [borrower.firstname, borrower.othername, borrower.businessName]
      .filter(Boolean)
      .join(" ")
      .trim() || "Unknown";

  const prefix = currencyCode || "";
  const principal =
    loan?.principal != null
      ? `${prefix} ${Number(loan.principal).toLocaleString()}`
      : null;

  const date = fmtDateCompact(loan?.startDate);
  const product = loan?.loanProduct?.name || "";

  return [borrowerName, principal, date, product].filter(Boolean).join(" | ");
};