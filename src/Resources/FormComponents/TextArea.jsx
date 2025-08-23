import React from "react";
import { TextField } from "@mui/material";
import { useField } from "formik";

const TextArea = ({
  label,
  name,
  helperText,
  required,
  rows = 4,
  ...props
}) => {
  const [field, meta] = useField(name);

  return (
    <TextField
      {...field}
      {...props}
      label={label}
      fullWidth
      multiline
      rows={rows}
      variant="outlined"
      required={required}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error ? meta.error : helperText}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
        },
      }}
    />
  );
};

export default TextArea;
