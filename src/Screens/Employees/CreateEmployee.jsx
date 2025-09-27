import React, { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { generateClient } from "aws-amplify/api";
import { createEmployee } from "../../graphql/mutations";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";

const client = generateClient();

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

const CreateEmployee = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: null,
    phoneNumber1: "",
    phoneNumber2: "",
    email: "",
    title: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    nextOfKinName: "",
    nextOfKinPhoneNumber: "",
    nextOfKinEmail: "",
    nextOfKinRelationship: "",
    nextOfKinAddress: "",
    nationalID: "",
    passportNumber: "",
    nationality: "",
    status: "ACTIVE",
    employmentType: "FULL_TIME",
    employmentStatus: "ACTIVE",
    employmentStartDate: null,
    employmentEndDate: null,
    employmentPosition: "",
    employmentDepartment: "",
    employmentGrade: "",
    employmentLocation: "",
    grossSalary: "",
    bankAccountNumber: "",
    bankName: "",
    bankBranchCode: "",
    socialSecurityNumber: "",
    taxIdentificationNumber: "",
    taxExemptStatus: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (field) => (date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare the input data
      const input = {
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

      // Remove empty strings and null values
      Object.keys(input).forEach((key) => {
        if (input[key] === "" || input[key] === null) {
          delete input[key];
        }
      });

      const result = await client.graphql({
        query: createEmployee,
        variables: { input },
      });

      onSuccess(result.data.createEmployee);
    } catch (err) {
      console.error("Error creating employee:", err);
      setError(
        "Failed to create employee. Please check your input and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Personal Information */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Personal Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={handleChange("firstName")}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Middle Name"
                value={formData.middleName}
                onChange={handleChange("middleName")}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange("lastName")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={handleDateChange("dateOfBirth")}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={handleChange("title")}
                placeholder="Mr., Mrs., Dr., etc."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                value={formData.phoneNumber1}
                onChange={handleChange("phoneNumber1")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Alternative Phone"
                value={formData.phoneNumber2}
                onChange={handleChange("phoneNumber2")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="email"
                label="Email"
                value={formData.email}
                onChange={handleChange("email")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nationality"
                value={formData.nationality}
                onChange={handleChange("nationality")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="National ID"
                value={formData.nationalID}
                onChange={handleChange("nationalID")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Passport Number"
                value={formData.passportNumber}
                onChange={handleChange("passportNumber")}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Address Information */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Address Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address Line 1"
                value={formData.addressLine1}
                onChange={handleChange("addressLine1")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address Line 2"
                value={formData.addressLine2}
                onChange={handleChange("addressLine2")}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={handleChange("city")}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State/Province"
                value={formData.stateProvince}
                onChange={handleChange("stateProvince")}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Postal Code"
                value={formData.postalCode}
                onChange={handleChange("postalCode")}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Employment Information */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Employment Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Position"
                value={formData.employmentPosition}
                onChange={handleChange("employmentPosition")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                value={formData.employmentDepartment}
                onChange={handleChange("employmentDepartment")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Employment Type"
                value={formData.employmentType}
                onChange={handleChange("employmentType")}
              >
                {employmentTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Employment Status"
                value={formData.employmentStatus}
                onChange={handleChange("employmentStatus")}
              >
                {employmentStatuses.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={formData.employmentStartDate}
                onChange={handleDateChange("employmentStartDate")}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date"
                value={formData.employmentEndDate}
                onChange={handleDateChange("employmentEndDate")}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Grade"
                value={formData.employmentGrade}
                onChange={handleChange("employmentGrade")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.employmentLocation}
                onChange={handleChange("employmentLocation")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Gross Salary"
                value={formData.grossSalary}
                onChange={handleChange("grossSalary")}
                inputProps={{ step: "0.01", min: "0" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Status"
                value={formData.status}
                onChange={handleChange("status")}
              >
                {statuses.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        {/* Next of Kin Information */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Next of Kin Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Next of Kin Name"
                value={formData.nextOfKinName}
                onChange={handleChange("nextOfKinName")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Relationship"
                value={formData.nextOfKinRelationship}
                onChange={handleChange("nextOfKinRelationship")}
              >
                {relationships.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Next of Kin Phone"
                value={formData.nextOfKinPhoneNumber}
                onChange={handleChange("nextOfKinPhoneNumber")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="email"
                label="Next of Kin Email"
                value={formData.nextOfKinEmail}
                onChange={handleChange("nextOfKinEmail")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Next of Kin Address"
                value={formData.nextOfKinAddress}
                onChange={handleChange("nextOfKinAddress")}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Banking Information */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Banking & Tax Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bank Name"
                value={formData.bankName}
                onChange={handleChange("bankName")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bank Account Number"
                value={formData.bankAccountNumber}
                onChange={handleChange("bankAccountNumber")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bank Branch Code"
                value={formData.bankBranchCode}
                onChange={handleChange("bankBranchCode")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Social Security Number"
                value={formData.socialSecurityNumber}
                onChange={handleChange("socialSecurityNumber")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tax ID Number"
                value={formData.taxIdentificationNumber}
                onChange={handleChange("taxIdentificationNumber")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tax Exempt Status"
                value={formData.taxExemptStatus}
                onChange={handleChange("taxExemptStatus")}
              />
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Creating..." : "Create Employee"}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateEmployee;
