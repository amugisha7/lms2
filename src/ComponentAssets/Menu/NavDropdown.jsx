// src/components/NavDropdown.jsx
import React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from 'react-router-dom'; // Replace with react-router-dom Link if you use it

function NavDropdown({ name, items }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        color="inherit"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        aria-controls={open ? `${name}-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{ textTransform: 'none' }} // To make button text "Title Case" like in image
      >
        {name}
      </Button>
      <Menu
        id={`${name}-menu`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': `${name}-button`, // You might want to assign an ID to the button for better accessibility
        }}
      >
        {items.map((item) => (
          <MenuItem
            key={item.name}
            onClick={handleClose}
            component={item.path ? Link : 'li'} // Use Link if path exists, otherwise default to li
            to={item.path || '#'} // Fallback to '#' if no path provided
          >
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default NavDropdown;