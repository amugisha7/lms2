import React, { useRef, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ClickableText from "./ClickableText";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "../theme";
import { EditClickedContext } from "./CollectionsTemplate";
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

  // Declare variables outside try block for proper scope
  let dialogElement = null;
  let originalStyles = null;
  let originalBodyStyles = null;

  // Wait for the DOM to update with light mode styles
  setTimeout(async () => {
    try {
      // Target only the dialog paper element (the actual popup without background)
      dialogElement =
        printableRef.current?.querySelector(".MuiDialog-paper") ||
        printableRef.current;

      if (!dialogElement) {
        throw new Error("Dialog content not found");
      }

      // Store original styles
      originalStyles = {
        position: dialogElement.style.position,
        transform: dialogElement.style.transform,
        margin: dialogElement.style.margin,
        maxWidth: dialogElement.style.maxWidth,
        width: dialogElement.style.width,
        height: dialogElement.style.height,
        overflow: dialogElement.style.overflow,
      };

      // Store original body styles
      originalBodyStyles = {
        width: document.body.style.width,
        minWidth: document.body.style.minWidth,
        overflow: document.body.style.overflow,
      };

      // Force desktop layout for PDF generation
      Object.assign(document.body.style, {
        width: "1200px", // Force desktop width
        minWidth: "1200px",
        overflow: "visible",
      });

      // Set styles for PDF capture - force desktop layout
      Object.assign(dialogElement.style, {
        position: "static",
        transform: "none",
        margin: "0",
        maxWidth: "900px", // Desktop maxWidth for 'md'
        width: "900px", // Fixed desktop width
        height: "auto",
        overflow: "visible",
      });

      // Force all responsive elements to desktop view
      const responsiveElements = dialogElement.querySelectorAll("*");
      const originalElementStyles = [];

      responsiveElements.forEach((element, index) => {
        const computed = window.getComputedStyle(element);
        originalElementStyles[index] = {
          fontSize: element.style.fontSize,
          padding: element.style.padding,
          margin: element.style.margin,
          width: element.style.width,
          flexDirection: element.style.flexDirection,
          flexWrap: element.style.flexWrap,
          order: element.style.order,
          display: element.style.display,
        };

        // Force desktop styles
        if (element.classList.contains("popup-header")) {
          element.style.flexWrap = "nowrap";
        }

        // Reset any mobile-specific overrides
        element.style.fontSize = computed.fontSize;
        element.style.order = "0";
      });

      // Wait for layout to settle
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Get canvas of the dialog element only
      const canvas = await html2canvas(dialogElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 900,
        height: dialogElement.scrollHeight,
        windowWidth: 1200,
        windowHeight: 800,
      });

      // Restore all element styles
      responsiveElements.forEach((element, index) => {
        if (originalElementStyles[index]) {
          Object.assign(element.style, originalElementStyles[index]);
        }
      });

      // Restore original styles
      Object.assign(dialogElement.style, originalStyles);
      Object.assign(document.body.style, originalBodyStyles);

      // Create PDF (multi-page support)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Attribution (only first page)
      pdf.setFontSize(9);
      pdf.setTextColor(25, 118, 210);
      const attributionText =
        "Created using Loan Management Software from www.LoanTabs.com";
      const textWidth =
        (pdf.getStringUnitWidth(attributionText) * 9) /
        pdf.internal.scaleFactor;
      const textXPos = (pageWidth - textWidth) / 2;
      const attributionYPos = 15;
      pdf.text(attributionText, textXPos, attributionYPos);

      // Layout metrics
      const contentStartYFirstPage = attributionYPos + 5; // first page starts below attribution
      const topMarginOtherPages = 10; // top margin on subsequent pages
      const leftPadding = 10;
      const rightPadding = 10;
      const bottomPadding = 10;

      const availableWidth = pageWidth - leftPadding - rightPadding;
      const availableHeightFirst =
        pageHeight - contentStartYFirstPage - bottomPadding;
      const availableHeightOther =
        pageHeight - topMarginOtherPages - bottomPadding;

      // Scale factor (px per mm) based on width fit
      const pxPerMm = canvas.width / availableWidth;

      // Determine if single-page fits
      const totalHeightMm = canvas.height / pxPerMm;
      const firstPageCapacityMm = availableHeightFirst;

      // Helper to add a slice
      const addSlice = (sliceTopPx, sliceHeightPx, isFirstPage) => {
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceHeightPx;
        const ctx = sliceCanvas.getContext("2d");
        ctx.drawImage(
          canvas,
          0,
          sliceTopPx,
          canvas.width,
          sliceHeightPx,
          0,
          0,
          canvas.width,
          sliceHeightPx
        );
        const sliceImg = sliceCanvas.toDataURL("image/jpeg", 1.0);
        const sliceHeightMm = (sliceHeightPx / canvas.width) * availableWidth;
        const yPos = isFirstPage ? contentStartYFirstPage : topMarginOtherPages;
        const xPos = leftPadding + (availableWidth - availableWidth) / 2; // stays left-aligned within padded area
        pdf.addImage(
          sliceImg,
          "JPEG",
          xPos,
          yPos,
          availableWidth,
          sliceHeightMm
        );
      };

      if (totalHeightMm <= firstPageCapacityMm) {
        // Single page case (original behavior without shrinking vertically)
        addSlice(0, canvas.height, true);
      } else {
        // Multi-page slicing
        let remainingPx = canvas.height;
        let offsetPx = 0;

        // First page slice height in px
        const firstPageHeightPx = Math.floor(availableHeightFirst * pxPerMm);
        addSlice(0, firstPageHeightPx, true);
        remainingPx -= firstPageHeightPx;
        offsetPx += firstPageHeightPx;

        const otherPageCapacityPx = Math.floor(availableHeightOther * pxPerMm);

        while (remainingPx > 0) {
          pdf.addPage();
          const sliceHeightPx = Math.min(otherPageCapacityPx, remainingPx);
          addSlice(offsetPx, sliceHeightPx, false);
          offsetPx += sliceHeightPx;
          remainingPx -= sliceHeightPx;
        }
      }

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

      // Restore styles in case of error
      if (dialogElement && originalStyles) {
        Object.assign(dialogElement.style, originalStyles);
      }
      if (originalBodyStyles) {
        Object.assign(document.body.style, originalBodyStyles);
      }

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
  const { editClicked, setEditClicked } = useContext(EditClickedContext) || {};
  const printableRef = useRef(null);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      disableScrollLock
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
          {showDelete && onDelete && !editClicked && (
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
          {showEdit && onEdit && !editClicked && (
            <ClickableText
              className="action-icon"
              onClick={onEdit}
              sx={{ mr: 2, fontSize: "0.9rem" }}
            >
              Edit
            </ClickableText>
          )}

          {showEdit && onEdit && !editClicked && (
            <Button
              onClick={() =>
                downloadPdf(printableRef, colorMode, theme.palette.mode)
              }
              size="small"
              aria-label="Download PDF"
              startIcon={<DownloadIcon sx={{ mr: -0.7 }} />}
              sx={{
                mr: 1,
                fontSize: "0.9rem",
                minWidth: "auto",
                padding: "2px 8px",
                textTransform: "none",
                lineHeight: 1.2,
                backgroundColor: "transparent",
                color: theme.palette.mode === "dark" ? "#ebebeb" : "#2b2d2f",
                // border: `1px solid ${
                //   theme.palette.mode === "dark" ? "#76B1D3" : "#1976d2"
                // }`,
                borderRadius: "4px",
                boxShadow: "none",
              }}
              className="action-icon"
            >
              PDF
            </Button>
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

      <Box
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
      </Box>
    </Dialog>
  );
}
