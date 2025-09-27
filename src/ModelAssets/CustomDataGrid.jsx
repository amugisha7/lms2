import {
  DataGrid,
  ExportCsv,
  Toolbar,
  ToolbarButton,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  QuickFilterTrigger,
} from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";

const StyledQuickFilter = styled(QuickFilter)({
  display: "grid",
  alignItems: "center",
});

const StyledToolbarButton = styled(ToolbarButton)(({ theme, ownerState }) => ({
  gridArea: "1 / 1",
  width: "min-content",
  height: "min-content",
  zIndex: 1,
  opacity: ownerState.expanded ? 0 : 1,
  pointerEvents: ownerState.expanded ? "none" : "auto",
  transition: theme.transitions.create(["opacity"]),
}));

const StyledTextField = styled(TextField)(({ theme, ownerState }) => ({
  gridArea: "1 / 1",
  overflowX: "clip",
  width: ownerState.expanded ? 260 : "var(--trigger-width)",
  opacity: ownerState.expanded ? 1 : 0,
  transition: theme.transitions.create(["width", "opacity"]),
}));

function CustomToolbar() {
  return (
    <Toolbar>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          // p: 1,
        }}
      >
        <StyledQuickFilter defaultExpanded>
          <QuickFilterTrigger
            render={(triggerProps, state) => (
              <Tooltip title="Search" enterDelay={0}>
                <StyledToolbarButton
                  {...triggerProps}
                  ownerState={{ expanded: state.expanded }}
                  color="default"
                  aria-disabled={state.expanded}
                >
                  <SearchIcon fontSize="small" />
                </StyledToolbarButton>
              </Tooltip>
            )}
          />
          <QuickFilterControl
            render={({ ref, ...controlProps }, state) => (
              <StyledTextField
                {...controlProps}
                ownerState={{ expanded: state.expanded }}
                inputRef={ref}
                aria-label="Search"
                placeholder="Search..."
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: state.value ? (
                      <InputAdornment position="end">
                        <QuickFilterClear
                          edge="end"
                          size="small"
                          aria-label="Clear search"
                          material={{ sx: { marginRight: -0.75 } }}
                        >
                          <CancelIcon fontSize="small" />
                        </QuickFilterClear>
                      </InputAdornment>
                    ) : null,
                    ...controlProps.slotProps?.input,
                  },
                  ...controlProps.slotProps,
                }}
              />
            )}
          />
        </StyledQuickFilter>
        <Tooltip title="Download as CSV">
          <ExportCsv render={<ToolbarButton />}>
            <FileDownloadIcon fontSize="small" />
          </ExportCsv>
        </Tooltip>
      </Box>
    </Toolbar>
  );
}

const CustomDataGrid = ({
  rows,
  columns,
  loading = false,
  minHeight = 400,
  maxHeight = 700,
  pageSize = 50,
  pageSizeOptions = [50, 100],
  allowSorting = true,
  onRowClick,
  ...otherProps
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const customStyles = {
    // height,
    width: "100%",
    // border: `1px solid ${isDark ? "#404040" : "#e0e0e0"}`, // Remove top border
    // borderLeft: `1px solid ${isDark ? "#404040" : "#e0e0e0"}`,
    // borderRight: `1px solid ${isDark ? "#404040" : "#e0e0e0"}`,
    // borderBottom: `1px solid ${isDark ? "#404040" : "#e0e0e0"}`,
    // borderRadius: "8px",
    overflow: "hidden",
    marginBottom: 8,
    fontFamily: theme.typography.fontFamily,

    // Header styling
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5",
      borderBottom: `2px solid ${isDark ? "#404040" : "#d0d0d0"}`,
      fontSize: "0.875rem",
      fontWeight: 600,
      color: isDark ? "#e8e6e3" : "#393a3d",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },

    "& .MuiDataGrid-columnHeader": {
      padding: "8px 16px",
      "&:focus": {
        outline: "none",
      },
    },

    // Cell styling
    "& .MuiDataGrid-cell": {
      borderBottom: `1px solid ${isDark ? "#333333" : "#e8e8e8"}`,
      padding: "0px 16px 16px 12px",
      fontSize: "0.82rem",
      color: isDark ? "#e8e6e3" : "#393a3d",
      "&:focus": {
        outline: "none",
      },
    },

    // Alternating row colors
    "& .MuiDataGrid-row": {
      "&:nth-of-type(odd)": {
        backgroundColor: isDark ? "#23272b" : "#f7fafd",
      },
      "&:nth-of-type(even)": {
        backgroundColor: isDark ? "#1b1f23" : "#ffffff",
      },
      ...(otherProps.onRowClick && {
        "&:hover": {
          backgroundColor: `${isDark ? "#31363b" : "#f0f4f8"} !important`,
          cursor: "pointer",
        },
      }),
      transition: "background-color 0.2s ease-in-out",
    },

    // Footer/pagination styling
    "& .MuiDataGrid-footerContainer": {
      borderTop: `1px solid ${isDark ? "#404040" : "#e0e0e0"}`,
      backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5",
    },

    "& .MuiDataGrid-pagination": {
      color: isDark ? "#e8e6e3" : "#393a3d",
    },

    // Scrollbar styling
    "& .MuiDataGrid-virtualScroller": {
      "&::-webkit-scrollbar": {
        width: "8px",
        height: "8px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: isDark ? "#2a2a2a" : "#f1f1f1",
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: isDark ? "#555555" : "#c1c1c1",
        borderRadius: "4px",
        "&:hover": {
          backgroundColor: isDark ? "#666666" : "#a1a1a1",
        },
      },
    },

    // Loading overlay
    "& .MuiDataGrid-overlay": {
      backgroundColor: isDark
        ? "rgba(33, 33, 33, 0.9)"
        : "rgba(255, 255, 255, 0.9)",
      color: isDark ? "#e8e6e3" : "#393a3d",
    },

    // No rows overlay
    "& .MuiDataGrid-noRowsContainer": {
      backgroundColor: "transparent",
      color: isDark ? "#b0b0b0" : "#666666",
      fontSize: "0.875rem",
      fontStyle: "italic",
    },

    // Selection styling (if needed)
    "& .MuiDataGrid-row.Mui-selected": {
      backgroundColor: `${isDark ? "#1976d2" : "#1976d2"}40 !important`,
      "&:hover": {
        backgroundColor: `${isDark ? "#1976d2" : "#1976d2"}60 !important`,
      },
    },

    // Toolbar styling (if used)
    "& .MuiDataGrid-toolbarContainer": {
      padding: "16px",
      borderBottom: `1px solid ${isDark ? "#404040" : "#e0e0e0"}`,
      backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5",
    },
  };

  return (
    <Box sx={customStyles}>
      <DataGrid
        rows={rows}
        columns={
          allowSorting
            ? columns.map((col) => ({
                ...col,
                sortable: col.sortable !== undefined ? col.sortable : true,
              }))
            : columns.map((col) => ({
                ...col,
                sortable: false,
              }))
        }
        loading={loading}
        density="compact"
        disableRowSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: {
              pageSize,
            },
          },
        }}
        pageSizeOptions={pageSizeOptions}
        onRowClick={onRowClick}
        {...otherProps}
        sx={{
          border: "none",
          height: "100%",
          "& .MuiDataGrid-main": {
            borderRadius: 0,
          },
        }}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
      />
    </Box>
  );
};

export default CustomDataGrid;
