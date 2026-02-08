import React from "react";
import {
  FormControl,
  FormHelperText,
  Box,
  Typography,
  TextField,
  Autocomplete,
  Checkbox,
} from "@mui/material";
import { useField } from "formik";
import { tokens } from "../../theme";

const MultipleDropDownSearchable = ({
  label,
  name,
  options,
  helperText,
  required,
  readOnly = false,
  editing = true,
  disabled = false,
  placeholder,
  showOnlyForAdmin,
  showOnlyInEditMode,
  span,
  validationType,
  validationPattern,
  validationMessage,
  maxLength,
  dependsOn,
  dependsOnValue,
  ...props
}) => {
  const [field, meta, helpers] = useField(name);
  const isReadOnly = readOnly || editing === false || disabled;

  // Get selected options based on field.value (array of values)
  const selectedOptions =
    options?.filter((option) => field.value?.includes(option.value)) || [];

  const handleChange = (event, newValue) => {
    const values = newValue.map((option) => option.value);
    helpers.setValue(values);
  };

  // Get labels for display when not editing
  const selectedLabels = selectedOptions
    .map((option) => option.label)
    .join(", ");

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
          error={meta.touched && Boolean(meta.error)}
          sx={{
            flex: { xs: "unset", sm: 3 },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Autocomplete
            {...props}
            multiple
            value={selectedOptions}
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
                error={meta.touched && Boolean(meta.error)}
                InputProps={{
                  ...params.InputProps,
                  readOnly: isReadOnly,
                }}
              />
            )}
            renderOption={(props, option, { selected }) => {
              const { key, ...otherProps } = props;
              return (
                <li key={key} {...otherProps}>
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                  {option.label}
                </li>
              );
            }}
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
          <FormHelperText>
            {meta.touched && meta.error ? meta.error : helperText}
          </FormHelperText>
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
          {selectedLabels || ""}
        </Typography>
      )}
    </Box>
  );
};

export default MultipleDropDownSearchable;
