// src/components/SalesNavbar.jsx
import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Custom NavDropdown component
import NavDropdown from './NavDropdown';
import ColorModeToggle from '../ColorModeToggle';
import { UserContext } from '../../App'; // Adjust the path if needed
import myLogo from '../../Resources/loantabs_logo.png'; // Adjust path if needed

// Placeholder for react-router-dom Link (if not using react-router-dom directly)
const Link = React.forwardRef((props, ref) => <a ref={ref} {...props} />);
Link.displayName = 'Link';

// Define your navigation items here
const navItems = [
  {
    name: "Borrowers",
    type: "dropdown",
    items: [
      { name: "All Borrowers", path: "/allBorrowers" },
      { name: "New Borrower", path: "/addBorrower" },
    ],
  },
  {
    name: "Accounts",
    type: "dropdown",
    items: [
      { name: "All Accounts", path: "/accounts/all" },
      { name: "My Accounts", path: "/accounts/my" },
      { name: "New Account", path: "/accounts/new" },
    ],
  },
  {
    name: "Contacts",
    type: "dropdown",
    items: [
      { name: "All Contacts", path: "/contacts/all" },
      { name: "My Contacts", path: "/contacts/my" },
    ],
  },
  {
    name: "Opportunities",
    type: "dropdown",
    items: [
      { name: "All Opportunities", path: "/opportunities/all" },
      { name: "My Opportunities", path: "/opportunities/my" },
    ],
  },
  {
    name: "Tasks",
    type: "dropdown",
    items: [
      { name: "All Tasks", path: "/tasks/all" },
      { name: "My Tasks", path: "/tasks/my" },
    ],
  },
  {
    name: "Calendar",
    type: "link",
    path: "/calendar"
  },
  {
    name: "Reports",
    type: "dropdown",
    items: [
      { name: "Sales Reports", path: "/reports/sales" },
      { name: "Activity Reports", path: "/reports/activity" },
    ],
  },
  {
    name: "More",
    type: "dropdown",
    items: [
      { name: "Admin", path: "/admin" },
      { name: "Settings", path: "/settings" },
    ],
  },
];

function NavBar() {
  const { user, userDetails } = useContext(UserContext);

  const businessName = userDetails?.institution?.name || 'Business name';
  const userEmail = user?.signInDetails?.loginId || user?.attributes?.email || user?.email || 'useremail';
  const accessLevel = userDetails?.userType || 'Unknown';

  return (
    <AppBar position="static">
      <Box sx={{ maxWidth: 1000, mx: 'auto', width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1,
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 1, md: 0 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Box
              sx={{
                width: '2rem',
                height: '2rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                overflow: 'hidden',
              }}
            >
              <img
                src={myLogo}
                alt="LoanTabs Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </Box>
            <Typography
              variant="body"
              noWrap
              component="div"
              sx={{ mr: 3, display: { xs: 'none', sm: 'block' } }}
            >
              LoanTabs
            </Typography>
          </Box>
          <Typography variant="h4" align="center" 
            sx={{ fontWeight: 700}}
          >
            {businessName}
          </Typography>
          
          <Box sx={{ display: 'flex' }}>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
            <IconButton size="large" aria-label="help" color="inherit">
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
            <IconButton size="large" aria-label="settings" color="inherit">
              <SettingsIcon fontSize="small" />
            </IconButton>
            <IconButton size="large" aria-label="user profile" color="inherit">
              <PersonIcon fontSize="small" />
            </IconButton>
            <ColorModeToggle />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 1,
          }}
        >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="sales home"
            sx={{ mr: 1 }}
          >
            <HomeIcon />
          </IconButton>

          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            {navItems.map((item) =>
              item.type === "link" ? (
                <Button
                  key={item.name}
                  color="inherit"
                  component={Link}
                  to={item.path}
                >
                  {item.name}
                </Button>
              ) : (
                <NavDropdown key={item.name} name={item.name} items={item.items} />
              )
            )}
          </Box>
        </Box>
      </Box>
    </AppBar>
  );
}

export default NavBar;