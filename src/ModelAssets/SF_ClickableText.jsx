import React from "react";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

/**
 * SF_ClickableText
 * A small underlined link-style text that follows the sf theme.
 *
 * Props:
 *   children  – label text
 *   onClick   – optional click handler
 *   sx        – optional additional MUI sx overrides
 */
export default function SF_ClickableText({ children, onClick, sx }) {
  const theme = useTheme();
  const sf = theme.palette.sf;

  return (
    <Typography
      onClick={onClick}
      sx={{
        fontSize: "0.7rem",
        color: sf.sf_textLink,
        cursor: "pointer",
        mt: 0.2,
        textDecoration: "underline",
        "&:hover": { color: sf.sf_textLinkHover },
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}
