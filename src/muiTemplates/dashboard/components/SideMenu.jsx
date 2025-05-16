import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import OptionsMenu from './OptionsMenu';
import { useContext } from 'react';
import { UserContext } from '../../../App';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MegaMenu from './MegaMenu';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import SmartphoneRoundedIcon from '@mui/icons-material/SmartphoneRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu({ onHideMenu }) {
  const { user, userDetails } = useContext(UserContext);

  // Define heading and menu items to pass to MegaMenu
  const megaMenuHeading = "Production";

  const borrowerItems = [
    {
      value: "addBorrower",
      label: "Create",
      secondary: "Add a new borrower",
      icon: <PersonAddAltRoundedIcon sx={{ fontSize: '1rem' }} />,
      avatarAlt: "Add a new borrower",
    },
    {
      value: "manageBorrowers",
      label: "Manage",
      secondary: "Manage existing borrowers",
      icon: <PeopleAltRoundedIcon sx={{ fontSize: '1rem' }} />,
      avatarAlt: "Manage existing borrowers",
    },
  ];
  const megaMenuItems = [
    {
      value: "web",
      label: "Sitemark-web",
      secondary: "Web app",
      icon: <DevicesRoundedIcon sx={{ fontSize: '1rem' }} />,
      avatarAlt: "Sitemark web",
    },
    {
      value: "app",
      label: "Sitemark-app",
      secondary: "Mobile application",
      icon: <SmartphoneRoundedIcon sx={{ fontSize: '1rem' }} />,
      avatarAlt: "Sitemark App",
    },
    {
      value: "store",
      label: "Sitemark-Store",
      secondary: "Web app",
      icon: <DevicesRoundedIcon sx={{ fontSize: '1rem' }} />,
      avatarAlt: "Sitemark Store",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      {/* Hide menu button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          p: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <IconButton aria-label="Hide menu" onClick={onHideMenu}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        <MegaMenu heading={"Borrowers"} items={borrowerItems} />
        <MegaMenu heading={megaMenuHeading} items={megaMenuItems} />
        <MegaMenu heading={megaMenuHeading} items={megaMenuItems} />
        <MegaMenu heading={megaMenuHeading} items={megaMenuItems} />
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent />
        <CardAlert />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <OptionsMenu />
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            Access Level: {userDetails.userType || 'Unknown'}
          </Typography>
        </Box>
      </Stack>
    </Drawer>
  );
}
