import { useContext, useEffect, useState } from "react";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../../App";
import * as Yup from "yup";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { FormikProvider } from "formik";

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

const CustomFields = ({
  formKey,
  formik,
  onFieldsLoaded, // Callback to update parent validation schema and initial values
  onValidationSchemaChange,
  editing = true,
}) => {
  const { userDetails } = useContext(UserContext);
  const institutionId = userDetails?.institutionUsersId;
  const branchId = userDetails?.branchUsersId;
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const client = generateClient();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchCustomFields = async () => {
      if (!institutionId || !branchId || !formKey) {
        setLoading(false);
        return;
      }

      try {
        const res = await client.graphql({
          query: `
            query ListCustomFormFields(
              $filter: ModelCustomFormFieldFilterInput
              $limit: Int
              $nextToken: String
            ) {
              listCustomFormFields(filter: $filter, limit: $limit, nextToken: $nextToken) {
                items {
                  id
                  formKey
                  label
                  fieldType
                  options
                  required
                  createdAt
                }
              }
            }
          `,
          variables: {
            filter: {
              and: [
                { formKey: { eq: formKey } },
                {
                  or: [
                    { institutionCustomFormFieldsId: { eq: institutionId } },
                    { branchCustomFormFieldsId: { eq: branchId } },
                  ],
                },
              ],
            },
          },
        });

        if (res.data.listCustomFormFields.items.length > 0) {
          const sortedFields = res.data.listCustomFormFields.items.sort(
            (a, b) => {
              return new Date(a.createdAt) - new Date(b.createdAt);
            }
          );

          const fieldsWithParsedOptions = sortedFields.map((field) => ({
            ...field,
            options: field.options ? JSON.parse(field.options) : null,
            fieldName: `custom_${field.id}`, // Use unique field name based on ID
          }));

          setCustomFields(fieldsWithParsedOptions);

          // Build validation schema for custom fields
          const customFieldsValidation = {};
          const customFieldsInitialValues = {};

          fieldsWithParsedOptions.forEach((field) => {
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
                  fieldSchema = fieldSchema.required(
                    `${field.label} is required`
                  );
                }
                break;
              case "number":
                fieldSchema = Yup.number()
                  .typeError("Must be a number")
                  .nullable();
                if (field.required) {
                  fieldSchema = fieldSchema.required(
                    `${field.label} is required`
                  );
                }
                break;
              case "date":
                fieldSchema = Yup.string()
                  .nullable()
                  .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format");
                if (field.required) {
                  fieldSchema = fieldSchema.required(
                    `${field.label} is required`
                  );
                }
                break;
              default:
                if (field.required) {
                  fieldSchema = fieldSchema.required(
                    `${field.label} is required`
                  );
                }
                break;
            }

            customFieldsValidation[field.fieldName] = fieldSchema;
            customFieldsInitialValues[field.fieldName] = "";
          });

          // Notify parent component about the fields and validation schema
          if (onFieldsLoaded) {
            onFieldsLoaded(customFieldsInitialValues);
          }

          if (onValidationSchemaChange) {
            onValidationSchemaChange(customFieldsValidation);
          }
        }
      } catch (error) {
        console.error("Error fetching custom fields:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomFields();
  }, [institutionId, branchId, formKey]);

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

  if (loading) {
    return (
      <Typography variant="body2" sx={{ textAlign: "center", py: 2 }}>
        Loading custom fields...
      </Typography>
    );
  }

  if (customFields.length === 0) {
    return null; // Don't render anything if no custom fields
  }

  return (
    <FormikProvider value={formik}>
      <>
        {/* Custom Fields Section Header */}
        <Grid container spacing={1}>
          <FormGrid size={{ xs: 12 }}>
            <Typography variant="h5" sx={{ my: 2, fontWeight: "bold" }}>
              ADDITONAL INFORMATION (Custom Fields)
            </Typography>
          </FormGrid>
          {/* Render Custom Fields */}
          {customFields.map((field) => (
            <FormGrid key={field.id} size={{ xs: 12, md: 6 }}>
              {renderCustomField(field)}
            </FormGrid>
          ))}
        </Grid>
      </>
    </FormikProvider>
  );
};

// Export helper function for getting custom fields data
CustomFields.getCustomFieldsData = (customFields, formValues) => {
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

export default CustomFields;
