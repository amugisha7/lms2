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
        <Box
          sx={{
            p: { xs: 2, sm: 4, md: 4, lg: 5 },
            pt: { xs: 3, sm: undefined, md: undefined, lg: undefined },
            pb: 6,
            flexGrow: 1,
            overflowX: 'auto',
            overflowY: 'auto',
            display: 'flex', // Add flex display
            justifyContent: { xs: 'flex-start', sm: 'center', md: 'center', lg: 'center' }, // Center on sm and up
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 1200 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;