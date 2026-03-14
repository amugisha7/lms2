import { useContext } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material";
import { FormikProvider } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { UserContext } from "../../../App";
import ClickableText from "../../../ModelAssets/ClickableText";
import { useHasPermission } from "../../../ModelAssets/Permissions/permissions";
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

const CustomEmployeeFields = ({
  customFields = [],
  formik,
  editing = false,
  onEdit,
  onPrint,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const canUpdate = useHasPermission("update", "employee");

  const renderField = (field) => {
    const commonProps = {
      name: field.fieldName,
      label: field.label,
      required: field.required,
      editing,
    };

    switch (field.fieldType) {
      case "select":
        return (
          <Dropdown
            {...commonProps}
            options={field.options?.map((o) => ({ value: o, label: o })) || []}
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
      <>
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary, fontStyle: "italic" }}
          >
            You have not added any custom fields for Employees.
          </Typography>
        </Box>
        <Box sx={{ my: 4, textAlign: "center" }}>
          <ClickableText
            onClick={() => navigate("/customFields")}
            sx={{ fontSize: "0.8rem", textDecoration: "underline" }}
            className="pdf-hide"
          >
            Manage Custom Fields
          </ClickableText>
        </Box>
      </>
    );
  }

  return (
    <FormikProvider value={formik}>
      <>
        <Box
          sx={{
            mb: 1,
            display: "flex",
            justifyContent: "flex-end",
            gap: 3,
          }}
        >
          {canUpdate && (
            <ClickableText
              onClick={onEdit}
              sx={{ color: theme.palette.blueText.main, fontSize: "0.9rem" }}
              className="pdf-hide"
            >
              Edit
            </ClickableText>
          )}
          <ClickableText
            onClick={onPrint}
            sx={{ color: theme.palette.secondary.main, fontSize: "0.9rem" }}
            className="pdf-hide"
          >
            Export PDF
          </ClickableText>
        </Box>

        <Grid container spacing={1}>
          {customFields.map((field) => (
            <FormGrid key={field.id} size={{ xs: 12, md: 6 }}>
              {renderField(field)}
            </FormGrid>
          ))}
        </Grid>

        <Box sx={{ my: 4, textAlign: "center" }}>
          <ClickableText
            onClick={() => navigate("/customFields")}
            sx={{ fontSize: "0.8rem", textDecoration: "underline" }}
            className="pdf-hide"
          >
            Manage Custom Fields
          </ClickableText>
        </Box>
      </>
    </FormikProvider>
  );
};

CustomEmployeeFields.createValidationSchema = (customFields) => {
  const schema = {};
  customFields.forEach((field) => {
    let s = Yup.string().nullable();
    switch (field.fieldType) {
      case "text":
      case "textarea":
        s = Yup.string()
          .nullable()
          .matches(
            /^[^,"'!{}]+$/,
            "Invalid characters found. Cannot use , \" ' ! { }",
          );
        break;
      case "number":
        s = Yup.number().typeError("Must be a number").nullable();
        break;
      case "date":
        s = Yup.string()
          .nullable()
          .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format");
        break;
      default:
        break;
    }
    if (field.required) s = s.required(`${field.label} is required`);
    schema[field.fieldName] = s;
  });
  return schema;
};

CustomEmployeeFields.createInitialValues = (customFields) => {
  const vals = {};
  customFields.forEach((field) => {
    vals[field.fieldName] = "";
  });
  return vals;
};

export default CustomEmployeeFields;
