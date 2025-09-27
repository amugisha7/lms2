import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

export default function DeleteDialog({
  open,
  onClose,
  onConfirm,
  loading = false,
  error = "",
  name = "",
}) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : "#fff",
        },
      }}
    >
      <DialogContent
        sx={{
          p: { xs: 2, sm: 3 },
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.01)"
              : "#fafbfc",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: theme.palette.mode === "dark" ? "#fff" : "#171717",
          }}
        >
          Confirm Delete
        </Typography>
        <Typography sx={{ mb: 2, color: theme.palette.text.primary }}>
          Are you sure you want to delete{" "}
          <b style={{ color: theme.palette.error.main }}>{name}</b>?
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          pb: { xs: 2, sm: 3 },
          pt: 0,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.01)"
              : "#fafbfc",
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          //   color="primary"
          sx={{
            minWidth: 100,
            borderColor: theme.palette.mode === "dark" ? "#76B1D3" : "#1976d2",
            // color: theme.palette.mode === "dark" ? "#76B1D3" : "#1976d2",
            fontWeight: 500,
            mr: 1.5,
            // "&:hover": {
            //   borderColor:
            //     theme.palette.mode === "dark" ? "#4d96c7" : "#1565c0",
            //   backgroundColor: theme.palette.action.hover,
            // },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          sx={{
            minWidth: 100,
            fontWeight: 600,
            boxShadow: "none",
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(90deg, #db4f4a 60%, #af3f3b 100%)"
                : "linear-gradient(90deg, #db4f4a 60%, #e2726e 100%)",
            color: "#fff",
            "&:hover": {
              background: theme.palette.mode === "dark" ? "#af3f3b" : "#e2726e",
              boxShadow: "0 2px 8px rgba(219,79,74,0.15)",
            },
          }}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
