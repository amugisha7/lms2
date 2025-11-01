import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useField } from "formik";

const TextInput = ({
  label,
  name,
  type = "text",
  helperText,
  required,
  readOnly = false,
  editing = true,
  disabled = false,
  inputProps, // explicitly accept inputProps
  minLength, // <-- accept minLength
  maxLength, // <-- accept maxLength
  slotProps: incomingSlotProps, // <-- accept incoming slotProps for merging
  validationMessage, // <-- extract validationMessage to prevent it from reaching DOM
  validationType, // <-- extract validationType to prevent it from reaching DOM
  validationPattern, // <-- extract validationPattern to prevent it from reaching DOM
  dynamicLabel,
  dependsOn,
  dependsOnValue,
  ...props
}) => {
  const [field, meta] = useField(name);
  const isReadOnly = readOnly || editing === false || disabled;

  // Merge consumer-provided slotProps with our readOnly and inputProps, plus min/max length
  const mergedSlotProps = {
    ...incomingSlotProps,
    input: {
      ...(incomingSlotProps?.input || {}),
      ...(inputProps || {}),
      ...(minLength !== undefined ? { minLength } : {}),
      ...(maxLength !== undefined ? { maxLength } : {}),
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
        {...props}
        // label={label}
        type={type}
        fullWidth
        variant="filled"
        required={required}
        error={isReadOnly ? false : meta.touched && Boolean(meta.error)} // hide error state when read-only
        helperText={
          isReadOnly
            ? undefined
            : meta.touched && meta.error
            ? meta.error
            : helperText // hide helper text when read-only
        }
        size="small"
        // inputProps removed; moved into slotProps.input
        slotProps={mergedSlotProps}
        sx={{
          flex: { xs: "unset", sm: "1 1 auto" },
          width: { xs: "100%", sm: "auto" },
          minWidth: 0,
          "& .MuiFilledInput-input": {
            paddingTop: 0.5,
            paddingBottom: 0.5,
            borderRadius: 0,
          },
          "& .MuiFilledInput-root": {
            backgroundColor: isReadOnly ? "transparent" : undefined, // transparent when read-only
            "&:hover": {
              backgroundColor: isReadOnly ? "transparent" : undefined, // keep transparent on hover
            },
            "&.Mui-focused": {
              backgroundColor: isReadOnly ? "transparent" : undefined, // keep transparent on focus
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

export default TextInput;
