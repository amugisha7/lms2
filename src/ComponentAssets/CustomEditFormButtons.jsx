import React from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const CustomEditFormButtons = ({
  formik,
  setEditMode,
  setSubmitError,
  setSubmitSuccess,
}) => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 1,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(118, 177, 211, 0.15)"
              : "rgba(25, 118, 210, 0.08)",
          border: `1px solid ${
            theme.palette.mode === "dark"
              ? "rgba(118, 177, 211, 0.3)"
              : "rgba(25, 118, 210, 0.2)"
          }`,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.mode === "dark" ? "#76B1D3" : "#1976d2",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            fontSize: "0.875rem",
            "&::before": {
              content: '"✏️"',
              mr: 1.5,
              fontSize: "1rem",
            },
          }}
        >
          Editing Mode Active
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.mode === "dark" ? "#c2c2c2" : "#666666",
            fontStyle: "italic",
            display: "block",
            mt: 0.5,
          }}
        >
          Make your changes and click Save Changes when done
        </Typography>
      </Box>
      <div
        style={{
          // marginTop: 16,
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: 16,
          paddingBottom: 16,
          borderBottom: `1px solid ${
            theme.palette.mode === "dark" ? "#525252" : "#e0e0e0"
          }`,
          gap: 16,
        }}
      >
        <Button
          type="button"
          variant="outlined"
          color="error"
          disabled={formik.isSubmitting}
          onClick={() => {
            formik.resetForm();
            setEditMode(false);
            setSubmitError("");
            setSubmitSuccess("");
          }}
          sx={{
            minWidth: 120,
            fontWeight: 600,
            borderColor: theme.palette.error.main,
            color: theme.palette.error.main,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(244,67,54,0.08)"
                : "rgba(244,67,54,0.04)",
            "&:hover": {
              borderColor: theme.palette.error.dark,
              color: theme.palette.error.dark,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(244,67,54,0.18)"
                  : "rgba(244,67,54,0.12)",
            },
          }}
        >
          Discard Changes
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={formik.isSubmitting || !formik.values.name}
          sx={{
            minWidth: 120,
            fontWeight: 600,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 2px 8px rgba(118, 177, 211, 0.3)"
                : "0 2px 8px rgba(25, 118, 210, 0.3)",
            "&:hover": {
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 4px 12px rgba(118, 177, 211, 0.4)"
                  : "0 4px 12px rgba(25, 118, 210, 0.4)",
            },
          }}
        >
          {formik.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </>
  );
};

export default CustomEditFormButtons;
