import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  AppBar,
  Toolbar,
  useMediaQuery
} from '@mui/material';
import {
  Help as HelpIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Apps as AppsIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import SideBar from './SideBar';
import { Outlet } from 'react-router-dom';
import ColorModeToggle from '../../ComponentAssets/ColorModeToggle';
import { useTheme } from '@mui/material/styles';
import TopBar from './TopBar';

// Main Dashboard Component
const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', 
      bgcolor: theme.palette.primary.mainbgd }}>
      {/* Sidebar - Hidden on mobile */}
      {!isMobile && <SideBar open={drawerOpen} />}
      
      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh',
        minWidth: 0,
        overflow: 'hidden'
      }}>
        {/* Top Bar */}
        <TopBar onMenuClick={() => setDrawerOpen((prev) => !prev)} />
        
        {/* Dashboard Content */}
        <Box sx={{ 
          p: { xs: 2, sm: 2, md: 3, lg: 5 }, 
          flexGrow: 1, 
          overflowX: 'auto',
          overflowY: 'auto'
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;