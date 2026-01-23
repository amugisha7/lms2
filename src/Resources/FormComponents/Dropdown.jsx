import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  OutlinedInput,
  styled,
} from "@mui/material";
import { useField } from "formik";
import { tokens } from "../../theme";

const Dropdown = ({
  label,
  name,
  options,
  helperText,
  required,
  readOnly = false,
  editing = true,
  disabled = false,
  dynamicLabel,
  dependsOn,
  dependsOnValue,
  validationType,
  validationPattern,
  validationMessage,
  maxLength,
  adminOnly, // extract to prevent passing to DOM
  ...props
}) => {
  const [field, meta] = useField(name);
  const isReadOnly = readOnly || editing === false || disabled;

  const coerceLabel = (labelValue) => {
    if (labelValue === null || labelValue === undefined) return "";
    if (typeof labelValue === "string" || typeof labelValue === "number") {
      return String(labelValue);
    }
    // Avoid rendering objects/arrays as React children.
    return "";
  };

  const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => {
    const colors = tokens(theme.palette.mode);
    return {
      border: isReadOnly ? `transparent` : `1px solid ${colors.grey[200]}`,
      // fontSize: "1rem",
    };
  });

  // Find the label for the current value
  const selectedOption = options?.find(
    (option) => option.value === field.value,
  );

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
      <Box
        sx={{
          width: { xs: "100%", sm: "auto" },
          flex: { xs: "unset", sm: 1 },
          display: "flex",
          alignItems: "center",
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
      </Box>
      {editing ? (
        <FormControl
          fullWidth
          variant="filled"
          error={meta.touched && Boolean(meta.error)}
          sx={{
            flex: { xs: "unset", sm: 3 },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Select
            {...field}
            {...props}
            size="small"
            displayEmpty
            input={<StyledOutlinedInput label={label} />}
            slotProps={{
              input: { readOnly: isReadOnly },
            }}
          >
            <MenuItem value="">
              <em>Select {label}</em>
            </MenuItem>
            {options?.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  "&:hover": {
                    color: "white",
                  },
                }}
              >
                {coerceLabel(option.label)}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {meta.touched && meta.error ? meta.error : helperText}
          </FormHelperText>
        </FormControl>
      ) : (
        <Typography
          sx={{
            flex: { xs: "unset", sm: 3 },
            width: { xs: "100%", sm: "auto" },
            display: "flex",
            alignItems: "center",
            // minHeight: 40,
            pl: 1.5,
            // fontSize: 14,
            // color: "text.primary",
          }}
        >
          {selectedOption ? coerceLabel(selectedOption.label) : ""}
        </Typography>
      )}
    </Box>
  );
};

export default Dropdown;
