import React, { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Save as SaveIcon } from "@mui/icons-material";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Divider,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";

const employmentTypes = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERN", label: "Intern" },
  { value: "CONSULTANT", label: "Consultant" },
];

const employmentStatuses = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "TERMINATED", label: "Terminated" },
];

const statuses = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "PENDING", label: "Pending" },
  { value: "SUSPENDED", label: "Suspended" },
];

const relationships = [
  { value: "SPOUSE", label: "Spouse" },
  { value: "PARENT", label: "Parent" },
  { value: "CHILD", label: "Child" },
  { value: "SIBLING", label: "Sibling" },
  { value: "FRIEND", label: "Friend" },
  { value: "OTHER", label: "Other" },
];

const EmployeeDetailsTab = ({ employee, isEditing, onSave, loading }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        middleName: employee.middleName || "",
        dateOfBirth: employee.dateOfBirth ? dayjs(employee.dateOfBirth) : null,
        phoneNumber1: employee.phoneNumber1 || "",
        phoneNumber2: employee.phoneNumber2 || "",
        email: employee.email || "",
        title: employee.title || "",
        addressLine1: employee.addressLine1 || "",
        addressLine2: employee.addressLine2 || "",
        city: employee.city || "",
        stateProvince: employee.stateProvince || "",
        postalCode: employee.postalCode || "",
        nextOfKinName: employee.nextOfKinName || "",
        nextOfKinPhoneNumber: employee.nextOfKinPhoneNumber || "",
        nextOfKinEmail: employee.nextOfKinEmail || "",
        nextOfKinRelationship: employee.nextOfKinRelationship || "",
        nextOfKinAddress: employee.nextOfKinAddress || "",
        nationalID: employee.nationalID || "",
        passportNumber: employee.passportNumber || "",
        nationality: employee.nationality || "",
        status: employee.status || "ACTIVE",
        employmentType: employee.employmentType || "FULL_TIME",
        employmentStatus: employee.employmentStatus || "ACTIVE",
        employmentStartDate: employee.employmentStartDate
          ? dayjs(employee.employmentStartDate)
          : null,
        employmentEndDate: employee.employmentEndDate
          ? dayjs(employee.employmentEndDate)
          : null,
        employmentPosition: employee.employmentPosition || "",
        employmentDepartment: employee.employmentDepartment || "",
        employmentGrade: employee.employmentGrade || "",
        employmentLocation: employee.employmentLocation || "",
        grossSalary: employee.grossSalary || "",
        bankAccountNumber: employee.bankAccountNumber || "",
        bankName: employee.bankName || "",
        bankBranchCode: employee.bankBranchCode || "",
        socialSecurityNumber: employee.socialSecurityNumber || "",
        taxIdentificationNumber: employee.taxIdentificationNumber || "",
        taxExemptStatus: employee.taxExemptStatus || "",
      });
    }
  }, [employee]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleDateChange = (field) => (date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleSave = () => {
    const updateData = {
      ...formData,
      dateOfBirth: formData.dateOfBirth
        ? formData.dateOfBirth.format("YYYY-MM-DD")
        : null,
      employmentStartDate: formData.employmentStartDate
        ? formData.employmentStartDate.format("YYYY-MM-DD")
        : null,
      employmentEndDate: formData.employmentEndDate
        ? formData.employmentEndDate.format("YYYY-MM-DD")
        : null,
      grossSalary: formData.grossSalary
        ? parseFloat(formData.grossSalary)
        : null,
    };

    // Remove empty strings
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === "") {
        updateData[key] = null;
      }
    });

    onSave(updateData);
  };

  const renderField = (
    label,
    value,
    field = null,
    type = "text",
    options = null
  ) => {
    if (isEditing && field) {
      if (type === "select" && options) {
        return (
          <TextField
            select
            fullWidth
            label={label}
            value={formData[field] || ""}
            onChange={handleChange(field)}
            size="small"
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );
      } else if (type === "date") {
        return (
          <DatePicker
            label={label}
            value={formData[field]}
            onChange={handleDateChange(field)}
            renderInput={(params) => (
              <TextField {...params} fullWidth size="small" />
            )}
          />
        );
      } else if (type === "number") {
        return (
          <TextField
            fullWidth
            type="number"
            label={label}
            value={formData[field] || ""}
            onChange={handleChange(field)}
            size="small"
            inputProps={{ step: "0.01", min: "0" }}
          />
        );
      } else {
        return (
          <TextField
            fullWidth
            type={type}
            label={label}
            value={formData[field] || ""}
            onChange={handleChange(field)}
            size="small"
            multiline={type === "textarea"}
            rows={type === "textarea" ? 2 : 1}
          />
        );
      }
    }

    // Display mode
    return (
      <Box>
        <Typography variant="caption" color="textSecondary" component="div">
          {label}
        </Typography>
        <Typography variant="body2" component="div">
          {value || "Not specified"}
        </Typography>
      </Box>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {/* Personal Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Personal Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                {renderField("First Name", employee.firstName, "firstName")}
              </Grid>
              <Grid item xs={12} sm={4}>
                {renderField("Middle Name", employee.middleName, "middleName")}
              </Grid>
              <Grid item xs={12} sm={4}>
                {renderField("Last Name", employee.lastName, "lastName")}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Date of Birth",
                  employee.dateOfBirth
                    ? dayjs(employee.dateOfBirth).format("MM/DD/YYYY")
                    : null,
                  "dateOfBirth",
                  "date"
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField("Title", employee.title, "title")}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Phone Number",
                  employee.phoneNumber1,
                  "phoneNumber1"
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Alternative Phone",
                  employee.phoneNumber2,
                  "phoneNumber2"
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField("Email", employee.email, "email", "email")}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Nationality",
                  employee.nationality,
                  "nationality"
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField("National ID", employee.nationalID, "nationalID")}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Passport Number",
                  employee.passportNumber,
                  "passportNumber"
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Address Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Address Line 1",
                  employee.addressLine1,
                  "addressLine1"
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Address Line 2",
                  employee.addressLine2,
                  "addressLine2"
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {renderField("City", employee.city, "city")}
              </Grid>
              <Grid item xs={12} sm={4}>
                {renderField(
                  "State/Province",
                  employee.stateProvince,
                  "stateProvince"
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {renderField("Postal Code", employee.postalCode, "postalCode")}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Employment Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Position",
                  employee.employmentPosition,
                  "employmentPosition"
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Department",
                  employee.employmentDepartment,
                  "employmentDepartment"
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Employment Type",
                  employmentTypes.find(
                    (t) => t.value === employee.employmentType
                  )?.label || employee.employmentType,
                  "employmentType",
                  "select",
                  employmentTypes
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Employment Status",
                  employmentStatuses.find(
                    (s) => s.value === employee.employmentStatus
                  )?.label || employee.employmentStatus,
                  "employmentStatus",
                  "select",
                  employmentStatuses
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Start Date",
                  employee.employmentStartDate
                    ? dayjs(employee.employmentStartDate).format("MM/DD/YYYY")
                    : null,
                  "employmentStartDate",
                  "date"
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "End Date",
                  employee.employmentEndDate
                    ? dayjs(employee.employmentEndDate).format("MM/DD/YYYY")
                    : null,
                  "employmentEndDate",
                  "date"
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Grade",
                  employee.employmentGrade,
                  "employmentGrade"
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Location",
                  employee.employmentLocation,
                  "employmentLocation"
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Gross Salary",
                  employee.grossSalary
                    ? `$${employee.grossSalary.toLocaleString()}`
                    : null,
                  "grossSalary",
                  "number"
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Status",
                  statuses.find((s) => s.value === employee.status)?.label ||
                    employee.status,
                  "status",
                  "select",
                  statuses
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Next of Kin Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Next of Kin Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Next of Kin Name",
                  employee.nextOfKinName,
                  "nextOfKinName"
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Relationship",
                  relationships.find(
                    (r) => r.value === employee.nextOfKinRelationship
                  )?.label || employee.nextOfKinRelationship,
                  "nextOfKinRelationship",
                  "select",
                  relationships
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Next of Kin Phone",
                  employee.nextOfKinPhoneNumber,
                  "nextOfKinPhoneNumber"
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Next of Kin Email",
                  employee.nextOfKinEmail,
                  "nextOfKinEmail",
                  "email"
                )}
              </Grid>
              <Grid item xs={12}>
                {renderField(
                  "Next of Kin Address",
                  employee.nextOfKinAddress,
                  "nextOfKinAddress",
                  "textarea"
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Banking Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Banking & Tax Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                {renderField("Bank Name", employee.bankName, "bankName")}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Bank Account Number",
                  employee.bankAccountNumber,
                  "bankAccountNumber"
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Bank Branch Code",
                  employee.bankBranchCode,
                  "bankBranchCode"
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Social Security Number",
                  employee.socialSecurityNumber,
                  "socialSecurityNumber"
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Tax ID Number",
                  employee.taxIdentificationNumber,
                  "taxIdentificationNumber"
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField(
                  "Tax Exempt Status",
                  employee.taxExemptStatus,
                  "taxExemptStatus"
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {isEditing && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              startIcon={
                loading ? <CircularProgress size={20} /> : <SaveIcon />
              }
              onClick={handleSave}
              disabled={loading}
              size="large"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default EmployeeDetailsTab;
