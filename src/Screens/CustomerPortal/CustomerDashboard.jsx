import React, { useState, useContext } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import CustomerSideBar from "./CustomerSideBar";
import CustomerMobileMenu from "./CustomerMobileMenu";
import { Outlet } from "react-router-dom";
import ColorModeToggle from "../../ModelAssets/ColorModeToggle";
import { useTheme } from "@mui/material/styles";
import { CustomerContext } from "../../CustomerApp";
import { IconButton, AppBar, Toolbar } from "@mui/material";
import { Menu as MenuIcon, ExitToApp as LogoutIcon } from "@mui/icons-material";

// Customer Dashboard Component
const CustomerDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { institution, signOut } = useContext(CustomerContext);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: theme.palette.primary.mainbgd,
      }}
    >
      {/* Sidebar - Hidden on mobile */}
      {!isMobile && <CustomerSideBar open={drawerOpen} />}

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        {/* Top Bar */}
        <AppBar
          position="static"
          sx={{
            bgcolor: theme.palette.primary.mainbgd,
            boxShadow: "none",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={
                isMobile
                  ? handleMobileMenuToggle
                  : () => setDrawerOpen((prev) => !prev)
              }
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {institution?.name || "Customer Portal"}
            </Typography>
            <ColorModeToggle />
            <IconButton
              color="inherit"
              onClick={signOut}
              sx={{ ml: 2 }}
              title="Sign Out"
            >
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Dashboard Content */}
        <Box
          sx={{
            p: { xs: 2, sm: 4, md: 4, lg: 5 },
            pt: { xs: 3, sm: undefined, md: undefined, lg: undefined },
            pb: 6,
            flexGrow: 1,
            overflowX: "auto",
            overflowY: "auto",
            display: "flex",
            justifyContent: {
              xs: "flex-start",
              sm: "center",
              md: "center",
              lg: "center",
            },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 1200 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>

      {/* Mobile Menu Drawer */}
      <CustomerMobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </Box>
  );
};

export default CustomerDashboard;
