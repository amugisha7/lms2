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
  slotProps: incomingSlotProps,
  validationType,
  validationMessage,
  validationPattern,
  ...otherProps
}) => {
  const [field, meta] = useField(name);
  const isReadOnly = readOnly || editing === false;

  // Merge consumer-provided slotProps with our readOnly setting
  const mergedSlotProps = {
    ...incomingSlotProps,
    input: {
      ...(incomingSlotProps?.input || {}),
      readOnly: isReadOnly,
    },
  };

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
        {...field}
        {...otherProps}
        fullWidth
        multiline
        rows={rows}
        variant="filled"
        required={required}
        error={isReadOnly ? false : meta.touched && Boolean(meta.error)}
        helperText={
          isReadOnly
            ? undefined
            : meta.touched && meta.error
            ? meta.error
            : helperText
        }
        size="small"
        slotProps={mergedSlotProps}
        sx={{
          flex: { xs: "unset", sm: "1 1 auto" },
          width: { xs: "100%", sm: "auto" },
          minWidth: 0,
          "& .MuiFilledInput-input": {
            paddingTop: 0,
            paddingBottom: 0.5,
            borderRadius: 0,
          },
          "& .MuiFilledInput-root": {
            backgroundColor: isReadOnly ? "transparent" : undefined,
            "&:hover": {
              backgroundColor: isReadOnly ? "transparent" : undefined,
            },
            "&.Mui-focused": {
              backgroundColor: isReadOnly ? "transparent" : undefined,
            },
            "&:before, &:after": {
              borderBottomColor: isReadOnly ? "transparent" : undefined,
            },
            "&.Mui-focused:after": {
              borderBottomColor: isReadOnly
                ? "transparent"
                : (theme) =>
                    theme.palette.mode === "dark"
                      ? "#90caf9"
                      : theme.palette.primary.main,
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
