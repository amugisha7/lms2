import React from "react";
import { TextField } from "@mui/material";
import { useField } from "formik";

const DateInput = ({ label, name, helperText, required, ...props }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <TextField
      {...props}
      label={label}
      type="date"
      fullWidth
      variant="outlined"
      required={required}
      value={field.value || ""}
      onChange={(e) => helpers.setValue(e.target.value)}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error ? meta.error : helperText}
      InputLabelProps={{
        shrink: true,
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
        },
      }}
    />
  );
};

export default DateInput;
