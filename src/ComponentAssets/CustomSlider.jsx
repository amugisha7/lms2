import React, { useRef, useContext } from "react";
import Drawer from "@mui/material/Drawer";
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
  let drawerElement = null;
  let originalStyles = null;
  let originalBodyStyles = null;

  // Wait for the DOM to update with light mode styles
  setTimeout(async () => {
    try {
      // Target only the drawer paper element (the actual slider without background)
      drawerElement =
        printableRef.current?.querySelector(".MuiDrawer-paper") ||
        printableRef.current;

      if (!drawerElement) {
        throw new Error("Drawer content not found");
      }

      // Store original styles
      originalStyles = {
        position: drawerElement.style.position,
        transform: drawerElement.style.transform,
        margin: drawerElement.style.margin,
        maxWidth: drawerElement.style.maxWidth,
        width: drawerElement.style.width,
        height: drawerElement.style.height,
        overflow: drawerElement.style.overflow,
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
      Object.assign(drawerElement.style, {
        position: "static",
        transform: "none",
        margin: "0",
        maxWidth: "900px", // Desktop maxWidth
        width: "900px", // Fixed desktop width
        height: "auto",
        overflow: "visible",
      });

      // Force all responsive elements to desktop view
      const responsiveElements = drawerElement.querySelectorAll("*");
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
        if (element.classList.contains("slider-header")) {
          element.style.flexWrap = "nowrap";
        }

        // Reset any mobile-specific overrides
        element.style.fontSize = computed.fontSize;
        element.style.order = "0";
      });

      // Wait for layout to settle
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Get canvas of the drawer element only
      const canvas = await html2canvas(drawerElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 900, // Fixed desktop width
        height: drawerElement.scrollHeight,
        windowWidth: 1200, // Force desktop viewport
        windowHeight: 800,
      });

      // Restore all element styles
      responsiveElements.forEach((element, index) => {
        if (originalElementStyles[index]) {
          Object.assign(element.style, originalElementStyles[index]);
        }
      });

      // Restore original styles
      Object.assign(drawerElement.style, originalStyles);
      Object.assign(document.body.style, originalBodyStyles);

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
      pdf.setFontSize(9);
      pdf.setTextColor(25, 118, 210); // Material blue 700 (hex #1976d2)

      const attributionText =
        "Created using Loan Management Software from www.LoanTabs.com";
      const textWidth =
        (pdf.getStringUnitWidth(attributionText) * 9) /
        pdf.internal.scaleFactor;
      const textXPos = (pageWidth - textWidth) / 2;
      const attributionYPos = 15; // 15mm from top

      pdf.text(attributionText, textXPos, attributionYPos);

      // Calculate available space for content (with proper spacing and padding)
      const contentStartY = attributionYPos + 5; // 5mm spacing after attribution
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

      // Restore styles in case of error
      if (drawerElement && originalStyles) {
        Object.assign(drawerElement.style, originalStyles);
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

export default function CustomSlider({
  open,
  onClose,
  title,
  children,
  onEdit,
  onDelete,
  showEdit = true,
  showDelete = true,
  editMode = false,
}) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { editClicked, setEditClicked } = useContext(EditClickedContext) || {};
  const printableRef = useRef(null);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      variant="temporary"
      ModalProps={{
        disableScrollLock: true,
      }}
      id="printable-slider"
      ref={printableRef}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "90%", sm: 500, md: 850, lg: 1000 }, // Responsive widths: full on mobile, increasing on larger screens
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
          position: "relative",
          flexWrap: { xs: "wrap", sm: "nowrap" },
        }}
        className="slider-header"
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            textTransform: "none",
            width: { xs: "90%", sm: "auto" },
            pr: { xs: 2, sm: 0 },
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            order: { xs: 1, sm: 0 },
            width: { xs: "100%", sm: "auto" },
            mt: { xs: 1, sm: 0 },
          }}
          className="slider-actions"
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
              ml: { xs: 0, sm: "60px" },
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
        className="slider-content"
      >
        {children}
      </Box>
    </Drawer>
  );
}
