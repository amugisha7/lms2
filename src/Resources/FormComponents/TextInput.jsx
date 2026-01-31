import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useField } from "formik";

const stripCommas = (value) => String(value ?? "").replace(/,/g, "");

const sanitizeNumericInput = (value) => {
  const raw = stripCommas(value);
  if (raw === "") return "";

  // Keep only digits, one leading '-', and one '.'
  let out = "";
  let sawDot = false;
  for (let i = 0; i < raw.length; i += 1) {
    const ch = raw[i];
    if (ch >= "0" && ch <= "9") {
      out += ch;
      continue;
    }
    if (ch === "-" && out.length === 0) {
      out += ch;
      continue;
    }
    if (ch === "." && !sawDot) {
      out += ch;
      sawDot = true;
      continue;
    }
  }

  // Allow partial values like '-', '.', '-.'
  if (out === "-" || out === "." || out === "-.") return out;

  // Ensure the remaining structure still looks like a number
  if (!/^-?\d*(\.\d*)?$/.test(out)) return "";
  return out;
};

const formatNumberWithCommas = (value) => {
  const raw = stripCommas(value);
  if (raw === "") return "";

  // Don't force-format incomplete values
  if (raw === "-" || raw === "." || raw === "-." || raw.endsWith(".")) {
    const withoutTrailingDot = raw.endsWith(".") ? raw.slice(0, -1) : raw;
    const formattedBase = formatNumberWithCommas(withoutTrailingDot);
    return raw.endsWith(".") ? `${formattedBase}.` : formattedBase;
  }

  const isNegative = raw.startsWith("-");
  const unsigned = isNegative ? raw.slice(1) : raw;
  const [intPart = "", decPart] = unsigned.split(".");

  // Format integer part without converting to Number (avoids precision loss for large values)
  const intDigits =
    intPart.replace(/^0+(?=\d)/, "") || (intPart === "" ? "" : "0");
  const formattedInt = intDigits
    ? intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "";

  const withDecimals =
    decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
  const signed = isNegative ? `-${withDecimals}` : withDecimals;
  return signed;
};

const caretIndexFromStrippedLength = (formatted, strippedLen) => {
  if (!formatted) return 0;
  if (!Number.isFinite(strippedLen) || strippedLen <= 0) return 0;
  let count = 0;
  for (let i = 0; i < formatted.length; i += 1) {
    if (formatted[i] === ",") continue;
    count += 1;
    if (count >= strippedLen) return i + 1;
  }
  return formatted.length;
};

const TextInput = ({
  label,
  name,
  type = "text",
  helperText,
  required,
  readOnly = false,
  editing = true,
  disabled = false,
  inputProps, // explicitly accept inputProps
  minLength, // <-- accept minLength
  maxLength, // <-- accept maxLength
  slotProps: incomingSlotProps, // <-- accept incoming slotProps for merging
  validationMessage, // <-- extract validationMessage to prevent it from reaching DOM
  validationType, // <-- extract validationType to prevent it from reaching DOM
  validationPattern, // <-- extract validationPattern to prevent it from reaching DOM
  dynamicLabel,
  dependsOn,
  dependsOnValue,
  placeholder,
  defaultValue, // extract to prevent passing to TextField
  adminOnly, // extract to prevent passing to DOM
  isEditMode, // extract to prevent passing to DOM
  dynamicRequired, // extract to prevent passing to DOM
  dynamicRequiredValue, // extract to prevent passing to DOM
  ...props
}) => {
  const [field, meta, helpers] = useField(name);
  const isReadOnly = readOnly || editing === false || disabled;
  const isNumberType = type === "number";
  const [isFocused, setIsFocused] = React.useState(false);
  const [focusedDisplayValue, setFocusedDisplayValue] = React.useState("");
  const inputRef = React.useRef(null);

  const rawValue = field.value ?? "";
  const displayValue = React.useMemo(() => {
    if (!isNumberType) return rawValue;
    if (isFocused && !isReadOnly) return focusedDisplayValue;
    return formatNumberWithCommas(rawValue);
  }, [focusedDisplayValue, isFocused, isNumberType, isReadOnly, rawValue]);

  // Merge consumer-provided slotProps with our readOnly and inputProps, plus min/max length
  const mergedSlotProps = {
    ...incomingSlotProps,
    input: {
      ...(incomingSlotProps?.input || {}),
      ...(inputProps || {}),
      ...(minLength !== undefined ? { minLength } : {}),
      ...(maxLength !== undefined ? { maxLength } : {}),
      readOnly: isReadOnly,
      ...(isNumberType ? { inputMode: "decimal" } : {}),
    },
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
      <TextField
        {...field}
        {...props}
        // label={label}
        type={isNumberType ? "text" : type}
        fullWidth
        variant="filled"
        placeholder={placeholder}
        required={required}
        value={displayValue}
        inputRef={inputRef}
        onFocus={(e) => {
          setIsFocused(true);
          if (isNumberType) {
            setFocusedDisplayValue(formatNumberWithCommas(rawValue));
          }
          props?.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          field.onBlur(e);
          if (isNumberType) {
            setFocusedDisplayValue("");
          }
          props?.onBlur?.(e);
        }}
        onChange={(e) => {
          if (!isNumberType) {
            field.onChange(e);
            return;
          }
          const currentInput = e.target.value;
          const caret = e.target.selectionStart ?? currentInput.length;
          const strippedLenBeforeCaret = stripCommas(
            currentInput.slice(0, caret),
          ).length;

          const nextRaw = sanitizeNumericInput(currentInput);
          helpers.setValue(nextRaw);

          const nextFormatted = formatNumberWithCommas(nextRaw);
          setFocusedDisplayValue(nextFormatted);

          // Restore caret based on logical (comma-stripped) position.
          const targetStrippedLen = Math.min(
            strippedLenBeforeCaret,
            stripCommas(nextFormatted).length,
          );
          const nextCaret = caretIndexFromStrippedLength(
            nextFormatted,
            targetStrippedLen,
          );
          setTimeout(() => {
            const el = inputRef.current;
            if (!el || typeof el.setSelectionRange !== "function") return;
            try {
              el.setSelectionRange(nextCaret, nextCaret);
            } catch {
              // ignore
            }
          }, 0);
        }}
        error={isReadOnly ? false : meta.touched && Boolean(meta.error)} // hide error state when read-only
        helperText={
          isReadOnly
            ? undefined
            : meta.touched && meta.error
              ? meta.error
              : helperText // hide helper text when read-only
        }
        size="small"
        // inputProps removed; moved into slotProps.input
        slotProps={mergedSlotProps}
        sx={{
          flex: { xs: "unset", sm: "1 1 auto" },
          width: { xs: "100%", sm: "auto" },
          minWidth: 0,
          "& .MuiFilledInput-input": {
            paddingTop: 0.5,
            paddingBottom: 0.5,
            borderRadius: 0,
          },
          "& .MuiFilledInput-root": {
            backgroundColor: isReadOnly ? "transparent" : undefined, // transparent when read-only
            "&:hover": {
              backgroundColor: isReadOnly ? "transparent" : undefined, // keep transparent on hover
            },
            "&.Mui-focused": {
              backgroundColor: isReadOnly ? "transparent" : undefined, // keep transparent on focus
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
  );
};

export default TextInput;
