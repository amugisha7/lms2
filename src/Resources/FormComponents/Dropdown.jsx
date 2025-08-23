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
  ...props
}) => {
  const [field, meta] = useField(name);
  const isReadOnly = readOnly || editing === false;

  const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => {
    const colors = tokens(theme.palette.mode);
    return {
      border: isReadOnly ? `transparent` : `1px solid ${colors.grey[200]}`,
      // fontSize: "1rem",
    };
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        gap: 1,
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
            fontSize: { xs: 14, sm: 12 },
            fontWeight: 500,
            color: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.grey[200]
                : theme.palette.text.primary,
            width: "100%",
            wordBreak: "break-word",
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
      <FormControl
        fullWidth
        variant="outlined"
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
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {meta.touched && meta.error ? meta.error : helperText}
        </FormHelperText>
      </FormControl>
    </Box>
  );
};

export default Dropdown;
