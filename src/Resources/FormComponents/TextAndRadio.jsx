import React from "react";
import {
  Box,
  TextField,
  Typography,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import { useField } from "formik";

const TextAndRadio = ({
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

  // Radio Group Props
  radioLabel,
  radioName,
  radioOptions,
  radioHelperText,
  radioRequired,
  radioOnChange, // Pass through for external onChange handling
  radioGroupProps, // for any remaining MuiRadioGroup specific props

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
  const [textField, textMeta] = useField(textName);
  const [radioField, radioMeta, radioHelpers] = useField(radioName);

  const isReadOnly = readOnly || !editing || disabled;

  const handleRadioChange = (event) => {
    radioHelpers.setValue(event.target.value);
    if (radioOnChange) {
      radioOnChange(event);
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
      {...otherProps}
    >
      {/* Text Input - 30% width on desktop, 100% on mobile */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", sm: "30%" },
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
          {...textInputProps}
          {...otherProps}
          type={textType}
          fullWidth
          variant="filled"
          placeholder={textPlaceholder}
          required={textRequired}
          error={
            isReadOnly ? false : textMeta.touched && Boolean(textMeta.error)
          }
          helperText={
            isReadOnly
              ? undefined
              : textMeta.touched && textMeta.error
              ? textMeta.error
              : textHelperText
          }
          size="small"
          inputProps={{ readOnly: isReadOnly }}
          sx={{
            width: "100%",
            "& .MuiFilledInput-input": {
              paddingTop: 0.5,
              paddingBottom: 0.5,
              borderRadius: 0,
            },
            "& .MuiFilledInput-root": {
              backgroundColor: isReadOnly ? "transparent" : undefined,
              "&:hover": {
                backgroundColor: isReadOnly ? "transparent" : undefined,
              },
              "&.Mui-focused": {
                backgroundColor: isReadOnly ? "transparent" : undefined,
              },
              "&:before, &:after": {
                borderBottomColor: isReadOnly ? "transparent" : undefined,
              },
              "&.Mui-focused:after": {
                borderBottomColor: isReadOnly
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

      {/* Radio Group - 70% width on desktop, 100% on mobile */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", sm: "70%" },
          minHeight: "56px", // Ensure consistent height with text input
          justifyContent: "flex-end", // Align content to the bottom
        }}
      >
        {radioLabel && ( // Conditionally render label for radio group if provided
          <Typography
            sx={{
              fontSize: 12,
              mb: 1, // Margin bottom for spacing
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.text.secondary
                  : theme.palette.text.primary,
            }}
          >
            {radioLabel}
            {radioRequired && (
              <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>
                *
              </Box>
            )}
          </Typography>
        )}
        <MuiRadioGroup
          {...radioField}
          value={radioField.value ?? (radioOptions?.length > 0 ? radioOptions[0].value : "")}
          {...radioGroupProps}
          onChange={handleRadioChange}
          row
          sx={{ width: "100%" }}
        >
          {radioOptions?.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio disabled={isReadOnly} size="small" />}
              label={option.label}
              disabled={isReadOnly}
              sx={{ mr: 3, ".MuiFormControlLabel-label": { fontSize: 12 } }}
            />
          ))}
        </MuiRadioGroup>
        <FormHelperText error={radioMeta.touched && Boolean(radioMeta.error)}>
          {radioMeta.touched && radioMeta.error
            ? radioMeta.error
            : radioHelperText}
        </FormHelperText>
      </Box>
    </Box>
  );
};

export default TextAndRadio;
