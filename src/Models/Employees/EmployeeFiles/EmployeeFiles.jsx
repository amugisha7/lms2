import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  uploadData as amplifyUploadData,
  getUrl,
  remove,
} from "aws-amplify/storage";
import CustomDataGrid from "../../../ModelAssets/CustomDataGrid";
import DeleteDialog from "../../../ModelAssets/DeleteDialog";
import { UserContext } from "../../../App";
import UploadDialogBox from "../../../ModelAssets/UploadDialogBox";
import { formatDate } from "./fileUtils";
import { getEmployeeFilesColumns } from "./employeeFilesColumns";
import { useHasPermission } from "../../../ModelAssets/Permissions/permissions";
import { updateEmployeeDocuments } from "../employeeHelpers";

const EmployeeFiles = ({ employee, setEmployee, setNotification }) => {
  const theme = useTheme();
  const { userDetails } = useContext(UserContext);

  const maxFileSize = 10 * 1024 * 1024; // 10 MB

  const canCreate = useHasPermission("create", "employee");
  const canDelete = useHasPermission("delete", "employee");

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

  // Derive stored files from customEmployeeDetails
  useEffect(() => {
    if (employee?.customEmployeeDetails) {
      try {
        const parsed =
          typeof employee.customEmployeeDetails === "string"
            ? JSON.parse(employee.customEmployeeDetails)
            : employee.customEmployeeDetails;
        setFiles(Array.isArray(parsed?.documents) ? parsed.documents : []);
      } catch {
        setFiles([]);
      }
    } else {
      setFiles([]);
    }
  }, [employee]);

  const persistFiles = async (updatedFiles) => {
    const result = await updateEmployeeDocuments(employee.id, updatedFiles);
    setEmployee((prev) => ({
      ...prev,
      customEmployeeDetails:
        result?.customEmployeeDetails ?? prev.customEmployeeDetails,
    }));
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) setUploadFileData((prev) => ({ ...prev, file }));
  };

  const handleUpload = async (values) => {
    if (uploadMode === "file") {
      const uploadedCount = files.filter((f) => f.s3Key).length;
      if (uploadedCount >= 10) {
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
        setNotification({ message: "Please select a file", color: "red" });
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
        const timestamp = new Date().getTime();
        const fileName = `employee-${employee.id}/${timestamp}-${uploadFileData.file.name}`;

        await amplifyUploadData({
          key: fileName,
          data: uploadFileData.file,
          options: { contentType: uploadFileData.file.type },
        });

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

        const updatedFiles = [...files, newFile];
        setFiles(updatedFiles);
        await persistFiles(updatedFiles);

        setNotification({
          message: "File uploaded successfully!",
          color: "green",
        });
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
      // Link mode
      if (!values.url?.trim()) {
        setNotification({ message: "Please enter a URL", color: "red" });
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
        await persistFiles(updatedFiles);

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
          options: { expiresIn: 300 },
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
      if (fileToDelete.s3Key) {
        await remove({ key: fileToDelete.s3Key });
      }

      const updatedFiles = files.filter((f) => f.id !== fileToDelete.id);
      setFiles(updatedFiles);
      await persistFiles(updatedFiles);

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
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  const openDeleteDialog = (file) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const columns = getEmployeeFilesColumns(
    theme,
    handleDownload,
    openDeleteDialog,
    formatDate,
    canDelete,
  );

  return (
    <Box>
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        name={fileToDelete?.fileName || "this file"}
      />

      <UploadDialogBox
        open={uploadDialogOpen}
        onClose={() => {
          setUploadDialogOpen(false);
          setUploadFileData({ file: null, description: "" });
          setUploadMode("file");
        }}
        onSubmit={handleUpload}
        uploadMode={uploadMode}
        setUploadMode={setUploadMode}
        uploadFileData={uploadFileData}
        onFileSelect={handleFileSelect}
        loading={loading}
      />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      <CustomDataGrid
        rows={files}
        columns={columns}
        loading={loading}
        addButtonLabel={canCreate ? "Add File" : undefined}
        onAddClick={canCreate ? () => setUploadDialogOpen(true) : undefined}
        emptyMessage="No files attached to this employee."
      />
    </Box>
  );
};

export default EmployeeFiles;
