import React from "react";
import { Box, Link, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const FormLinkText = ({
  icon: Icon,
  linkText,
  linkUrl,
  sx = {},
  variant = "body2",
  external = false,
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
        gap: 0.5,

        ...sx,
      }}
    >
      <Link
        href={linkUrl}
        target={external ? "_blank" : "_self"}
        rel={external ? "noopener noreferrer" : ""}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.3,
          fontSize: 12,
          fontWeight: 400,
          color: colors.blueText.main,
          transition: "color 0.2s ease-in-out",
          "&:hover": {
            cursor: "pointer",
            color: colors.blueText.light,
          },
          textDecoration: "underline",
        }}
        {...props}
      >
        {Icon && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ fontSize: 12 }} />
          </Box>
        )}
        {linkText}
      </Link>
    </Box>
  );
};

export default FormLinkText;
