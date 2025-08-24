import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Grid, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import createCustomer from "./tempForm";
import TextInput from "../Resources/FormComponents/TextInput";
import Dropdown from "../Resources/FormComponents/Dropdown";
import RadioGroup from "../Resources/FormComponents/RadioGroup";
import DateInput from "../Resources/FormComponents/DateInput";
import FileUpload from "../Resources/FormComponents/FileUpload";
import TextArea from "../Resources/FormComponents/TextArea";
import NumberInput from "../Resources/FormComponents/NumberInput";
import CreateFormButtons from "../ComponentAssets/CreateFormButtons";

// Styled FormGrid component for consistent layout
const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

const FormTemplate = () => {
  // Generate validation schema based on form fields
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string(),
    gender: Yup.string().required("Gender is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string(),
    address: Yup.string().required("Address is required"),
    userType: Yup.string().required("User type is required"),
    dob: Yup.date().required("Date of birth is required"),
    profilePicture: Yup.mixed().required("Profile picture is required"),
    numberOfChildren: Yup.number().min(0, "Cannot be negative"),
  });

  const initialValues = {
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phoneNumber: "",
    address: "",
    userType: "",
    dob: "",
    profilePicture: null,
    numberOfChildren: "",
  };

  const renderFormField = (field) => {
    const commonProps = {
      key: field.name,
      name: field.name,
      label: field.label,
      required: field.required,
      helperText: field.helperText,
      //   editing: false,
    };

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
        return <TextInput {...commonProps} type={field.type} />;
      case "select":
        return <Dropdown {...commonProps} options={field.options} />;
      case "radio":
        return <RadioGroup {...commonProps} options={field.options} />;
      case "date":
        return <DateInput {...commonProps} />;
      case "file":
        return <FileUpload {...commonProps} accept="image/*" />;
      case "textArea":
        return <TextArea {...commonProps} />;
      case "number":
        return <NumberInput {...commonProps} />;
      default:
        return <TextInput {...commonProps} />;
    }
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form values:", values);
    setTimeout(() => {
      setSubmitting(false);
    }, 1000);
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Create Customer
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <Grid container spacing={1}>
              {createCustomer.map((field) => (
                <FormGrid
                  item
                  size={{ xs: 12, md: field.span }}
                  key={field.name}
                >
                  {renderFormField(field)}
                </FormGrid>
              ))}

              <Grid size={{ xs: 12 }}>
                <CreateFormButtons formik={formik} />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormTemplate;
