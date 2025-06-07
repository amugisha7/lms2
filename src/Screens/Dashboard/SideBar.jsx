import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AccountBalance as AccountBalanceIcon,
  Group as GroupIcon,
  AccountBalanceWallet as WalletIcon,
  Assessment as ReportsIcon,
  ExpandLess,
  ExpandMore,
  PersonAdd as PersonAddIcon,
  ListAlt as ListAltIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import myLogo from '../../Resources/loantabs_logo.png'; // Adjust path if needed

const SideBar = ({ open = true, onClose }) => {
  const [borrowersOpen, setBorrowersOpen] = useState(false);
  const navigate = useNavigate();
  const [menuItems] = useState([
    { name: 'Dashboard', icon: <DashboardIcon sx={{ color: 'white'}}/>, active: true },
    { name: 'Borrowers', icon: <PeopleIcon sx={{ color: 'white'}}/>, expandable: true },
    { name: 'Loans', icon: <AccountBalanceIcon sx={{ color: 'white'}}/>, expandable: true },
    { name: 'Team', icon: <GroupIcon sx={{ color: 'white'}}/>, expandable: true },
    { name: 'Accounts', icon: <WalletIcon sx={{ color: 'white'}}/>, expandable: true },
    { name: 'Reports', icon: <ReportsIcon sx={{ color: 'white'}}/>, expandable: true }
  ]);

  return (
    <Box
      sx={{
        width: 220,
        bgcolor: '#282828',
        color: 'white',
        display: open ? 'flex' : 'none',
        flexDirection: 'column',
        transition: 'all 0.3s',
        overflowY: 'auto', // Enable vertical scroll
        height: '100vh'    // Ensure sidebar takes full viewport height
      }}
    >
      {/* LoanTabs Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          mt: 2, ml: 2
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

      {/* Menu Section */}
      <Box sx={{ mt: 4 }}>
        <List dense>
          {menuItems.map((item, index) => {
            if (item.name === 'Borrowers') {
              return (
                <React.Fragment key={item.name}>
                  <ListItem
                    button
                    onClick={() => setBorrowersOpen((prev) => !prev)}
                    sx={{
                      mb: 0.5,
                      px: 3,
                      '&:hover': { bgcolor: '#000' }
                    }}
                  >
                    <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        sx: { color: 'white' }
                      }}
                    />
                    {borrowersOpen ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
                  </ListItem>
                  <Collapse in={borrowersOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding dense>
                      <ListItem
                        button
                        onClick={() => navigate('/addBorrower')}
                        sx={{
                          pl: 6,
                          mb: 0.5,
                          color: 'white',
                          '&:hover': { bgcolor: '#000' }
                        }}
                      >
                        <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
                          <PersonAddIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Create Borrower"
                          primaryTypographyProps={{
                            fontSize: '0.85rem',
                            sx: { color: 'white' }
                          }}
                        />
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => navigate('/allBorrowers')}
                        sx={{
                          pl: 6,
                          mb: 0.5,
                          color: 'white',
                          '&:hover': { bgcolor: '#000' }
                        }}
                      >
                        <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
                          <ListAltIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="View Borrowers"
                          primaryTypographyProps={{
                            fontSize: '0.85rem',
                            sx: { color: 'white' }
                          }}
                        />
                      </ListItem>
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            }
            return (
              <ListItem
                key={item.name}
                button
                sx={{
                  mb: 0.5,
                  px: 3,
                  '&:hover': { bgcolor: '#000' }
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    sx: { color: 'white' }
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

export default SideBar;