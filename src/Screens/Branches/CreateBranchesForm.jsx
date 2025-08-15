import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../App";
import CustomTextInput from "../../ComponentAssets/CustomTextInput";
import CreateFormButtons from "../../ComponentAssets/CreateFormButtons";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function CreateBranchesForm({ onClose, onCreateSuccess }) {
  const client = generateClient();
  const { userDetails } = React.useContext(UserContext);
  const [submitError, setSubmitError] = React.useState("");
  const [submitSuccess, setSubmitSuccess] = React.useState("");
  const [editMode, setEditMode] = React.useState(true); // Always in edit mode for create form

  const formik = useFormik({
    initialValues: {
      name: "",
      branchCode: "",
      address: "",
      status: "active",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required("Branch Name is required")
        .max(100, "Name too long")
        .matches(/^[^,"'!{}]+$/, "Name contains invalid characters"),
      branchCode: Yup.string()
        .max(20, "Code too long")
        .matches(/^[^,"'!{}]+$/, "Code contains invalid characters"),
      address: Yup.string()
        .max(200, "Address too long")
        .matches(/^[^,"'!{}]+$/, "Address contains invalid characters"),
      status: Yup.string(),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
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
            mutation CreateBranch($input: CreateBranchInput!) {
              createBranch(input: $input) {
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
              name: values.name.trim(),
              branchCode: values.branchCode.trim(),
              address: values.address?.trim() || null,
              status: values.status,
              institutionBranchesId: userDetails.institutionUsersId,
            },
          },
        });

        setSubmitSuccess("Branch created!");
        resetForm();
        onCreateSuccess(result.data.createBranch);
      } catch (err) {
        console.log("err::: ", err);
        setSubmitError("Failed to create branch. Please try again.");
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
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flex: 1,
      }}
    >
      <Typography variant="caption" sx={{ mb: 2, display: "block" }}>
        You must provide a 'Branch Name'.
      </Typography>

      <Grid container spacing={3}>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="name">Branch Name*</FormLabel>
          <CustomTextInput
            id="name"
            name="name"
            placeholder="Branch Name"
            size="small"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.errors.name}
            touched={formik.touched.name}
          />
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="branchCode">Branch Code</FormLabel>
          <CustomTextInput
            id="branchCode"
            name="branchCode"
            placeholder="Branch Code (optional)"
            size="small"
            value={formik.values.branchCode}
            onChange={formik.handleChange}
            error={
              formik.touched.branchCode && Boolean(formik.errors.branchCode)
            }
            helperText={formik.errors.branchCode}
            touched={formik.touched.branchCode}
          />
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 12 }}>
          <FormLabel htmlFor="address">Address</FormLabel>
          <CustomTextInput
            id="address"
            name="address"
            placeholder="Branch Address (optional)"
            size="small"
            multiline
            rows={2}
            value={formik.values.address}
            onChange={formik.handleChange}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.errors.address}
            touched={formik.touched.address}
          />
        </FormGrid>
      </Grid>

      <CreateFormButtons
        formik={formik}
        setEditMode={setEditMode}
        setSubmitError={setSubmitError}
        setSubmitSuccess={setSubmitSuccess}
        onClose={onClose}
      />

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
