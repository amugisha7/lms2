import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ClickableText from "./ClickableText";

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
}) {
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
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, textTransform: "none" }}
        >
          {title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {showEdit && onEdit && (
            <ClickableText onClick={onEdit} sx={{ mr: 2, fontSize: "0.9rem" }}>
              Edit
            </ClickableText>
          )}
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
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <DialogContent sx={{ p: 0 }}>{children}</DialogContent>
    </Dialog>
  );
}
