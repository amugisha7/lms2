import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  CloudUpload,
  Add,
  Description,
  Cancel,
  Delete,
} from "@mui/icons-material";
import {
  uploadData as amplifyUploadData,
  getUrl,
  remove,
} from "aws-amplify/storage";
import { generateClient } from "aws-amplify/api";
import { updateBorrower } from "../../../graphql/mutations";
import CustomDataGrid from "../../../ModelAssets/CustomDataGrid";
import ClickableText from "../../../ComponentAssets/ClickableText";
import DeleteDialog from "../../../ComponentAssets/DeleteDialog";
import { UserContext } from "../../../App";
import { Formik } from "formik";
import TextInput from "../../../Resources/FormComponents/TextInput";

const BorrowerFiles = ({ borrower, setBorrower, setNotification }) => {
  const theme = useTheme();
  const { userDetails } = useContext(UserContext);
  const client = React.useMemo(() => generateClient(), []);

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadFileData, setUploadFileData] = useState({
    file: null,
    description: "",
  });
  const [uploadMode, setUploadMode] = useState("file");

  // Initialize files from borrower data
  useEffect(() => {
    if (borrower?.borrowerDocuments) {
      setFiles(
        Array.isArray(borrower.borrowerDocuments)
          ? borrower.borrowerDocuments
          : []
      );
    } else {
      setFiles([]);
    }
  }, [borrower]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFileData({ ...uploadFileData, file });
    }
  };

  const handleUpload = async (values) => {
    if (uploadMode === "file") {
      const uploadedFilesCount = files.filter((f) => f.s3Key).length;
      if (uploadedFilesCount >= 10) {
        setNotification({
          message: "Max of 10 files allowed. Try adding a link instead.",
          color: "red",
        });
        return;
      }

      const allowedTypes = [
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

      if (!uploadFileData.file) {
        setNotification({
          message: "Please select a file",
          color: "red",
        });
        return;
      }

      if (!allowedTypes.includes(uploadFileData.file.type)) {
        setNotification({
          message:
            "File type not allowed. Please select a document or image file.",
          color: "red",
        });
        return;
      }

      if (uploadFileData.file.size > maxFileSize) {
        setNotification({
          message: "File size exceeds 10MB limit.",
          color: "red",
        });
        return;
      }

      setLoading(true);
      try {
        // Generate unique filename
        const timestamp = new Date().getTime();
        const fileName = `borrower-${borrower.id}/${timestamp}-${uploadFileData.file.name}`;

        // Upload to S3
        await amplifyUploadData({
          key: fileName,
          data: uploadFileData.file,
          options: {
            contentType: uploadFileData.file.type,
          },
        });

        // Create file record
        const newFile = {
          id: timestamp.toString(),
          fileName: uploadFileData.file.name,
          description: values.description?.trim() || "",
          uploadDate: new Date().toISOString(),
          uploadedBy:
            userDetails?.firstName && userDetails?.lastName
              ? `${userDetails.firstName} ${userDetails.lastName}`
              : "User",
          s3Key: fileName,
          fileSize: uploadFileData.file.size,
          fileType: uploadFileData.file.type,
        };

        // Update files array
        const updatedFiles = [...files, newFile];
        setFiles(updatedFiles);

        // Update borrower in database
        const borrowerInput = {
          id: borrower.id,
          borrowerDocuments: JSON.stringify(updatedFiles),
        };

        const updateResult = await client.graphql({
          query: updateBorrower,
          variables: { input: borrowerInput },
        });

        // Update local borrower state
        setBorrower((prev) => ({ ...prev, borrowerDocuments: updatedFiles }));

        setNotification({
          message: "File uploaded successfully!",
          color: "green",
        });

        // Reset upload dialog
        setUploadDialogOpen(false);
        setUploadFileData({ file: null, description: "" });
      } catch (error) {
        console.error("Error uploading file:", error);
        setNotification({
          message: "Error uploading file. Please try again.",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Handle link addition - no limit
      if (!values.url?.trim()) {
        setNotification({
          message: "Please enter a URL",
          color: "red",
        });
        return;
      }

      setLoading(true);
      try {
        const timestamp = new Date().getTime();
        const newFile = {
          id: timestamp.toString(),
          fileName: values.url.trim(),
          description: values.description?.trim() || "",
          uploadDate: new Date().toISOString(),
          uploadedBy:
            userDetails?.firstName && userDetails?.lastName
              ? `${userDetails.firstName} ${userDetails.lastName}`
              : "User",
          type: "link",
        };

        const updatedFiles = [...files, newFile];
        setFiles(updatedFiles);

        const borrowerInput = {
          id: borrower.id,
          borrowerDocuments: JSON.stringify(updatedFiles),
        };

        await client.graphql({
          query: updateBorrower,
          variables: { input: borrowerInput },
        });

        setBorrower((prev) => ({ ...prev, borrowerDocuments: updatedFiles }));

        setNotification({
          message: "Link added successfully!",
          color: "green",
        });

        setUploadDialogOpen(false);
        setUploadFileData({ file: null, description: "" });
        setUploadMode("file");
      } catch (error) {
        console.error("Error adding link:", error);
        setNotification({
          message: "Error adding link. Please try again.",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownload = async (file) => {
    try {
      setLoading(true);
      if (file.s3Key) {
        const signedURL = await getUrl({
          key: file.s3Key,
          options: {
            expiresIn: 300, // 5 minutes
          },
        });
        window.open(signedURL.url, "_blank");
      } else {
        window.open(file.fileName, "_blank");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      setNotification({
        message: "Error downloading file. Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;

    setDeleteLoading(true);
    try {
      // Remove from S3 only if it's an uploaded file
      if (fileToDelete.s3Key) {
        await remove({ key: fileToDelete.s3Key });
      }

      // Update files array
      const updatedFiles = files.filter((f) => f.id !== fileToDelete.id);
      setFiles(updatedFiles);

      // Update borrower in database
      const borrowerInput = {
        id: borrower.id,
        borrowerDocuments: JSON.stringify(updatedFiles),
      };

      const updateResult = await client.graphql({
        query: updateBorrower,
        variables: { input: borrowerInput },
      });

      // Update local borrower state
      setBorrower((prev) => ({ ...prev, borrowerDocuments: updatedFiles }));

      setNotification({
        message: "File deleted successfully!",
        color: "green",
      });

      setDeleteDialogOpen(false);
      setFileToDelete(null);
    } catch (error) {
      console.error("Error deleting file:", error);
      setNotification({
        message: "Error deleting file. Please try again.",
        color: "red",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteDialog = (file) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const formatFileSize = (bytes) => {
    if (bytes === undefined || bytes === null) return "N/A";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Data grid columns
  const columns = [
    {
      field: "fileName",
      headerName: "File Name",
      width: 300,
      renderCell: (params) => {
        if (params.row.type === "link") {
          const url = params.value.startsWith("http")
            ? params.value
            : `http://${params.value}`;
          return (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: theme.palette.blueText.main,
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {params.value}
            </a>
          );
        } else {
          return (
            <ClickableText
              onClick={() => handleDownload(params.row)}
              sx={{
                color: theme.palette.blueText.main,
                textDecoration: "underline",
                cursor: "pointer",
                "&:hover": {
                  color: theme.palette.blueText.dark,
                },
              }}
            >
              {params.value}
            </ClickableText>
          );
        }
      },
    },
    {
      field: "description",
      headerName: "Description",
      width: 205,
    },
    {
      field: "fileSize",
      headerName: "Size",
      width: 70,
      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: "0.75rem",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          {formatFileSize(params.value)}
        </Typography>
      ),
    },
    {
      field: "uploadDate",
      headerName: "Upload Date",
      width: 150,
      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: "0.75rem",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          {formatDate(params.value)}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 50,
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => openDeleteDialog(params.row)}>
          <Delete
            sx={{
              color: theme.palette.error.main,
              "&:hover": {
                color: theme.palette.error.dark,
              },
              fontSize: 20,
            }}
          />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Box>
        {/* Header with Upload Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              fontFamily: theme.typography.h6.fontFamily,
            }}
          >
            Files ({files.length})
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={
                <CloudUpload sx={{ color: theme.palette.blueText.main }} />
              }
              onClick={() => {
                setUploadMode("file");
                setUploadDialogOpen(true);
              }}
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
              startIcon={<Add sx={{ color: theme.palette.blueText.main }} />}
              onClick={() => {
                setUploadMode("link");
                setUploadDialogOpen(true);
              }}
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
        </Box>

        {/* Files Data Grid */}
        {loading && !deleteLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : files.length > 0 ? (
          <CustomDataGrid
            rows={files}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id}
            pageSize={25}
            pageSizeOptions={[25, 50, 100]}
          />
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 2,
              backgroundColor: theme.palette.background.paper,
              borderRadius: "8px",
              //   border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                // mb: 1,
              }}
            >
              No files uploaded yet
            </Typography>
          </Box>
        )}
      </Box>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload File or Add Link</DialogTitle>
        <Formik
          initialValues={{ description: "", url: "" }}
          onSubmit={handleUpload}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <DialogContent>
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <Button
                      variant={uploadMode === "file" ? "contained" : "outlined"}
                      onClick={() => {
                        setUploadMode("file");
                        formik.resetForm();
                        setUploadFileData({ file: null, description: "" });
                      }}
                      sx={{ flex: 1 }}
                    >
                      Upload File
                    </Button>
                    <Button
                      variant={uploadMode === "link" ? "contained" : "outlined"}
                      onClick={() => {
                        setUploadMode("link");
                        formik.resetForm();
                        setUploadFileData({ file: null, description: "" });
                      }}
                      sx={{ flex: 1 }}
                    >
                      Add Link
                    </Button>
                  </Box>
                  {uploadMode === "file" ? (
                    <>
                      <Button
                        component="label"
                        variant="outlined"
                        sx={{
                          width: "100%",
                          py: 2,
                          mb: 3,
                          borderStyle: "dashed",
                          borderColor: theme.palette.blueText.main,
                          color: theme.palette.blueText.main,
                          backgroundColor: "transparent",
                          "&:hover": {
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.blueText.dark, // darken on hover
                            borderColor: theme.palette.blueText.dark, // darken on hover
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
                  onClick={() => setUploadDialogOpen(false)}
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

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        name={fileToDelete?.fileName}
      />
    </>
  );
};

export default BorrowerFiles;
