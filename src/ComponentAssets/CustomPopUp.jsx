import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ClickableText from "./ClickableText";
import { useTheme } from "@mui/material/styles";

export default function CustomPopUp({
  open,
  onClose,
  title,
  children,
  onEdit,
  onDelete,
  showEdit = true,
  showDelete = true,
  maxWidth = "md",
  fullWidth = true,
  editMode = false,
}) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #e0e0e0",
          position: "relative", // for absolute positioning of close button on mobile
          flexWrap: { xs: "wrap", sm: "nowrap" }, // allow wrapping on mobile
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            textTransform: "none",
            width: { xs: "90%", sm: "auto" }, // 90% width on mobile
            pr: { xs: 2, sm: 0 },
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            order: { xs: 1, sm: 0 }, // move to next line on mobile
            width: { xs: "100%", sm: "auto" }, // full width on mobile
            mt: { xs: 1, sm: 0 }, // margin top on mobile
          }}
        >
          {showDelete && onDelete && (
            <ClickableText
              onClick={onDelete}
              sx={{
                mr: 2,
                fontSize: "0.9rem",
                color: "error.main",
                "&:hover": {
                  color: "error.dark",
                },
              }}
            >
              Delete
            </ClickableText>
          )}
          {showEdit && onEdit && (
            <ClickableText onClick={onEdit} sx={{ mr: 2, fontSize: "0.9rem" }}>
              Edit
            </ClickableText>
          )}
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              position: { xs: "absolute", sm: "static" },
              top: { xs: 16, sm: "auto" },
              right: { xs: 16, sm: "auto" },
              ml: { xs: 0, sm: "60px" }, // add left margin except on mobile
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <DialogContent
        sx={{
          p: 0,
          "& > *": {
            p: 3,
            display: "flex",
            flexDirection: "column",
            border: editMode
              ? `2px solid ${
                  theme.palette.mode === "dark" ? "#76B1D3" : "#1976d2"
                }`
              : `1px solid ${
                  theme.palette.mode === "dark" ? "#525252" : "#e0e0e0"
                }`,
            borderRadius: 1,
            backgroundColor: editMode
              ? theme.palette.mode === "dark"
                ? "rgba(118, 177, 211, 0.08)"
                : "#f8f9ff"
              : "transparent",
            transition: "all 0.3s ease",
            position: "relative",
            "&::before": editMode
              ? {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(90deg, #76B1D3, #4d96c7)"
                      : "linear-gradient(90deg, #1976d2, #42a5f5)",
                  borderRadius: "4px 4px 0 0",
                }
              : {},
          },
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
