import React from "react";
import { Button, FormHelperText, Typography, Box } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useField } from "formik";

const FileUpload = ({
  label,
  name,
  helperText,
  required,
  readOnly = false,
  editing = true,
  maxSize,
  imageOnly,
  accept,
  ...props
}) => {
  const [field, meta, helpers] = useField(name);

  // Remove custom props from being passed to DOM
  const inputProps = {};
  if (accept) inputProps.accept = accept;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    helpers.setValue(file);
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
          width: { xs: "100%", sm: "100px" },
        }}
      >
        {label} {required && <span style={{ color: "#d32f2f" }}>*</span>}
      </Typography>
      <Box
        sx={{
          flex: { xs: "unset", sm: "1 1 auto" },
          width: { xs: "100%", sm: "auto" },
          minWidth: 0,
        }}
      >
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
          disabled={readOnly || editing === false}
        >
          {field.value ? field.value.name : "Choose File"}
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            {...inputProps}
          />
        </Button>
        <FormHelperText error={meta.touched && Boolean(meta.error)}>
          {meta.touched && meta.error ? meta.error : helperText}
        </FormHelperText>
      </Box>
    </Box>
  );
};

export default FileUpload;
