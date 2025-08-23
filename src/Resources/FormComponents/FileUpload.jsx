import React from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  Typography,
  Box,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useField } from "formik";

const FileUpload = ({ label, name, helperText, required, ...props }) => {
  const [field, meta, helpers] = useField(name);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    helpers.setValue(file);
  };

  return (
    <FormControl fullWidth error={meta.touched && Boolean(meta.error)}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        {label} {required && "*"}
      </Typography>
      <Box>
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUpload />}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            borderStyle: "dashed",
            py: 2,
            width: "100%",
          }}
        >
          {field.value ? field.value.name : "Choose File"}
          <input type="file" hidden onChange={handleFileChange} {...props} />
        </Button>
      </Box>
      <FormHelperText>
        {meta.touched && meta.error ? meta.error : helperText}
      </FormHelperText>
    </FormControl>
  );
};

export default FileUpload;
