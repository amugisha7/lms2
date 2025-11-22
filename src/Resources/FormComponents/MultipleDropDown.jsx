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
  Checkbox,
} from "@mui/material";
import { useField } from "formik";
import { tokens } from "../../theme";

const MultipleDropDown = ({
  label,
  name,
  options,
  helperText,
  required,
  placeholder,
  readOnly = false,
  editing = true,
  showSelectAll = false,
  ...props
}) => {
  const [field, meta, helpers] = useField(name);
  const isReadOnly = readOnly || editing === false;
  const textPlaceholder = placeholder || `Select ${label}`;

  const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => {
    const colors = tokens(theme.palette.mode);
    return {
      border: isReadOnly ? `transparent` : `1px solid ${colors.grey[200]}`,
    };
  });

  const SELECT_ALL_VALUE = "__SELECT_ALL__";
  
  const allValues = React.useMemo(
    () => options?.map(option => option.value) || [],
    [options]
  );
  
  const currentValues = field.value || [];
  
  const allSelected = React.useMemo(
    () => allValues.length > 0 && allValues.every(val => currentValues.includes(val)),
    [allValues, currentValues]
  );
  
  const someSelected = React.useMemo(
    () => currentValues.length > 0 && !allSelected,
    [currentValues, allSelected]
  );

  // Find the labels for the current values
  const selectedLabels = options
    ?.filter((option) => field.value?.includes(option.value))
    .map((option) => option.label)
    .join(", ");

  const handleChange = (event) => {
    const value = event.target.value;
    const selectedValues = typeof value === "string" ? value.split(",") : value;
    
    // Check if "Select All" was clicked
    if (selectedValues.includes(SELECT_ALL_VALUE)) {
      // If all items are already selected, deselect all
      if (allSelected) {
        helpers.setValue([]);
      } else {
        // Otherwise, select all items
        helpers.setValue(allValues);
      }
    } else {
      // Filter out SELECT_ALL_VALUE as a safety measure (shouldn't normally be included)
      const filteredValues = selectedValues.filter(val => val !== SELECT_ALL_VALUE);
      helpers.setValue(filteredValues);
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
          error={meta.touched && Boolean(meta.error)}
          sx={{
            flex: { xs: "unset", sm: 3 },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Select
            {...props}
            multiple
            value={field.value || []}
            onChange={handleChange}
            size="small"
            displayEmpty
            input={<StyledOutlinedInput label={label} />}
            renderValue={(selected) => {
              if (!selected || selected.length === 0) {
                return <em> {textPlaceholder}</em>;
              }
              return options
                ?.filter((option) => selected.includes(option.value))
                .map((option) => option.label)
                .join(", ");
            }}
            slotProps={{
              input: { readOnly: isReadOnly },
            }}
          >
            {showSelectAll && options && options.length > 0 && (
              <MenuItem
                key={SELECT_ALL_VALUE}
                value={SELECT_ALL_VALUE}
                sx={{
                  "&:hover": {
                    color: "#fff",
                    backgroundColor: "primary.main",
                  },
                }}
              >
                <Checkbox 
                  checked={allSelected} 
                  indeterminate={someSelected}
                />
                Select all {label}
              </MenuItem>
            )}
            {options?.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  "&:hover": {
                    color: "#fff",
                    backgroundColor: "primary.main",
                  },
                }}
              >
                <Checkbox
                  checked={field.value?.indexOf(option.value) > -1 || false}
                />
                {option.label}
              </MenuItem>
            ))}
          </Select>
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

export default MultipleDropDown;
