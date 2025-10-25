import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CloudUpload, Add } from "@mui/icons-material";
import {
  uploadData as amplifyUploadData,
  getUrl,
  remove,
} from "aws-amplify/storage";
import { generateClient } from "aws-amplify/api";
import CustomDataGrid from "../../../ComponentAssets/CustomDataGrid";
import DeleteDialog from "../../../ModelAssets/DeleteDialog";
import { UserContext } from "../../../App";
import UploadDialogBox from "../../../ModelAssets/UploadDialogBox";
import { formatFileSize, formatDate } from "./fileUtils";
import { getUserFilesColumns } from "./userFilesColumns";
import { useHasPermission } from "../../../ModelAssets/Permissions/permissions";

const UPDATE_USER_MUTATION = `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      userDocuments
      updatedAt
    }
  }
`;

const UserFiles = ({ user, setUser, setNotification }) => {
  const theme = useTheme();
  const { userDetails } = useContext(UserContext);
  const client = React.useMemo(() => generateClient(), []);

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const canCreateUserFiles = useHasPermission("create", "user");
  const canDeleteUserFiles = useHasPermission("delete", "user");

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

  // Initialize files from user data
  useEffect(() => {
    if (user?.userDocuments) {
      setFiles(Array.isArray(user.userDocuments) ? user.userDocuments : []);
    } else {
      setFiles([]);
    }
  }, [user]);

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
        const fileName = `user-${user.id}/${timestamp}-${uploadFileData.file.name}`;

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

        // Update user in database
        const userInput = {
          id: user.id,
          userDocuments: JSON.stringify(updatedFiles),
        };

        await client.graphql({
          query: UPDATE_USER_MUTATION,
          variables: { input: userInput },
        });

        // Update local user state
        setUser((prev) => ({ ...prev, userDocuments: updatedFiles }));

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

        const userInput = {
          id: user.id,
          userDocuments: JSON.stringify(updatedFiles),
        };

        await client.graphql({
          query: UPDATE_USER_MUTATION,
          variables: { input: userInput },
        });

        setUser((prev) => ({ ...prev, userDocuments: updatedFiles }));

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

      // Update user in database
      const userInput = {
        id: user.id,
        userDocuments: JSON.stringify(updatedFiles),
      };

      await client.graphql({
        query: UPDATE_USER_MUTATION,
        variables: { input: userInput },
      });

      // Update local user state
      setUser((prev) => ({ ...prev, userDocuments: updatedFiles }));

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

  // Data grid columns
  const columns = getUserFilesColumns(
    theme,
    handleDownload,
    openDeleteDialog,
    formatFileSize,
    formatDate,
    canDeleteUserFiles
  );

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
            {canCreateUserFiles && (
              <>
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
                  startIcon={
                    <Add sx={{ color: theme.palette.blueText.main }} />
                  }
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
              </>
            )}
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
            initialState={{
              sorting: {
                sortModel: [{ field: "uploadDate", sort: "desc" }],
              },
            }}
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
      <UploadDialogBox
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        uploadMode={uploadMode}
        uploadFileData={uploadFileData}
        setUploadFileData={setUploadFileData}
        handleFileSelect={handleFileSelect}
        handleUpload={handleUpload}
        loading={loading}
      />

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

export default UserFiles;
