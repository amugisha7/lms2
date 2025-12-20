import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const FormLabel = ({
  label,
  children,
  sx = {},
  variant = "body2",
  fontWeight = 600,
  editing,
  onlyVisibleInCreate = false,
  isEditMode = false,
  component,
  htmlFor,
  required,
  ...rest
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (onlyVisibleInCreate && isEditMode) {
    return null;
  }

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "auto" },
        flex: { xs: "unset", sm: 1 },
        display: "flex",
        alignItems: "center",
        mt: 2,
        mb: 1,
        ...sx,
      }}
    >
      <Typography
        variant={variant}
        sx={{
          fontSize: 12,
          fontWeight: fontWeight,
          color: "#ff9800;",
        }}
        component={component}
        htmlFor={htmlFor}
        aria-required={required}
      >
        {label || children}
      </Typography>
    </Box>
  );
};

export default FormLabel;
