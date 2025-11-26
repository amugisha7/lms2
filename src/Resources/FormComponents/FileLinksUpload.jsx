import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ExpandMore, CloudUpload, Add, Cancel } from "@mui/icons-material";
import { Formik } from "formik";
import { useField } from "formik";
import TextInput from "./TextInput";
import DeleteDialog from "../../ModelAssets/DeleteDialog";
import CustomDataGrid from "../../ModelAssets/CustomDataGrid";
import { getFileDataGridColumns, formatFileSize } from "./fileDataGridColumns";
import { generateClient } from "aws-amplify/api";
import { remove as amplifyRemove } from "aws-amplify/storage";
import {
  DELETE_DOCUMENT_MUTATION,
  DELETE_MONEY_TRANSACTION_DOCUMENT_MUTATION,
  LIST_MONEY_TRANSACTION_DOCUMENTS_QUERY,
} from "../../Models/Accounts/MoneyTransactions/moneyTransactionHelpes";

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "image/svg+xml",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * FileLinksUpload - A reusable Formik-integrated component for uploading files and adding links
 * with an expandable accordion interface.
 *
 * Can be used in form configs with type: "fileUpload"
 *
 * @param {Object} props
 * @param {string} props.label - Label for the accordion header (default: "Attachments")
 * @param {string} props.name - Formik field name (required for form integration)
 * @param {Function} props.onError - Callback for error notifications
 * @param {boolean} props.disabled - Disable all interactions
 * @param {boolean} props.readOnly - Read-only mode
 * @param {boolean} props.editing - Editing mode (false = read-only)
 * @param {boolean} props.defaultExpanded - Default expanded state
 * @param {number} props.maxFiles - Maximum number of files allowed (default: 10)
 * @param {number} props.maxFileSize - Maximum file size in bytes (default: 10MB)
 * @param {Array} props.allowedTypes - Array of allowed MIME types
 */
const FileLinksUpload = ({
  label = "Attachments",
  name,
  onError,
  disabled = false,
  readOnly = false,
  editing = true,
  required = false,
  defaultExpanded = false,
  maxFiles = 10,
  maxFileSize = MAX_FILE_SIZE,
  allowedTypes = ALLOWED_FILE_TYPES,
  transactionId = null, // Transaction ID for deleting existing files
  // Extract form-config specific props to prevent passing to DOM
  validationType,
  validationMessage,
  span,
  ...props
}) => {
  const theme = useTheme();
  const [field, meta, helpers] = useField(name);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState("file");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const client = React.useMemo(() => generateClient(), []);

  const isReadOnly = readOnly || editing === false || disabled;

  // Get files from Formik field value
  const files = Array.isArray(field.value) ? field.value : [];

  // Auto-expand when there are existing files, otherwise use defaultExpanded
  const [expanded, setExpanded] = useState(defaultExpanded || files.length > 0);

  // Update expanded state when files change (e.g., when initial values are loaded)
  useEffect(() => {
    if (files.length > 0 && !expanded) {
      setExpanded(true);
    }
  }, [files.length]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      if (
        allowedTypes.some(
          (type) =>
            file.type.startsWith(type.split("/")[0]) || file.type === type
        )
      ) {
        setSelectedFile(file);
      }
    }
  };

  const handleAddItem = (values) => {
    if (uploadMode === "file") {
      if (!selectedFile) {
        onError?.({ message: "Please select a file", color: "red" });
        return;
      }

      const uploadedFilesCount = files.filter((f) => f.type === "file").length;
      if (uploadedFilesCount >= maxFiles) {
        onError?.({
          message: `Maximum of ${maxFiles} files allowed. Try adding a link instead.`,
          color: "red",
        });
        return;
      }

      if (!allowedTypes.includes(selectedFile.type)) {
        onError?.({
          message:
            "File type not allowed. Please select a document or image file.",
          color: "red",
        });
        return;
      }

      if (selectedFile.size > maxFileSize) {
        onError?.({
          message: `File size exceeds ${formatFileSize(maxFileSize)} limit.`,
          color: "red",
        });
        return;
      }

      const newFile = {
        id: Date.now().toString(),
        file: selectedFile,
        fileName: selectedFile.name,
        description: values.description?.trim() || "",
        type: "file",
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        uploadDate: new Date().toISOString(),
      };

      helpers.setValue([...files, newFile]);
      closeDialog();
    } else {
      if (!values.url?.trim()) {
        onError?.({ message: "Please enter a URL", color: "red" });
        return;
      }

      const newLink = {
        id: Date.now().toString(),
        fileName: values.url.trim(),
        description: values.description?.trim() || "",
        type: "link",
        uploadDate: new Date().toISOString(),
      };

      helpers.setValue([...files, newLink]);
      closeDialog();
    }
  };

  /**
   * Remove a file/link - handles both new (pending) and existing (saved) items
   */
  const handleRemoveItem = async (fileId) => {
    const fileToRemove = files.find((f) => f.id === fileId);

    if (!fileToRemove) {
      setDeleteDialogOpen(false);
      setFileToDelete(null);
      return;
    }

    // If it's an existing file from the database, delete it via API
    if (fileToRemove.isExisting) {
      setDeleteLoading(true);
      try {
        // 1. Find and delete the join record
        if (transactionId) {
          const joinResult = await client.graphql({
            query: LIST_MONEY_TRANSACTION_DOCUMENTS_QUERY,
            variables: {
              filter: {
                moneyTransactionId: { eq: transactionId },
                documentId: { eq: fileToRemove.id },
              },
            },
          });

          const joinRecords =
            joinResult.data.listMoneyTransactionDocuments?.items || [];

          // Delete join record(s)
          await Promise.all(
            joinRecords.map((record) =>
              client.graphql({
                query: DELETE_MONEY_TRANSACTION_DOCUMENT_MUTATION,
                variables: { input: { id: record.id } },
              })
            )
          );
        } else if (fileToRemove.joinRecordId) {
          // If we have the join record ID directly
          await client.graphql({
            query: DELETE_MONEY_TRANSACTION_DOCUMENT_MUTATION,
            variables: { input: { id: fileToRemove.joinRecordId } },
          });
        }

        // 2. Delete the Document record
        await client.graphql({
          query: DELETE_DOCUMENT_MUTATION,
          variables: { input: { id: fileToRemove.id } },
        });

        // 3. Remove from S3 if it has a key
        if (fileToRemove.s3Key) {
          try {
            await amplifyRemove({ key: fileToRemove.s3Key });
          } catch (s3Error) {
            console.warn("Could not delete file from S3:", s3Error);
            // Continue even if S3 deletion fails
          }
        }

        // Update local state
        helpers.setValue(files.filter((f) => f.id !== fileId));

        onError?.({
          message: `${fileToRemove.fileName} deleted successfully!`,
          color: "green",
        });
      } catch (error) {
        console.error("Error deleting existing file:", error);
        onError?.({
          message: `Error deleting ${fileToRemove.fileName}. Please try again.`,
          color: "red",
        });
      } finally {
        setDeleteLoading(false);
        setDeleteDialogOpen(false);
        setFileToDelete(null);
      }
    } else {
      // For new (pending) files, just remove from local state
      helpers.setValue(files.filter((f) => f.id !== fileId));
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  const openDeleteDialog = (file) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setFileToDelete(null);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedFile(null);
    setUploadMode("file");
  };

  const openFileDialog = () => {
    setUploadMode("file");
    setDialogOpen(true);
  };

  const openLinkDialog = () => {
    setUploadMode("link");
    setDialogOpen(true);
  };

  // Handle file click to preview/open local files or existing files
  const handleFileClick = async (file) => {
    if (file.file) {
      // For local File objects (not yet uploaded), create a temporary URL
      const objectUrl = URL.createObjectURL(file.file);
      window.open(objectUrl, "_blank");
      // Clean up the URL after a short delay to allow the browser to open it
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } else if (file.s3Key) {
      // For existing files with S3 keys, get a signed URL
      try {
        const { getUrl } = await import("aws-amplify/storage");
        const signedURL = await getUrl({
          key: file.s3Key,
          options: {
            expiresIn: 300, // 5 minutes
          },
        });
        window.open(signedURL.url, "_blank");
      } catch (error) {
        console.error("Error getting file URL:", error);
        onError?.({
          message: "Error opening file. Please try again.",
          color: "red",
        });
      }
    } else if (file.type === "link") {
      // For links, open directly
      const url = file.fileName.startsWith("http")
        ? file.fileName
        : `http://${file.fileName}`;
      window.open(url, "_blank");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderBottom: (theme) =>
          `1.5px dotted ${
            theme.palette.mode === "dark"
              ? theme.palette.grey[500]
              : theme.palette.grey[400]
          }`,
        pb: editing ? 1 : 0,
      }}
    >
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{
          boxShadow: "none",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "8px !important",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "transparent",
              border: `2px solid ${theme.palette.blueText.main}`,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontSize: 14,
              }}
            >
              {label} ({files.length})
              {required && (
                <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>
                  *
                </Box>
              )}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {/* Upload Buttons */}
          {!isReadOnly && (
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={
                  <CloudUpload sx={{ color: theme.palette.blueText.main }} />
                }
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
                disabled={isReadOnly}
                sx={{
                  borderColor: theme.palette.blueText.main,
                  color: theme.palette.blueText.main,
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "transparent",
                    borderColor: theme.palette.blueText.dark,
                    borderWidth: "2px",
                    color: theme.palette.blueText.dark,
                  },
                }}
              >
                Upload File
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Add sx={{ color: theme.palette.blueText.main }} />}
                onClick={(e) => {
                  e.stopPropagation();
                  openLinkDialog();
                }}
                disabled={isReadOnly}
                sx={{
                  borderColor: theme.palette.blueText.main,
                  color: theme.palette.blueText.main,
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "transparent",
                    borderColor: theme.palette.blueText.dark,
                    borderWidth: "2px",
                    color: theme.palette.blueText.dark,
                  },
                }}
              >
                Add Link
              </Button>
            </Box>
          )}

          {/* Files DataGrid */}
          {files.length > 0 ? (
            <CustomDataGrid
              rows={files}
              columns={getFileDataGridColumns(
                theme,
                handleFileClick,
                openDeleteDialog,
                !isReadOnly
              )}
              getRowId={(row) => row.id}
              loading={false}
              pageSize={5}
              pageSizeOptions={[5, 10]}
              showToolbar={false}
            />
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                textAlign: "center",
                py: 2,
              }}
            >
              No files or links added yet
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Upload/Link Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {uploadMode === "file" ? "Upload File" : "Add Link"}
        </DialogTitle>
        <Formik
          initialValues={{ description: "", url: "" }}
          onSubmit={handleAddItem}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <DialogContent
                onDragOver={(e) => {
                  e.preventDefault();
                  if (uploadMode === "file") setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={uploadMode === "file" ? handleDrop : undefined}
                sx={{
                  ...(isDragOver && {
                    border: `2px dashed ${theme.palette.primary.main}`,
                    // backgroundColor: theme.palette.action.hover,
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
                        {selectedFile ? (
                          <>
                            {selectedFile.name}
                            <Cancel
                              sx={{ ml: 1, cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFile(null);
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
              <DialogActions sx={{ pb: 2 }}>
                <Button
                  onClick={closeDialog}
                  type="button"
                  variant="outlined"
                  color="error"
                  sx={{
                    minWidth: 120,
                    fontWeight: 600,
                    borderColor: theme.palette.error.main,
                    color: theme.palette.error.main,
                    "&:hover": {
                      borderColor: theme.palette.error.dark,
                      color: theme.palette.error.dark,
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    (uploadMode === "file" &&
                      (!selectedFile || !formik.values.description.trim())) ||
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
                  {uploadMode === "file" ? "Upload" : "Add Link"}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={() => handleRemoveItem(fileToDelete?.id)}
        name={fileToDelete?.fileName}
        loading={deleteLoading}
      />
    </Box>
  );
};

export default FileLinksUpload;
