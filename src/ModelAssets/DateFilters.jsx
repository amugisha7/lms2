import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import SFClickableText from "./SF_ClickableText";

const DEFAULT_DATE_PRESET_OPTIONS = [
  { key: "this_week", label: "This Week" },
  { key: "last_week", label: "Last Week" },
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
  { key: "last_3_months", label: "Last 3 Months" },
  { key: "last_6_months", label: "Last 6 Months" },
  { key: "this_year", label: "This Year" },
  { key: "past_12_months", label: "Past 12 Months" },
];

const toDateInputValue = (date) => {
  const parsedDate = dayjs(date).startOf("day");
  return parsedDate.isValid() ? parsedDate.format("YYYY-MM-DD") : "";
};

const getPresetRange = (presetKey) => {
  const today = dayjs().startOf("day");
  let from = null;
  let to = today;

  if (presetKey === "this_week") {
    from = today.startOf("week");
  } else if (presetKey === "last_week") {
    from = today.startOf("week").subtract(1, "week");
    to = from.endOf("week");
  } else if (presetKey === "this_month") {
    from = today.startOf("month");
  } else if (presetKey === "last_month") {
    from = today.subtract(1, "month").startOf("month");
    to = today.subtract(1, "month").endOf("month");
  } else if (presetKey === "last_3_months") {
    to = today.subtract(1, "month").endOf("month");
    from = to.subtract(2, "month").startOf("month");
  } else if (presetKey === "last_6_months") {
    to = today.subtract(1, "month").endOf("month");
    from = to.subtract(5, "month").startOf("month");
  } else if (presetKey === "this_year") {
    from = today.startOf("year");
  } else if (presetKey === "past_12_months") {
    from = today.subtract(12, "month").add(1, "day");
  }

  if (!from) {
    return null;
  }

  return {
    from: toDateInputValue(from),
    to: toDateInputValue(to),
  };
};

export default function DateFilters({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  presetOptions = DEFAULT_DATE_PRESET_OPTIONS,
}) {
  const theme = useTheme();
  const sf = theme.palette.sf;
  const [showDateFilters, setShowDateFilters] = React.useState(false);
  const [activeDatePreset, setActiveDatePreset] = React.useState("");

  const isDateFilterActive = Boolean(dateFrom || dateTo);

  React.useEffect(() => {
    if (!dateFrom && !dateTo) {
      setActiveDatePreset("");
    }
  }, [dateFrom, dateTo]);

  const applyDatePreset = React.useCallback(
    (presetKey) => {
      const range = getPresetRange(presetKey);
      if (!range) {
        return;
      }

      onDateFromChange(range.from);
      onDateToChange(range.to);
      setShowDateFilters(true);
      setActiveDatePreset(presetKey);
    },
    [onDateFromChange, onDateToChange],
  );

  const clearDateFilter = React.useCallback(() => {
    onDateFromChange("");
    onDateToChange("");
    setShowDateFilters(false);
    setActiveDatePreset("");
  }, [onDateFromChange, onDateToChange]);

  return (
    <>
      {!showDateFilters && (
        <SFClickableText onClick={() => setShowDateFilters((prev) => !prev)}>
          Filter by Date
        </SFClickableText>
      )}
      {(showDateFilters || isDateFilterActive) && (
        <SFClickableText
          onClick={(event) => {
            event.stopPropagation();
            clearDateFilter();
          }}
        >
          Clear Date Filter
        </SFClickableText>
      )}
      {showDateFilters && (
        <Box
          sx={{
            display: "grid",
            gap: 1,
            width: "100%",
            gridTemplateColumns: {
              xs: "repeat(3, minmax(0, 1fr))",
              sm: "repeat(10, minmax(0, max-content))",
            },
            alignItems: "stretch",
          }}
        >
          {presetOptions.map((preset) => {
            const isActive = activeDatePreset === preset.key;

            return (
              <SFClickableText
                key={preset.key}
                onClick={() => applyDatePreset(preset.key)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 33,
                  px: 1,
                  mt: 0,
                  border: `1px solid ${isActive ? sf.sf_brandPrimary : sf.sf_searchBorder}`,
                  bgcolor: isActive ? sf.sf_brandPrimary : sf.sf_searchBg,
                  color: isActive ? sf.sf_whiteMain || "#fff" : sf.sf_textLink,
                  textDecoration: "none",
                  textAlign: "center",
                  lineHeight: 1.2,
                  borderRadius: 0,
                  transition:
                    "background-color 0.15s, color 0.15s, border-color 0.15s",
                  "&:hover": {
                    color: isActive
                      ? sf.sf_whiteMain || "#fff"
                      : sf.sf_textLinkHover,
                    bgcolor: isActive
                      ? sf.sf_brandPrimary
                      : sf.sf_actionHoverBg,
                    borderColor: sf.sf_brandPrimary,
                  },
                }}
              >
                {preset.label}
              </SFClickableText>
            );
          })}
          <Box
            sx={{
              display: "grid",
              gap: 1,
              gridColumn: {
                xs: "1 / -1",
                sm: "span 2",
              },
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(2, minmax(130px, 160px))",
              },
            }}
          >
            <TextField
              type="date"
              size="small"
              label="From"
              value={dateFrom}
              onChange={(e) => {
                onDateFromChange(e.target.value);
                setActiveDatePreset("");
              }}
              InputLabelProps={{ shrink: true }}
              sx={{
                minWidth: 130,
                "& .MuiInputBase-root": { borderRadius: 0, height: 33 },
                "& .MuiInputLabel-root": { fontSize: "0.72rem" },
                "& .MuiInputBase-input": {
                  fontSize: "0.78rem",
                  py: 0.7,
                },
              }}
            />
            <TextField
              type="date"
              size="small"
              label="To"
              value={dateTo}
              onChange={(e) => {
                onDateToChange(e.target.value);
                setActiveDatePreset("");
              }}
              InputLabelProps={{ shrink: true }}
              sx={{
                minWidth: 130,
                "& .MuiInputBase-root": { borderRadius: 0, height: 33 },
                "& .MuiInputLabel-root": { fontSize: "0.72rem" },
                "& .MuiInputBase-input": {
                  fontSize: "0.78rem",
                  py: 0.7,
                },
              }}
            />
          </Box>
        </Box>
      )}
    </>
  );
}
