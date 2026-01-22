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
import CustomDataGrid from "../../../../ModelAssets/CustomDataGrid";
import DeleteDialog from "../../../../ModelAssets/DeleteDialog";
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
  // Documents come from a join table, so we need to map the nested document object
  useEffect(() => {
    if (transaction?.documents?.items) {
      const mappedFiles = transaction.documents.items
        .filter((item) => item.document) // Filter out any items without a document
        .map((item) => ({
          ...item.document,
          uploadDate: item.document.createdAt,
          // Check if it's a link based on contentType
          type: item.document.contentType === "link" ? "link" : "file",
          // Store join record ID for potential use
          joinRecordId: item.id,
        }));
      setFiles(mappedFiles);
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

        const linkResult = await client.graphql({
          query: createMoneyTransactionDocument,
          variables: { input: linkInput },
        });
        const joinRecord = linkResult.data.createMoneyTransactionDocument;

        // Create file object for local state (flat structure for display)
        const fileForState = {
          ...newDocument,
          uploadDate: newDocument.createdAt,
          fileSize: uploadFileData.file.size,
          type: "file",
          joinRecordId: joinRecord.id,
        };

        const updatedFiles = [...files, fileForState];
        setFiles(updatedFiles);

        // Update parent transaction state with nested structure
        setTransaction((prev) => ({
          ...prev,
          documents: {
            ...prev.documents,
            items: [
              ...(prev.documents?.items || []),
              { id: joinRecord.id, document: newDocument },
            ],
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

        const linkResult = await client.graphql({
          query: createMoneyTransactionDocument,
          variables: { input: linkInput },
        });
        const joinRecord = linkResult.data.createMoneyTransactionDocument;

        // Create file object for local state (flat structure for display)
        const fileForState = {
          ...newDocument,
          uploadDate: newDocument.createdAt,
          type: "link",
          joinRecordId: joinRecord.id,
        };

        const updatedFiles = [...files, fileForState];
        setFiles(updatedFiles);

        // Update parent transaction state with nested structure
        setTransaction((prev) => ({
          ...prev,
          documents: {
            ...prev.documents,
            items: [
              ...(prev.documents?.items || []),
              { id: joinRecord.id, document: newDocument },
            ],
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

    const fileId = fileToDelete.id;
    const fileS3Key = fileToDelete.s3Key;

    setDeleteLoading(true);
    try {
      // 1. Find the join record
      const joinResult = await client.graphql({
        query: listMoneyTransactionDocuments,
        variables: {
          filter: {
            moneyTransactionId: { eq: transaction.id },
            documentId: { eq: fileId },
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
            }),
          ),
        );
      }

      // 3. Delete Document record
      await client.graphql({
        query: deleteDocument,
        variables: { input: { id: fileId } },
      });

      // 4. Remove from S3 if it has a key
      if (fileS3Key) {
        await remove({ key: fileS3Key });
      }

      // Update local files state
      const updatedFiles = files.filter((f) => f.id !== fileId);
      setFiles(updatedFiles);

      // Update parent transaction state with nested structure
      setTransaction((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          items: (prev.documents?.items || []).filter(
            (item) => item.document?.id !== fileId,
          ),
        },
      }));

      setNotification({
        message: "File deleted successfully!",
        color: "green",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      setNotification({
        message: "Error deleting file. Please try again.",
        color: "red",
      });
    } finally {
      // Always close the dialog and reset state
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setFileToDelete(null);
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
    canDeleteFiles,
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
