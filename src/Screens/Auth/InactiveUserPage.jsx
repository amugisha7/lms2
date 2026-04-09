import React, { useContext } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { UserContext } from "../../App";

const STATUS_CONTENT = {
  pending: {
    label: "Pending",
    title: "Your access is not active yet",
    message:
      "Your institution administrator still needs to activate your account before you can use this workspace.",
  },
  inactive: {
    label: "Inactive",
    title: "Your access has been restricted",
    message:
      "Your institution administrator has restricted access to this workspace for your account.",
  },
  suspended: {
    label: "Suspended",
    title: "Your access has been restricted",
    message:
      "Your institution administrator has suspended this account and application features are currently unavailable.",
  },
};

const DEFAULT_CONTENT = {
  label: "Restricted",
  title: "Your access is restricted",
  message:
    "This account is not active, so application features are currently unavailable.",
};

export default function InactiveUserPage() {
  const theme = useTheme();
  const { userDetails, signOut } = useContext(UserContext);

  const normalizedStatus = (userDetails?.status || "").toLowerCase();
  const statusContent = STATUS_CONTENT[normalizedStatus] || DEFAULT_CONTENT;
  const displayName = [
    userDetails?.firstName,
    userDetails?.middleName,
    userDetails?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        background: `linear-gradient(180deg, ${theme.palette.primary.mainbgd} 0%, ${theme.palette.background.default} 100%)`,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 720,
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 24px 70px rgba(15, 23, 42, 0.10)",
        }}
      >
        <Stack spacing={3}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "18px",
                display: "grid",
                placeItems: "center",
                bgcolor: theme.palette.error.light,
                color: theme.palette.error.dark,
              }}
            >
              <LockOutlinedIcon />
            </Box>
            <Box>
              <Chip
                label={statusContent.label}
                color="error"
                size="small"
                sx={{ mb: 1, fontWeight: 700 }}
              />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {statusContent.title}
              </Typography>
            </Box>
          </Stack>

          <Typography variant="body1" color="text.secondary">
            {statusContent.message} Please contact your institution admin if you
            need this access restored.
          </Typography>

          <Alert severity="error" variant="outlined">
            Features in this application are unavailable until your account is
            marked active by the institution admin.
          </Alert>

          <Box
            sx={{
              p: 2.5,
              borderRadius: 3,
              //   bgcolor: theme.palette.action.hover,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Signed in as
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {displayName || userDetails?.email || "Current user"}
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <Typography variant="body2" color="text.secondary">
              If this status looks incorrect, contact your institution admin.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LogoutOutlinedIcon />}
              onClick={() => signOut?.()}
            >
              Sign out
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
