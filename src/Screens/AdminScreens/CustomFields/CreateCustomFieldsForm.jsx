import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { generateClient } from "aws-amplify/api";
import { useFormik, FormikProvider } from "formik"; // Import FormikProvider
import * as Yup from "yup";
import { useContext, useEffect } from "react";
import { UserContext } from "../../../App";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";

// Import custom components
import TextInput from "../../../Resources/FormComponents/TextInput";
import NumberInput from "../../../Resources/FormComponents/NumberInput";
import Dropdown from "../../../Resources/FormComponents/Dropdown";
import DateInput from "../../../Resources/FormComponents/DateInput";
import TextArea from "../../../Resources/FormComponents/TextArea";

// Update the validation schema to include fieldType validation
const validationSchema = Yup.object().shape({
  formKey: Yup.string().required("Form key is required"),
  label: Yup.string()
    .matches(
      /^[^,"'!{}]+$/,
      "Invalid characters found. Cannot use , \" ' ! { }"
    )
    .required("Label is required"),
  fieldType: Yup.string().required("Field type is required"),
  // Remove options from Yup schema as we'll handle it in validate function
});

const fieldTypeDescriptions = {
  text: "This will allow you to type text into a field",
  number: "If you want to restrict numbers only in a field",
  select: "This will allow you to select options from a dropdown box",
  date: "This will allow you to select a date from the calendar",
  textarea: "This will create a multi-line text input field",
};

export default function CreateCustomFieldsForm(props) {
  const { userDetails } = useContext(UserContext);
  const navigate = useNavigate();
  const [submitError, setSubmitError] = React.useState("");
  const [submitSuccess, setSubmitSuccess] = React.useState("");
  const [currentOption, setCurrentOption] = React.useState("");
  const [optionsList, setOptionsList] = React.useState([]);

  const client = generateClient();
  const branchId = userDetails?.branchUsersId;

  const formik = useFormik({
    initialValues: {
      formKey: "CreateBorrowerForm",
      label: "",
      fieldType: "text",
      options: "",
      required: false,
    },
    validationSchema,
    validate: (values) => {
      const errors = {};
      if (values.fieldType === "select" && optionsList.length === 0) {
        errors.options = "At least one option is required for dropdown fields";
        errors.fieldType = "Please add at least one option";
      }
      return errors;
    },
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);

      try {
        const input = {
          formKey: values.formKey,
          label: values.label.trim(),
          fieldType: values.fieldType,
          options:
            values.fieldType === "select" ? JSON.stringify(optionsList) : null,
          required: values.required,
          branchCustomFormFieldsId: branchId,
          institutionCustomFormFieldsId:
            userDetails?.institutionUsersId || null,
        };
        // console.log("input::: ", input);

        await client.graphql({
          query: `
            mutation CreateCustomFormField($input: CreateCustomFormFieldInput!) {
              createCustomFormField(input: $input) {
                formKey
                label
                fieldType
                options
                required
              }
            }
          `,
          variables: { input },
        });

        setSubmitSuccess("Custom field created successfully!");
        setSubmitting(false);
        resetForm();

        // Reset optionsList and currentOption on successful submission
        setOptionsList([]);
        setCurrentOption("");

        setTimeout(() => {
          if (values.formKey === "CreateBorrowerForm") {
            navigate("/addBorrower");
          } else if (values.formKey === "CreateLoanForm") {
            navigate("/addLoan");
          } else if (values.formKey === "CreateCollateralForm") {
            navigate("/addCollateral");
          }
        }, 1500);
      } catch (err) {
        console.error("Error creating custom field:", err);
        setSubmitError("Failed to create custom field. Please try again.");
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (formik.values.fieldType === "select") {
      formik.validateForm();
    }
  }, [optionsList, formik.values.fieldType, formik.validateForm]);

  const handleAddOption = () => {
    const trimmedOption = currentOption.trim();

    // Check for invalid characters
    const invalidCharsRegex = /[,"'!{}]/;
    if (invalidCharsRegex.test(trimmedOption)) {
      formik.setFieldError(
        "options",
        "Invalid characters found. Cannot use , \" ' ! { }"
      );
      return;
    }

    if (trimmedOption) {
      const isDuplicate = optionsList.some(
        (option) => option.toLowerCase() === trimmedOption.toLowerCase()
      );

      if (isDuplicate) {
        formik.setFieldError("options", "This option already exists");
        return;
      }

      setOptionsList([...optionsList, trimmedOption]);
      setCurrentOption("");

      if (formik.errors.options) {
        formik.setFieldError("options", undefined);
      }
    }
  };

  return (
    <FormikProvider value={formik}>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          mx: { xs: 0, sm: "auto" },
          mt: { xs: 0, sm: 0 },
          p: { xs: 0, sm: 0 },
          borderRadius: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add a custom field to a form
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Dropdown
              name="formKey"
              label="Form"
              options={[
                { value: "CreateBorrowerForm", label: "Borrower Form" },
                { value: "CreateLoanForm", label: "Loan Form" },
                { value: "CreateCollateralForm", label: "Collateral Form" },
              ]}
              required
              editing={true}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput
              name="label"
              label="Field Label"
              placeholder="Enter Field Label"
              required
              editing={true}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Dropdown
              name="fieldType"
              label="Field Type"
              options={[
                { value: "text", label: "Text" },
                { value: "number", label: "Number" },
                { value: "select", label: "Dropdown" },
                { value: "date", label: "Date" },
                { value: "textarea", label: "Textarea" },
              ]}
              required
              editing={true}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                minHeight: "56px",
              }}
            >
              {fieldTypeDescriptions[formik.values.fieldType]}
            </Typography>
          </Grid>

          {formik.values.fieldType === "select" && (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 2 }}>
                  <FormLabel>Add dropdown options</FormLabel>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      id="currentOption"
                      placeholder="Enter an option"
                      size="small"
                      value={currentOption}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (formik.errors.options) {
                          formik.setFieldError("options", undefined);
                        }
                        if (/[,"'!{}]/.test(value)) {
                          formik.setFieldError(
                            "options",
                            "Invalid characters found. Cannot use , \" ' ! { }"
                          );
                        }
                        setCurrentOption(value);
                      }}
                      error={Boolean(formik.errors.options)}
                      sx={{ flex: 1 }}
                      variant="outlined"
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddOption}
                      disabled={!currentOption.trim()}
                      size="small"
                    >
                      Add Option
                    </Button>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                {optionsList.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    {optionsList.map((option, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          borderRadius: 1,
                          px: 1,
                          py: 0.5,
                        }}
                      >
                        <Typography variant="body2">{option}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => {
                            const newOptions = [...optionsList];
                            newOptions.splice(index, 1);
                            setOptionsList(newOptions);
                          }}
                          sx={{
                            ml: 1,
                            p: 0.2,
                            color: "#d32f2f",
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}

                {formik.touched.options && formik.errors.options && (
                  <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                    {formik.errors.options}
                  </Typography>
                )}
              </Grid>
            </>
          )}

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.required}
                  onChange={formik.handleChange}
                  name="required"
                />
              }
              label="Set this as a Required Field"
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          {submitError && (
            <Typography color="error" sx={{ mb: 1 }}>
              {submitError}
            </Typography>
          )}
          {submitSuccess && (
            <Typography color="primary" sx={{ mb: 1 }}>
              {submitSuccess}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            {formik.isSubmitting ? "Creating..." : "Create Custom Field"}
          </Button>
        </Box>
      </Box>
    </FormikProvider>
  );
}
