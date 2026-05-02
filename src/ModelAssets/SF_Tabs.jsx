import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

export default function SFTabs({
  tabs,
  activeKey,
  onChange,
  counts = {},
  ariaLabel = "Tabs",
}) {
  const theme = useTheme();
  const sf = theme.palette.sf;

  return (
    <Box
      sx={{
        mb: "18px",
        borderBottom: `1px solid ${sf.sf_borderLight}`,
        bgcolor: sf.sf_cardBg,
        overflowX: "auto",
        overflowY: "hidden",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": { height: 6 },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: sf.sf_borderMedium,
          borderRadius: 999,
        },
        "&::-webkit-scrollbar-track": {
          bgcolor: "transparent",
        },
      }}
    >
      <Box
        role="tablist"
        aria-label={ariaLabel}
        sx={{
          display: "flex",
          alignItems: "stretch",
          gap: { xs: 0.25, sm: 0.75 },
          minWidth: "max-content",
          px: { xs: 0.5, sm: 1 },
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeKey === tab.key;
          const count = counts[tab.key] ?? 0;

          return (
            <Box
              key={tab.key}
              component="button"
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.key)}
              sx={{
                cursor: "pointer",
                appearance: "none",
                border: "none",
                borderBottom: `3px solid ${isActive ? sf.sf_brandPrimary : "transparent"}`,
                bgcolor: isActive ? sf.sf_pageBg : "transparent",
                color: isActive ? sf.sf_textPrimary : sf.sf_textTertiary,
                px: { xs: 1.1, sm: 1.5 },
                py: 1.15,
                minHeight: 48,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.65,
                whiteSpace: "nowrap",
                fontSize: "0.86rem",
                fontWeight: isActive ? 700 : 500,
                lineHeight: 1,
                fontFamily: "inherit",
                transition:
                  "color 0.15s, background-color 0.15s, border-color 0.15s",
                "&:hover": {
                  bgcolor: isActive ? sf.sf_pageBg : sf.sf_rowHover,
                  color: isActive ? sf.sf_textPrimary : sf.sf_textSecondary,
                },
                "&:focus-visible": {
                  outline: `2px solid ${sf.sf_borderFocus}`,
                  outlineOffset: -2,
                },
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: "inherit",
                  fontWeight: "inherit",
                  color: "inherit",
                  lineHeight: 1,
                }}
              >
                {tab.label}
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontSize: "0.76rem",
                  fontWeight: 600,
                  color: isActive ? sf.sf_brandPrimary : sf.sf_textTertiary,
                  lineHeight: 1,
                }}
              >
                {count}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
