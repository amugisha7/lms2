import React, { forwardRef, useImperativeHandle } from "react";
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";

const REPAYMENT_FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly", label: "Monthly" },
  { value: "bimonthly", label: "Bimonthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "every_4_months", label: "Every 4 Months" },
  { value: "semi_annual", label: "Semi-Annual" },
  { value: "every_9_months", label: "Every 9 Months" },
  { value: "yearly", label: "Yearly" },
  { value: "lump_sum", label: "Lump-Sum" },
];

const REPAYMENT_ORDER_OPTIONS = ["Penalty", "Fees", "Interest", "Principal"];

const RepaymentSettings = forwardRef(function RepaymentSettings(
  { formik },
  ref
) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [repaymentOrder, setRepaymentOrder] = React.useState(
    REPAYMENT_ORDER_OPTIONS
  );

  useImperativeHandle(ref, () => ({
    getRepaymentOrder: () => [...repaymentOrder],
  }));

  const moveOrderUp = (index) => {
    if (index > 0) {
      const newOrder = [...repaymentOrder];
      [newOrder[index - 1], newOrder[index]] = [
        newOrder[index],
        newOrder[index - 1],
      ];
      setRepaymentOrder(newOrder);
    }
  };

  const moveOrderDown = (index) => {
    if (index < repaymentOrder.length - 1) {
      const newOrder = [...repaymentOrder];
      [newOrder[index + 1], newOrder[index]] = [
        newOrder[index],
        newOrder[index + 1],
      ];
      setRepaymentOrder(newOrder);
    }
  };

  return (
    <>
      <Grid size={{ xs: 12, md: 12 }}>
        <hr style={{ width: "100%", marginBottom: "20px" }} />
        <Typography variant="caption" sx={{ mt: 2 }}>
          REPAYMENT SETTINGS:
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormLabel htmlFor="repaymentFrequency">Repayment Frequency</FormLabel>
        <Select
          id="repaymentFrequency"
          name="repaymentFrequency"
          value={formik.values.repaymentFrequency || ""}
          onChange={formik.handleChange}
          size="small"
          fullWidth
          renderValue={(selected) => {
            if (!selected) return "Select Repayment Frequency";
            const found = REPAYMENT_FREQUENCY_OPTIONS.find(
              (o) => o.value === selected
            );
            return found ? found.label : "Select Repayment Frequency";
          }}
          sx={{
            border:
              formik.touched.repaymentFrequency &&
              formik.errors.repaymentFrequency
                ? "1.5px solid #d32f2f"
                : `1px solid ${colors.grey[200]}`,
            width: "100%",
          }}
        >
          <MenuItem value="" disabled sx={{ "&:hover": { color: "white" } }}>
            Select Repayment Frequency
          </MenuItem>
          {REPAYMENT_FREQUENCY_OPTIONS.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{ "&:hover": { color: "white" } }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <FormLabel sx={{ mb: 1 }}>Repayment Order</FormLabel>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="caption" sx={{ mb: 1 }}>
            This is the order in which received payments are allocated. For
            example, if the order is Fees → Principal → Interest → Penalty and a
            $100 payment is received, the system first covers any Fees, then
            applies the remainder to Principal, then Interest, and finally
            Penalty.
          </Typography>
          <Box
            sx={{
              width: 200,
              border: `1px solid ${colors.grey[200]}`,
              borderRadius: "4px",
            }}
          >
            <List
              dense
              sx={{
                // maxHeight: 160,
                height: 105,
                // overflow: "auto",
                padding: 0,
                "& .MuiListItem-root": {
                  paddingTop: "0px",
                  paddingBottom: "0px",
                },
              }}
            >
              {repaymentOrder.map((item, idx) => (
                <ListItem
                  key={`${item}-${idx}`}
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        aria-label="up"
                        onClick={() => moveOrderUp(idx)}
                        disabled={idx === 0}
                        size="small"
                      >
                        <ArrowUpward
                          sx={{ color: colors.blueAccent[400] }}
                          fontSize="inherit"
                        />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="down"
                        onClick={() => moveOrderDown(idx)}
                        disabled={idx === repaymentOrder.length - 1}
                        size="small"
                      >
                        <ArrowDownward
                          sx={{ color: colors.blueAccent[400] }}
                          fontSize="inherit"
                        />
                      </IconButton>
                    </>
                  }
                  sx={{ color: colors.grey[200] }}
                >
                  {idx + 1}. {item}
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Grid>
    </>
  );
});

export default RepaymentSettings;
