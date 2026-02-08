import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CloudUpload } from "@mui/icons-material";
import { UserContext } from "../../App";
import { useNotification } from "../../ModelAssets/NotificationContext";
import { uploadData as amplifyUploadData, getUrl } from "aws-amplify/storage";
import { updateInstitution } from "./helpers/updateInstitution";

const DocumentHeaderSettings = () => {
  const theme = useTheme();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { showNotification } = useNotification();

  const maxFileSize = 2 * 1024 * 1024; // 2MB

  const uploadingRef = useRef(false);
  const [headerImage, setHeaderImage] = useState(null);
  const [headerImageSignedUrl, setHeaderImageSignedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFileData, setUploadFileData] = useState({
    file: null,
    preview: null,
  });
  const [initializedLoaded, setInitializedLoaded] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if user is admin
  const isAdmin =
    userDetails?.userPermissions?.includes("admin") ||
    userDetails?.userType?.toLowerCase() === "admin";

  // Initialize header image
  useEffect(() => {
    const fetchHeaderImage = async () => {
      if (userDetails?.institution) {
        // Parse customDocumentHeader if it's a string
        let documentHeader = userDetails.institution.customDocumentHeader;
        if (typeof documentHeader === "string") {
          try {
            documentHeader = JSON.parse(documentHeader);
          } catch (e) {
            console.error("Failed to parse customDocumentHeader", e);
            documentHeader = {};
          }
        }

        const headerImageUrl = documentHeader?.headerImageUrl || null;
        setHeaderImage(headerImageUrl);

        // Fetch signed URL if image exists
        if (headerImageUrl) {
          try {
            const signedURL = await getUrl({
              path: `public/${headerImageUrl}`,
              options: {
                expiresIn: 3600, // 1 hour
              },
            });
            setHeaderImageSignedUrl(signedURL.url);
          } catch (error) {
            console.error("Error fetching header image URL:", error);
            setHeaderImageSignedUrl(null);
          }
        } else {
          setHeaderImageSignedUrl(null);
        }

        setInitializedLoaded(true);
      }
    };

    fetchHeaderImage();
  }, [userDetails?.institution]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadFileData({
          file,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (uploadingRef.current) return;

    if (!uploadFileData.file) {
      showNotification("Please select a file", "red");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(uploadFileData.file.type)) {
      showNotification(
        "File type not allowed. Please select an image file.",
        "red",
      );
      return;
    }

    if (uploadFileData.file.size > maxFileSize) {
      showNotification("File size exceeds 2MB limit.", "red");
      return;
    }

    uploadingRef.current = true;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const timestamp = new Date().getTime();
      const fileName = `institution-header-image/${userDetails.institutionUsersId}-${timestamp}-${uploadFileData.file.name}`;
      const path = `public/${fileName}`;

      await amplifyUploadData({
        path,
        data: uploadFileData.file,
        options: {
          contentType: uploadFileData.file.type,
        },
      }).result;

      // Get the S3 URL for the uploaded image
      const signedURL = await getUrl({
        path,
        options: {
          expiresIn: 3600, // 1 hour
        },
      });

      let currentHeader = userDetails.institution.customDocumentHeader || {};
      if (typeof currentHeader === "string") {
        try {
          currentHeader = JSON.parse(currentHeader);
        } catch (e) {
          console.error("Failed to parse customDocumentHeader", e);
          currentHeader = {};
        }
      }

      const newHeader = {
        ...currentHeader,
        headerImageUrl: fileName,
      };

      const updateData = {
        id: userDetails.institutionUsersId,
        customDocumentHeader: JSON.stringify(newHeader),
      };

      await updateInstitution(updateData);

      setHeaderImage(fileName);
      setHeaderImageSignedUrl(signedURL.url);
      setUserDetails({
        ...userDetails,
        institution: {
          ...userDetails.institution,
          customDocumentHeader: newHeader,
        },
      });

      setSuccess("Header image uploaded successfully!");
      showNotification("Header image uploaded successfully!", "green");
      setUploadDialogOpen(false);
      setUploadFileData({ file: null, preview: null });
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMsg =
        error.message || "Error uploading file. Please try again.";
      setError(errorMsg);
      showNotification(errorMsg, "red");
    } finally {
      setLoading(false);
      uploadingRef.current = false;
    }
  };

  const handlePreview = async () => {
    if (!headerImage) return;
    try {
      setLoading(true);
      const signedURL = await getUrl({
        path: `public/${headerImage}`,
        options: {
          expiresIn: 300, // 5 minutes
        },
      });
      window.open(signedURL.url, "_blank");
    } catch (error) {
      console.error("Error previewing image:", error);
      showNotification("Error previewing image. Please try again.", "red");
    } finally {
      setLoading(false);
    }
  };

  if (!initializedLoaded) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Paper sx={{ p: 3, maxWidth: 900, mx: "auto", mt: 2 }}>
        <Typography
          variant="body1"
          sx={{ textAlign: "center", color: "text.secondary" }}
        >
          Only administrators can manage document header settings.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      {/* Header with Upload Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          mt: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.text.primary,
            fontFamily: theme.typography.h6.fontFamily,
          }}
        >
          Document Header Image
        </Typography>
        <Button
          variant="outlined"
          startIcon={
            <CloudUpload sx={{ color: theme.palette.blueText.main }} />
          }
          onClick={() => setUploadDialogOpen(true)}
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
          Upload Image
        </Button>
      </Box>

      {/* Current Image Preview */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : headerImage ? (
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            Current Header Image
          </Typography>
          <Box
            sx={{
              mb: 2,
              p: 2,
              backgroundColor: theme.palette.background.default,
              borderRadius: "8px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
              maxHeight: "300px",
              overflow: "auto",
            }}
          >
            {headerImageSignedUrl ? (
              <img
                src={headerImageSignedUrl}
                alt="Header preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Loading image...
              </Typography>
            )}
          </Box>
          <Button
            // variant="outlined"
            onClick={handlePreview}
            disabled={loading}
            // sx={{ color: theme.palette.blueText.main }}
          >
            View Full Image
          </Button>
        </Paper>
      ) : (
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            No header image uploaded yet
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
            Upload an image to be used as the header for A4 documents
          </Typography>
        </Paper>
      )}

      {/* Information */}
      <Paper
        sx={{ p: 3, mt: 3, backgroundColor: theme.palette.background.paper }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Image Requirements
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          • Recommended size: 2480 x 350 px
          <br />
          • Supported formats: JPG, PNG
          <br />
          • Maximum file size: 2MB
          <br />
          • For best results, use a wide, short image with a transparent or
          white background
          <br />• This image will appear at the top of exported documents and
          will not be scaled
        </Typography>
      </Paper>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Document Header Image</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box>
            <Button
              component="label"
              variant="outlined"
              sx={{
                width: "100%",
                py: 3,
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
              <Box sx={{ textAlign: "center" }}>
                <CloudUpload sx={{ fontSize: 40, mb: 1, color: "inherit" }} />
                <Typography variant="body2">
                  Click to select file or drag and drop
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  JPG, PNG (Max 2MB)
                </Typography>
              </Box>
              <input
                hidden
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileSelect}
              />
            </Button>

            {uploadFileData.preview && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 2, color: "text.secondary" }}
                >
                  Preview
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: theme.palette.background.default,
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "200px",
                    maxHeight: "300px",
                    overflow: "auto",
                  }}
                >
                  <img
                    src={uploadFileData.preview}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setUploadDialogOpen(false);
              setUploadFileData({ file: null, preview: null });
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            color="primary"
            disabled={!uploadFileData.file || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentHeaderSettings;
