import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CloudUpload, Cancel } from "@mui/icons-material";
import { Formik } from "formik";
import TextInput from "../Resources/FormComponents/TextInput";

const BorrowerUploadDialog = ({
  open,
  onClose,
  uploadMode,
  uploadFileData,
  setUploadFileData,
  handleFileSelect,
  handleUpload,
  loading,
}) => {
  const theme = useTheme();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const acceptedTypes = [
        "image/",
        ".pdf",
        ".doc",
        ".docx",
        ".txt",
        ".xls",
        ".xlsx",
        ".ppt",
        ".pptx",
      ];
      const isAccepted = acceptedTypes.some(
        (type) =>
          file.type.startsWith(type) ||
          file.name.endsWith(type.replace(".", ""))
      );
      if (isAccepted) {
        setUploadFileData({ ...uploadFileData, file });
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {uploadMode === "file" ? "Upload File" : "Add Link"}
      </DialogTitle>
      <Formik
        initialValues={{ description: "", url: "" }}
        onSubmit={handleUpload}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <DialogContent
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              sx={{
                ...(isDragOver && {
                  border: `2px dashed ${theme.palette.primary.main}`,
                  backgroundColor: theme.palette.action.hover,
                }),
              }}
            >
              <Box>
                {uploadMode === "file" ? (
                  <>
                    <Button
                      component="label"
                      variant="outlined"
                      sx={{
                        width: "100%",
                        py: 3,
                        mb: 3,
                        borderStyle: "dashed",
                        borderColor: theme.palette.blueText.main,
                        color: theme.palette.blueText.main,
                        backgroundColor: "transparent",
                        "&:hover": {
                          backgroundColor: theme.palette.background.paper,
                          color: theme.palette.blueText.dark,
                          borderColor: theme.palette.blueText.dark,
                          borderWidth: "2px",
                        },
                      }}
                    >
                      {uploadFileData.file ? (
                        <>
                          {uploadFileData.file.name}
                          <Cancel
                            sx={{ ml: 1, cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadFileData({
                                ...uploadFileData,
                                file: null,
                              });
                            }}
                          />
                        </>
                      ) : (
                        <>
                          Choose File
                          <CloudUpload sx={{ ml: 1 }} />
                        </>
                      )}
                      <input
                        type="file"
                        hidden
                        onChange={handleFileSelect}
                        accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                      />
                    </Button>
                    <TextInput
                      name="description"
                      label="Description"
                      rows={1}
                      required
                    />
                  </>
                ) : (
                  <>
                    <TextInput name="url" label="URL" required />
                    <TextInput
                      name="description"
                      label="Description"
                      rows={1}
                      required
                    />
                  </>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={onClose}
                disabled={loading}
                type="button"
                variant="outlined"
                color="error"
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
                disabled={
                  loading ||
                  (uploadMode === "file" &&
                    (!uploadFileData.file ||
                      !formik.values.description.trim())) ||
                  (uploadMode === "link" &&
                    (!formik.values.url.trim() ||
                      !formik.values.description.trim()))
                }
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
                {loading ? (
                  <CircularProgress size={20} />
                ) : uploadMode === "file" ? (
                  "Upload"
                ) : (
                  "Add Link"
                )}
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default BorrowerUploadDialog;
