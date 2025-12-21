import React from "react";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import { useTheme, Box } from "@mui/material";

const PlusButtonMain = ({
  onClick,
  buttonText,
  startIcon,
  color,
  variant = "outlined",
  disabled = false,
  type = "button",
  ...otherProps
}) => {
  const theme = useTheme();

  const defaultStartIcon = (
    <Add
      sx={{ color: color || theme.palette.blueText.main, fontSize: "0.5rem" }}
    />
  );
  const buttonColor = color || theme.palette.blueText.main;

  const iconSx = {
    color: disabled ? theme.palette.action.disabled : buttonColor,
    fontSize: "0.5rem",
  };

  const buttonSx = {
    padding: "5px 10px",
    fontSize: "0.8rem",
    borderRadius: "0px",
    ...(variant === "outlined" && {
      borderColor: buttonColor,
      color: buttonColor,
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "transparent",
        borderColor: buttonColor,
        borderWidth: "2px",
      },
      "&.Mui-disabled": {
        borderColor: theme.palette.action.disabled,
        color: "grey",
      },
    }),
    ...(variant === "contained" && {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
      "&.Mui-disabled": {
        backgroundColor: theme.palette.action.disabledBackground,
        color: theme.palette.action.disabled,
      },
    }),
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Button
        variant={variant}
        onClick={onClick}
        disabled={disabled}
        startIcon={startIcon}
        type={type}
        sx={buttonSx}
        {...otherProps}
      >
        {buttonText}
      </Button>
    </Box>
  );
};

export default PlusButtonMain;
