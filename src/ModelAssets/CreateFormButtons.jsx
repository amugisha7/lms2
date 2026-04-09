import React from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import PlusButtonMain from "./PlusButtonMain";

const CreateFormButtons = ({
  formik,
  setEditMode = () => {},
  setSubmitError = () => {},
  setSubmitSuccess = () => {},
  onClose, // add onClose prop
  hideCancel, // new prop
  submitLabel = "Save",
  submitDisabled = false,
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
        {!hideCancel && (
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
              padding: "5px 10px",
              fontSize: "0.8rem",
              borderRadius: "0px",
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
            CANCEL
          </Button>
        )}
        <PlusButtonMain
          type="submit"
          variant="outlined"
          disabled={formik.isSubmitting || submitDisabled}
          buttonText={formik.isSubmitting ? "Saving..." : submitLabel}
        />
      </div>
    </>
  );
};

export default CreateFormButtons;
