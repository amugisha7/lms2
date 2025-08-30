import React, { useRef, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ClickableText from "./ClickableText";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "../theme";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// Modified function to download PDF using jsPDF and html2canvas
const downloadPdf = async (printableRef, colorMode, originalMode) => {
  // Switch to light mode before generating PDF
  if (originalMode === "dark") {
    colorMode.toggleColorMode();
  }

  // Add print-only class for styling
  document.body.classList.add("printing-active");

  // Wait for the DOM to update with light mode styles
  setTimeout(async () => {
    try {
      // Target only the dialog paper element (the actual popup without background)
      const dialogElement =
        printableRef.current?.querySelector(".MuiDialog-paper") ||
        printableRef.current;

      if (!dialogElement) {
        throw new Error("Dialog content not found");
      }

      // Temporarily style the dialog for PDF generation
      const originalStyles = {
        position: dialogElement.style.position,
        transform: dialogElement.style.transform,
        margin: dialogElement.style.margin,
        maxWidth: dialogElement.style.maxWidth,
        width: dialogElement.style.width,
        height: dialogElement.style.height,
        overflow: dialogElement.style.overflow,
      };

      // Set styles for PDF capture
      Object.assign(dialogElement.style, {
        position: "static",
        transform: "none",
        margin: "0",
        maxWidth: "none",
        width: "210mm", // A4 width
        height: "auto",
        overflow: "visible",
      });

      // Get canvas of the dialog element only
      const canvas = await html2canvas(dialogElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: dialogElement.offsetWidth,
        height: dialogElement.offsetHeight,
      });

      // Restore original styles
      Object.assign(dialogElement.style, originalStyles);

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      // Create a new PDF in A4 portrait format
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // A4 dimensions: 210mm x 297mm
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add attribution text at the top
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100); // Gray color

      const attributionText =
        "Created using Loan Management Software from www.LoanTabs.com";
      const textWidth =
        (pdf.getStringUnitWidth(attributionText) * 10) /
        pdf.internal.scaleFactor;
      const textXPos = (pageWidth - textWidth) / 2;
      const attributionYPos = 15; // 15mm from top

      pdf.text(attributionText, textXPos, attributionYPos);

      // Calculate available space for content (with proper spacing and padding)
      const contentStartY = attributionYPos + 5; // 10mm spacing after attribution
      const leftPadding = 10; // 10mm left padding
      const rightPadding = 10; // 10mm right padding
      const bottomPadding = 10; // 10mm bottom padding

      const availableWidth = pageWidth - leftPadding - rightPadding;
      const availableHeight = pageHeight - contentStartY - bottomPadding;

      // Calculate dimensions to fit content in available space
      const canvasAspectRatio = canvas.width / canvas.height;
      let finalWidth = availableWidth;
      let finalHeight = availableWidth / canvasAspectRatio;

      // If the image is taller than available space, scale it down
      if (finalHeight > availableHeight) {
        finalHeight = availableHeight;
        finalWidth = finalHeight * canvasAspectRatio;
      }

      // Center the image horizontally within the available space
      const xPos = leftPadding + (availableWidth - finalWidth) / 2;
      const yPos = contentStartY;

      // Add the content image
      pdf.addImage(imgData, "JPEG", xPos, yPos, finalWidth, finalHeight);

      // Save the PDF
      pdf.save("document.pdf");

      // Remove print-only class
      document.body.classList.remove("printing-active");

      // Switch back to original mode
      if (originalMode === "dark") {
        setTimeout(() => {
          colorMode.toggleColorMode();
        }, 100);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Clean up even if there's an error
      document.body.classList.remove("printing-active");
      if (originalMode === "dark") {
        colorMode.toggleColorMode();
      }
    }
  }, 300);
};

export default function CustomPopUp({
  open,
  onClose,
  title,
  children,
  onEdit,
  onDelete,
  showEdit = true,
  showDelete = true,
  maxWidth = "md",
  fullWidth = true,
  editMode = false,
}) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const printableRef = useRef(null);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      id="printable-popup"
      ref={printableRef}
      sx={{
        "& .MuiDialog-paper": {
          // Ensure the dialog paper has consistent styling for PDF generation
          minHeight: "auto",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #e0e0e0",
          position: "relative", // for absolute positioning of close button on mobile
          flexWrap: { xs: "wrap", sm: "nowrap" }, // allow wrapping on mobile
        }}
        className="popup-header"
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            textTransform: "none",
            width: { xs: "90%", sm: "auto" }, // 90% width on mobile
            pr: { xs: 2, sm: 0 },
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            order: { xs: 1, sm: 0 }, // move to next line on mobile
            width: { xs: "100%", sm: "auto" }, // full width on mobile
            mt: { xs: 1, sm: 0 }, // margin top on mobile
          }}
          className="popup-actions"
        >
          {showDelete && onDelete && (
            <ClickableText
              className="action-icon"
              onClick={onDelete}
              sx={{
                mr: 2,
                fontSize: "0.9rem",
                color: "error.main",
                "&:hover": {
                  color: "error.dark",
                },
              }}
            >
              Delete
            </ClickableText>
          )}
          {showEdit && onEdit && (
            <ClickableText
              className="action-icon"
              onClick={onEdit}
              sx={{ mr: 2, fontSize: "0.9rem" }}
            >
              Edit
            </ClickableText>
          )}

          {!editMode && (
            <IconButton
              onClick={() =>
                downloadPdf(printableRef, colorMode, theme.palette.mode)
              }
              size="small"
              aria-label="Download PDF"
              sx={{
                mr: 1,
                fontSize: "0.9rem",
              }}
              className="action-icon"
            >
              <PictureAsPdfIcon />
            </IconButton>
          )}

          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              position: { xs: "absolute", sm: "static" },
              top: { xs: 16, sm: "auto" },
              right: { xs: 16, sm: "auto" },
              ml: { xs: 0, sm: "60px" }, // add left margin except on mobile
            }}
            className="action-icon"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <DialogContent
        sx={{
          p: 0,
          "& > *": {
            p: 3,
            display: "flex",
            flexDirection: "column",
            border: editMode
              ? `2px solid ${
                  theme.palette.mode === "dark" ? "#76B1D3" : "#1976d2"
                }`
              : `1px solid ${
                  theme.palette.mode === "dark" ? "#525252" : "#e0e0e0"
                }`,
            borderRadius: 1,
            backgroundColor: editMode
              ? theme.palette.mode === "dark"
                ? "rgba(118, 177, 211, 0.08)"
                : "#f8f9ff"
              : "transparent",
            transition: "all 0.3s ease",
            position: "relative",
            "&::before": editMode
              ? {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(90deg, #76B1D3, #4d96c7)"
                      : "linear-gradient(90deg, #1976d2, #42a5f5)",
                  borderRadius: "4px 4px 0 0",
                }
              : {},
          },
        }}
        className="popup-content"
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
