import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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
} from "../pdfExportUtils";

const buildDescription = (row) => {
  if (row.rowType === "disbursement") {
    return row.description || "Disbursement";
  }

  if (row.rowType === "installment") {
    return `Installment ${row.installmentNumber}`;
  }

  if (row.rowType === "extension") {
    return `${row.description || "Post-Maturity Interest"}${
      row.status ? ` (${row.status})` : ""
    }`;
  }

  if (row.rowType === "penalty") {
    return `${row.description || "Penalty"}${
      row.status ? ` (${row.status})` : ""
    }`;
  }

  return `Payment${row.paymentMethod ? ` (${row.paymentMethod})` : ""}${
    row.referenceNumber ? ` Ref: ${row.referenceNumber}` : ""
  }`;
};

const getStatementColumns = (visibleColumns) => {
  const defs = [
    { key: "date", label: "Date", isMoney: false },
    { key: "description", label: "Description", isMoney: false },
    { key: "scheduledPrincipal", label: "Sched. Principal", isMoney: true },
    { key: "scheduledInterest", label: "Sched. Interest", isMoney: true },
    { key: "scheduledFees", label: "Sched. Fees", isMoney: true },
    { key: "scheduledPenalty", label: "Sched. Penalty", isMoney: true },
    { key: "scheduledTotal", label: "Total Due", isMoney: true },
    { key: "paymentAmount", label: "Payment", isMoney: true },
    { key: "allocPrincipal", label: "Paid Principal", isMoney: true },
    { key: "allocInterest", label: "Paid Interest", isMoney: true },
    { key: "allocFees", label: "Paid Fees", isMoney: true },
    { key: "allocPenalty", label: "Paid Penalty", isMoney: true },
    { key: "runningBalance", label: "Balance", isMoney: true },
  ];

  return defs.filter((def) => visibleColumns?.[def.key]);
};

const buildStatementBody = (rows, columns, currency, currencyCode) =>
  rows.map((row) => {
    const record = { _rowType: row.rowType };

    for (const column of columns) {
      switch (column.key) {
        case "date":
          record.date = formatPdfDate(row.date);
          break;
        case "description":
          record.description = buildDescription(row);
          break;
        case "scheduledPrincipal":
          record.scheduledPrincipal =
            row.rowType === "installment"
              ? formatCurrencyText(row.principalDue, currency, currencyCode)
              : "";
          break;
        case "scheduledInterest":
          record.scheduledInterest =
            row.rowType === "installment" || row.rowType === "extension"
              ? formatCurrencyText(row.interestDue, currency, currencyCode)
              : "";
          break;
        case "scheduledFees":
          record.scheduledFees =
            row.rowType === "installment"
              ? formatCurrencyText(row.feesDue, currency, currencyCode)
              : "";
          break;
        case "scheduledPenalty":
          record.scheduledPenalty =
            row.rowType === "installment" || row.rowType === "penalty"
              ? formatCurrencyText(row.penaltyDue, currency, currencyCode)
              : "";
          break;
        case "scheduledTotal":
          record.scheduledTotal =
            row.rowType === "installment" ||
            row.rowType === "penalty" ||
            row.rowType === "extension"
              ? formatCurrencyText(row.totalDue, currency, currencyCode)
              : "";
          break;
        case "paymentAmount":
          record.paymentAmount =
            row.rowType === "payment" || row.rowType === "disbursement"
              ? formatCurrencyText(
                  row.amount,
                  currency,
                  currencyCode,
                )
              : "";
          break;
        case "allocPrincipal":
          record.allocPrincipal =
            row.rowType === "payment"
              ? formatCurrencyText(
                  row.allocPrincipal,
                  currency,
                  currencyCode,
                )
              : "";
          break;
        case "allocInterest":
          record.allocInterest =
            row.rowType === "payment"
              ? formatCurrencyText(row.allocInterest, currency, currencyCode)
              : "";
          break;
        case "allocFees":
          record.allocFees =
            row.rowType === "payment"
              ? formatCurrencyText(row.allocFees, currency, currencyCode)
              : "";
          break;
        case "allocPenalty":
          record.allocPenalty =
            row.rowType === "payment"
              ? formatCurrencyText(row.allocPenalty, currency, currencyCode)
              : "";
          break;
        case "runningBalance":
          record.runningBalance = formatCurrencyText(
            row.runningBalance,
            currency,
            currencyCode,
          );
          break;
        default:
          break;
      }
    }

    return record;
  });

export async function exportStatementPdf({
  loan,
  rows,
  visibleColumns,
  currency = "$",
  currencyCode,
  institutionName = "",
  branchName = "",
  headerImageSrc,
  showCustomHeader = false,
  showCustomHeaderFirstPageOnly = true,
  showInstitutionName = true,
  showBranchName = true,
  showStatus = true,
  borrowerLabel = "",
  officerLabel = "",
  statusLabel = "",
  interestRateLabel = "",
  interestMethodLabel = "",
  showLoanOfficer = false,
  showLoanProduct = false,
  showInterestRate = false,
  showInterestMethod = false,
  filename = "LoanStatement.pdf",
}) {
  if (!loan) throw new Error("loan is required");
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("Statement rows are required");
  }

  const doc = new jsPDF({ format: "a4", unit: "pt" });
  const headerImageDataUrl = await loadImageDataUrl(headerImageSrc);
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
  y = drawTitleBlock(doc, "LOAN STATEMENT", y);

  const leftItems = [
    { label: "Loan #", value: loan?.loanNumber || loan?.id || "N/A" },
    { label: "Borrower", value: borrowerLabel || "N/A" },
    showLoanOfficer ? { label: "Loan Officer", value: officerLabel } : null,
    showStatus ? { label: "Status", value: statusLabel || loan?.status || "N/A" } : null,
    showLoanProduct
      ? { label: "Loan Product", value: loan?.loanProduct?.name || "N/A" }
      : null,
  ];

  const rightItems = [
    {
      label: "Principal",
      value: formatCurrencyText(loan?.principal, currency, currencyCode),
    },
    showInterestRate
      ? { label: "Interest Rate", value: interestRateLabel || "N/A" }
      : null,
    showInterestMethod
      ? { label: "Interest Method", value: interestMethodLabel || "N/A" }
      : null,
    {
      label: "Term",
      value: loan?.duration
        ? `${loan.duration} ${loan.durationInterval || ""}`.trim()
        : "N/A",
    },
    { label: "Start Date", value: formatPdfDate(loan?.startDate) },
    { label: "Maturity Date", value: formatPdfDate(loan?.maturityDate) },
  ];

  y = drawInfoColumns(doc, { leftItems, rightItems, startY: y }) + 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Statement:", PDF_LAYOUT.marginX, y);
  y += 10;

  const columns = getStatementColumns(visibleColumns);
  const body = buildStatementBody(rows, columns, currency, currencyCode);
  const moneyColumnStyles = columns.reduce((acc, column) => {
    if (column.isMoney) {
      acc[column.key] = { halign: "right" };
    }
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
      date: { cellWidth: 58 },
      description: { cellWidth: 128 },
      ...moneyColumnStyles,
    },
    didDrawPage: (data) => {
      if (data.pageNumber > 1) {
        drawPdfHeader(doc, headerOptions, data.pageNumber);
      }
    },
    didParseCell: (data) => {
      if (data.section !== "body") return;
      const rowType = data.row.raw?._rowType;

      if (rowType === "disbursement") {
        data.cell.styles.fillColor = [232, 244, 232];
        if (data.column.dataKey === "description") {
          data.cell.styles.fontStyle = "italic";
        }
      } else if (rowType === "extension") {
        data.cell.styles.fillColor = [255, 247, 230];
        if (data.column.dataKey === "description") {
          data.cell.styles.fontStyle = "italic";
        }
      } else if (rowType === "payment") {
        data.cell.styles.fillColor = [232, 240, 254];
        if (data.column.dataKey === "description") {
          data.cell.styles.fontStyle = "italic";
        }
      }
    },
  });

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    drawPdfFooter(doc, page, totalPages);
  }

  doc.save(filename);
}
