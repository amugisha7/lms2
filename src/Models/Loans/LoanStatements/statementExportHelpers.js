/**
 * Export helpers for Loan Statements.
 *
 * Models the A4 html2canvas → jsPDF pipeline from
 * src/Models/Loans/LoanDrafts/LoanScheduleDraft.jsx.
 *
 * No React imports – called imperatively from the statement screen.
 */
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

/**
 * Export the contents of a DOM node to an A4 PDF.
 *
 * @param {object} opts
 * @param {HTMLElement} opts.printAreaRef - The DOM node containing .page divs
 * @param {string}      opts.filename     - Desired PDF file name
 */
export async function exportStatementPdf({ printAreaRef, filename = "LoanStatement.pdf" }) {
  if (!printAreaRef) throw new Error("printAreaRef is required");

  const container = printAreaRef;

  // Wait for the DOM to stabilize (images, etc.)
  await new Promise((r) => requestAnimationFrame(r));
  await new Promise((r) => requestAnimationFrame(r));

  const getPageElements = () =>
    Array.from(container.querySelectorAll(".page") || []);

  const pageElements = getPageElements();
  if (!pageElements.length) throw new Error("No .page elements found in printAreaRef");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < pageElements.length; i++) {
    const freshPages = getPageElements();
    const pageEl = freshPages[i];
    if (!pageEl) continue;

    // Wait for any images inside the page
    const imgs = Array.from(pageEl.querySelectorAll("img") || []);
    if (imgs.length) {
      await Promise.all(
        imgs.map((img) => {
          if (img.complete && img.naturalWidth > 0) return Promise.resolve();
          return new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          });
        })
      );
    }

    const canvas = await html2canvas(pageEl, {
      scale: 1.5,
      useCORS: true,
      imageTimeout: 15000,
      logging: false,
      backgroundColor: "#ffffff",
      onclone: (clonedDoc) => {
        // Remove overlay backdrops so they don't appear in the PDF
        clonedDoc
          .querySelectorAll(".MuiBackdrop-root, .no-print")
          .forEach((node) => node.remove());
      },
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.78);
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    if (i > 0) pdf.addPage();

    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
  }

  pdf.save(filename);
}
