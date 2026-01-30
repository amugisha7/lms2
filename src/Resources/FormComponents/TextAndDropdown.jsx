import React from "react";
import {
  Box,
  TextField,
  Typography,
  MenuItem,
  FormHelperText,
  OutlinedInput,
  Select,
  FormControl,
  styled,
} from "@mui/material";
import { useField } from "formik";
import { tokens } from "../../theme";

const TextAndDropdown = ({
  // Common props
  editing = true,
  readOnly = false,
  disabled = false,

  // Text Input Props
  textLabel,
  textName,
  textType = "text",
  textHelperText,
  textRequired,
  textPlaceholder,
  textInputProps, // for any remaining TextField specific props
  textDisabled = false, // Allow disabling just the text field

  // Dropdown Props
  dropdownLabel,
  dropdownName,
  dropdownOptions,
  dropdownHelperText,
  dropdownRequired,
  dropdownOnChange, // Pass through for external onChange handling
  dropdownProps, // for any remaining TextField specific props
  dropdownDisabled = false, // Allow disabling just the dropdown

  // Extract validation/dependency props to prevent passing to DOM
  validationType,
  validationPattern,
  validationMessage,
  maxLength,
  minLength,
  dependsOn,
  dependsOnValue,
  dynamicLabel,

  ...otherProps
}) => {
  // Prevent passing validation/control props to DOM by removing them from nested prop bags
  const {
    validationType: _textValidationType,
    validationPattern: _textValidationPattern,
    validationMessage: _textValidationMessage,
    maxLength: _textMaxLength,
    minLength: _textMinLength,
    ...sanitizedTextInputProps
  } = textInputProps || {};

  const {
    validationType: _dropValidationType,
    validationPattern: _dropValidationPattern,
    validationMessage: _dropValidationMessage,
    maxLength: _dropMaxLength,
    minLength: _dropMinLength,
    ...sanitizedDropdownProps
  } = dropdownProps || {};
  const [textField, textMeta] = useField(textName);
  const [dropdownField, dropdownMeta, dropdownHelpers] = useField(dropdownName);

  const isReadOnly = readOnly || !editing || disabled;
  const isTextReadOnly = isReadOnly || textDisabled;
  const isDropdownReadOnly = isReadOnly || dropdownDisabled;

  const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => {
    const colors = tokens(theme.palette.mode);
    return {
      border: isDropdownReadOnly
        ? `transparent`
        : `1px solid ${colors.grey[200]}`,
    };
  });

  const handleDropdownChange = (event) => {
    dropdownHelpers.setValue(event.target.value);
    if (dropdownOnChange) {
      dropdownOnChange(event);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "flex-end" },
        gap: { xs: 0, sm: 2 },
        width: "100%",
        borderBottom: (theme) =>
          `1.5px dotted ${
            theme.palette.mode === "dark"
              ? theme.palette.grey[500]
              : theme.palette.grey[400]
          }`,
        pb: editing ? 1 : 0,
      }}
    >
      {/* Text Input - 50% width */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "50%",
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            mb: 0.5,
          }}
        >
          {textLabel}
          {textRequired && (
            <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>
              *
            </Box>
          )}
        </Typography>
        <TextField
          {...textField}
          {...sanitizedTextInputProps}
          type={textType}
          fullWidth
          variant="filled"
          placeholder={textPlaceholder}
          required={textRequired}
          error={
            isTextReadOnly ? false : textMeta.touched && Boolean(textMeta.error)
          }
          helperText={
            isTextReadOnly
              ? textHelperText
              : textMeta.touched && textMeta.error
                ? textMeta.error
                : textHelperText
          }
          size="small"
          inputProps={{ readOnly: isTextReadOnly }}
          sx={{
            width: "100%",
            "& .MuiFilledInput-input": {
              paddingTop: 0.5,
              paddingBottom: 0.5,
              borderRadius: 0,
            },
            "& .MuiFilledInput-root": {
              backgroundColor: isTextReadOnly ? "transparent" : undefined,
              "&:hover": {
                backgroundColor: isTextReadOnly ? "transparent" : undefined,
              },
              "&.Mui-focused": {
                backgroundColor: isTextReadOnly ? "transparent" : undefined,
              },
              "&:before, &:after": {
                borderBottomColor: isTextReadOnly ? "transparent" : undefined,
              },
              "&.Mui-focused:after": {
                borderBottomColor: isTextReadOnly
                  ? "transparent"
                  : (theme) =>
                      theme.palette.mode === "dark"
                        ? "#90caf9"
                        : theme.palette.primary.main,
              },
            },
            "& .MuiInputLabel-root": {
              "&.Mui-focused": {
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? "#90caf9"
                    : theme.palette.primary.main,
              },
            },
          }}
        />
      </Box>

      {/* Dropdown - 50% width */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "50%",
          minHeight: "56px", // Ensure consistent height with text input
          justifyContent: "flex-end", // Align content to the bottom
        }}
      >
        {dropdownLabel && ( // Conditionally render label for dropdown if provided
          <Typography
            sx={{
              fontSize: 12,
              mb: 0.5,
            }}
          >
            {dropdownLabel}
            {dropdownRequired && (
              <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>
                *
              </Box>
            )}
          </Typography>
        )}
        <FormControl
          fullWidth
          variant="outlined"
          error={dropdownMeta.touched && Boolean(dropdownMeta.error)}
        >
          <Select
            {...dropdownField}
            {...sanitizedDropdownProps}
            size="small"
            displayEmpty
            input={<StyledOutlinedInput />}
            onChange={handleDropdownChange}
            disabled={isDropdownReadOnly}
            slotProps={{
              input: { readOnly: isDropdownReadOnly },
            }}
          >
            <MenuItem value="">
              <em>Select {dropdownLabel}</em>
            </MenuItem>
            {dropdownOptions?.map((option) => (
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
            {dropdownMeta.touched && dropdownMeta.error
              ? dropdownMeta.error
              : dropdownHelperText}
          </FormHelperText>
        </FormControl>
      </Box>
    </Box>
  );
};

export default TextAndDropdown;
