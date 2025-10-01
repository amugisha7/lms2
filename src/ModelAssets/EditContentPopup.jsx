import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";

export default function EditContentPopup({
  open,
  onClose,
  title,
  children,
  maxWidth = "lg",
  fullWidth = true,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      disableScrollLock
      sx={{
        "& .MuiDialog-paper": {
          minHeight: "auto",
          maxHeight: "90vh",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: `1px solid ${
            theme.palette.mode === "dark" ? "#525252" : "#e0e0e0"
          }`,
          position: "sticky",
          top: 0,
          backgroundColor: theme.palette.background.paper,
          zIndex: 1,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            textTransform: "none",
            color: theme.palette.text.primary,
          }}
        >
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          color="inherit"
          sx={{
            "& svg": {
              color: colors.grey[200],
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent
        sx={{
          p: 0,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.mode === "dark" ? "#555" : "#ccc",
            borderRadius: "3px",
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {children}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
