import React from "react";
import {
  Box,
  Typography,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import { useField } from "formik";

const RadioGroup = ({
  label,
  name,
  options,
  helperText,
  required,
  editing = true,
  readOnly = false,
  disabled = false,
  showOnlyInEditMode,
  dependsOn,
  dependsOnValue,
  validationType,
  validationPattern,
  validationMessage,
  maxLength,
  onChange,
  ...otherProps
}) => {
  const [field, meta, helpers] = useField(name);
  const isReadOnly = readOnly || !editing || disabled;

  const handleChange = (event) => {
    helpers.setValue(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        borderBottom: (theme) =>
          `1.5px dotted ${
            theme.palette.mode === "dark"
              ? theme.palette.grey[500]
              : theme.palette.grey[400]
          }`,
        // pb: editing ? 1 : 0,
      }}
    >
      <MuiRadioGroup
        {...field}
        value={field.value ?? ""}
        {...otherProps}
        onChange={handleChange}
        row
        sx={{ width: "100%" }}
      >
        {options?.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio disabled={isReadOnly} size="small" />}
            label={option.label}
            disabled={isReadOnly}
            sx={{ mr: 3, ".MuiFormControlLabel-label": { fontSize: 12 } }}
          />
        ))}
      </MuiRadioGroup>
      <FormHelperText error={meta.touched && Boolean(meta.error)}>
        {meta.touched && meta.error ? meta.error : helperText}
      </FormHelperText>
    </Box>
  );
};

export default RadioGroup;
