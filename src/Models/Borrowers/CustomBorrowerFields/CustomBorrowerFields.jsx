import { useContext, useEffect, useState, useRef } from "react";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../../App";
import * as Yup from "yup";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { FormikProvider } from "formik";
import ClickableText from "../../../ComponentAssets/ClickableText";
import { useNavigate } from "react-router-dom"; // <-- Add this import

// Import custom form components
import TextInput from "../../../Resources/FormComponents/TextInput";
import NumberInput from "../../../Resources/FormComponents/NumberInput";
import Dropdown from "../../../Resources/FormComponents/Dropdown";
import DateInput from "../../../Resources/FormComponents/DateInput";
import TextArea from "../../../Resources/FormComponents/TextArea";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

const CustomBorrowerFields = ({
  customFields = [],
  formik,
  editing = true,
  onEdit,
  onPrint,
}) => {
  const { userDetails } = useContext(UserContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate(); // <-- Add this

  const renderCustomField = (field) => {
    const fieldName = field.fieldName;

    const commonProps = {
      name: fieldName,
      label: field.label,
      required: field.required,
      editing: editing,
    };

    switch (field.fieldType) {
      case "select":
        return (
          <Dropdown
            {...commonProps}
            options={
              field.options?.map((option) => ({
                value: option,
                label: option,
              })) || []
            }
          />
        );

      case "number":
        return <NumberInput {...commonProps} />;

      case "textarea":
        return <TextArea {...commonProps} rows={3} />;

      case "date":
        return <DateInput {...commonProps} />;

      case "text":
      default:
        return <TextInput {...commonProps} />;
    }
  };

  if (customFields.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            fontStyle: "italic",
          }}
        >
          No custom fields available for this borrower.
        </Typography>
      </Box>
    );
  }

  return (
    <FormikProvider value={formik}>
      <>
        {/* Action buttons */}
        <Box
          sx={{
            mb: 1,
            display: "flex",
            justifyContent: "flex-end",
            gap: 3,
          }}
        >
          <ClickableText
            onClick={onEdit}
            sx={{
              color: theme.palette.blueText.main,
              fontSize: "0.9rem",
            }}
          >
            Edit
          </ClickableText>
          <ClickableText
            onClick={onPrint}
            sx={{
              color: theme.palette.secondary.main,
              fontSize: "0.9rem",
            }}
          >
            Print
          </ClickableText>
        </Box>

        {/* Custom Fields Grid */}
        <Grid container spacing={1}>
          {customFields.map((field) => (
            <FormGrid key={field.id} size={{ xs: 12, md: 6 }}>
              {renderCustomField(field)}
            </FormGrid>
          ))}
        </Grid>

        {/* ClickableText for managing custom fields */}
        <Box sx={{ my: 4, textAlign: "center" }}>
          <ClickableText
            onClick={() => navigate("/customFields")}
            sx={{
              // color: theme.palette.blueText.main,
              // fontWeight: 500,
              fontSize: "0.8rem",
              textDecoration: "underline",
              // mt: 2,
            }}
          >
            Manage Custom Fields
          </ClickableText>
        </Box>
      </>
    </FormikProvider>
  );
};

// Export helper function for getting custom fields data
CustomBorrowerFields.getCustomFieldsData = (customFields, formValues) => {
  const customFieldsData = {};
  customFields.forEach((field) => {
    const value = formValues[field.fieldName];
    customFieldsData[field.id] = {
      fieldId: field.id,
      label: field.label,
      fieldType: field.fieldType,
      value: typeof value === "string" ? value.trim() || null : value || null,
    };
  });
  return customFieldsData;
};

// Export helper function for creating validation schema
CustomBorrowerFields.createValidationSchema = (customFields) => {
  const customFieldsValidation = {};

  customFields.forEach((field) => {
    let fieldSchema = Yup.string().nullable();

    // Add type-specific validation
    switch (field.fieldType) {
      case "text":
      case "textarea":
        fieldSchema = Yup.string()
          .nullable()
          .matches(
            /^[^,"'!{}]+$/,
            "Invalid characters found. Cannot use , \" ' ! { }"
          );
        if (field.required) {
          fieldSchema = fieldSchema.required(`${field.label} is required`);
        }
        break;
      case "number":
        fieldSchema = Yup.number().typeError("Must be a number").nullable();
        if (field.required) {
          fieldSchema = fieldSchema.required(`${field.label} is required`);
        }
        break;
      case "date":
        fieldSchema = Yup.string()
          .nullable()
          .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format");
        if (field.required) {
          fieldSchema = fieldSchema.required(`${field.label} is required`);
        }
        break;
      default:
        if (field.required) {
          fieldSchema = fieldSchema.required(`${field.label} is required`);
        }
        break;
    }

    customFieldsValidation[field.fieldName] = fieldSchema;
  });

  return customFieldsValidation;
};

// Export helper function for creating initial values
CustomBorrowerFields.createInitialValues = (customFields) => {
  const customFieldsInitialValues = {};
  customFields.forEach((field) => {
    customFieldsInitialValues[field.fieldName] = "";
  });
  return customFieldsInitialValues;
};

export default CustomBorrowerFields;
