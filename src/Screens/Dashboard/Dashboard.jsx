import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Help as HelpIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Apps as AppsIcon,
  Menu as MenuIcon // <-- Add this import
} from '@mui/icons-material';
import SideBar from './SideBar';
import { Outlet } from 'react-router-dom';
import ColorModeToggle from '../../ComponentAssets/ColorModeToggle';
import { useTheme } from '@mui/material/styles';

// Main Dashboard Component
const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', 
      bgcolor: theme.palette.primary.mainbgd }}>
      {/* Sidebar */}
      <SideBar open={drawerOpen} />
      
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <TopBar onMenuClick={() => setDrawerOpen((prev) => !prev)} />
        
        {/* Dashboard Content */}
        <Box sx={{ p: 5, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};


// Top Bar Component
const TopBar = ({ onMenuClick }) => {
  // Use theme to access palette
  const theme = useTheme();

  // Get institution name from context
  const { userDetails } = React.useContext(require('../../App').UserContext);
  const institutionName = userDetails?.institution?.name || "Institution";

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: theme.palette.primary.topbar, // Use theme palette
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={onMenuClick} sx={{ mr: 1 }}>
            <MenuIcon /> {/* Insert the hamburger menu icon */}
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
            {institutionName}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton>
            <HelpIcon />
          </IconButton>
          <IconButton>
            <AppsIcon />
          </IconButton>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <NotificationsIcon />
          </IconButton>
          <IconButton>
            <SettingsIcon />
          </IconButton>
          <ColorModeToggle />
          <Avatar sx={{ bgcolor: '#2196f3', width: 32, height: 32 }}>A</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};


export default Dashboard;