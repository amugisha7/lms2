import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useField } from "formik";

const TextArea = ({
  label,
  name,
  helperText,
  required,
  rows = 2,
  readOnly = false,
  editing = true,
  ...props
}) => {
  const [field, meta] = useField(name);
  const isReadOnly = readOnly || editing === false;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        // alignItems: { xs: "stretch", sm: "center" },
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
          width: { xs: "100%", sm: "100px" },
        }}
      >
        {label}
      </Typography>
      <TextField
        {...field}
        {...props}
        fullWidth
        multiline
        rows={rows}
        variant="outlined"
        required={required}
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.touched && meta.error ? meta.error : helperText}
        size="small"
        slotProps={{
          input: { readOnly: isReadOnly },
        }}
        sx={{
          flex: { xs: "unset", sm: "1 1 auto" },
          width: { xs: "100%", sm: "auto" },
          minWidth: 0,
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
          "& .MuiInputLabel-root": {
            "&.Mui-focused": {
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? "#90caf9"
                  : theme.palette.primary.main,
            },
          },
        }}
      />
    </Box>
  );
};

export default TextArea;
