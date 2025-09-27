import React from 'react';
import {
  Toolbar,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  ExportPrint,
} from '@mui/x-data-grid';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

const StyledQuickFilter = styled(QuickFilter)({
  marginLeft: 'auto',
});

function CustomToolbar() {
  const theme = useTheme();

  return (
    <Toolbar
      sx={{
        justifyContent: 'space-between',
        display: 'flex',
      }}
    >
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <StyledQuickFilter expanded>
          <QuickFilterControl
            render={({ ref, ...other }) => (
              <TextField
                {...other}
                sx={{ width: 260 }}
                inputRef={ref}
                aria-label="Search"
                placeholder="Search..."
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: other.value ? (
                      <InputAdornment position="end">
                        <QuickFilterClear
                          edge="end"
                          size="small"
                          aria-label="Clear search"
                          material={{ sx: { marginRight: -0.75 } }}
                        >
                          <CancelIcon fontSize="small" />
                        </QuickFilterClear>
                      </InputAdornment>
                    ) : null,
                    ...other.slotProps?.input,
                  },
                  ...other.slotProps,
                }}
              />
            )}
          />
        </StyledQuickFilter>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
      </Box>
      {/* Add your right-aligned toolbar items here if needed */}
    </Toolbar>
  );
}

export default CustomToolbar;