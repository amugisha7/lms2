import * as React from 'react';
import Button from '@mui/material/Button';

export default function SideMenuButton({
  startIcon,
  onClick,
  children,
  sx = {},
  ...props
}) {
  return (
    <Button
      startIcon={startIcon}
      onClick={onClick}
      variant="outlined"
      sx={{
        width: 200,
        justifyContent: 'flex-start',
        fontWeight: 600,
        fontSize: 16,
        color: 'text.primary',
        background: 'transparent',
        borderRadius: 1,
        px: 2,
        py: 1.2,
        mb: 0.5,
        textTransform: 'none',
        '&:hover': {
          background: (theme) =>
            theme.vars ? theme.vars.palette.action.hover : '#f5f5f5',
        },
        boxShadow: 0,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}