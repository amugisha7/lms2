import * as React from "react";
import { useLocation, Outlet } from "react-router-dom";
import { useNotification } from "../../ModelAssets/NotificationContext";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
import MainGrid from "./components/MainGrid";
import SideMenu from "./components/SideMenu";
import AppTheme from "../shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";

import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import ColorModeToggle from "../../ModelAssets/ColorModeToggle";
import NavBar from "../../ModelAssets/Menu/NavBar";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props) {
  const location = useLocation();
  const { showNotification } = useNotification();
  const [sideMenuOpen, setSideMenuOpen] = React.useState(true);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  React.useEffect(() => {
    if (location.state?.notification) {
      showNotification(
        location.state.notification.message,
        location.state.notification.color,
      );
      // Clear the notification from history so it doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, showNotification]);

  // Toggle sidebar only on desktop
  const handleShowMenu = () => setSideMenuOpen(true);
  const handleHideMenu = () => setSideMenuOpen(false);

  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        {/* Show IconButton only on desktop */}
        {!sideMenuOpen && (
          <IconButton
            aria-label="Show menu"
            sx={{
              ml: 3,
              mt: 1,
              display: { xs: "none", sm: "none", md: "inline-flex" },
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1300,
              // background: '#fff',
              boxShadow: 1,
            }}
            onClick={handleShowMenu}
          >
            <MenuIcon />
          </IconButton>
        )}
        {sideMenuOpen && <SideMenu onHideMenu={handleHideMenu} />}
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: colors.grey[900],
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <NavBar />
            <Header />
            <Outlet /> {/* This will render the matched child route */}
          </Stack>
        </Box>
      </Box>
    </Box>
  );

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        {/* Show IconButton only on desktop */}
        {!sideMenuOpen && (
          <IconButton
            aria-label="Show menu"
            sx={{
              ml: 3,
              mt: 1,
              display: { xs: "none", sm: "none", md: "inline-flex" },
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1300,
              background: "#fff",
              boxShadow: 1,
            }}
            onClick={handleShowMenu}
          >
            <MenuIcon />
          </IconButton>
        )}
        {sideMenuOpen && <SideMenu onHideMenu={handleHideMenu} />}
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <Outlet /> {/* This will render the matched child route */}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
