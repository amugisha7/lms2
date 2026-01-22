import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import { Formik } from "formik";
import { UserContext } from "../../App";
import CreateBorrower from "./CreateBorrower/CreateBorrower";
import NotificationBar from "../../ModelAssets/NotificationBar";
import ClickableText from "../../ModelAssets/ClickableText";
import CustomSlider from "../../ModelAssets/CustomSlider";
import CustomBorrowerFields from "./CustomBorrowerFields/CustomBorrowerFields";
import EditableCustomBorrowerFields from "./CustomBorrowerFields/EditableCustomBorrowerFields";
import DeleteDialog from "../../ModelAssets/DeleteDialog";
import {
  fetchCustomFieldsForBorrower,
  mapCustomFieldsToFormValues,
  updateBorrowerCustomFields,
} from "./CustomBorrowerFields/customFieldsHelpers";
import {
  fetchBorrowerById,
  updateBorrowerById,
  deleteBorrowerById,
} from "./CreateBorrower/createBorrowerHelpers";
import BorrowerFiles from "./BorrowerFiles/BorrowerFiles";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { ColorModeContext } from "../../theme";
import { useHasPermission } from "../../ModelAssets/Permissions/permissions";

// Modified function to download PDF using jsPDF and html2canvas
const downloadPdf = async (
  printableRef,
  colorMode,
  originalMode,
  filename = "document.pdf",
  heading = "",
) => {
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
      // Target the printable element
      dialogElement = printableRef.current;

      if (!dialogElement) {
        throw new Error("Printable content not found");
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

      // Set styles for PDF capture
      Object.assign(dialogElement.style, {
        position: "static",
        transform: "none",
        margin: "0",
        maxWidth: "900px", // Desktop maxWidth
        width: "900px", // Fixed desktop width
        height: "auto",
        overflow: "visible",
      });

      // Hide elements that should not appear in PDF
      const hideElements = dialogElement.querySelectorAll(".pdf-hide");
      const originalDisplays = [];
      hideElements.forEach((el, index) => {
        originalDisplays[index] = el.style.display;
        el.style.display = "none";
      });

      // Wait for layout to settle
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Get canvas of the element
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

      // Restore hidden elements
      hideElements.forEach((el, index) => {
        el.style.display = originalDisplays[index];
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

      // Heading (if provided)
      let contentStartYFirstPage = attributionYPos + 5;
      if (heading) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(15);
        pdf.setTextColor(0, 0, 0);
        const headingWidth =
          (pdf.getStringUnitWidth(heading) * 15) / pdf.internal.scaleFactor;
        const headingXPos = (pageWidth - headingWidth) / 2;
        const headingYPos = attributionYPos + 10;
        pdf.text(heading, headingXPos, headingYPos);
        contentStartYFirstPage = headingYPos + 10;
      } else {
        contentStartYFirstPage = attributionYPos + 5;
      }
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
          sliceHeightPx,
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
          sliceHeightMm,
        );
      };

      if (totalHeightMm <= firstPageCapacityMm) {
        // Single page case
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

      pdf.save(filename);

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

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`borrower-tabpanel-${index}`}
      aria-labelledby={`borrower-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BorrowerManagement() {
  const { borrowerId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const printableRef = useRef(null);
  const customFieldsPrintableRef = useRef(null);
  const { userDetails } = useContext(UserContext);
  const [tabValue, setTabValue] = useState(0);
  const [borrower, setBorrower] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({
    message: "",
    color: "green",
  });
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [customFields, setCustomFields] = useState([]);
  const [customFieldsLoading, setCustomFieldsLoading] = useState(true);
  const [editCustomFieldsPopupOpen, setEditCustomFieldsPopupOpen] =
    useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const fetchedBorrowerIdRef = React.useRef();
  const fetchedCustomFieldsRef = React.useRef({
    institutionUsersId: null,
    branchUsersId: null,
  }); // <-- Add ref

  const canEditBorrower = useHasPermission("update", "borrower");
  const canDeleteBorrower = useHasPermission("delete", "borrower");

  // Fetch borrower data
  useEffect(() => {
    const fetchBorrower = async () => {
      if (!borrowerId) {
        setError("No borrower ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("API Call: Fetching borrower by ID", borrowerId);
        const borrowerData = await fetchBorrowerById(borrowerId); // <-- Use helper
        console.log("API Call: Borrower fetched successfully", borrowerData);
        setBorrower(borrowerData);
      } catch (err) {
        console.error("Error fetching borrower:", err);
        setError(err.message || "Failed to load borrower details");
      } finally {
        setLoading(false);
      }
    };

    if (borrowerId && borrowerId !== fetchedBorrowerIdRef.current) {
      fetchBorrower();
      fetchedBorrowerIdRef.current = borrowerId;
    }
  }, [borrowerId]);

  // Fetch custom fields
  useEffect(() => {
    const fetchCustomFields = async () => {
      if (!userDetails?.institutionUsersId || !userDetails?.branchUsersId) {
        setCustomFieldsLoading(false);
        return;
      }

      try {
        setCustomFieldsLoading(true);
        console.log("API Call: Fetching custom fields for borrower", {
          institutionUsersId: userDetails.institutionUsersId,
          branchUsersId: userDetails.branchUsersId,
        });
        const fields = await fetchCustomFieldsForBorrower(
          userDetails.institutionUsersId,
          userDetails.branchUsersId,
        );
        console.log("API Call: Custom fields fetched successfully", fields);
        setCustomFields(fields);
      } catch (error) {
        console.error("Error fetching custom fields:", error);
      } finally {
        setCustomFieldsLoading(false);
      }
    };

    // Only fetch if institutionUsersId or branchUsersId changed
    if (
      userDetails?.institutionUsersId &&
      userDetails?.branchUsersId &&
      (fetchedCustomFieldsRef.current.institutionUsersId !==
        userDetails.institutionUsersId ||
        fetchedCustomFieldsRef.current.branchUsersId !==
          userDetails.branchUsersId)
    ) {
      fetchCustomFields();
      fetchedCustomFieldsRef.current = {
        institutionUsersId: userDetails.institutionUsersId,
        branchUsersId: userDetails.branchUsersId,
      };
    }
  }, [userDetails?.institutionUsersId, userDetails?.branchUsersId]);

  // API handler for updating borrower
  const handleUpdateBorrowerAPI = async (values, initialValues) => {
    console.log("API Call: Updating borrower", { values, initialValues });
    const result = await updateBorrowerById(values, initialValues); // <-- Use helper
    console.log("API Call: Borrower updated successfully", result);
    return result;
  };

  const handleEditSuccess = (updatedBorrower) => {
    setBorrower(updatedBorrower);
    const combinedName =
      updatedBorrower.firstname || updatedBorrower.othername
        ? `${[updatedBorrower.firstname, updatedBorrower.othername]
            .filter(Boolean)
            .join(" ")}${
            updatedBorrower.businessName
              ? ` (${updatedBorrower.businessName})`
              : ""
          }`
        : updatedBorrower.businessName || "";
    setNotification({
      message: `${combinedName} updated successfully!`,
      color: "green",
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getBorrowerName = () => {
    if (!borrower) return "Borrower";
    return borrower.firstname || borrower.othername
      ? `${[borrower.firstname, borrower.othername].filter(Boolean).join(" ")}${
          borrower.businessName ? ` (${borrower.businessName})` : ""
        }`
      : borrower.businessName || "Unnamed Borrower";
  };

  // Example handlers (implement as needed)
  const handleEdit = () => {
    setEditPopupOpen(true);
  };
  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!borrower) return;

    setDeleteLoading(true);
    try {
      console.log("API Call: Deleting borrower", borrowerId);
      await deleteBorrowerById(borrowerId);
      console.log("API Call: Borrower deleted successfully");

      const combinedName = getBorrowerName();
      setNotification({
        message: `${combinedName} deleted successfully!`,
        color: "green",
      });

      // Navigate back to borrowers list after a short delay
      setTimeout(() => {
        navigate("/borrowers");
      }, 1500);
    } catch (error) {
      console.error("Error deleting borrower:", error);
      setNotification({
        message: "Error deleting borrower. Please try again.",
        color: "red",
      });
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };
  const handlePrint = () => {
    const heading = `Borrower Details - ${getBorrowerName()}`;
    const filename = heading.replace(/ /g, "_") + ".pdf";
    downloadPdf(printableRef, colorMode, theme.palette.mode, filename, heading);
  };

  const handleEditPopupClose = () => {
    setEditPopupOpen(false);
  };

  const handleEditPopupSuccess = (updatedBorrower) => {
    setBorrower(updatedBorrower);
    const combinedName =
      updatedBorrower.firstname || updatedBorrower.othername
        ? `${[updatedBorrower.firstname, updatedBorrower.othername]
            .filter(Boolean)
            .join(" ")}${
            updatedBorrower.businessName
              ? ` (${updatedBorrower.businessName})`
              : ""
          }`
        : updatedBorrower.businessName || "";
    setNotification({
      message: `${combinedName} updated successfully!`,
      color: "green",
    });
    setEditPopupOpen(false);
  };

  // Custom fields handlers
  const handleEditCustomFields = () => {
    setEditCustomFieldsPopupOpen(true);
  };

  const handleCustomFieldsPrint = () => {
    const heading = `Borrower Details (custom fields) - ${getBorrowerName()}`;
    const filename = heading.replace(/ /g, "_") + ".pdf";
    downloadPdf(
      customFieldsPrintableRef,
      colorMode,
      theme.palette.mode,
      filename,
      heading,
    );
  };

  const handleEditCustomFieldsPopupClose = () => {
    setEditCustomFieldsPopupOpen(false);
  };

  const handleUpdateCustomFieldsAPI = async (values) => {
    console.log("API Call: Updating borrower custom fields", {
      borrowerId,
      customFields,
      values,
    });
    const result = await updateBorrowerCustomFields(
      borrowerId,
      customFields,
      values,
    );
    console.log("API Call: Custom fields updated successfully", result);
    return result;
  };

  const handleCustomFieldsUpdateSuccess = (updatedData) => {
    // Update the borrower state with new custom fields data
    setBorrower((prevBorrower) => ({
      ...prevBorrower,
      customFieldsData: updatedData.customFieldsData,
      updatedAt: updatedData.updatedAt,
    }));
    setEditCustomFieldsPopupOpen(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigate("/borrowers")} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">Error</Typography>
        </Box>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <NotificationBar
        message={notification.message}
        color={notification.color}
      />

      {/* Edit Slider */}
      <CustomSlider
        open={editPopupOpen}
        onClose={handleEditPopupClose}
        title={`Edit ${getBorrowerName()}`}
        showEdit={false}
        showDelete={false}
        showPdf={false}
      >
        <CreateBorrower
          initialValues={borrower}
          isEditMode={true}
          forceEditMode={true}
          onEditSuccess={handleEditPopupSuccess}
          onUpdateBorrowerAPI={handleUpdateBorrowerAPI}
          setNotification={setNotification}
          onCancel={handleEditPopupClose}
        />
      </CustomSlider>

      {/* Edit Custom Fields Slider */}
      <CustomSlider
        open={editCustomFieldsPopupOpen}
        onClose={handleEditCustomFieldsPopupClose}
        title={`Edit Custom Fields - ${getBorrowerName()}`}
        showEdit={false}
        showDelete={false}
        showPdf={false}
      >
        <EditableCustomBorrowerFields
          customFields={customFields}
          initialValues={mapCustomFieldsToFormValues(borrower, customFields)}
          onUpdateSuccess={handleCustomFieldsUpdateSuccess}
          onUpdateCustomFieldsAPI={handleUpdateCustomFieldsAPI}
          onCancel={handleEditCustomFieldsPopupClose}
          setNotification={setNotification}
        />
      </CustomSlider>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        name={getBorrowerName()}
      />

      <Box sx={{ width: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={() => navigate("/borrowers")}
              sx={{
                mr: 1,
                color: theme.palette.text.primary,
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontFamily: theme.typography.h4.fontFamily,
              }}
            >
              {getBorrowerName()}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              mt: { xs: 2, sm: 0 },
              flexShrink: 0,
            }}
          >
            {/* Removed Edit button from header */}
            {canDeleteBorrower && (
              <ClickableText
                onClick={handleDelete}
                sx={{
                  color: theme.palette.error.main,
                  // fontWeight: 500,
                  fontSize: "0.9rem",
                }}
              >
                Delete
              </ClickableText>
            )}
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: theme.palette.divider,
              backgroundColor: theme.palette.background.paper,
              borderRadius: "8px 8px 0 0",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="borrower management tabs"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: theme.palette.blueText.main,
                  height: 3,
                  borderRadius: "1.5px",
                },
                "& .MuiTab-root": {
                  fontFamily: theme.typography.fontFamily,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textTransform: "none",
                  letterSpacing: "0.02em",
                  color: theme.palette.text.secondary,
                  minHeight: 48,
                  padding: "12px 24px",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    color: theme.palette.blueText.main,
                    // backgroundColor: theme.palette.action.hover,
                  },
                  "&.Mui-selected": {
                    color: theme.palette.blueText.main,
                    fontWeight: 600,
                  },
                  "&.Mui-focusVisible": {
                    backgroundColor: theme.palette.action.focus,
                  },
                },
                "& .MuiTabs-flexContainer": {
                  gap: 1,
                },
              }}
            >
              <Tab label="Details" id="borrower-tab-0" />
              <Tab label="Files" id="borrower-tab-2" />
              <Tab label="Custom Fields" id="borrower-tab-1" />
            </Tabs>
          </Box>
          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            <div ref={printableRef}>
              {/* Right-aligned Edit button */}
              <Box
                sx={{
                  mb: 1,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 3,
                }}
              >
                {canEditBorrower && (
                  <ClickableText
                    onClick={handleEdit}
                    sx={{
                      color: theme.palette.blueText.main,
                      fontSize: "0.9rem",
                    }}
                    className="pdf-hide"
                  >
                    Edit
                  </ClickableText>
                )}
                <ClickableText
                  onClick={handlePrint}
                  sx={{
                    color: theme.palette.secondary.main,
                    // fontWeight: 500,
                    fontSize: "0.9rem",
                  }}
                  className="pdf-hide"
                >
                  Export PDF
                </ClickableText>
              </Box>
              <CreateBorrower
                initialValues={borrower}
                isEditMode={true}
                forceEditMode={false}
                onEditSuccess={handleEditSuccess}
                onUpdateBorrowerAPI={handleUpdateBorrowerAPI}
                setNotification={setNotification}
              />
            </div>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <div ref={customFieldsPrintableRef}>
              {customFieldsLoading ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Loading custom fields...
                  </Typography>
                </Box>
              ) : (
                <Formik
                  initialValues={mapCustomFieldsToFormValues(
                    borrower,
                    customFields,
                  )}
                  enableReinitialize
                >
                  {(formik) => (
                    <CustomBorrowerFields
                      customFields={customFields}
                      formik={formik}
                      editing={false}
                      onEdit={handleEditCustomFields}
                      onPrint={handleCustomFieldsPrint}
                    />
                  )}
                </Formik>
              )}
            </div>
          </TabPanel>{" "}
          <TabPanel value={tabValue} index={1}>
            <BorrowerFiles
              borrower={borrower}
              setBorrower={setBorrower}
              setNotification={setNotification}
            />
          </TabPanel>
        </Box>
      </Box>
    </>
  );
}
