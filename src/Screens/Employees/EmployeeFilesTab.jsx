import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  AttachFile as FileIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Description as DocIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

// Mock file data structure - in a real app, this would come from your backend/S3
const sampleFiles = [
  {
    id: "1",
    name: "Resume.pdf",
    type: "application/pdf",
    size: 245632,
    uploadDate: "2024-01-15",
    category: "HR Documents",
    s3Key: "employees/123/resume.pdf",
  },
  {
    id: "2",
    name: "ID_Copy.jpg",
    type: "image/jpeg",
    size: 1024000,
    uploadDate: "2024-01-10",
    category: "Identification",
    s3Key: "employees/123/id_copy.jpg",
  },
];

const fileCategories = [
  "HR Documents",
  "Identification",
  "Contracts",
  "Certificates",
  "Performance Reviews",
  "Training Materials",
  "Other",
];

const EmployeeFilesTab = ({ employee, isEditing, onSave, loading }) => {
  const [files, setFiles] = useState([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState("HR Documents");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real application, you would fetch files related to this employee
    // For now, we'll use sample data
    setFiles(sampleFiles);
  }, [employee.id]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      // In a real application, you would:
      // 1. Upload file to S3
      // 2. Create a Document record in your database
      // 3. Associate it with the employee

      // For demo purposes, we'll simulate the upload
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newFile = {
        id: Date.now().toString(),
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        uploadDate: new Date().toISOString().split("T")[0],
        category: uploadCategory,
        description: uploadDescription,
        s3Key: `employees/${employee.id}/${selectedFile.name}`,
      };

      setFiles((prev) => [newFile, ...prev]);
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setUploadDescription("");
      setUploadCategory("HR Documents");
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      // In a real application, you would delete from S3 and database
      setFiles((prev) => prev.filter((file) => file.id !== fileId));
    } catch (err) {
      console.error("Error deleting file:", err);
      setError("Failed to delete file. Please try again.");
    }
  };

  const handleDownloadFile = (file) => {
    // In a real application, you would generate a signed URL from S3
    console.log("Downloading file:", file.name);
    // Simulate download
    const link = document.createElement("a");
    link.href = "#";
    link.download = file.name;
    link.click();
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon color="primary" />;
    } else if (fileType === "application/pdf") {
      return <PdfIcon color="error" />;
    } else {
      return <DocIcon color="action" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getCategoryColor = (category) => {
    const colors = {
      "HR Documents": "primary",
      Identification: "secondary",
      Contracts: "success",
      Certificates: "info",
      "Performance Reviews": "warning",
      "Training Materials": "default",
      Other: "default",
    };
    return colors[category] || "default";
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" color="primary">
          Employee Files
        </Typography>
        {isEditing && (
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => setUploadDialogOpen(true)}
            size="small"
          >
            Upload File
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {files.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <FileIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No files uploaded
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Upload documents, certificates, and other files related to this
              employee.
            </Typography>
            {isEditing && (
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => setUploadDialogOpen(true)}
              >
                Upload First File
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <List>
              {files.map((file, index) => (
                <React.Fragment key={file.id}>
                  <ListItem sx={{ px: 3, py: 2 }}>
                    <ListItemIcon>{getFileIcon(file.type)}</ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography variant="subtitle2">
                            {file.name}
                          </Typography>
                          <Chip
                            label={file.category}
                            size="small"
                            color={getCategoryColor(file.category)}
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="caption" color="textSecondary">
                            {formatFileSize(file.size)} • Uploaded{" "}
                            {file.uploadDate}
                          </Typography>
                          {file.description && (
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {file.description}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadFile(file)}
                          title="Download"
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadFile(file)}
                          title="View"
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        {isEditing && (
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteFile(file.id)}
                            title="Delete"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < files.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* File Statistics */}
      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Card variant="outlined">
            <CardContent sx={{ py: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="textSecondary">
                    Total Files
                  </Typography>
                  <Typography variant="h6">{files.length}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="textSecondary">
                    Total Size
                  </Typography>
                  <Typography variant="h6">
                    {formatFileSize(
                      files.reduce((sum, file) => sum + file.size, 0)
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="textSecondary">
                    Last Upload
                  </Typography>
                  <Typography variant="h6">
                    {files.length > 0 ? files[0].uploadDate : "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => !uploading && setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  fullWidth
                  sx={{ py: 2 }}
                >
                  Choose File
                  <input
                    type="file"
                    hidden
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xlsx,.xls"
                  />
                </Button>
                {selectedFile && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, textAlign: "center" }}
                  >
                    Selected: {selectedFile.name} (
                    {formatFileSize(selectedFile.size)})
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  SelectProps={{ native: true }}
                >
                  {fileCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description (Optional)"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Brief description of the file..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setUploadDialogOpen(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!selectedFile || uploading}
            startIcon={
              uploading ? <CircularProgress size={20} /> : <UploadIcon />
            }
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeFilesTab;
