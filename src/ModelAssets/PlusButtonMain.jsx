import React from "react";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import { useTheme, Box } from "@mui/material";

const PlusButtonMain = ({ onClick, buttonText, startIcon, color }) => {
  const theme = useTheme();

  const defaultStartIcon = (
    <Add
      sx={{ color: color || theme.palette.blueText.main, fontSize: "0.5rem" }}
    />
  );
  const buttonColor = color || theme.palette.blueText.main;

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Button
        variant="outlined"
        onClick={onClick}
        startIcon={startIcon || defaultStartIcon}
        sx={{
          padding: "5px 10px",
          fontSize: "0.8rem",
          borderColor: buttonColor,
          color: buttonColor,
          backgroundColor: "transparent",
          borderRadius: "0px",
          "&:hover": {
            backgroundColor: "transparent",
            borderColor: buttonColor,
            borderWidth: "2px",
          },
        }}
      >
        {buttonText}
      </Button>
    </Box>
  );
};

export default PlusButtonMain;
