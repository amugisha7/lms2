import React, { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightModeRounded";
import { ColorModeContext } from "../theme";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const ColorModeToggle = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const colorMode = useContext(ColorModeContext);
  return (
    <IconButton
      onClick={colorMode.toggleColorMode}
      color="inherit"
      sx={{
        "& svg": {
          color: colors.grey[200],
        },
      }}
    >
      {theme.palette.mode === "dark" ? <LightModeIcon fontSize="small"/> : <DarkModeIcon fontSize="small"/>}
    </IconButton>
  );
};

export default ColorModeToggle;