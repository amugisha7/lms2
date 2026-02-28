import { createContext, useState, useMemo, useCallback } from "react";
import { createTheme } from "@mui/material/styles";

// ─── Salesforce Lightning Design System (SLDS) tokens ───
// Prefixed with "sf_" for easy identification. Both light & dark variants.
export const sfTokens = (mode) => {
  const isDark = mode === "dark";
  return {
    // ── Brand colors ──
    sf_brandPrimary:    isDark ? "#1B96FF" : "#0176D3",  // primary action / links
    sf_brandDark:       isDark ? "#0D47A1" : "#032D60",  // page header bg
    sf_brandLight:      isDark ? "#1B96FF" : "#1B96FF",  // highlights
    sf_brandHover:      isDark ? "#0B5CAB" : "#014486",  // hover on brand items

    // ── Backgrounds ──
    sf_pageBg:          isDark ? "#1B1B1B" : "#F3F3F3",  // page / canvas
    sf_cardBg:          isDark ? "#242424" : "#FFFFFF",  // card / paper
    sf_headerBg:        isDark ? "#2A2A2A" : "#FAFAF9",  // table header row
    sf_rowHover:        isDark ? "#333333" : "#F3F2F2",  // row hover
    sf_rowStripeBg:     isDark ? "#2E2E2E" : "#F8F8F8",  // alternating stripe
    sf_selectedRow:     isDark ? "#0D3B66" : "#EBF5FE",  // selected row

    // ── Text ──
    sf_textPrimary:     isDark ? "#E5E5E5" : "#181818",  // heading / primary text
    sf_textSecondary:   isDark ? "#B0B0B0" : "#444444",  // secondary / labels
    sf_textTertiary:    isDark ? "#8C8C8C" : "#706E6B",  // meta / captions
    sf_textLink:        isDark ? "#1B96FF" : "#0176D3",  // links & clickable text
    sf_textLinkHover:   isDark ? "#45B0FF" : "#014486",  // link hover
    sf_textOnBrand:     "#FFFFFF",                        // text on brand bg
    sf_textInverse:     isDark ? "#181818" : "#FFFFFF",  // inverted text

    // ── Borders ──
    sf_borderLight:     isDark ? "#3C3C3C" : "#E5E5E5",  // subtle border
    sf_borderMedium:    isDark ? "#4A4A4A" : "#C9C9C9",  // standard border
    sf_borderFocus:     isDark ? "#1B96FF" : "#0176D3",  // focus ring

    // ── Status / Semantic ──
    sf_success:         isDark ? "#45C65A" : "#2E844A",
    sf_successBg:       isDark ? "#1C3829" : "#EBF7E6",
    sf_error:           isDark ? "#F26B6B" : "#BA0517",
    sf_errorBg:         isDark ? "#3D1F1F" : "#FEF1EE",
    sf_warning:         isDark ? "#FE9339" : "#DD7A01",
    sf_warningBg:       isDark ? "#3D2E1A" : "#FFF8E6",
    sf_info:            isDark ? "#1B96FF" : "#0176D3",
    sf_infoBg:          isDark ? "#1A2E45" : "#EBF5FE",

    // ── Shadows ──
    sf_shadowSm:        isDark
      ? "0 2px 4px rgba(0,0,0,0.50)"
      : "0 2px 4px rgba(0,0,0,0.10)",
    sf_shadowMd:        isDark
      ? "0 4px 12px rgba(0,0,0,0.55)"
      : "0 4px 12px rgba(0,0,0,0.10)",
    sf_shadowLg:        isDark
      ? "0 8px 24px rgba(0,0,0,0.60)"
      : "0 8px 24px rgba(0,0,0,0.12)",

    // ── Radii ──
    sf_radiusSm:   "4px",
    sf_radiusMd:   "8px",
    sf_radiusLg:   "12px",
    sf_radiusPill:  "999px",

    // ── Spacing helpers (px) ──
    sf_spacingXs:  "4px",
    sf_spacingSm:  "8px",
    sf_spacingMd:  "12px",
    sf_spacingLg:  "16px",
    sf_spacingXl:  "24px",
    sf_spacingXxl: "32px",

    // ── Table-specific ──
    sf_tableHeaderBg:   isDark ? "#2A2A2A" : "#FAFAF9",
    sf_tableHeaderText: isDark ? "#B0B0B0" : "#444444",
    sf_tableBorder:     isDark ? "#3C3C3C" : "#E5E5E5",
    sf_tableCellPadX:   "16px",
    sf_tableCellPadY:   "8px",

    // ── Pill / Badge ──
    sf_pillSuccessBg:   isDark ? "#1C3829" : "#EBF7E6",
    sf_pillSuccessText: isDark ? "#45C65A" : "#2E844A",
    sf_pillErrorBg:     isDark ? "#3D1F1F" : "#FEF1EE",
    sf_pillErrorText:   isDark ? "#F26B6B" : "#BA0517",
    sf_pillWarningBg:   isDark ? "#3D2E1A" : "#FFF8E6",
    sf_pillWarningText: isDark ? "#FE9339" : "#DD7A01",
    sf_pillInfoBg:      isDark ? "#1A2E45" : "#EBF5FE",
    sf_pillInfoText:    isDark ? "#1B96FF" : "#0176D3",
    sf_pillNeutralBg:   isDark ? "#3C3C3C" : "#ECEBEA",
    sf_pillNeutralText: isDark ? "#B0B0B0" : "#706E6B",

    // ── Action button / chip ──
    sf_actionBg:        isDark ? "#1A2E45" : "#EBF5FE",
    sf_actionText:      isDark ? "#1B96FF" : "#0176D3",
    sf_actionHoverBg:   isDark ? "#0D3B66" : "#D8EDFE",

    // ── Progress bar ──
    sf_progressTrack:   isDark ? "#3C3C3C" : "#E5E5E5",
    sf_progressFill:    isDark ? "#1B96FF" : "#0176D3",
    sf_progressSuccess: isDark ? "#45C65A" : "#2E844A",

    // ── KPI / stat cards ──
    sf_kpiCardBg:       isDark ? "#2A2A2A" : "#FFFFFF",
    sf_kpiIconBg:       isDark ? "#1A2E45" : "#EBF5FE",
    sf_kpiIconColor:    isDark ? "#1B96FF" : "#0176D3",

    // ── Search input ──
    sf_searchBg:        isDark ? "#2E2E2E" : "#FFFFFF",
    sf_searchBorder:    isDark ? "#4A4A4A" : "#C9C9C9",
    sf_searchFocusBorder: isDark ? "#1B96FF" : "#0176D3",
    sf_searchPlaceholder: isDark ? "#8C8C8C" : "#706E6B",

    // ── Tab / filter pill ──
    sf_tabActiveBg:     isDark ? "#1B96FF" : "#0176D3",
    sf_tabActiveText:   "#FFFFFF",
    sf_tabInactiveBg:   isDark ? "#2E2E2E" : "#ECEBEA",
    sf_tabInactiveText: isDark ? "#B0B0B0" : "#706E6B",
    sf_tabHoverBg:      isDark ? "#3C3C3C" : "#E5E5E5",

    // ── Footer ──
    sf_footerBg:        isDark ? "#2A2A2A" : "#FAFAF9",
    sf_footerText:      isDark ? "#8C8C8C" : "#706E6B",
  };
};

// Enhanced color design tokens with consistent structure
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        
      white: {
          100: "#282828",
        },
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#080b12",
          900: "#040509",
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1F2A40",
          500: "#141b2d",
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
        greenAccent: {
          100: "#dbf5ee",
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd",
          500: "#4cceac",
          600: "#3da58a",
          700: "#2e7c67",
          800: "#1e5245",
          900: "#0f2922",
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#db4f4a",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        orangeAccent: {
          100: "#fef5e7",
          200: "#fdebd0",
          300: "#fce1b8",
          400: "#fbd7a1",
          500: "#facd89",
          600: "#f9c372",
          700: "#f8b95a",
          800: "#f7af43",
          900: "#ED9100",
        },
        blueAccent: {
          100: "#e6f0f7",
          200: "#cce1ef",
          300: "#b3d2e7",
          400: "#99c3df",
          500: "#80b4d7",
          600: "#66a5cf",
          700: "#4d96c7",
          800: "#3387bf",
          900: "#043F69",
        },
        blueText: {
          main: "#7CC4FE",
          light: "#A3D8FF", // subtle lighter blue for hover
        },
      }
    : {
        white: {
          100: "#ffffff", // manually changed
        },
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        primary: {
          100: "#040509",
          200: "#080b12",
          300: "#0c101b",
          400: "#f2f0f0", // manually changed
          500: "#141b2d",
          600: "#1F2A40",
          700: "#727681",
          800: "#a1a4ab",
          900: "#d0d1d5",
        },
        greenAccent: {
          100: "#0f2922",
          200: "#1e5245",
          300: "#2e7c67",
          400: "#3da58a",
          500: "#4cceac",
          600: "#70d8bd",
          700: "#94e2cd",
          800: "#b7ebde",
          900: "#dbf5ee",
        },
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#db4f4a",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
        orangeAccent: {
          100: "#ED9100",
          200: "#f7af43",
          300: "#f8b95a",
          400: "#f9c372",
          500: "#facd89",
          600: "#fbd7a1",
          700: "#fce1b8",
          800: "#fdebd0",
          900: "#fef5e7",
        },
        blueAccent: {
          100: "#043F69",
          200: "#3387bf",
          300: "#4d96c7",
          400: "#66a5cf",
          500: "#80b4d7",
          600: "#99c3df",
          700: "#b3d2e7",
          800: "#cce1ef",
          900: "#e6f0f7",
        },
        blueText: {
          main: "#014486",
          light: "#1976d2", // subtle lighter blue for hover
        },
      }),
});

// Enhanced MUI theme settings with modern responsive design
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  const sf = sfTokens(mode);
  const isDark = mode === "dark";
  return {
    palette: {
      mode,
      // Expose all sf_ tokens via theme.palette.sf.*
      sf,
      primary: {
        main: isDark ? colors.primary[500] : colors.primary[100],
        light: isDark ? colors.primary[400] : colors.primary[200],
        dark: isDark ? colors.primary[600] : colors.primary[300],
        contrastText: isDark ? "#fff" : "#171717",
        topbar: isDark ? 'black' : 'white',
        mainbgd: isDark ? '#212121' : '#FFFfff',
        mainbox: isDark ? '#1B1B1B' : 'white',
        gridBottomBorder: isDark? 'black' : 'grey'
      },
      secondary: {
        main: colors.greenAccent[500],
        light: colors.greenAccent[400],
        dark: colors.greenAccent[600],
        contrastText: isDark ? colors.grey[100] : colors.grey[900],
      },
      error: {
        main: colors.redAccent[500],
        light: colors.redAccent[400],
        dark: colors.redAccent[600],
        contrastText: colors.grey[100],
      },
      warning: {
        main: colors.blueAccent[500],
        light: colors.blueAccent[400],
        dark: colors.blueAccent[600],
        contrastText: colors.grey[100],
      },
      info: {
        main: colors.blueAccent[500],
        light: colors.blueAccent[400],
        dark: colors.blueAccent[600],
        contrastText: colors.grey[100],
      },
      success: {
        main: colors.greenAccent[500],
        light: colors.greenAccent[400],
        dark: colors.greenAccent[600],
        contrastText: colors.grey[100],
      },
      neutral: {
        dark: colors.grey[700],
        main: colors.grey[500],
        light: colors.grey[100],
      },
      background: {
        default: isDark ? "#333333" : "#ffffff", // <-- fixed
        paper: isDark ? colors.primary[400] : "#ffffff",
        surface: isDark ? colors.primary[600] : colors.grey[100],
      },
      text: {
        primary: isDark ? "#e8e6e3" : "#393a3d",     // <-- force text color
        secondary: isDark ? colors.grey[300] : colors.grey[600],
        disabled: isDark ? colors.grey[500] : colors.grey[400],
      },
      action: {
        active: isDark ? colors.grey[200] : colors.grey[700],
        hover: isDark ? colors.primary[300] : colors.grey[200],
        selected: isDark ? colors.primary[300] : colors.grey[300],
        disabled: isDark ? colors.grey[600] : colors.grey[400],
        disabledBackground: isDark ? colors.grey[700] : colors.grey[200],
      },
      blueAccent: colors.blueAccent,
      divider: isDark ? colors.grey[700] : colors.grey[300],
      blueText: {
        main: colors.blueText.main,
      },
    },
    typography: {
      fontFamily: [
        '"Montserrat"', // <-- Set Montserrat as the default font
        '"Inter"',
        '"Source Sans Pro"',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 600,
      h1: {
        fontFamily: '"Montserrat", "Inter", "Source Sans Pro", sans-serif', // <-- Use Montserrat
        fontWeight: 700,
        fontSize: "clamp(2rem, 5vw, 3.5rem)",
        lineHeight: 1.2,
        letterSpacing: "-0.02em",
        color: isDark ? "#fff" : "#171717",
        "@media (max-width:600px)": {
          fontSize: "2rem",
        },
      },
      h2: {
        fontFamily: '"Montserrat", "Inter", "Source Sans Pro", sans-serif',
        fontWeight: 600,
        fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
        lineHeight: 1.3,
        letterSpacing: "-0.01em",
        color: isDark ? "#fff" : "#171717",
        "@media (max-width:600px)": {
          fontSize: "1.75rem",
        },
      },
      h3: {
        fontFamily: '"Montserrat", "Inter", "Source Sans Pro", sans-serif',
        fontWeight: 600,
        fontSize: "clamp(1.25rem, 3vw, 2rem)",
        lineHeight: 1.4,
        letterSpacing: "-0.005em",
        color: isDark ? "#fff" : "#171717",
        "@media (max-width:600px)": {
          fontSize: "1.5rem",
        },
      },
      h4: {
        fontFamily: '"Montserrat", "Inter", "Source Sans Pro", sans-serif',
        fontWeight: 500,
        fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
        lineHeight: 1.4,
        color: isDark ? "#fff" : "#171717",
        "@media (max-width:600px)": {
          fontSize: "1.25rem",
        },
      },
      h5: {
        fontFamily: '"Montserrat", "Inter", "Source Sans Pro", sans-serif',
        fontWeight: 500,
        fontSize: "clamp(1rem, 2vw, 1.25rem)",
        lineHeight: 1.5,
        color: isDark ? "#fff" : "#171717",
      },
      h6: {
        fontFamily: '"Montserrat", "Inter", "Source Sans Pro", sans-serif',
        fontWeight: 500,
        fontSize: "clamp(0.875rem, 1.5vw, 1.125rem)",
        lineHeight: 1.5,
        color: isDark ? "#fff" : "#171717",
      },
      subtitle1: {
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.6,
        color: isDark ? colors.grey[300] : colors.grey[700],
      },
      subtitle2: {
        fontSize: "0.875rem",
        fontWeight: 500,
        lineHeight: 1.6,
        color: isDark ? colors.grey[300] : colors.grey[700],
      },
      body1: {
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.7,
        color: isDark ? "#fff" : "#171717",
      },
      body2: {
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: 1.6,
        color: isDark ? "#fff" : "#171717",
      },
      button: {
        fontSize: "0.875rem",
        fontWeight: 500,
        textTransform: "none",
        lineHeight: 1.4,
        letterSpacing: "0.02em",
      },
      caption: {
        fontSize: "0.75rem",
        fontWeight: 400,
        lineHeight: 1.5,
        color: isDark ? colors.grey[400] : colors.grey[600],
      },
      overline: {
        fontSize: "0.75rem",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        lineHeight: 1.5,
        color: isDark ? colors.grey[400] : colors.grey[600],
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    spacing: 8,
    shape: {
      // borderRadius: 8,
    },
    shadows: isDark
      ? [
          "none",
          "0px 1px 3px rgba(0, 0, 0, 0.4)",
          "0px 2px 6px rgba(0, 0, 0, 0.4)",
          "0px 4px 12px rgba(0, 0, 0, 0.4)",
          "0px 6px 16px rgba(0, 0, 0, 0.4)",
          "0px 8px 20px rgba(0, 0, 0, 0.4)",
          "0px 10px 24px rgba(0, 0, 0, 0.4)",
          "0px 12px 28px rgba(0, 0, 0, 0.4)",
          "0px 14px 32px rgba(0, 0, 0, 0.4)",
          "0px 16px 36px rgba(0, 0, 0, 0.4)",
          "0px 18px 40px rgba(0, 0, 0, 0.4)",
          "0px 20px 44px rgba(0, 0, 0, 0.4)",
          "0px 22px 48px rgba(0, 0, 0, 0.4)",
          "0px 24px 52px rgba(0, 0, 0, 0.4)",
          "0px 26px 56px rgba(0, 0, 0, 0.4)",
          "0px 28px 60px rgba(0, 0, 0, 0.4)",
          "0px 30px 64px rgba(0, 0, 0, 0.4)",
          "0px 32px 68px rgba(0, 0, 0, 0.4)",
          "0px 34px 72px rgba(0, 0, 0, 0.4)",
          "0px 36px 76px rgba(0, 0, 0, 0.4)",
          "0px 38px 80px rgba(0, 0, 0, 0.4)",
          "0px 40px 84px rgba(0, 0, 0, 0.4)",
          "0px 42px 88px rgba(0, 0, 0, 0.4)",
          "0px 44px 92px rgba(0, 0, 0, 0.4)",
          "0px 46px 96px rgba(0, 0, 0, 0.4)",
        ]
      : [
          "none",
          "0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)",
          "0px 2px 6px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.24)",
          "0px 4px 12px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.24)",
          "0px 6px 16px rgba(0, 0, 0, 0.12), 0px 6px 12px rgba(0, 0, 0, 0.24)",
          "0px 8px 20px rgba(0, 0, 0, 0.12), 0px 8px 16px rgba(0, 0, 0, 0.24)",
          "0px 10px 24px rgba(0, 0, 0, 0.12), 0px 10px 20px rgba(0, 0, 0, 0.24)",
          "0px 12px 28px rgba(0, 0, 0, 0.12), 0px 12px 24px rgba(0, 0, 0, 0.24)",
          "0px 14px 32px rgba(0, 0, 0, 0.12), 0px 14px 28px rgba(0, 0, 0, 0.24)",
          "0px 16px 36px rgba(0, 0, 0, 0.12), 0px 16px 32px rgba(0, 0, 0, 0.24)",
          "0px 18px 40px rgba(0, 0, 0, 0.12), 0px 18px 36px rgba(0, 0, 0, 0.24)",
          "0px 20px 44px rgba(0, 0, 0, 0.12), 0px 20px 40px rgba(0, 0, 0, 0.24)",
          "0px 22px 48px rgba(0, 0, 0, 0.12), 0px 22px 44px rgba(0, 0, 0, 0.24)",
          "0px 24px 52px rgba(0, 0, 0, 0.12), 0px 24px 48px rgba(0, 0, 0, 0.24)",
          "0px 26px 56px rgba(0, 0, 0, 0.12), 0px 26px 52px rgba(0, 0, 0, 0.24)",
          "0px 28px 60px rgba(0, 0, 0, 0.12), 0px 28px 56px rgba(0, 0, 0, 0.24)",
          "0px 30px 64px rgba(0, 0, 0, 0.12), 0px 30px 60px rgba(0, 0, 0, 0.24)",
          "0px 32px 68px rgba(0, 0, 0, 0.12), 0px 32px 64px rgba(0, 0, 0, 0.24)",
          "0px 34px 72px rgba(0, 0, 0, 0.12), 0px 34px 68px rgba(0, 0, 0, 0.24)",
          "0px 36px 76px rgba(0, 0, 0, 0.12), 0px 36px 72px rgba(0, 0, 0, 0.24)",
          "0px 38px 80px rgba(0, 0, 0, 0.12), 0px 38px 76px rgba(0, 0, 0, 0.24)",
          "0px 40px 84px rgba(0, 0, 0, 0.12), 0px 40px 80px rgba(0, 0, 0, 0.24)",
          "0px 42px 88px rgba(0, 0, 0, 0.12), 0px 42px 84px rgba(0, 0, 0, 0.24)",
          "0px 44px 92px rgba(0, 0, 0, 0.12), 0px 44px 88px rgba(0, 0, 0, 0.24)",
          "0px 46px 96px rgba(0, 0, 0, 0.12), 0px 46px 92px rgba(0, 0, 0, 0.24)",
        ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 8,
            padding: "8px 16px",
            transition: "all 0.2s ease-in-out",
            color: isDark ? "#fff" : "#fff", // Text color for both modes
            backgroundColor: isDark ? "#f08735" : "#dd621a", // Background color
            "&:hover": {
              translate: 'translateY(-2px)',
              backgroundColor: "#bc3401", // Hover background color for both modes
            },
            "&.Mui-disabled": {
              color: isDark ? colors.grey[500] : "#fff", // Disabled text color
              backgroundColor: isDark ? "#f5c77e" : "#CDC8B1", // Disabled background color
            },
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: isDark ? '#76B1D3' : '#043F69',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          h6: {
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
          },
          subtitle2: {
            fontSize: '0.75rem',
            color: isDark ? colors.grey[400] : colors.grey[600],
          },
          caption: {
            fontSize: '0.75rem',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
            },
            // Set icon color for all MUI icons inside IconButton
            color: isDark ? "#c2c2c2" : "#292929",
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: isDark ? "#c2c2c2" : "#292929",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            // borderRadius: '8px',
            backgroundColor: isDark ? colors.primary[600] : '#ffffff',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: isDark ? colors.grey[600] : colors.grey[300],
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            // Set very light grey for light mode, black for dark mode
            backgroundColor: isDark ? "#000000" : "#EEE9E9",
            color: isDark ? "#fff" : "#171717", // <-- force text color
            boxShadow: isDark
              ? "0px 2px 6px rgba(0, 0, 0, 0.4)"
              : "0px 2px 6px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? colors.primary[600] : colors.grey[50],
            borderRight: isDark ? `1px solid ${colors.grey[700]}` : `1px solid ${colors.grey[200]}`,
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          h6: {
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
          },
          subtitle2: {
            fontSize: '0.75rem',
            color: isDark ? colors.grey[400] : colors.grey[600],
          },
          caption: {
            fontSize: '0.75rem',
          },
        },
      },
      MuiOutlinedInput: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? colors.grey[600] : colors.grey[400],
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? colors.grey[500] : colors.grey[500],
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? colors.blueAccent[500] : colors.blueAccent[500],
              },
            },
            input: {
              color: isDark ? "#e8e6e3" : "#393a3d", // Input text color
              '&.Mui-disabled': {
                color: isDark ? 'white !important' : 'black !important', // Disabled input text color
                WebkitTextFillColor: isDark ? 'white !important' : 'black !important',
              }
            }
          }
        },
        MuiInputLabel: {
          styleOverrides: {
            root: {
              color: isDark ? colors.grey[300] : colors.grey[700],
              '&.Mui-focused': {
                color: isDark ? colors.blueAccent[500] : colors.blueAccent[500],
              },
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-input': {
                color: isDark ? "#e8e6e3" : "#393a3d",
              }
            }
          }
        },
        MuiDataGrid: {
          styleOverrides: {
            root: {
              // backgroundColor: isDark ? 'blue' : 'red',
              backgroundColor: isDark ? '#212121' : '#FFFfff'
            },
          },
        },
    },
  };
};

// Color mode context with better performance
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: "dark",
});

// Enhanced useMode hook with localStorage persistence and better performance
export const useMode = () => {
  const [mode, setMode] = useState(() => {
    // Initialize from localStorage or default to dark
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("colorMode");
      return savedMode || "dark";
    }
    return "dark";
  });

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prev) => {
        const newMode = prev === "light" ? "dark" : "light";
        if (typeof window !== "undefined") {
          localStorage.setItem("colorMode", newMode);
        }
        return newMode;
      });
    },
    mode,
  }), [mode]);

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};