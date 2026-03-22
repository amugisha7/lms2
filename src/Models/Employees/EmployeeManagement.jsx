import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
  Breadcrumbs,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import { Formik } from "formik";
import { UserContext } from "../../App";
import CreateEmployee from "./CreateEmployee/CreateEmployee";
import NotificationBar from "../../ModelAssets/NotificationBar";
import ClickableText from "../../ModelAssets/ClickableText";
import CustomSlider from "../../ModelAssets/CustomSlider";
import DeleteDialog from "../../ModelAssets/DeleteDialog";
import EmployeeFiles from "./EmployeeFiles/EmployeeFiles";
import CustomEmployeeFields from "./CustomEmployeeFields/CustomEmployeeFields";
import EditableCustomEmployeeFields from "./CustomEmployeeFields/EditableCustomEmployeeFields";
import {
  fetchEmployeeById,
  getEmployeeDisplayName,
  updateEmployeeRecord,
  deleteEmployeeRecord,
  fetchCustomFieldsForEmployee,
  mapCustomFieldsToEmployeeValues,
  updateEmployeeCustomFields,
} from "./employeeHelpers";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { ColorModeContext } from "../../theme";
import { useHasPermission } from "../../ModelAssets/Permissions/permissions";

const downloadPdf = async (
  printableRef,
  colorMode,
  originalMode,
  filename = "document.pdf",
  heading = "",
) => {
  if (originalMode === "dark") colorMode.toggleColorMode();
  document.body.classList.add("printing-active");

  let dialogElement = null;
  let originalStyles = null;
  let originalBodyStyles = null;

  setTimeout(async () => {
    try {
      dialogElement = printableRef.current;
      if (!dialogElement) throw new Error("Printable content not found");

      originalStyles = {
        position: dialogElement.style.position,
        transform: dialogElement.style.transform,
        margin: dialogElement.style.margin,
        maxWidth: dialogElement.style.maxWidth,
        width: dialogElement.style.width,
        height: dialogElement.style.height,
        overflow: dialogElement.style.overflow,
      };
      originalBodyStyles = {
        width: document.body.style.width,
        minWidth: document.body.style.minWidth,
        overflow: document.body.style.overflow,
      };

      Object.assign(document.body.style, {
        width: "1200px",
        minWidth: "1200px",
        overflow: "visible",
      });
      Object.assign(dialogElement.style, {
        position: "static",
        transform: "none",
        margin: "0",
        maxWidth: "900px",
        width: "900px",
        height: "auto",
        overflow: "visible",
      });

      const hideElements = dialogElement.querySelectorAll(".pdf-hide");
      const originalDisplays = [];
      hideElements.forEach((el, i) => {
        originalDisplays[i] = el.style.display;
        el.style.display = "none";
      });

      await new Promise((resolve) => setTimeout(resolve, 200));

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

      hideElements.forEach((el, i) => {
        el.style.display = originalDisplays[i];
      });
      Object.assign(dialogElement.style, originalStyles);
      Object.assign(document.body.style, originalBodyStyles);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.setFontSize(9);
      pdf.setTextColor(25, 118, 210);
      const attributionText =
        "Created using Loan Management Software from www.LoanTabs.com";
      const textWidth =
        (pdf.getStringUnitWidth(attributionText) * 9) /
        pdf.internal.scaleFactor;
      const attributionYPos = 15;
      pdf.text(attributionText, (pageWidth - textWidth) / 2, attributionYPos);

      let contentStartYFirstPage = attributionYPos + 5;
      if (heading) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(15);
        pdf.setTextColor(0, 0, 0);
        const headingWidth =
          (pdf.getStringUnitWidth(heading) * 15) / pdf.internal.scaleFactor;
        const headingYPos = attributionYPos + 10;
        pdf.text(heading, (pageWidth - headingWidth) / 2, headingYPos);
        contentStartYFirstPage = headingYPos + 10;
      }

      const leftPadding = 10;
      const rightPadding = 10;
      const bottomPadding = 10;
      const topMarginOtherPages = 10;
      const availableWidth = pageWidth - leftPadding - rightPadding;
      const availableHeightFirst =
        pageHeight - contentStartYFirstPage - bottomPadding;
      const availableHeightOther =
        pageHeight - topMarginOtherPages - bottomPadding;
      const pxPerMm = canvas.width / availableWidth;
      const totalHeightMm = canvas.height / pxPerMm;

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
        pdf.addImage(
          sliceImg,
          "JPEG",
          leftPadding,
          isFirstPage ? contentStartYFirstPage : topMarginOtherPages,
          availableWidth,
          sliceHeightMm,
        );
      };

      if (totalHeightMm <= availableHeightFirst) {
        addSlice(0, canvas.height, true);
      } else {
        let remainingPx = canvas.height;
        let offsetPx = 0;
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
      document.body.classList.remove("printing-active");
      if (originalMode === "dark")
        setTimeout(() => colorMode.toggleColorMode(), 100);
    } catch (error) {
      console.error("Error generating PDF:", error);
      document.body.classList.remove("printing-active");
      if (dialogElement && originalStyles)
        Object.assign(dialogElement.style, originalStyles);
      if (originalBodyStyles)
        Object.assign(document.body.style, originalBodyStyles);
      if (originalMode === "dark") colorMode.toggleColorMode();
    }
  }, 300);
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`employee-tabpanel-${index}`}
      aria-labelledby={`employee-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function EmployeeManagement() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const printableRef = useRef(null);
  const customFieldsPrintableRef = useRef(null);
  const { userDetails } = useContext(UserContext);

  const [tabValue, setTabValue] = useState(0);
  const [employee, setEmployee] = useState(null);
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

  const fetchedEmployeeIdRef = useRef();
  const fetchedCustomFieldsRef = useRef({
    institutionUsersId: null,
    branchUsersId: null,
  });

  const canEditEmployee = useHasPermission("update", "employee");
  const canDeleteEmployee = useHasPermission("delete", "employee");

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!employeeId) {
        setError("No employee ID provided");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchEmployeeById(employeeId);
        setEmployee(data);
      } catch (err) {
        console.error("Error fetching employee:", err);
        setError(err.message || "Failed to load employee details");
      } finally {
        setLoading(false);
      }
    };

    if (employeeId && employeeId !== fetchedEmployeeIdRef.current) {
      fetchEmployee();
      fetchedEmployeeIdRef.current = employeeId;
    }
  }, [employeeId]);

  useEffect(() => {
    const fetchCustomFields = async () => {
      if (!userDetails?.institutionUsersId || !userDetails?.branchUsersId) {
        setCustomFieldsLoading(false);
        return;
      }
      try {
        setCustomFieldsLoading(true);
        const fields = await fetchCustomFieldsForEmployee(
          userDetails.institutionUsersId,
          userDetails.branchUsersId,
        );
        setCustomFields(fields);
      } catch (err) {
        console.error("Error fetching employee custom fields:", err);
      } finally {
        setCustomFieldsLoading(false);
      }
    };

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

  const getEmployeeName = () => getEmployeeDisplayName(employee);
  const handleTabChange = (_, newValue) => setTabValue(newValue);

  const handleUpdateEmployeeAPI = async (values) =>
    updateEmployeeRecord(values);

  const handleEditSuccess = (updatedEmployee) => {
    setEmployee(updatedEmployee);
    setNotification({
      message: `${getEmployeeDisplayName(updatedEmployee)} updated successfully!`,
      color: "green",
    });
  };

  const handleEdit = () => setEditPopupOpen(true);
  const handleDelete = () => setDeleteDialogOpen(true);

  const handleConfirmDelete = async () => {
    if (!employee) return;
    setDeleteLoading(true);
    try {
      await deleteEmployeeRecord(employee.id);
      setNotification({
        message: `${getEmployeeName()} deleted successfully!`,
        color: "green",
      });
      setTimeout(() => navigate("/employees"), 1500);
    } catch (err) {
      console.error("Error deleting employee:", err);
      setNotification({
        message: "Error deleting employee. Please try again.",
        color: "red",
      });
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handlePrint = () => {
    const heading = `Employee Details - ${getEmployeeName()}`;
    downloadPdf(
      printableRef,
      colorMode,
      theme.palette.mode,
      heading.replace(/ /g, "_") + ".pdf",
      heading,
    );
  };

  const handleEditPopupClose = () => setEditPopupOpen(false);
  const handleEditPopupSuccess = (updatedEmployee) => {
    setEmployee(updatedEmployee);
    setNotification({
      message: `${getEmployeeDisplayName(updatedEmployee)} updated successfully!`,
      color: "green",
    });
    setEditPopupOpen(false);
  };

  const handleEditCustomFields = () => setEditCustomFieldsPopupOpen(true);
  const handleEditCustomFieldsPopupClose = () =>
    setEditCustomFieldsPopupOpen(false);

  const handleCustomFieldsPrint = () => {
    const heading = `Employee Details (custom fields) - ${getEmployeeName()}`;
    downloadPdf(
      customFieldsPrintableRef,
      colorMode,
      theme.palette.mode,
      heading.replace(/ /g, "_") + ".pdf",
      heading,
    );
  };

  const handleUpdateCustomFieldsAPI = async (values) =>
    updateEmployeeCustomFields(employeeId, customFields, values);

  const handleCustomFieldsUpdateSuccess = (updatedData) => {
    setEmployee((prev) => ({
      ...prev,
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
          <IconButton onClick={() => navigate("/employees")} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">Error</Typography>
        </Box>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!employee) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Employee not found</Typography>
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
        title={`Edit ${getEmployeeName()}`}
        showEdit={false}
        showDelete={false}
        showPdf={false}
      >
        <CreateEmployee
          initialValues={employee}
          isEditMode={true}
          forceEditMode={true}
          onEditSuccess={handleEditPopupSuccess}
          onUpdateEmployeeAPI={handleUpdateEmployeeAPI}
          setNotification={setNotification}
          onCancel={handleEditPopupClose}
        />
      </CustomSlider>

      {/* Edit Custom Fields Slider */}
      <CustomSlider
        open={editCustomFieldsPopupOpen}
        onClose={handleEditCustomFieldsPopupClose}
        title={`Edit Custom Fields - ${getEmployeeName()}`}
        showEdit={false}
        showDelete={false}
        showPdf={false}
      >
        <EditableCustomEmployeeFields
          customFields={customFields}
          initialValues={mapCustomFieldsToEmployeeValues(
            employee,
            customFields,
          )}
          onUpdateSuccess={handleCustomFieldsUpdateSuccess}
          onUpdateCustomFieldsAPI={handleUpdateCustomFieldsAPI}
          onCancel={handleEditCustomFieldsPopupClose}
          setNotification={setNotification}
        />
      </CustomSlider>

      {/* Delete Confirmation */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        name={getEmployeeName()}
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
              onClick={() => navigate("/employees")}
              sx={{
                mr: 1,
                color: theme.palette.text.primary,
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Breadcrumbs
                separator="›"
                aria-label="breadcrumb"
                sx={{ mb: 0.25 }}
              >
                <Typography
                  variant="caption"
                  onClick={() => navigate("/employees")}
                  sx={{
                    color: theme.palette.blueText.main,
                    cursor: "pointer",
                    fontWeight: 500,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  All Employees
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Employee Profile
                </Typography>
              </Breadcrumbs>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  fontFamily: theme.typography.h4.fontFamily,
                }}
              >
                {getEmployeeName()}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                Employee Key: {employee.id}
              </Typography>
            </Box>
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
            {canDeleteEmployee && (
              <ClickableText
                onClick={handleDelete}
                sx={{ color: theme.palette.error.main, fontSize: "0.9rem" }}
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
              aria-label="employee management tabs"
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
                  "&:hover": { color: theme.palette.blueText.main },
                  "&.Mui-selected": {
                    color: theme.palette.blueText.main,
                    fontWeight: 600,
                  },
                  "&.Mui-focusVisible": {
                    backgroundColor: theme.palette.action.focus,
                  },
                },
                "& .MuiTabs-flexContainer": { gap: 1 },
              }}
            >
              <Tab label="Details" id="employee-tab-0" />
              <Tab label="Files" id="employee-tab-1" />
              <Tab label="Custom Fields" id="employee-tab-2" />
            </Tabs>
          </Box>

          {/* Details Tab */}
          <TabPanel value={tabValue} index={0}>
            <div ref={printableRef}>
              <Box
                sx={{
                  mb: 1,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 3,
                }}
              >
                {canEditEmployee && (
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
              <CreateEmployee
                initialValues={employee}
                isEditMode={true}
                forceEditMode={false}
                onEditSuccess={handleEditSuccess}
                onUpdateEmployeeAPI={handleUpdateEmployeeAPI}
                setNotification={setNotification}
              />
            </div>
          </TabPanel>

          {/* Files Tab */}
          <TabPanel value={tabValue} index={1}>
            <EmployeeFiles
              employee={employee}
              setEmployee={setEmployee}
              setNotification={setNotification}
            />
          </TabPanel>

          {/* Custom Fields Tab */}
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
                  initialValues={mapCustomFieldsToEmployeeValues(
                    employee,
                    customFields,
                  )}
                  enableReinitialize
                >
                  {(formik) => (
                    <CustomEmployeeFields
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
