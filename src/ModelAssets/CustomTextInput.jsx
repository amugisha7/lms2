import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

const CustomTextInput = ({
  id,
  name,
  placeholder,
  size = "small",
  value,
  onChange,
  error,
  helperText,
  disabled,
  multiline = false,
  rows,
  touched,
  sx = {},
}) => {
  const theme = useTheme();

  return (
    <>
      <OutlinedInput
        id={id}
        name={name}
        placeholder={placeholder}
        size={size}
        value={value}
        onChange={onChange}
        error={error}
        disabled={disabled}
        multiline={multiline}
        rows={rows}
        sx={{
          mb: 2,
          backgroundColor: disabled
            ? theme.palette.mode === "dark"
              ? "#2a2a2a"
              : "#f5f5f5"
            : theme.palette.mode === "dark"
            ? "#1B1B1B"
            : "#ffffff",
          "& .Mui-disabled": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#2a2a2a" : "#f5f5f5",
          },
          ...(!disabled && {
            "& .MuiOutlinedInput-root": {
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor:
                  theme.palette.mode === "dark" ? "#76B1D3" : "#1976d2",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor:
                  theme.palette.mode === "dark" ? "#76B1D3" : "#1976d2",
                borderWidth: "2px",
              },
            },
          }),
          ...sx,
        }}
      />
      {touched && error && (
        <Typography color="error" variant="caption">
          {helperText || error}
        </Typography>
      )}
    </>
  );
};

export default CustomTextInput;
