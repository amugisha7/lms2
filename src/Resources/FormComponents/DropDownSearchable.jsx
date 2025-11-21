import React, { useState } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  OutlinedInput,
  styled,
  TextField,
  Autocomplete,
} from "@mui/material";
import { tokens } from "../../theme";

const DropDownSearchable = ({
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
  placeholder,
  ...props
}) => {
  const isReadOnly = readOnly || editing === false || disabled;

  const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => {
    const colors = tokens(theme.palette.mode);
    return {
      border: isReadOnly ? `transparent` : `1px solid ${colors.grey[200]}`,
    };
  });

  // Find the label for the current value
  const selectedOption = options?.find(
    (option) => option.value === props.value
  );

  // Get the current value object for Autocomplete
  const currentValue = selectedOption || null;

  const handleChange = (event, newValue) => {
    if (props.onChange) {
      props.onChange({ target: { value: newValue ? newValue.value : "" } });
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
          error={false}
          sx={{
            flex: { xs: "unset", sm: 3 },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Autocomplete
            {...props}
            value={currentValue}
            onChange={handleChange}
            options={options || []}
            getOptionLabel={(option) => option.label || ""}
            isOptionEqualToValue={(option, value) =>
              option.value === value?.value
            }
            disabled={isReadOnly}
            readOnly={isReadOnly}
            size="small"
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeholder}
                error={false}
                InputProps={{
                  ...params.InputProps,
                  readOnly: isReadOnly,
                }}
              />
            )}
            slotProps={{
              paper: {
                sx: {
                  "& .MuiAutocomplete-option": {
                    "&:hover": {
                      color: "white",
                    },
                  },
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                border: isReadOnly
                  ? "transparent"
                  : (theme) =>
                      `1px solid ${
                        theme.palette.mode === "dark"
                          ? tokens("dark").grey[200]
                          : tokens("light").grey[200]
                      }`,
              },
            }}
          />
          <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
      ) : (
        <Typography
          sx={{
            flex: { xs: "unset", sm: 3 },
            width: { xs: "100%", sm: "auto" },
            display: "flex",
            alignItems: "center",
            pl: 1.5,
          }}
        >
          {selectedOption ? selectedOption.label : ""}
        </Typography>
      )}
    </Box>
  );
};

export default DropDownSearchable;
