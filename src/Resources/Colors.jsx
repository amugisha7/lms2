import { useTheme } from '@mui/material';
import { tokens } from '../theme';

export const useColors = () => {
  const theme = useTheme();
  return tokens(theme.palette.mode);
};

// Export a singleton instance that can be imported directly
let colors = {};

// Initialize with dark mode defaults
colors = tokens('dark');

// Function to update colors when theme changes
export const updateColors = (mode) => {
  colors = tokens(mode);
};

export default colors;