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
import { useNavigate } from "react-router-dom";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function CreateBranchesForm() {
  const client = generateClient();
  const { userDetails } = React.useContext(UserContext);
  const [submitError, setSubmitError] = React.useState("");
  const [submitSuccess, setSubmitSuccess] = React.useState("");
  const navigate = useNavigate();

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
              branchInstitutionId: userDetails.institutionUsersId,
            },
          },
        });

        setSubmitSuccess("Branch created!");
        resetForm();
        navigate("/admin/branches");
      } catch (err) {
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
        mx: { xs: 0, sm: "auto" },
        mt: { xs: 0, sm: 0 },
        p: { xs: 0, sm: 0 },
        borderRadius: 1,
        display: "flex",
        flexDirection: "column",
        maxWidth: { xs: "100%", md: 800 },
        width: "100%",
        flex: 1,
        mb: 6,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: 600, my: 2, textTransform: "none" }}
      >
        CREATE A BRANCH{" "}
        <Typography variant="caption" sx={{ color: "#90a4ae" }}>
          Help
        </Typography>
      </Typography>
      <Typography variant="caption" sx={{ mb: 1 }}>
        You must provide a 'Branch Name'.
      </Typography>

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
            placeholder="Branch Code (optional)"
            size="small"
            value={formik.values.branchCode}
            onChange={formik.handleChange}
            error={
              formik.touched.branchCode && Boolean(formik.errors.branchCode)
            }
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
          />
          {formik.touched.address && formik.errors.address && (
            <Typography color="error" variant="caption">
              {formik.errors.address}
            </Typography>
          )}
        </FormGrid>
      </Grid>

      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={formik.isSubmitting || !formik.values.name}
          sx={{ mb: 6 }}
        >
          {formik.isSubmitting ? "Saving..." : "Create Branch"}
        </Button>
      </Box>

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
    </Box>
  );
}
