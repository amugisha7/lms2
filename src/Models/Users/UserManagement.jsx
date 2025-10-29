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
import CreateUser from "./CreateUser/CreateUser";
import NotificationBar from "../../ComponentAssets/NotificationBar";
import ClickableText from "../../ComponentAssets/ClickableText";
import EditContentPopup from "../../ModelAssets/EditContentPopup";
import DeleteDialog from "../../ModelAssets/DeleteDialog";
import {
  fetchUserById,
  updateUserById,
  deleteUserById,
} from "./CreateUser/createUserHelpers";
import {
  fetchCustomFieldsForUser,
  mapCustomFieldsToFormValues,
  updateUserCustomFields,
} from "./CustomUserFields/customFieldsHelpers";
import UserFiles from "./UserFiles/UserFiles";
import EditableCustomUserFields from "./CustomUserFields/EditableCustomUserFields";
import CustomUserFields from "./CustomUserFields/CustomUserFields";

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
  heading = ""
) => {
  // Switch to light mode before generating PDF
  if (originalMode === "dark") {
    colorMode.toggleColorMode();
  }

  const dialogElement = printableRef.current;
  if (!dialogElement) return;

  // Store original styles
  const originalStyles = {
    position: dialogElement.style.position,
    left: dialogElement.style.left,
    top: dialogElement.style.top,
    transform: dialogElement.style.transform,
    zIndex: dialogElement.style.zIndex,
    width: dialogElement.style.width,
    maxWidth: dialogElement.style.maxWidth,
    height: dialogElement.style.height,
    overflow: dialogElement.style.overflow,
  };

  const originalBodyStyles = {
    overflow: document.body.style.overflow,
  };

  // Temporarily modify styles for PDF generation
  Object.assign(dialogElement.style, {
    position: "absolute",
    left: "0",
    top: "0",
    transform: "none",
    zIndex: "9999",
    width: "900px", // Fixed width for PDF
    maxWidth: "900px",
    height: "auto",
    overflow: "visible",
  });

  document.body.style.overflow = "hidden";

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

  // Create PDF
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Attribution
  pdf.setFontSize(9);
  pdf.setTextColor(25, 118, 210);
  const attributionText =
    "Created using Loan Management Software from www.LoanTabs.com";
  const textWidth =
    (pdf.getStringUnitWidth(attributionText) * 9) / pdf.internal.scaleFactor;
  const textXPos = (pageWidth - textWidth) / 2;
  const attributionYPos = 15;
  pdf.text(attributionText, textXPos, attributionYPos);

  // Heading
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
  }

  const topMarginOtherPages = 10;
  const leftPadding = 10;
  const rightPadding = 10;
  const bottomPadding = 10;

  const availableWidth = pageWidth - leftPadding - rightPadding;
  const availableHeightFirst =
    pageHeight - contentStartYFirstPage - bottomPadding;
  const availableHeightOther = pageHeight - topMarginOtherPages - bottomPadding;

  const pxPerMm = canvas.width / availableWidth;
  const totalHeightMm = canvas.height / pxPerMm;
  const firstPageCapacityMm = availableHeightFirst;

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

    const sliceImgData = sliceCanvas.toDataURL("image/png");
    const sliceHeightMm = sliceHeightPx / pxPerMm;

    if (isFirstPage) {
      pdf.addImage(
        sliceImgData,
        "PNG",
        leftPadding,
        contentStartYFirstPage,
        availableWidth,
        sliceHeightMm
      );
    } else {
      pdf.addPage();
      pdf.addImage(
        sliceImgData,
        "PNG",
        leftPadding,
        topMarginOtherPages,
        availableWidth,
        sliceHeightMm
      );
    }
  };

  if (totalHeightMm <= firstPageCapacityMm) {
    addSlice(0, canvas.height, true);
  } else {
    const firstSliceHeightPx = firstPageCapacityMm * pxPerMm;
    addSlice(0, firstSliceHeightPx, true);

    let remainingHeightPx = canvas.height - firstSliceHeightPx;
    let currentTopPx = firstSliceHeightPx;

    while (remainingHeightPx > 0) {
      const sliceHeightPx = Math.min(
        remainingHeightPx,
        availableHeightOther * pxPerMm
      );
      addSlice(currentTopPx, sliceHeightPx, false);
      remainingHeightPx -= sliceHeightPx;
      currentTopPx += sliceHeightPx;
    }
  }

  // Restore color mode
  if (originalMode === "dark") {
    colorMode.toggleColorMode();
  }

  pdf.save(filename);
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { userDetails } = useContext(UserContext);
  const colorMode = useContext(ColorModeContext);
  const printableRef = useRef();
  const customFieldsPrintableRef = useRef();
  const fetchedUserIdRef = React.useRef();
  const fetchedCustomFieldsRef = React.useRef({
    institutionUsersId: null,
    branchUsersId: null,
  }); // <-- Add ref

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState({
    message: "",
    color: "green",
  });
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [customFields, setCustomFields] = useState([]);
  const [customFieldsLoading, setCustomFieldsLoading] = useState(true);
  const [editCustomFieldsPopupOpen, setEditCustomFieldsPopupOpen] =
    useState(false);

  // Permissions
  const canEditUser = useHasPermission("update", "user");
  const canDeleteUser = useHasPermission("delete", "user");

  // Fetch user data
  const fetchUser = async () => {
    try {
      setLoading(true);
      const userData = await fetchUserById(id);
      setUser(userData);
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  // Fetch custom fields
  useEffect(() => {
    const fetchCustomFields = async () => {
      if (!userDetails?.institutionUsersId || !userDetails?.branchUsersId) {
        setCustomFieldsLoading(false);
        return;
      }

      try {
        setCustomFieldsLoading(true);
        console.log("API Call: Fetching custom fields for user", {
          institutionUsersId: userDetails.institutionUsersId,
          branchUsersId: userDetails.branchUsersId,
        });
        const fields = await fetchCustomFieldsForUser(
          userDetails.institutionUsersId,
          userDetails.branchUsersId
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setEditPopupOpen(true);
  };

  const handleEditPopupClose = () => {
    setEditPopupOpen(false);
  };

  const handleEditSuccess = (updatedUser) => {
    setUser(updatedUser);
    setNotification({
      message: "User updated successfully!",
      color: "green",
    });
    setEditPopupOpen(false); // Close the popup on success
  };

  const handleUpdateUserAPI = async (values, initialValues) => {
    const result = await updateUserById(id, values);
    return result;
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteUserById(id);
      setNotification({
        message: "User deleted successfully!",
        color: "green",
      });
      navigate("/users");
    } catch (err) {
      console.error("Error deleting user:", err);
      setNotification({
        message: "Failed to delete user",
        color: "red",
      });
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  // Custom fields handlers
  const handleEditCustomFields = () => {
    setEditCustomFieldsPopupOpen(true);
  };

  const handleCustomFieldsPrint = () => {
    const heading = `User Details (custom fields) - ${getUserName()}`;
    const filename = heading.replace(/ /g, "_") + ".pdf";
    downloadPdf(
      customFieldsPrintableRef,
      colorMode,
      theme.palette.mode,
      filename,
      heading
    );
  };

  const handleEditCustomFieldsPopupClose = () => {
    setEditCustomFieldsPopupOpen(false);
  };

  const handleUpdateCustomFieldsAPI = async (values) => {
    console.log("API Call: Updating user custom fields", {
      userId: id,
      customFields,
      values,
    });
    const result = await updateUserCustomFields(
      id,
      customFields,
      values,
      userDetails.institutionUsersId,
      userDetails.branchUsersId
    );
    console.log("API Call: Custom fields updated successfully", result);
    return result;
  };

  const handleCustomFieldsUpdateSuccess = (updatedData) => {
    // Update the user state with new custom fields data
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedData,
    }));
    setEditCustomFieldsPopupOpen(false);
  };

  const handlePrint = () => {
    const originalMode = theme.palette.mode;
    downloadPdf(
      printableRef,
      colorMode,
      originalMode,
      `${getUserName()}_details.pdf`,
      `${getUserName()} - User Details`
    );
  };

  const getUserName = () => {
    if (!user) return "User";
    return (
      [user.firstName, user.middleName, user.lastName]
        .filter(Boolean)
        .join(" ") ||
      user.email ||
      "Unnamed User"
    );
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
          <IconButton onClick={() => navigate("/users")} sx={{ mr: 1 }}>
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

      {/* Edit Popup */}
      <EditContentPopup
        open={editPopupOpen}
        onClose={handleEditPopupClose}
        title={`Edit ${getUserName()}`}
        maxWidth="lg"
      >
        <CreateUser
          initialValues={user}
          isEditMode={true}
          forceEditMode={true}
          onEditSuccess={handleEditSuccess}
          onUpdateUserAPI={handleUpdateUserAPI}
          setNotification={setNotification}
          onCancel={handleEditPopupClose}
          canEdit={canEditUser}
        />
      </EditContentPopup>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        name={getUserName()}
      />

      {/* Edit Custom Fields Popup */}
      <EditContentPopup
        open={editCustomFieldsPopupOpen}
        onClose={handleEditCustomFieldsPopupClose}
        title={`Edit Custom Fields - ${getUserName()}`}
        maxWidth="lg"
      >
        <EditableCustomUserFields
          customFields={customFields}
          initialValues={mapCustomFieldsToFormValues(user, customFields)}
          onUpdateSuccess={handleCustomFieldsUpdateSuccess}
          onUpdateCustomFieldsAPI={handleUpdateCustomFieldsAPI}
          onCancel={handleEditCustomFieldsPopupClose}
          setNotification={setNotification}
        />
      </EditContentPopup>

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
              onClick={() => navigate("/users")}
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
              {getUserName()}
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
            {/* {canDeleteUser && userDetails?.id !== id && (
              <ClickableText
                onClick={handleDelete}
                sx={{
                  color: theme.palette.error.main,
                  fontSize: "0.9rem",
                }}
              >
                Delete
              </ClickableText>
            )} */}
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
              aria-label="user management tabs"
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
              <Tab label="Details" id="user-tab-0" />
              <Tab label="Files" id="user-tab-1" />
              <Tab label="Custom Fields" id="user-tab-2" />
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
                {canEditUser && (
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
                    fontSize: "0.9rem",
                  }}
                  className="pdf-hide"
                >
                  Export PDF
                </ClickableText>
              </Box>
              <CreateUser
                initialValues={user}
                isEditMode={true}
                forceEditMode={false}
                onEditSuccess={handleEditSuccess}
                onUpdateUserAPI={handleUpdateUserAPI}
                setNotification={setNotification}
                canEdit={canEditUser}
              />
            </div>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <UserFiles
              user={user}
              setUser={setUser}
              setNotification={setNotification}
            />
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
                    user,
                    customFields
                  )}
                  enableReinitialize
                >
                  {(formik) => (
                    <CustomUserFields
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
          </TabPanel>
        </Box>
      </Box>
    </>
  );
}
