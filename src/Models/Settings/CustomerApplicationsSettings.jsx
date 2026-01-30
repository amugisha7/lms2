import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Button,
  useTheme,
  Alert,
  CircularProgress,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import { UserContext } from "../../App";
import QRCode from "qrcode";

const CustomerApplicationsSettings = () => {
  const theme = useTheme();
  const { userDetails } = useContext(UserContext);
  const [applicationUrl, setApplicationUrl] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [qrCopySuccess, setQrCopySuccess] = useState(false);

  const institutionId = userDetails?.institution?.id;

  // Initialize URL, QR code, and load settings
  useEffect(() => {
    if (!institutionId) {
      setLoading(false);
      return;
    }

    const initializeData = async () => {
      const url = `https://app.loantabs.com/client/${institutionId}`;
      setApplicationUrl(url);

      // Generate QR code
      try {
        const dataUrl = await QRCode.toDataURL(url, {
          width: 1200,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
        setQrCodeDataUrl(dataUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }

      setLoading(false);
    };

    initializeData();
  }, [institutionId]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(applicationUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const handleCopyQRCode = async () => {
    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeDataUrl);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      setQrCopySuccess(true);
      setTimeout(() => setQrCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy QR code:", error);
      alert(
        "Failed to copy QR code to clipboard. Please try downloading it instead.",
      );
    }
  };

  const handleDownloadQRCode = () => {
    const link = document.createElement("a");
    link.href = qrCodeDataUrl;
    link.download = `loantabs-application-${institutionId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!institutionId) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Unable to load institution details. Please try again later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: theme.palette.text.primary,
        }}
      >
        Customer Portal Link
      </Typography>
      <Typography
        sx={{
          mb: 3,
        }}
      >
        Customers can apply for loans, view loan statements, and upload their
        details.
      </Typography>

      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 500,
            color: theme.palette.text.primary,
          }}
        >
          Application URL
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            color: theme.palette.text.secondary,
          }}
        >
          Share this URL with your customers to allow them to access your
          portal.
        </Typography>

        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
          <TextField
            fullWidth
            value={applicationUrl}
            InputProps={{
              readOnly: true,
            }}
            sx={{
              "& .MuiInputBase-root": {
                fontFamily: "monospace",
                fontSize: "0.9rem",
              },
            }}
          />
          <IconButton
            onClick={handleCopyUrl}
            color="primary"
            sx={{
              mt: 0.5,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ContentCopyIcon />
          </IconButton>
        </Box>

        {copySuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            URL copied to clipboard!
          </Alert>
        )}
      </Paper>

      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 500,
            color: theme.palette.text.primary,
          }}
        >
          QR Code
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: theme.palette.text.secondary,
          }}
        >
          Scan this QR code or share it with customers for easy access to your
          portal.
        </Typography>

        {qrCodeDataUrl ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 2,
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: theme.shadows[2],
              }}
            >
              <img
                src={qrCodeDataUrl}
                alt="Application QR Code"
                style={{
                  display: "block",
                  width: "300px",
                  height: "300px",
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={
                  <ContentCopyIcon sx={{ color: "white", fontSize: "small" }} />
                }
                onClick={handleCopyQRCode}
                sx={{
                  textTransform: "none",
                }}
              >
                Copy QR Code
              </Button>
              <Button
                variant="contained"
                startIcon={
                  <DownloadIcon sx={{ color: "white", fontSize: "small" }} />
                }
                onClick={handleDownloadQRCode}
                sx={{
                  textTransform: "none",
                }}
              >
                Download Image
              </Button>
            </Box>

            {qrCopySuccess && (
              <Alert severity="success" sx={{ mt: 1 }}>
                QR code copied to clipboard!
              </Alert>
            )}
          </Box>
        ) : (
          <Alert severity="warning">
            Unable to generate QR code. Please try refreshing the page.
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default CustomerApplicationsSettings;
