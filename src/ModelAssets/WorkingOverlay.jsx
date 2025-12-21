import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function WorkingOverlay({ open, message = "Working..." }) {
  return (
    <Backdrop
      sx={(theme) => ({
        color: theme.palette.text.primary,
        zIndex: theme.zIndex.modal + 1,
      })}
      open={Boolean(open)}
    >
      <Stack spacing={2} alignItems="center">
        <CircularProgress color="inherit" />
        {message ? (
          <Typography
            variant="body1"
            sx={(theme) => ({
              color: theme.palette.text.primary,
              fontWeight: 500,
            })}
          >
            {message}
          </Typography>
        ) : null}
      </Stack>
    </Backdrop>
  );
}
