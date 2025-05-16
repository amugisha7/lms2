import * as React from 'react';
import MuiAvatar from '@mui/material/Avatar';
import MuiListItemAvatar from '@mui/material/ListItemAvatar';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Select, { selectClasses } from '@mui/material/Select';
import { styled } from '@mui/material/styles';

const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.secondary,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

export default function MegaMenu({ heading = "Production", items = [] }) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Prevent changing the selected value
  const handleMenuItemClick = (event) => {
    event.preventDefault();
    setOpen(false);
  };

  return (
    <Select
      labelId="company-select"
      id="company-simple-select"
      value="production"
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      displayEmpty
      inputProps={{ 'aria-label': 'Select company' }}
      fullWidth
      sx={{
        maxHeight: 56,
        width: 200,
        '&.MuiList-root': {
          p: '8px',
        },
        [`& .${selectClasses.select}`]: {
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          pl: 1,
        },
      }}
      renderValue={() => (
        <span style={{ fontWeight: 600, fontSize: 16 }}>{heading}</span>
      )}
    >
      <ListSubheader sx={{ pt: 0 }}>{heading}</ListSubheader>
      {items.map((item) => (
        <MenuItem key={item.value} value={item.value} onClick={handleMenuItemClick}>
          <ListItemAvatar>
            <Avatar alt={item.avatarAlt}>
              {item.icon}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={item.label} secondary={item.secondary} />
        </MenuItem>
      ))}
    </Select>
  );
}
