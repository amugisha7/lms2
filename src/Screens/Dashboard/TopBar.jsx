import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
  useMediaQuery,
  Badge,
} from "@mui/material";
import {
  Help as HelpIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Apps as AppsIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import ColorModeToggle from "../../ComponentAssets/ColorModeToggle";
import { useTheme } from "@mui/material/styles";
import myLogo from "../../Resources/loantabs_logo.png";
import MobileMenu from "./MobileMenu";
import { useNavigate } from "react-router-dom";

const TopBar = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { userDetails, unreadCount } = React.useContext(
    require("../../App").UserContext
  );
  const institutionName = userDetails?.institution?.name || "";

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: theme.palette.primary.topbar,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: { xs: 48, sm: 64 },
          }}
        >
          {isMobile ? (
            // Mobile Layout
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  minWidth: 0,
                  justifyContent: "space-between",
                }}
              >
                <Box
                  component="button"
                  onClick={() => navigate("/")}
                  sx={{
                    width: "2rem",
                    height: "2rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    flexShrink: 0,
                    mr: 3,
                    p: 0,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={myLogo}
                    alt="LoanTabs Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "0.9rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    minWidth: 0,
                    flex: 1,
                    textAlign: "center",
                    mx: 1,
                  }}
                >
                  {institutionName}
                </Typography>
                <IconButton
                  onClick={handleMobileMenuToggle}
                  sx={{
                    color: theme.palette.text.primary,
                    "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                    flexShrink: 0,
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            // Desktop Layout
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={onMenuClick} sx={{ mr: 1 }}>
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, textTransform: "uppercase" }}
                >
                  {institutionName}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 400,
                    color: theme.palette.text.secondary,
                    fontStyle: "italic",
                    ml: 1,
                  }}
                >
                  — {userDetails?.branch?.name || "Main Branch"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton>
                  <HelpIcon />
                </IconButton>
                <IconButton>
                  <AppsIcon />
                </IconButton>
                <IconButton>
                  <SearchIcon />
                </IconButton>
                <IconButton onClick={() => navigate("/notifications")}>
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton onClick={() => navigate("/settings")}>
                  <SettingsIcon />
                </IconButton>
                <ColorModeToggle />
                <Avatar sx={{ bgcolor: "#2196f3", width: 32, height: 32 }}>
                  A
                </Avatar>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};

export default TopBar;
