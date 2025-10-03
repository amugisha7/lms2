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
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CloudUpload, Add, Description } from "@mui/icons-material";
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

const BorrowerFiles = ({ borrower, setBorrower, setNotification }) => {
  const theme = useTheme();
  const { userDetails } = useContext(UserContext);
  const client = React.useMemo(() => generateClient(), []);

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

  // Initialize files from borrower data
  useEffect(() => {
    if (borrower?.borrowerDocuments) {
      try {
        const parsedFiles = JSON.parse(borrower.borrowerDocuments);
        setFiles(Array.isArray(parsedFiles) ? parsedFiles : []);
      } catch (error) {
        console.error("Error parsing borrower documents:", error);
        setFiles([]);
      }
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

  const handleUpload = async () => {
    if (!uploadFileData.file || !uploadFileData.description.trim()) {
      setNotification({
        message: "Please select a file and provide a description",
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
        description: uploadFileData.description.trim(),
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
      setBorrower(updateResult.data.updateBorrower);

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
  };

  const handleDownload = async (file) => {
    try {
      setLoading(true);
      const signedURL = await getUrl({
        key: file.s3Key,
        options: {
          expiresIn: 300, // 5 minutes
        },
      });

      // Open download in new tab
      window.open(signedURL.url, "_blank");
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
      // Remove from S3
      await remove({ key: fileToDelete.s3Key });

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
      setBorrower(updateResult.data.updateBorrower);

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
      width: 280,
      renderCell: (params) => (
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
      ),
    },
    {
      field: "description",
      headerName: "Description",
      width: 300,
      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: "0.82rem",
            color: theme.palette.text.primary,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "fileSize",
      headerName: "Size",
      width: 100,
      renderCell: (params) => (
        <Typography sx={{ fontSize: "0.82rem" }}>
          {formatFileSize(params.value)}
        </Typography>
      ),
    },
    {
      field: "uploadDate",
      headerName: "Upload Date",
      width: 160,
      renderCell: (params) => (
        <Typography sx={{ fontSize: "0.82rem" }}>
          {formatDate(params.value)}
        </Typography>
      ),
    },
    {
      field: "uploadedBy",
      headerName: "Uploaded By",
      width: 140,
      renderCell: (params) => (
        <Typography sx={{ fontSize: "0.82rem" }}>{params.value}</Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <ClickableText
          onClick={() => openDeleteDialog(params.row)}
          sx={{
            color: theme.palette.error.main,
            fontSize: "0.82rem",
            cursor: "pointer",
            "&:hover": {
              color: theme.palette.error.dark,
            },
          }}
        >
          Delete
        </ClickableText>
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
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setUploadDialogOpen(true)}
            sx={{
              borderColor: theme.palette.blueText.main,
              color: theme.palette.blueText.main,
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "transparent",
                borderColor: theme.palette.blueText.main,
                borderWidth: "2px",
              },
            }}
          >
            Upload File
          </Button>
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
              py: 6,
              backgroundColor: theme.palette.background.paper,
              borderRadius: "8px",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Description
              sx={{
                fontSize: 48,
                color: theme.palette.text.secondary,
                mb: 2,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                mb: 1,
              }}
            >
              No files uploaded yet
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mb: 3,
              }}
            >
              Upload documents and files related to this borrower
            </Typography>
            <Button
              variant="outlined"
              startIcon={<CloudUpload />}
              onClick={() => setUploadDialogOpen(true)}
              sx={{
                borderColor: theme.palette.blueText.main,
                color: theme.palette.blueText.main,
              }}
            >
              Upload First File
            </Button>
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
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUpload />}
              sx={{
                width: "100%",
                py: 3,
                mb: 3,
                borderStyle: "dashed",
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.default,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              {uploadFileData.file ? uploadFileData.file.name : "Choose File"}
              <input
                type="file"
                hidden
                onChange={handleFileSelect}
                accept="*/*"
              />
            </Button>

            <TextField
              fullWidth
              label="Description *"
              value={uploadFileData.description}
              onChange={(e) =>
                setUploadFileData({
                  ...uploadFileData,
                  description: e.target.value,
                })
              }
              placeholder="Enter a description for this file"
              multiline
              rows={3}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={
              loading ||
              !uploadFileData.file ||
              !uploadFileData.description.trim()
            }
            sx={{
              backgroundColor: theme.palette.blueText.main,
              "&:hover": {
                backgroundColor: theme.palette.blueText.dark,
              },
            }}
          >
            {loading ? <CircularProgress size={20} /> : "Upload"}
          </Button>
        </DialogActions>
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
