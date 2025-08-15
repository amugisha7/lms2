import React from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

const CreateFormButtons = ({
  formik,
  setEditMode,
  setSubmitError,
  setSubmitSuccess,
  onClose, // add onClose prop
}) => {
  const theme = useTheme();

  return (
    <>
      <div
        style={{
          // marginTop: 16,
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: 16,
          paddingBottom: 8,
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
            if (onClose) onClose();
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
          Cancel
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
          {formik.isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </>
  );
};

export default CreateFormButtons;
