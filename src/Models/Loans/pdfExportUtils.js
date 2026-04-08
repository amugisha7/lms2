import dayjs from "dayjs";
import { formatMoney } from "../../Resources/formatting";

export const PDF_LAYOUT = {
  marginX: 42,
  marginTop: 36,
  marginBottom: 34,
  footerGap: 18,
};

export const PDF_FOOTER_TEXT =
  "Made with LOAN MANAGEMENT SOFTWARE from www.LoanTabs.com";

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export async function loadImageDataUrl(src) {
  if (!src || typeof src !== "string") return null;
  if (src.startsWith("data:")) return src;

  try {
    const response = await fetch(src);
    if (!response.ok) throw new Error(`Image fetch failed: ${response.status}`);
    const blob = await response.blob();
    return await blobToDataUrl(blob);
  } catch (error) {
    console.warn("Failed to load export header image:", error);
    return null;
  }
}

export function formatPdfDate(value) {
  if (!value) return "N/A";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("DD-MMM-YYYY") : String(value);
}

export function formatCurrencyText(value, currency = "$", currencyCode) {
  return formatMoney(value, currency, currencyCode) || "-";
}

export function sanitizeFilenamePart(value) {
  return String(value || "export")
    .replace(/[\\/:*?"<>|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/ /g, "_");
}

export function estimateHeaderHeight(options, pageNumber = 1) {
  const {
    showCustomHeader = false,
    showCustomHeaderFirstPageOnly = true,
    headerImageDataUrl = null,
    showInstitutionName = true,
    institutionName = "",
    showBranchName = true,
    branchName = "",
  } = options || {};

  const shouldRenderHeader =
    pageNumber === 1 || !showCustomHeaderFirstPageOnly;

  let height = PDF_LAYOUT.marginTop;

  if (shouldRenderHeader && showCustomHeader && headerImageDataUrl) {
    height += 74;
  }
  if (shouldRenderHeader && showInstitutionName && institutionName) {
    height += 18;
  }
  if (shouldRenderHeader && showBranchName && branchName) {
    height += 18;
  }

  return height;
}

export function drawPdfHeader(doc, options, pageNumber = 1) {
  const {
    showCustomHeader = false,
    showCustomHeaderFirstPageOnly = true,
    headerImageDataUrl = null,
    showInstitutionName = true,
    institutionName = "",
    showBranchName = true,
    branchName = "",
  } = options || {};

  const pageWidth = doc.internal.pageSize.getWidth();
  const shouldRenderHeader =
    pageNumber === 1 || !showCustomHeaderFirstPageOnly;

  let y = PDF_LAYOUT.marginTop;

  if (shouldRenderHeader && showCustomHeader && headerImageDataUrl) {
    try {
      const props = doc.getImageProperties(headerImageDataUrl);
      const maxWidth = pageWidth - PDF_LAYOUT.marginX * 2;
      const maxHeight = 64;
      let width = maxWidth;
      let height = (props.height * width) / props.width;

      if (height > maxHeight) {
        height = maxHeight;
        width = (props.width * height) / props.height;
      }

      const imageFormat = headerImageDataUrl.includes("image/jpeg")
        ? "JPEG"
        : "PNG";

      doc.addImage(
        headerImageDataUrl,
        imageFormat,
        PDF_LAYOUT.marginX,
        y,
        width,
        height,
      );
      y += height + 10;
    } catch (error) {
      console.warn("Failed to draw export header image:", error);
    }
  }

  if (shouldRenderHeader && showInstitutionName && institutionName) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(String(institutionName), PDF_LAYOUT.marginX, y);
    y += 18;
  }

  if (shouldRenderHeader && showBranchName && branchName) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(String(branchName), PDF_LAYOUT.marginX, y);
    y += 18;
  }

  return y;
}

export function drawPdfFooter(doc, pageNumber, totalPages) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const footerY = pageHeight - PDF_LAYOUT.marginBottom;

  doc.setDrawColor(0, 0, 0);
  doc.line(
    PDF_LAYOUT.marginX,
    footerY - 10,
    pageWidth - PDF_LAYOUT.marginX,
    footerY - 10,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text(PDF_FOOTER_TEXT, PDF_LAYOUT.marginX, footerY);
  doc.text(
    `Page ${pageNumber} of ${totalPages}`,
    pageWidth - PDF_LAYOUT.marginX,
    footerY,
    { align: "right" },
  );
}

export function drawTitleBlock(doc, title, startY) {
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(String(title), PDF_LAYOUT.marginX, startY);

  const dividerY = startY + 8;
  doc.setDrawColor(0, 0, 0);
  doc.line(
    PDF_LAYOUT.marginX,
    dividerY,
    pageWidth - PDF_LAYOUT.marginX,
    dividerY,
  );

  return dividerY + 12;
}

export function drawInfoColumns(doc, { leftItems = [], rightItems = [], startY }) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const gap = 24;
  const columnWidth = (pageWidth - PDF_LAYOUT.marginX * 2 - gap) / 2;
  const lineHeight = 14;

  const drawColumn = (items, startX) => {
    let y = startY;

    for (const item of items.filter(Boolean)) {
      const label = `${item.label}:`;
      const valueText = String(item.value ?? "N/A");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(label, startX, y);

      const labelWidth = doc.getTextWidth(label);
      const valueX = startX + labelWidth + 4;
      const valueWidth = Math.max(60, columnWidth - labelWidth - 6);

      doc.setFont("helvetica", "normal");
      const valueLines = doc.splitTextToSize(valueText, valueWidth);
      doc.text(valueLines, valueX, y);

      y += lineHeight * Math.max(1, valueLines.length);
    }

    return y;
  };

  const leftEndY = drawColumn(leftItems, PDF_LAYOUT.marginX);
  const rightEndY = drawColumn(
    rightItems,
    PDF_LAYOUT.marginX + columnWidth + gap,
  );

  return Math.max(leftEndY, rightEndY);
}
