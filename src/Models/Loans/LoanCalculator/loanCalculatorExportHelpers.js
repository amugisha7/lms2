import { jsPDF } from "jspdf";
import dayjs from "dayjs";
import { formatMoney } from "../../../Resources/formatting";

export const exportLoanCalculatorSummaryA4 = ({
  values,
  schedulePreview,
  currency = "$",
  currencyCode,
}) => {
  const totals = schedulePreview?.totals || {};
  const doc = new jsPDF({ format: "a4", unit: "pt" });
  const marginX = 40;
  let y = 60;

  doc.setFontSize(16);
  doc.text("Loan Calculator Summary", marginX, y);
  y += 22;

  doc.setFontSize(10);
  doc.text(`Generated: ${dayjs().format("DD-MMM-YYYY HH:mm")}`, marginX, y);
  y += 18;

  const lines = [
    ["Principal", formatMoney(values?.principalAmount, currency, currencyCode)],
    [
      "Interest",
      `${values?.interestRate ?? ""}${
        values?.interestType === "percentage" ? "%" : ""
      } (${values?.interestPeriod || ""})`.trim(),
    ],
    ["Start Date", values?.loanStartDate || ""],
    [
      "Duration",
      `${values?.loanDuration || ""} ${values?.durationPeriod || ""}`.trim(),
    ],
    [
      "Repayment",
      `${values?.repaymentFrequencyType || ""} ${values?.repaymentFrequency || ""}`.trim(),
    ],
  ];

  for (const [k, v] of lines) {
    doc.text(`${k}:`, marginX, y);
    doc.text(String(v ?? ""), marginX + 140, y);
    y += 14;
  }

  y += 12;
  doc.setFontSize(11);
  doc.text(
    `Totals: Principal ${formatMoney(
      totals.totalPrincipal,
      currency,
      currencyCode
    )} | Interest ${formatMoney(
      totals.totalInterest,
      currency,
      currencyCode
    )} | Payable ${formatMoney(totals.totalPayable, currency, currencyCode)}`,
    marginX,
    y
  );

  doc.save(`LoanCalculatorSummary_${dayjs().format("YYYYMMDD_HHmmss")}.pdf`);
};
