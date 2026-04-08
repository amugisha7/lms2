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
import CustomDataGrid from "../../../ModelAssets/CustomDataGrid";
import DeleteDialog from "../../../ModelAssets/DeleteDialog";
import { UserContext } from "../../../App";
import UploadDialogBox from "../../../ModelAssets/UploadDialogBox";
import { getLoanFilesColumns } from "./loanFilesColumns";
import { useHasPermission } from "../../../ModelAssets/Permissions/permissions";

const LOAN_DOCUMENTS_QUERY = /* GraphQL */ `
  query LoanDocumentsByLoanIdWithDetails(
    $loanId: ID!
    $limit: Int
    $nextToken: String
  ) {
    loanDocumentsByLoanId(
      loanId: $loanId
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        documentId
        loanId
        document {
          id
          documentType
          documentName
          documentDescription
          s3Key
          fileName
          contentType
          documentDate
          status
          createdAt
        }
      }
      nextToken
    }
  }
`;

const CREATE_DOCUMENT_MUTATION = /* GraphQL */ `
  mutation CreateDocument($input: CreateDocumentInput!) {
    createDocument(input: $input) {
      id
      documentType
      documentName
      documentDescription
      s3Key
      fileName
      contentType
      status
      createdAt
    }
  }
`;

const CREATE_LOAN_DOCUMENT_MUTATION = /* GraphQL */ `
  mutation CreateLoanDocument($input: CreateLoanDocumentInput!) {
    createLoanDocument(input: $input) {
      id
      documentId
      loanId
    }
  }
`;

const DELETE_LOAN_DOCUMENT_MUTATION = /* GraphQL */ `
  mutation DeleteLoanDocument($input: DeleteLoanDocumentInput!) {
    deleteLoanDocument(input: $input) {
      id
    }
  }
`;

const DELETE_DOCUMENT_MUTATION = /* GraphQL */ `
  mutation DeleteDocument($input: DeleteDocumentInput!) {
    deleteDocument(input: $input) {
      id
    }
  }
`;

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const LoanFiles = ({ loan, setNotification }) => {
  const theme = useTheme();
  const { userDetails } = useContext(UserContext);
  const client = React.useMemo(() => generateClient(), []);

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const canCreateFiles = useHasPermission("create", "loan");
  const canDeleteFiles = useHasPermission("delete", "loan");

  // joinRows: array of { id (join id), documentId, document: {...} }
  const [joinRows, setJoinRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadFileData, setUploadFileData] = useState({
    file: null,
    description: "",
  });
  const [uploadMode, setUploadMode] = useState("file");

  const fetchDocuments = React.useCallback(async () => {
    if (!loan?.id) return;
    setLoading(true);
    try {
      let allItems = [];
      let nextToken = null;
      do {
        const result = await client.graphql({
          query: LOAN_DOCUMENTS_QUERY,
          variables: { loanId: loan.id, limit: 100, nextToken },
        });
        const items =
          result?.data?.loanDocumentsByLoanId?.items?.filter(
            (r) => r?.document,
          ) || [];
        allItems = [...allItems, ...items];
        nextToken = result?.data?.loanDocumentsByLoanId?.nextToken;
      } while (nextToken);
      setJoinRows(allItems);
    } catch (err) {
      console.error("Error fetching loan documents:", err);
      setNotification({ message: "Error loading files.", color: "red" });
    } finally {
      setLoading(false);
    }
  }, [loan?.id, client, setNotification]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFileData((prev) => ({ ...prev, file }));
    }
  };

  const handleUpload = async (values) => {
    if (uploadMode === "file") {
      const fileCount = joinRows.filter(
        (r) => r.document?.documentType !== "link",
      ).length;
      if (fileCount >= 10) {
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
        setNotification({ message: "Please select a file.", color: "red" });
        return;
      }
      if (!allowedTypes.includes(uploadFileData.file.type)) {
        setNotification({
          message: "File type not allowed.",
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
        const timestamp = Date.now();
        const s3Key = `loan-${loan.id}/${timestamp}-${uploadFileData.file.name}`;

        await amplifyUploadData({
          key: s3Key,
          data: uploadFileData.file,
          options: { contentType: uploadFileData.file.type },
        });

        // Create Document record
        const docResult = await client.graphql({
          query: CREATE_DOCUMENT_MUTATION,
          variables: {
            input: {
              documentType: "file",
              documentName: uploadFileData.file.name,
              documentDescription: values.description?.trim() || "",
              s3Key,
              fileName: uploadFileData.file.name,
              contentType: uploadFileData.file.type,
              status: "active",
              branchDocumentsId: loan.branchID || null,
              createdByEmployeeID: loan.createdByEmployeeID || null,
            },
          },
        });

        const newDocId = docResult?.data?.createDocument?.id;
        if (!newDocId) throw new Error("Document creation failed");

        // Link Document to Loan
        const joinResult = await client.graphql({
          query: CREATE_LOAN_DOCUMENT_MUTATION,
          variables: {
            input: { documentId: newDocId, loanId: loan.id },
          },
        });

        const newJoinId = joinResult?.data?.createLoanDocument?.id;
        const newDoc = docResult?.data?.createDocument;

        setJoinRows((prev) => [
          ...prev,
          {
            id: newJoinId,
            documentId: newDocId,
            loanId: loan.id,
            document: newDoc,
          },
        ]);

        setNotification({
          message: "File uploaded successfully!",
          color: "green",
        });
        setUploadDialogOpen(false);
        setUploadFileData({ file: null, description: "" });
      } catch (err) {
        console.error("Error uploading file:", err);
        setNotification({
          message: "Error uploading file. Please try again.",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Link mode
      if (!values.url?.trim()) {
        setNotification({ message: "Please enter a URL.", color: "red" });
        return;
      }
      setLoading(true);
      try {
        const docResult = await client.graphql({
          query: CREATE_DOCUMENT_MUTATION,
          variables: {
            input: {
              documentType: "link",
              documentName: values.url.trim(),
              documentDescription: values.description?.trim() || "",
              fileName: values.url.trim(),
              status: "active",
              branchDocumentsId: loan.branchID || null,
              createdByEmployeeID: loan.createdByEmployeeID || null,
            },
          },
        });

        const newDocId = docResult?.data?.createDocument?.id;
        if (!newDocId) throw new Error("Document creation failed");

        const joinResult = await client.graphql({
          query: CREATE_LOAN_DOCUMENT_MUTATION,
          variables: {
            input: { documentId: newDocId, loanId: loan.id },
          },
        });

        const newJoinId = joinResult?.data?.createLoanDocument?.id;
        const newDoc = docResult?.data?.createDocument;

        setJoinRows((prev) => [
          ...prev,
          {
            id: newJoinId,
            documentId: newDocId,
            loanId: loan.id,
            document: newDoc,
          },
        ]);

        setNotification({
          message: "Link added successfully!",
          color: "green",
        });
        setUploadDialogOpen(false);
        setUploadFileData({ file: null, description: "" });
        setUploadMode("file");
      } catch (err) {
        console.error("Error adding link:", err);
        setNotification({
          message: "Error adding link. Please try again.",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownload = async (doc) => {
    try {
      setLoading(true);
      if (doc.s3Key) {
        const signedURL = await getUrl({
          key: doc.s3Key,
          options: { expiresIn: 300 },
        });
        window.open(signedURL.url, "_blank");
      } else {
        const url = doc.fileName?.startsWith("http")
          ? doc.fileName
          : `http://${doc.fileName}`;
        window.open(url, "_blank");
      }
    } catch (err) {
      console.error("Error downloading file:", err);
      setNotification({
        message: "Error downloading file. Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!rowToDelete) return;
    setDeleteLoading(true);
    try {
      // Remove from S3 if applicable
      if (rowToDelete.document?.s3Key) {
        await remove({ key: rowToDelete.document.s3Key });
      }

      // Delete join record
      await client.graphql({
        query: DELETE_LOAN_DOCUMENT_MUTATION,
        variables: { input: { id: rowToDelete.id } },
      });

      // Delete the Document record
      await client.graphql({
        query: DELETE_DOCUMENT_MUTATION,
        variables: { input: { id: rowToDelete.documentId } },
      });

      setJoinRows((prev) => prev.filter((r) => r.id !== rowToDelete.id));
      setNotification({
        message: "File deleted successfully!",
        color: "green",
      });
      setDeleteDialogOpen(false);
      setRowToDelete(null);
    } catch (err) {
      console.error("Error deleting file:", err);
      setNotification({
        message: "Error deleting file. Please try again.",
        color: "red",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteDialog = (doc) => {
    // Find the join row that owns this document
    const joinRow = joinRows.find((r) => r.document?.id === doc.id);
    if (joinRow) {
      setRowToDelete(joinRow);
      setDeleteDialogOpen(true);
    }
  };

  // Flatten to document objects for the grid (carry join id via a merged field)
  const rows = joinRows.map((r) => ({ ...r.document })).filter(Boolean);

  const columns = getLoanFilesColumns(
    theme,
    handleDownload,
    openDeleteDialog,
    formatDate,
    canDeleteFiles,
  );

  return (
    <>
      <Box>
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
            Files ({rows.length})
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

        {loading && !deleteLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : rows.length > 0 ? (
          <CustomDataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id}
            pageSize={25}
            pageSizeOptions={[25, 50, 100]}
            initialState={{
              sorting: { sortModel: [{ field: "createdAt", sort: "desc" }] },
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
              sx={{ color: theme.palette.text.secondary }}
            >
              No files uploaded yet
            </Typography>
          </Box>
        )}
      </Box>

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

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        name={
          rowToDelete?.document?.documentName || rowToDelete?.document?.fileName
        }
      />
    </>
  );
};

export default LoanFiles;
