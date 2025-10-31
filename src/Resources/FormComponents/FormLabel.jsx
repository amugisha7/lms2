import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const FormLabel = ({
  label,
  sx = {},
  variant = "body2",
  fontWeight = 600,
  ...props
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
        {...props}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default FormLabel;
