import React from "react";
import { TextField } from "@mui/material";
import { useField } from "formik";

const NumberInput = ({ label, name, helperText, required, ...props }) => {
  const [field, meta] = useField(name);

  return (
    <TextField
      {...field}
      {...props}
      label={label}
      type="number"
      fullWidth
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

export default NumberInput;
