import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Link } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const colorMap = {
  green: '#4caf50',
  blue: '#2196f3',
  red: '#f44336',
};

const NotificationBar = ({ message, color = 'blue', learnMoreUrl }) => {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible || !message) return null;

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: colorMap[color] || colorMap.blue,
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
        py: 1,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1400,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          flexGrow: 1,
          textAlign: 'center',
        }}
      >
        {message}
        {learnMoreUrl && (
          <>
            {' '}
            <Link href={learnMoreUrl} target="_blank" rel="noopener" sx={{ color: 'inherit', textDecoration: 'underline' }}>
              (learn more)
            </Link>
          </>
        )}
      </Typography>
      <IconButton size="small" onClick={() => setVisible(false)} sx={{ color: 'white' }}>
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default NotificationBar;
