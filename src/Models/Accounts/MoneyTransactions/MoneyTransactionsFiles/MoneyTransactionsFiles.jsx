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
import CustomDataGrid from "../../../../ComponentAssets/CustomDataGrid";
import DeleteDialog from "../../../../ComponentAssets/DeleteDialog";
import { UserContext } from "../../../../App";
import UploadDialogBox from "../../../../ModelAssets/UploadDialogBox";
import { formatFileSize, formatDate } from "../../../../Resources/filesUtils";
import { getMoneyTransactionsFilesColumns } from "./moneyTransactionsFilesColumns";
import { useHasPermission } from "../../../../ModelAssets/Permissions/permissions";
import {
  createDocument,
  createMoneyTransactionDocument,
  deleteDocument,
  deleteMoneyTransactionDocument,
} from "../../../../graphql/mutations";
import { listMoneyTransactionDocuments } from "../../../../graphql/queries";

const MoneyTransactionsFiles = ({
  transaction,
  setTransaction,
  setNotification,
}) => {
  const theme = useTheme();
  const { userDetails } = useContext(UserContext);
  const client = React.useMemo(() => generateClient(), []);

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  // Permissions - assuming similar permissions to borrower or generic document permissions
  // Adjust resource name if needed, e.g., "moneyTransaction" or "document"
  const canCreateFiles = useHasPermission("create", "document");
  const canDeleteFiles = useHasPermission("delete", "document");

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

  // Initialize files from transaction data
  useEffect(() => {
    if (transaction?.documents?.items) {
      setFiles(transaction.documents.items);
    } else {
      setFiles([]);
    }
  }, [transaction]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFileData({ ...uploadFileData, file });
    }
  };

  const handleUpload = async (values) => {
    if (uploadMode === "file") {
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
        const fileName = `transaction-${transaction.id}/${timestamp}-${uploadFileData.file.name}`;

        // Upload to S3
        await amplifyUploadData({
          key: fileName,
          data: uploadFileData.file,
          options: {
            contentType: uploadFileData.file.type,
          },
        });

        // Create Document record
        const documentInput = {
          documentName: uploadFileData.file.name,
          documentDescription: values.description?.trim() || "",
          documentDate: new Date().toISOString().split("T")[0], // AWSDate format
          s3Key: fileName,
          fileName: uploadFileData.file.name,
          contentType: uploadFileData.file.type,
          status: "active",
          // Link to branch if available in transaction or user details
          branchDocumentsId:
            transaction.account?.branchAccountsId || userDetails?.branchUsersId,
          createdByEmployeeID: userDetails?.id, // Assuming user is an employee
        };

        const docResult = await client.graphql({
          query: createDocument,
          variables: { input: documentInput },
        });
        const newDocument = docResult.data.createDocument;

        // Link Document to MoneyTransaction
        const linkInput = {
          moneyTransactionId: transaction.id,
          documentId: newDocument.id,
        };

        await client.graphql({
          query: createMoneyTransactionDocument,
          variables: { input: linkInput },
        });

        // Update files array
        // We need to add the new document to the list.
        // Note: The new document object might need some fields to match the grid columns if they differ from schema
        // But schema fields match columns (fileName, description, etc.)
        // We add 'uploadDate' which is not in Document schema directly (it has documentDate and createdAt)
        // The columns use 'uploadDate'. Let's map it.
        const fileForState = {
          ...newDocument,
          uploadDate: newDocument.createdAt,
          fileSize: uploadFileData.file.size, // Document schema doesn't have size, but we can add it to state for display
        };

        const updatedFiles = [...files, fileForState];
        setFiles(updatedFiles);

        // Update parent transaction state if needed (though we just updated local files)
        // If parent re-fetches, it will get the new list.
        // We can update parent state to reflect the change immediately
        setTransaction((prev) => ({
          ...prev,
          documents: {
            ...prev.documents,
            items: updatedFiles,
          },
        }));

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
      // Handle link addition
      if (!values.url?.trim()) {
        setNotification({
          message: "Please enter a URL",
          color: "red",
        });
        return;
      }

      setLoading(true);
      try {
        // Create Document record for link
        const documentInput = {
          documentName: values.url.trim(),
          documentDescription: values.description?.trim() || "",
          documentDate: new Date().toISOString().split("T")[0],
          fileName: values.url.trim(),
          contentType: "link", // Custom type for link
          status: "active",
          branchDocumentsId:
            transaction.account?.branchAccountsId || userDetails?.branchUsersId,
          createdByEmployeeID: userDetails?.id,
        };

        const docResult = await client.graphql({
          query: createDocument,
          variables: { input: documentInput },
        });
        const newDocument = docResult.data.createDocument;

        // Link Document to MoneyTransaction
        const linkInput = {
          moneyTransactionId: transaction.id,
          documentId: newDocument.id,
        };

        await client.graphql({
          query: createMoneyTransactionDocument,
          variables: { input: linkInput },
        });

        const fileForState = {
          ...newDocument,
          uploadDate: newDocument.createdAt,
          type: "link", // For column rendering
        };

        const updatedFiles = [...files, fileForState];
        setFiles(updatedFiles);

        setTransaction((prev) => ({
          ...prev,
          documents: {
            ...prev.documents,
            items: updatedFiles,
          },
        }));

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
      } else if (file.contentType === "link" || file.type === "link") {
        const url = file.fileName.startsWith("http")
          ? file.fileName
          : `http://${file.fileName}`;
        window.open(url, "_blank");
      } else {
        // Fallback
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
      // 1. Find the join record
      const joinResult = await client.graphql({
        query: listMoneyTransactionDocuments,
        variables: {
          filter: {
            moneyTransactionId: { eq: transaction.id },
            documentId: { eq: fileToDelete.id },
          },
        },
      });

      const joinRecords = joinResult.data.listMoneyTransactionDocuments.items;

      // 2. Delete join record(s)
      if (joinRecords.length > 0) {
        await Promise.all(
          joinRecords.map((record) =>
            client.graphql({
              query: deleteMoneyTransactionDocument,
              variables: { input: { id: record.id } },
            })
          )
        );
      }

      // 3. Delete Document record
      await client.graphql({
        query: deleteDocument,
        variables: { input: { id: fileToDelete.id } },
      });

      // 4. Remove from S3 if it has a key
      if (fileToDelete.s3Key) {
        await remove({ key: fileToDelete.s3Key });
      }

      // Update files array
      const updatedFiles = files.filter((f) => f.id !== fileToDelete.id);
      setFiles(updatedFiles);

      setTransaction((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          items: updatedFiles,
        },
      }));

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
  const columns = getMoneyTransactionsFilesColumns(
    theme,
    handleDownload,
    openDeleteDialog,
    formatFileSize,
    formatDate,
    canDeleteFiles
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
            {canCreateFiles && (
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
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
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

export default MoneyTransactionsFiles;
