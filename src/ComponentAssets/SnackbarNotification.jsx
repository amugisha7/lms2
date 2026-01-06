import React, { useEffect, useState } from "react";
import {
  Snackbar,
  Alert,
  IconButton,
  Link,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const colorMap = {
  green: "success",
  blue: "info",
  red: "error",
};

const SnackbarNotification = ({
  message,
  color = "blue",
  link,
  clearSnackbar,
}) => {
  const [open, setOpen] = useState(!!message);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (message) {
      setOpen(true);
      const timer = setTimeout(() => {
        setOpen(false);
        clearSnackbar();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [message, clearSnackbar]);

  const handleClose = (_, reason) => {
    if (reason !== "clickaway") {
      setOpen(false);
      clearSnackbar();
    }
  };

  if (!message) return null;

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: isMobile ? "center" : "right",
      }}
    >
      <Alert
        severity={colorMap[color] || "info"}
        action={
          <IconButton
            color="inherit"
            size="small"
            onClick={() => {
              setOpen(false);
              clearSnackbar();
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        sx={{ width: "100%" }}
      >
        {message}{" "}
        {link && (
          <Link
            href={link}
            target="_blank"
            rel="noopener"
            sx={{ color: "inherit", textDecoration: "underline", ml: 1 }}
          >
            (Learn more)
          </Link>
        )}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarNotification;
