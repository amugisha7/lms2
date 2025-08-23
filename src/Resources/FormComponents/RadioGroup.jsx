import React from "react";
import {
  FormControl,
  FormLabel,
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
  ...props
}) => {
  const [field, meta] = useField(name);

  return (
    <FormControl
      component="fieldset"
      error={meta.touched && Boolean(meta.error)}
    >
      <FormLabel component="legend" required={required}>
        {label}
      </FormLabel>
      <MuiRadioGroup {...field} {...props} row>
        {options?.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </MuiRadioGroup>
      <FormHelperText>
        {meta.touched && meta.error ? meta.error : helperText}
      </FormHelperText>
    </FormControl>
  );
};

export default RadioGroup;
