import jsPDF from "jspdf";
import { formatMoney } from "../../../Resources/formatting";

const parseAwsJson = (value) => {
  if (!value) return null;
  if (typeof value === "object") return value;
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const exportLoanDraftScheduleA4 = ({
  loanDraft,
  borrower,
  currency = "$",
  currencyCode,
}) => {
  const schedule = parseAwsJson(loanDraft?.schedulePreview);
  const installments = schedule?.installments || [];
  const totals = schedule?.totals || {};

  if (!Array.isArray(installments) || installments.length === 0) {
    throw new Error("Draft schedulePreview is missing or empty");
  }

  const doc = new jsPDF({ format: "a4", unit: "pt" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const marginX = 40;
  let y = 50;

  doc.setFontSize(16);
  doc.text("Loan Draft Repayment Schedule", marginX, y);
  y += 18;

  doc.setFontSize(10);
  doc.text(`Draft: ${loanDraft?.draftNumber || loanDraft?.id || ""}`, marginX, y);
  y += 14;
  doc.text(
    `Borrower: ${
      borrower
        ? `${borrower.firstname || ""} ${borrower.othername || ""} ${borrower.businessName || ""}`.trim()
        : loanDraft?.borrowerID || ""
    }`,
    marginX,
    y
  );
  y += 14;
  doc.text(`Status: ${loanDraft?.status || ""}`, marginX, y);
  y += 18;

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
  y += 22;

  const col = {
    date: marginX,
    principal: marginX + 120,
    interest: marginX + 220,
    total: marginX + 320,
    balance: marginX + 420,
  };

  const header = () => {
    doc.setFontSize(10);
    doc.text("Due Date", col.date, y);
    doc.text("Principal", col.principal, y);
    doc.text("Interest", col.interest, y);
    doc.text("Total", col.total, y);
    doc.text("Balance", col.balance, y);
    y += 12;
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 12;
  };

  header();

  doc.setFontSize(9);
  for (const inst of installments) {
    if (y > pageHeight - 60) {
      doc.addPage();
      y = 50;
      header();
      doc.setFontSize(9);
    }

    doc.text(String(inst.dueDate || ""), col.date, y);
    doc.text(formatMoney(inst.principalDue, currency, currencyCode), col.principal, y);
    doc.text(formatMoney(inst.interestDue, currency, currencyCode), col.interest, y);
    doc.text(formatMoney(inst.totalDue, currency, currencyCode), col.total, y);
    doc.text(formatMoney(inst.balanceAfter, currency, currencyCode), col.balance, y);
    y += 14;
  }

  doc.save(`LoanDraftSchedule_${loanDraft?.draftNumber || loanDraft?.id}.pdf`);
};

export const exportLoanDraftSummaryA4 = ({
  loanDraft,
  borrower,
  currency = "$",
  currencyCode,
}) => {
  const draftRecord = parseAwsJson(loanDraft?.draftRecord) || {};
  const schedule = parseAwsJson(loanDraft?.schedulePreview);
  const totals = schedule?.totals || {};

  const doc = new jsPDF({ format: "a4", unit: "pt" });
  const marginX = 40;
  let y = 60;

  doc.setFontSize(16);
  doc.text("Loan Draft Summary", marginX, y);
  y += 24;

  doc.setFontSize(11);
  doc.text(`Draft: ${loanDraft?.draftNumber || loanDraft?.id || ""}`, marginX, y);
  y += 16;
  doc.text(
    `Borrower: ${
      borrower
        ? `${borrower.firstname || ""} ${borrower.othername || ""} ${borrower.businessName || ""}`.trim()
        : loanDraft?.borrowerID || ""
    }`,
    marginX,
    y
  );
  y += 16;

  const lines = [
    [`Principal`, formatMoney(draftRecord?.principalAmount, currency, currencyCode)],
    [`Interest`, `${draftRecord?.interestRate ?? ""} ${draftRecord?.interestType === "percentage" ? "%" : ""}`.trim()],
    [`Start Date`, draftRecord?.loanStartDate || draftRecord?.startDate || ""],
    [`Duration`, `${draftRecord?.loanDuration || draftRecord?.termDuration || ""} ${draftRecord?.durationPeriod || ""}`.trim()],
    [`Repayment`, `${draftRecord?.repaymentFrequencyType || ""} ${draftRecord?.repaymentFrequency || ""}`.trim()],
  ];

  doc.setFontSize(10);
  for (const [k, v] of lines) {
    doc.text(`${k}:`, marginX, y);
    doc.text(String(v ?? ""), marginX + 140, y);
    y += 14;
  }

  y += 12;
  doc.setFontSize(11);
  doc.text(
    `Schedule Totals: Principal ${formatMoney(
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

  doc.save(`LoanDraftSummary_${loanDraft?.draftNumber || loanDraft?.id}.pdf`);
};
