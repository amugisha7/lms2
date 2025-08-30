import React from "react";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

export default function ClickableText({
  children,
  onClick,
  sx = {},
  ...props
}) {
  const theme = useTheme();
  return (
    <Typography
      component="span"
      sx={{
        display: "inline-block", // Add this to enable transform
        cursor: "pointer",
        color: theme.palette.blueText?.main || "primary.main",
        // fontWeight: "bold",
        fontSize: "inherit",
        textAlign: "left",
        textTransform: "none",
        textDecoration: "underline",
        transition: "transform 0.15s",
        "&:hover": {
          transform: "translateY(-2px)",
        },
        ...sx,
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </Typography>
  );
}
