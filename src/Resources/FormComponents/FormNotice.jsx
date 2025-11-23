import React from "react";
import { Typography, Box } from "@mui/material";

const FormNotice = ({
  message,
  span,
  onlyVisibleInCreate = false,
  isEditMode = false,
}) => {
  if (onlyVisibleInCreate && isEditMode) {
    return null;
  }

  return (
    <Box sx={{ width: "100%", mt: 1, mb: 1 }}>
      <Typography variant="body2" color="textSecondary">
        {message}
      </Typography>
    </Box>
  );
};

export default FormNotice;
