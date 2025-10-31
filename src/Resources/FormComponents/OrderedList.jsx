import React from "react";
import { Box, Typography, List, ListItem, IconButton } from "@mui/material";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";

const OrderedList = ({
  label,
  items,
  onChange,
  helperText,
  required,
  readOnly = false,
  editing = true,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isReadOnly = readOnly || editing === false;

  const moveItemUp = (index) => {
    if (index > 0 && !isReadOnly) {
      const newItems = [...items];
      [newItems[index - 1], newItems[index]] = [
        newItems[index],
        newItems[index - 1],
      ];
      onChange(newItems);
    }
  };

  const moveItemDown = (index) => {
    if (index < items.length - 1 && !isReadOnly) {
      const newItems = [...items];
      [newItems[index + 1], newItems[index]] = [
        newItems[index],
        newItems[index + 1],
      ];
      onChange(newItems);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "flex-start" },
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
          flexDirection: "column",
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
      <Box
        sx={{
          flex: { xs: "unset", sm: 3 },
          width: { xs: "100%", sm: "auto" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        {editing ? (
          <>
            {helperText && (
              <Typography
                variant="caption"
                sx={{
                  mb: 1,
                  color: "text.secondary",
                  display: "block",
                }}
              >
                {helperText}
              </Typography>
            )}
            <Box
              sx={{
                width: "100%",
                maxWidth: 300,
                border: `1px solid ${colors.grey[200]}`,
                borderRadius: "4px",
                backgroundColor: isReadOnly
                  ? "transparent"
                  : theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.09)"
                  : "rgba(0, 0, 0, 0.06)",
              }}
            >
              <List
                dense
                sx={{
                  minHeight: 105,
                  padding: 0,
                  "& .MuiListItem-root": {
                    paddingTop: "4px",
                    paddingBottom: "4px",
                  },
                }}
              >
                {items.map((item, idx) => (
                  <ListItem
                    key={`${item}-${idx}`}
                    secondaryAction={
                      !isReadOnly && (
                        <>
                          <IconButton
                            edge="end"
                            aria-label="move up"
                            onClick={() => moveItemUp(idx)}
                            disabled={idx === 0}
                            size="small"
                          >
                            <ArrowUpward
                              sx={{
                                color:
                                  idx === 0
                                    ? colors.grey[500]
                                    : colors.blueAccent[400],
                              }}
                              fontSize="inherit"
                            />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="move down"
                            onClick={() => moveItemDown(idx)}
                            disabled={idx === items.length - 1}
                            size="small"
                          >
                            <ArrowDownward
                              sx={{
                                color:
                                  idx === items.length - 1
                                    ? colors.grey[500]
                                    : colors.blueAccent[400],
                              }}
                              fontSize="inherit"
                            />
                          </IconButton>
                        </>
                      )
                    }
                    sx={{
                      color: colors.grey[200],
                      paddingRight: isReadOnly ? 2 : 9,
                    }}
                  >
                    {idx + 1}. {item}
                  </ListItem>
                ))}
              </List>
            </Box>
          </>
        ) : (
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              pl: 1.5,
            }}
          >
            {items.map((item, idx) => `${idx + 1}. ${item}`).join(", ")}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default OrderedList;
