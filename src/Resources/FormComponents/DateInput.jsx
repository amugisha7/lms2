import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useField } from "formik";
import { useTheme } from "@mui/material";

const DateInput = ({
  label,
  name,
  helperText,
  required,
  readOnly = false,
  editing = true,
  min,
  minToday, // extract to prevent passing to DOM
  validationType, // <-- destructure and ignore
  adminOnly, // extract to prevent passing to DOM
  isEditMode, // extract to prevent passing to DOM
  ...props
}) => {
  const [field, meta, helpers] = useField(name);
  const isReadOnly = readOnly || editing === false;
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        gap: { xs: 0, sm: 1 },
        borderBottom: (theme) =>
          `1.5px dotted ${
            theme.palette.mode === "dark"
              ? theme.palette.grey[500]
              : theme.palette.grey[400]
          }`,
        pb: editing ? 1 : 0,
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          minWidth: { xs: "100%", sm: "120px" },
          maxWidth: { xs: "100%", sm: "120px" },
        }}
      >
        {label}
        {required && (
          <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>
            *
          </Box>
        )}
      </Typography>
      <TextField
        {...props} // validationType is not included here
        type="date"
        fullWidth
        variant="outlined"
        required={required}
        value={field.value || ""}
        onChange={(e) => helpers.setValue(e.target.value)}
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.touched && meta.error ? meta.error : helperText}
        size="small"
        slotProps={{
          input: { readOnly: isReadOnly },
          htmlInput: { min },
        }}
        sx={{
          flex: { xs: "unset", sm: "1 1 auto" },
          width: { xs: "100%", sm: "auto" },
          minWidth: 0,
          '& input[type="date"]::-webkit-calendar-picker-indicator': {
            ...(theme.palette.mode === "dark" && {
              filter: "invert(1)",
            }),
            cursor: "pointer",
          },
          '& input[type="date"]::-webkit-calendar-picker-indicator:hover': {
            ...(theme.palette.mode === "dark" && {
              filter: "invert(1) brightness(1.2)",
            }),
          },

          "& .MuiOutlinedInput-root": {
            padding: 0,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isReadOnly
                ? "transparent"
                : (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[500]
                      : theme.palette.grey[400],
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: isReadOnly
                ? "transparent"
                : (theme) =>
                    theme.palette.mode === "dark"
                      ? "#90caf9"
                      : theme.palette.primary.main,
              borderWidth: isReadOnly ? 1 : 2,
            },
          },
        }}
      />
    </Box>
  );
};

export default DateInput;
