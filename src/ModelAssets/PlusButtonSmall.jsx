import React from "react";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import { useTheme, Box } from "@mui/material";

const PlusButtonSmall = ({
  onClick,
  label = "ADD LOAN",
  IconComponent = Add,
  disabled = false,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Button
        variant="outlined"
        onClick={onClick}
        disabled={disabled}
        startIcon={
          <IconComponent
            sx={{
              color: disabled
                ? theme.palette.action.disabled
                : theme.palette.blueText.main,
              fontSize: "0.5rem",
            }}
          />
        }
        sx={{
          padding: "2px 5px",
          fontSize: "0.7rem",
          borderColor: theme.palette.blueText.main,
          color: theme.palette.blueText.main,
          borderRadius: "0px",

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
        }}
      >
        {label}
      </Button>
    </Box>
  );
};

export default PlusButtonSmall;
