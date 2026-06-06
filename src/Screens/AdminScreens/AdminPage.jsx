import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import BusinessIcon from "@mui/icons-material/Business";
import ShieldIcon from "@mui/icons-material/Shield";
import GroupIcon from "@mui/icons-material/Group";
import TuneIcon from "@mui/icons-material/Tune";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ADMIN_SECTIONS = [
  {
    category: "Loan Configuration",
    items: [
      {
        label: "Loan Products",
        description: "Define loan types, interest rates, repayment schedules and eligibility rules.",
        icon: AccountBalanceIcon,
        route: "/admin/loan-products",
        tone: "brand",
      },
      {
        label: "Loan Fees",
        description: "Create and manage origination, processing and penalty fee structures.",
        icon: ReceiptLongIcon,
        route: "/admin/loan-fees",
        tone: "brand",
      },
    ],
  },
  {
    category: "Organisation",
    items: [
      {
        label: "Branches",
        description: "Add, edit and deactivate branch locations across your institution.",
        icon: BusinessIcon,
        route: "/admin/branches",
        tone: "info",
      },
      {
        label: "Securities",
        description: "Manage collateral types and security instruments accepted for loans.",
        icon: ShieldIcon,
        route: "/admin/securities",
        tone: "info",
      },
    ],
  },
  {
    category: "User Management",
    items: [
      {
        label: "Users",
        description: "View all system users, manage roles, permissions and account status.",
        icon: GroupIcon,
        route: "/users",
        tone: "success",
      },
      {
        label: "Custom Fields",
        description: "Configure additional data fields for borrowers, loans and other records.",
        icon: TuneIcon,
        route: "/customFields",
        tone: "success",
      },
    ],
  },
];

function getAccent(tone, sf) {
  if (tone === "success") return sf?.sf_success || "#2e7d32";
  if (tone === "info") return sf?.sf_info || "#0288d1";
  return sf?.sf_brandPrimary || "#1976d2";
}

function AdminCard({ item, sf, onClick }) {
  const Icon = item.icon;
  const accent = getAccent(item.tone, sf);

  return (
    <Box
      onClick={onClick}
      sx={{
        p: 2.5,
        border: `1px solid ${sf?.sf_borderLight || "#e0e0e0"}`,
        bgcolor: sf?.sf_cardBg || "#fff",
        boxShadow: sf?.sf_shadowSm || "0 1px 3px rgba(0,0,0,.1)",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        transition: "box-shadow 0.15s, transform 0.1s",
        "&:hover": {
          boxShadow: sf?.sf_shadowMd || "0 4px 12px rgba(0,0,0,.15)",
          transform: "translateY(-1px)",
        },
      }}
    >
      {/* Left accent bar */}
      <Box
        sx={{
          position: "absolute",
          inset: "0 auto 0 0",
          width: 4,
          bgcolor: accent,
        }}
      />

      {/* Icon */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          bgcolor: `${accent}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 20, color: accent }} />
      </Box>

      {/* Text */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.95rem",
            color: sf?.sf_textPrimary || "#111",
            lineHeight: 1.3,
          }}
        >
          {item.label}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.78rem",
            color: sf?.sf_textTertiary || "#767676",
            mt: 0.4,
            lineHeight: 1.4,
          }}
        >
          {item.description}
        </Typography>
      </Box>

      {/* Arrow */}
      <ArrowForwardIosIcon
        sx={{ fontSize: 13, color: sf?.sf_textTertiary || "#767676", mt: 0.3, flexShrink: 0 }}
      />
    </Box>
  );
}

export default function AdminPage() {
  const theme = useTheme();
  const sf = theme.palette.sf;
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const q = search.toLowerCase();
  const filtered = ADMIN_SECTIONS
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          !q ||
          item.label.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q),
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", width: "100%", mb: 6 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          pb: 1.5,
          borderBottom: `3px solid ${sf?.sf_brandPrimary || "#1976d2"}`,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ color: sf?.sf_textPrimary || "#111", mb: 0.4 }}
        >
          Admin Settings
        </Typography>
        <Typography sx={{ fontSize: "0.85rem", color: sf?.sf_textTertiary || "#767676" }}>
          Configure loan products, branches, users and system defaults.
        </Typography>
      </Box>

      {/* Search */}
      <TextField
        placeholder="Search settings…"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 18, color: sf?.sf_textTertiary || "#767676" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          maxWidth: 360,
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            borderColor: sf?.sf_borderLight || "#e0e0e0",
          },
        }}
      />

      {/* Sections */}
      {filtered.map((section) => (
        <Box key={section.category} sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: sf?.sf_textTertiary || "#767676",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              mb: 1.5,
            }}
          >
            {section.category}
          </Typography>
          <Grid container spacing={2}>
            {section.items.map((item) => (
              <Grid item xs={12} sm={6} key={item.label}>
                <AdminCard
                  item={item}
                  sf={sf}
                  onClick={() => navigate(item.route)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {filtered.length === 0 && (
        <Typography sx={{ color: sf?.sf_textTertiary || "#767676", mt: 2 }}>
          No settings match "{search}".
        </Typography>
      )}
    </Box>
  );
}
