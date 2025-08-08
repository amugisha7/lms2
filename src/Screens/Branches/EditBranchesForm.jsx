import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../App";
import FormControlLabel from "@mui/material/FormControlLabel";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const EditBranchesForm = React.forwardRef(
  (
    { initialValues, onClose, onEditSuccess, onDelete, isEditMode = false },
    ref
  ) => {
    const client = generateClient();
    const { userDetails } = React.useContext(UserContext);
    const [submitError, setSubmitError] = React.useState("");
    const [submitSuccess, setSubmitSuccess] = React.useState("");
    const [editMode, setEditMode] = React.useState(isEditMode);

    // Expose methods to parent component
    React.useImperativeHandle(ref, () => ({
      toggleEdit: () => {
        setEditMode(!editMode);
        setSubmitError("");
        setSubmitSuccess("");
      },
      getEditMode: () => editMode,
    }));

    const formik = useFormik({
      initialValues: {
        name: initialValues.name || "",
        branchCode: initialValues.branchCode || "",
        address: initialValues.address || "",
        status: initialValues.status || "active",
      },
      enableReinitialize: true,
      validationSchema: Yup.object().shape({
        name: Yup.string()
          .required("Branch Name is required")
          .max(100, "Name too long"),
        branchCode: Yup.string().max(20, "Code too long"),
        address: Yup.string().max(200, "Address too long"),
        status: Yup.string().required("Status is required"),
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
          const result = await client.graphql({
            query: `
            mutation UpdateBranch($input: UpdateBranchInput!) {
              updateBranch(input: $input) {
                id
                name
                branchCode
                address
                status
              }
            }
          `,
            variables: {
              input: {
                id: initialValues.id,
                name: values.name.trim(),
                branchCode: values.branchCode.trim(),
                address: values.address?.trim() || null,
                status: values.status,
              },
            },
          });

          setSubmitSuccess("Branch updated!");
          if (onEditSuccess && result?.data?.updateBranch) {
            onEditSuccess(result.data.updateBranch);
          } else if (onClose) {
            onClose();
          }
        } catch (err) {
          setSubmitError("Failed to update branch. Please try again.");
        } finally {
          setSubmitting(false);
        }
      },
    });

    return (
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid container spacing={3}>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="name">Branch Name*</FormLabel>
            <OutlinedInput
              id="name"
              name="name"
              placeholder="Branch Name"
              size="small"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              disabled={!editMode}
              sx={{ maxWidth: 500, mb: 2 }}
            />
            {formik.touched.name && formik.errors.name && (
              <Typography color="error" variant="caption">
                {formik.errors.name}
              </Typography>
            )}
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <FormLabel htmlFor="branchCode">Branch Code</FormLabel>
            <OutlinedInput
              id="branchCode"
              name="branchCode"
              placeholder="Branch Code"
              size="small"
              value={formik.values.branchCode}
              onChange={formik.handleChange}
              error={
                formik.touched.branchCode && Boolean(formik.errors.branchCode)
              }
              disabled={!editMode}
            />
            {formik.touched.branchCode && formik.errors.branchCode && (
              <Typography color="error" variant="caption">
                {formik.errors.branchCode}
              </Typography>
            )}
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 12 }}>
            <FormLabel htmlFor="address">Address</FormLabel>
            <OutlinedInput
              id="address"
              name="address"
              placeholder="Branch Address (optional)"
              size="small"
              multiline
              rows={2}
              value={formik.values.address}
              onChange={formik.handleChange}
              error={formik.touched.address && Boolean(formik.errors.address)}
              disabled={!editMode}
            />
            {formik.touched.address && formik.errors.address && (
              <Typography color="error" variant="caption">
                {formik.errors.address}
              </Typography>
            )}
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 12 }}>
            <FormLabel sx={{ fontWeight: 500, mb: 1 }}>Status</FormLabel>
            <Box>
              {/* Use radio buttons for status */}
              {STATUS_OPTIONS.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={
                    <input
                      type="radio"
                      name="status"
                      checked={formik.values.status === option.value}
                      onChange={() =>
                        formik.setFieldValue("status", option.value)
                      }
                      disabled={!editMode}
                    />
                  }
                  label={option.label}
                  sx={{ mr: 4 }}
                />
              ))}
            </Box>
          </FormGrid>
        </Grid>
        {editMode && (
          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={formik.isSubmitting || !formik.values.name}
            >
              {formik.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        )}
        {submitError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {submitError}
          </Typography>
        )}
        {submitSuccess && (
          <Typography color="primary" sx={{ mt: 2 }}>
            {submitSuccess}
          </Typography>
        )}
      </Box>
    );
  }
);

EditBranchesForm.displayName = "EditBranchesForm";

export default EditBranchesForm;
