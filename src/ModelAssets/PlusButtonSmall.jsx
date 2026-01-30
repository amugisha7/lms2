import React from "react";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import { useTheme, Box } from "@mui/material";

const PlusButtonSmall = ({
  onClick,
  label = "ADD LOAN",
  IconComponent = Add,
  disabled = false,
  variant = "outlined",
  iconSx: iconSxProp,
  ...otherProps
}) => {
  const theme = useTheme();

  const iconSx = {
    color: disabled
      ? theme.palette.action.disabled
      : theme.palette.blueText.main,
    fontSize: "0.5rem",
    ...iconSxProp,
  };

  const buttonSx = {
    padding: "2px 5px",
    fontSize: "0.7rem",
    borderRadius: "0px",
    ...(variant === "outlined" && {
      borderColor: theme.palette.blueText.main,
      color: theme.palette.blueText.main,
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "transparent",
        borderColor: theme.palette.blueText.main,
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
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // width: "100%",
        // height: "100%",
      }}
    >
      <Button
        variant={variant}
        onClick={onClick}
        disabled={disabled}
        startIcon={IconComponent ? <IconComponent sx={iconSx} /> : null}
        sx={{ ...buttonSx, ...otherProps?.sx }}
        {...otherProps}
      >
        {label}
      </Button>
    </Box>
  );
};

export default PlusButtonSmall;
