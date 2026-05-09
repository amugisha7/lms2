/**
 * Reports Landing Page
 * Displays cards for all five report areas with descriptions and navigation links.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShieldIcon from "@mui/icons-material/Shield";
import { REPORT_REGISTRY } from "./reportRegistry";

const ICON_MAP = {
  AccountBalance: (
    <AccountBalanceIcon sx={{ fontSize: 36, color: "primary.main" }} />
  ),
  Warning: <WarningAmberIcon sx={{ fontSize: 36, color: "warning.main" }} />,
  AccessTime: <AccessTimeIcon sx={{ fontSize: 36, color: "info.main" }} />,
  TrendingDown: <TrendingDownIcon sx={{ fontSize: 36, color: "error.main" }} />,
  TrendingUp: <TrendingUpIcon sx={{ fontSize: 36, color: "success.main" }} />,
  Shield: <ShieldIcon sx={{ fontSize: 36, color: "success.main" }} />,
};

export default function ReportsLanding() {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Reports
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select a report below to view portfolio metrics, collections data, and
          financial summaries.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {REPORT_REGISTRY.map((report) => (
          <Grid item xs={12} sm={6} md={4} key={report.key}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: 4 },
              }}
            >
              <CardActionArea
                onClick={() => navigate(report.route)}
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                <CardContent sx={{ width: "100%" }}>
                  <Box sx={{ mb: 1.5 }}>{ICON_MAP[report.icon] || null}</Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {report.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {report.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label="Open Report"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
