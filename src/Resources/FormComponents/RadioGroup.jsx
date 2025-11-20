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
      <Box
        sx={{
          flex: { xs: "unset", sm: "1 1 auto" },
          width: { xs: "100%", sm: "auto" },
          minWidth: 0,
        }}
      >
        <MuiRadioGroup {...field} {...otherProps} onChange={handleChange} row>
          {options?.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio disabled={isReadOnly} size="small" />}
              label={option.label}
              disabled={isReadOnly}
            />
          ))}
        </MuiRadioGroup>
        <FormHelperText error={meta.touched && Boolean(meta.error)}>
          {meta.touched && meta.error ? meta.error : helperText}
        </FormHelperText>
      </Box>
    </Box>
  );
};

export default RadioGroup;
