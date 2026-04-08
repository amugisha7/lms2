import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatMoney } from "../../../Resources/formatting";
import {
  PDF_LAYOUT,
  drawInfoColumns,
  drawPdfFooter,
  drawPdfHeader,
  drawTitleBlock,
  estimateHeaderHeight,
  formatCurrencyText,
  formatPdfDate,
  loadImageDataUrl,
  sanitizeFilenamePart,
} from "../pdfExportUtils";

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
  installments,
  totals: providedTotals,
  draftRecord = {},
  borrowerLabel = "",
  institutionName = "",
  branchName = "",
  currency = "$",
  currencyCode,
  headerImageSrc,
  showCustomHeader = false,
  showCustomHeaderFirstPageOnly = true,
  showInstitutionName = true,
  showBranchName = true,
  showLoanFees = true,
  showInterestRate = true,
  showInterestMethod = false,
  showTotals = false,
  loanFeeSummary,
  totalLoanFee = 0,
  visibleColumns = {},
}) => {
  const schedule = parseAwsJson(loanDraft?.schedulePreview);
  const scheduleInstallments = installments || schedule?.installments || [];
  const totals = providedTotals || schedule?.totals || {};

  if (!Array.isArray(scheduleInstallments) || scheduleInstallments.length === 0) {
    throw new Error("Draft schedulePreview is missing or empty");
  }

  const formatInterestPeriodLabel = (interestPeriod) => {
    switch (interestPeriod) {
      case "per_day":
        return "day";
      case "per_week":
        return "week";
      case "per_month":
        return "month";
      case "per_year":
        return "year";
      case "per_loan":
        return "loan";
      default:
        return "";
    }
  };

  const formatInterestMethodLabel = (interestMethod) => {
    switch (interestMethod) {
      case "compound_interest_accrued":
        return "Compound Interest - Accrued";
      case "compound_interest_equal_installments":
        return "Compound Interest - Equal Installments";
      case "flat":
        return "Flat";
      case "interest_only":
        return "Interest-Only";
      case "reducing_balance_equal_installments":
        return "Reducing Balance - Equal Installments";
      case "reducing_balance_equal_principal":
        return "Reducing Balance - Equal Principal";
      default:
        return interestMethod || "N/A";
    }
  };

  const startDateLabel =
    draftRecord?.loanStartDate || draftRecord?.startDate
      ? formatPdfDate(draftRecord?.loanStartDate || draftRecord?.startDate)
      : "N/A";
  const maturityDateLabel = formatPdfDate(
    scheduleInstallments[scheduleInstallments.length - 1]?.dueDate,
  );

  const interestLabel = (() => {
    if (draftRecord?.interestType === "percentage") {
      const periodLabel = formatInterestPeriodLabel(draftRecord?.interestPeriod);
      const suffix =
        draftRecord?.interestPeriod === "per_loan"
          ? " of Principal"
          : periodLabel
            ? ` per ${periodLabel}`
            : "";
      return `${draftRecord?.interestRate ?? ""}%${suffix}`.trim();
    }

    const amount = formatCurrencyText(
      draftRecord?.interestRate,
      currency,
      currencyCode,
    );
    const periodLabel = formatInterestPeriodLabel(draftRecord?.interestPeriod);
    return `${amount}${periodLabel ? ` per ${periodLabel}` : ""}`.trim();
  })();

  const doc = new jsPDF({ format: "a4", unit: "pt" });
  const headerImageDataUrlPromise = loadImageDataUrl(headerImageSrc);

  return headerImageDataUrlPromise.then((headerImageDataUrl) => {
    const headerOptions = {
      showCustomHeader,
      showCustomHeaderFirstPageOnly,
      headerImageDataUrl,
      showInstitutionName,
      institutionName,
      showBranchName,
      branchName,
    };

    const repeatedTopMargin =
      Math.max(
        estimateHeaderHeight(headerOptions, 1),
        estimateHeaderHeight(headerOptions, 2),
      ) + 6;

    let y = drawPdfHeader(doc, headerOptions, 1);
    y = drawTitleBlock(doc, "LOAN SCHEDULE", y);

    if (loanDraft?.draftNumber) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Reference: ${loanDraft.draftNumber}`, PDF_LAYOUT.marginX, y);
      y += 16;
    }

    const leftItems = [
      { label: "Borrower", value: borrowerLabel || loanDraft?.borrowerID || "N/A" },
      {
        label: "Principal",
        value: formatCurrencyText(
          draftRecord?.principalAmount,
          currency,
          currencyCode,
        ),
      },
      showInterestRate ? { label: "Interest", value: interestLabel || "N/A" } : null,
      showInterestMethod
        ? {
            label: "Interest Method",
            value: formatInterestMethodLabel(draftRecord?.interestMethod),
          }
        : null,
      loanFeeSummary && showLoanFees
        ? {
            label: "Loan Fees",
            value: formatCurrencyText(totalLoanFee, currency, currencyCode),
          }
        : null,
    ];

    const rightItems = [
      { label: "Start Date", value: startDateLabel },
      { label: "Maturity Date", value: maturityDateLabel },
      {
        label: "Duration",
        value: `${draftRecord?.loanDuration || ""} ${
          draftRecord?.durationPeriod || ""
        }`.trim() || "N/A",
      },
    ];

    y = drawInfoColumns(doc, { leftItems, rightItems, startY: y }) + 4;

    if (showTotals) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(
        `Totals: Interest ${formatCurrencyText(
          totals.totalInterest,
          currency,
          currencyCode,
        )} | Payable ${formatCurrencyText(
          totals.totalPayable,
          currency,
          currencyCode,
        )}`,
        PDF_LAYOUT.marginX,
        y,
      );
      y += 16;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Payment schedule:", PDF_LAYOUT.marginX, y);
    y += 10;

    const columns = [
      visibleColumns.number ? { key: "number", label: "#", isMoney: false } : null,
      visibleColumns.date ? { key: "date", label: "Date", isMoney: false } : null,
      visibleColumns.openingBalance
        ? { key: "openingBalance", label: "Opening Balance", isMoney: true }
        : null,
      visibleColumns.interest
        ? { key: "interest", label: "Interest", isMoney: true }
        : null,
      visibleColumns.principalRepaid
        ? { key: "principalRepaid", label: "Principal Repaid", isMoney: true }
        : null,
      visibleColumns.totalPayment
        ? { key: "totalPayment", label: "Total Payment", isMoney: true }
        : null,
      visibleColumns.closingBalance
        ? { key: "closingBalance", label: "Closing Balance", isMoney: true }
        : null,
    ].filter(Boolean);

    const body = scheduleInstallments.map((inst, index) => ({
      number: String(index + 1),
      date: formatPdfDate(inst?.dueDate),
      openingBalance: formatCurrencyText(
        inst?.openingBalance,
        currency,
        currencyCode,
      ),
      interest: formatCurrencyText(inst?.interestDue, currency, currencyCode),
      principalRepaid: formatCurrencyText(
        inst?.principalDue,
        currency,
        currencyCode,
      ),
      totalPayment: formatCurrencyText(inst?.totalDue, currency, currencyCode),
      closingBalance: formatCurrencyText(
        inst?.balanceAfter,
        currency,
        currencyCode,
      ),
    }));

    const moneyColumnStyles = columns.reduce((acc, column) => {
      if (column.isMoney) acc[column.key] = { halign: "right" };
      return acc;
    }, {});

    autoTable(doc, {
      startY: y,
      margin: {
        left: PDF_LAYOUT.marginX,
        right: PDF_LAYOUT.marginX,
        top: repeatedTopMargin,
        bottom: PDF_LAYOUT.marginBottom + PDF_LAYOUT.footerGap,
      },
      columns: columns.map((column) => ({
        header: column.label,
        dataKey: column.key,
      })),
      body,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 8.5,
        textColor: [0, 0, 0],
        lineColor: [190, 190, 190],
        lineWidth: 0.35,
        cellPadding: { top: 3, right: 4, bottom: 3, left: 4 },
        overflow: "linebreak",
        valign: "middle",
      },
      headStyles: {
        fillColor: [238, 238, 238],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        lineColor: [0, 0, 0],
        lineWidth: 0.75,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      columnStyles: {
        number: { cellWidth: 24 },
        date: { cellWidth: 58 },
        ...moneyColumnStyles,
      },
      didDrawPage: (data) => {
        if (data.pageNumber > 1) {
          drawPdfHeader(doc, headerOptions, data.pageNumber);
        }
      },
    });

    const totalPages = doc.getNumberOfPages();
    for (let page = 1; page <= totalPages; page += 1) {
      doc.setPage(page);
      drawPdfFooter(doc, page, totalPages);
    }

    const filename = `LoanSchedule_${sanitizeFilenamePart(
      borrowerLabel || loanDraft?.draftNumber || loanDraft?.id,
    )}.pdf`;
    doc.save(filename);
  });

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
