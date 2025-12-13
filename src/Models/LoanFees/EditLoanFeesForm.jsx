import React, { forwardRef, useImperativeHandle } from "react";
import Box from "@mui/material/Box";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../App";
import { EditClickedContext } from "../../ModelAssets/CollectionsTemplate";
import CreateFormButtons from "../../ModelAssets/CreateFormButtons";
import CustomEditFormButtons from "../../ModelAssets/CustomEditFormButtons";
import TextInput from "../../Resources/FormComponents/TextInput";
import NumberInput from "../../Resources/FormComponents/NumberInput";
import RadioGroup from "../../Resources/FormComponents/RadioGroup";
import Typography from "@mui/material/Typography";

const FEE_CALCULATION_OPTIONS = [
  { value: "fixed", label: "Fixed Amount" },
  { value: "percentage", label: "Percentage %" },
];

const FEE_PERCENTAGE_BASE_OPTIONS = [
  { value: "principal", label: "Principal" },
  { value: "interest", label: "Interest" },
  { value: "principal_interest", label: "Principal + Interest" },
];

const FEE_CATEGORY_OPTIONS = [
  { value: "non_deductable", label: "Non-Deductable Fee" },
  { value: "deductable", label: "Deductable Fee" },
  { value: "capitalized", label: "Capitalized Fee" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const EditLoanFeesForm = forwardRef(function EditLoanFeesForm(
  { initialValues, onClose, onSuccess, isEditMode = false },
  ref
) {
  const client = generateClient();
  const { userDetails } = React.useContext(UserContext);
  const [submitError, setSubmitError] = React.useState("");
  const [submitSuccess, setSubmitSuccess] = React.useState("");
  const [editMode, setEditMode] = React.useState(!isEditMode);
  const editClickedContext = React.useContext(EditClickedContext);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    toggleEdit: () => {
      setEditMode((prev) => !prev);
    },
    getEditMode: () => editMode,
  }));

  // Respond to editClicked from context
  React.useEffect(() => {
    if (editClickedContext?.editClicked && isEditMode && !editMode) {
      setEditMode(true);
    }
  }, [editClickedContext?.editClicked, isEditMode, editMode]);

  const formik = useFormik({
    initialValues: {
      name: initialValues.name || "",
      description: initialValues.description || "",
      category: initialValues.category || "non_deductable",
      calculationMethod: initialValues.calculationMethod || "fixed",
      percentageBase: initialValues.percentageBase || "",
      feeValue:
        initialValues.rate !== undefined && initialValues.rate !== null
          ? initialValues.rate
          : "",
      status: initialValues.status || "active",
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required("Fee Name is required")
        .max(100, "Name too long")
        .matches(/^[^,"'!{}]+$/, "Name contains invalid characters"),
      description: Yup.string()
        .max(500, "Description too long")
        .matches(/^[^,"'!{}]+$/, "Description contains invalid characters"),
      category: Yup.string().required("Fee Category is required"),
      calculationMethod: Yup.string().required("Calculation Method is required"),
      feeValue: Yup.number()
        .typeError("Fee value must be a number")
        .required("Fee value is required")
        .min(0, "Fee value must be positive"),
      status: Yup.string().required("Status is required"),
      percentageBase: Yup.string().when("calculationMethod", {
        is: "percentage",
        then: () => Yup.string().required("Percentage Base is required"),
        otherwise: () => Yup.string().nullable(),
      }),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError("");
      setSubmitSuccess("");
      setSubmitting(true);

      if (!userDetails || !userDetails.institutionUsersId) {
        setSubmitError("ERROR. Please reload the page or contact support.");
        setSubmitting(false);
        return;
      }

      try {
        const input = {
          id: initialValues.id,
          name: values.name.trim(),
          category: values.category,
          calculationMethod: values.calculationMethod,
          description: values.description?.trim() || null,
          percentageBase:
            values.calculationMethod === "percentage"
              ? values.percentageBase
              : null,
          status: values.status,
          institutionLoanFeesConfigsId: userDetails.institutionUsersId,
          rate: values.feeValue,
        };

        const result = await client.graphql({
          query: `
            mutation UpdateLoanFeesConfig($input: UpdateLoanFeesConfigInput!) {
              updateLoanFeesConfig(input: $input) {
                id
                name
                category
                calculationMethod
                description
                percentageBase
                status
                institutionLoanFeesConfigsId
                rate
              }
            }
          `,
          variables: { input },
        });

        setSubmitSuccess("Loan fee config updated!");
        
        // If in view mode, turn off edit mode after successful update
        if (isEditMode) {
          setEditMode(false);
          setTimeout(() => setSubmitSuccess(""), 2000);
        }
        
        if (onSuccess) {
            // onSuccess expects the updated item
             onSuccess(result.data.updateLoanFeesConfig);
        } else if (onClose) {
            onClose();
        }
      } catch (err) {
        console.error("Error updating loan fee config:", err);
        setSubmitError("Failed to update loan fee config. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

   // Effect to manage percentageBase when calculationMethod changes
   React.useEffect(() => {
    if (formik.values.calculationMethod === "percentage" && !formik.values.percentageBase) {
      formik.setFieldValue("percentageBase", "principal");
    } else if (formik.values.calculationMethod !== "percentage" && formik.values.percentageBase) {
       formik.setFieldValue("percentageBase", ""); // Clear it
    }
  }, [formik.values.calculationMethod]);

  return (
    <FormikProvider value={formik}>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Show edit mode header when in edit mode */}
        {isEditMode && editMode ? (
          <CustomEditFormButtons
            formik={formik}
            setEditMode={setEditMode}
            setSubmitError={setSubmitError}
            setSubmitSuccess={setSubmitSuccess}
          />
        ) : null}

        <TextInput
          label="Name"
          name="name"
          placeholder="Loan Fee Name"
          required
          editing={editMode}
        />

        <TextInput
          label="Description"
          name="description"
          placeholder="Fee Description (optional)"
          multiline
          rows={3}
          editing={editMode}
        />

        <RadioGroup
          label="Category"
          name="category"
          options={FEE_CATEGORY_OPTIONS}
          required
          editing={editMode}
        />

        <RadioGroup
          label="Calculation"
          name="calculationMethod"
          options={FEE_CALCULATION_OPTIONS}
          required
          editing={editMode}
        />

      {formik.values.calculationMethod === "percentage" && (
          <RadioGroup
          label="% Base"
          name="percentageBase"
          options={FEE_PERCENTAGE_BASE_OPTIONS}
          required
          editing={editMode}
          />
      )}

        <NumberInput
          label={
              formik.values.calculationMethod === "fixed" 
              ? `Amount (${userDetails?.institution?.currencyCode || ""})` 
              : "Rate (%)"
          }
          name="feeValue"
          placeholder={
              formik.values.calculationMethod === "fixed" 
              ? "Enter fixed amount" 
              : "Enter percentage"
          }
          required
          editing={editMode}
        />

        <RadioGroup
          label="Status"
          name="status"
          options={STATUS_OPTIONS}
          required
          editing={editMode}
        />

        {submitError && (
          <Typography color="error" variant="body2">
            {submitError}
          </Typography>
        )}
        {submitSuccess && (
          <Typography color="primary" variant="body2">
            {submitSuccess}
          </Typography>
        )}

        {/* Only show create buttons when not in isEditMode */}
        {!isEditMode && (
          <CreateFormButtons
            formik={formik}
            setSubmitError={setSubmitError}
            setSubmitSuccess={setSubmitSuccess}
            onClose={onClose}
            setEditMode={setEditMode} 
          />
        )}
      </Box>
    </FormikProvider>
  );
});

EditLoanFeesForm.displayName = "EditLoanFeesForm";

export default EditLoanFeesForm;
