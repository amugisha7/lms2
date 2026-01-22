import React from "react";
import { Typography, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import ClickableText from "../../ModelAssets/ClickableText";

const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null) return "N/A";
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Get columns configuration for file/link data grid
 * @param {Object} theme - MUI theme object
 * @param {Function} handleFileClick - Callback when a file is clicked (for preview/download)
 * @param {Function} openDeleteDialog - Callback to open delete confirmation dialog
 * @param {boolean} canDelete - Whether delete actions should be shown
 * @returns {Array} Column definitions for the data grid
 */
export const getFileDataGridColumns = (
  theme,
  handleFileClick,
  openDeleteDialog,
  canDelete = true
) => [
  {
    field: "fileName",
    headerName: "File Name",
    width: 280,
    renderCell: (params) => {
      if (params.row.type === "link") {
        const url = params.value.startsWith("http")
          ? params.value
          : `http://${params.value}`;
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: theme.palette.blueText.main,
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {params.value}
          </a>
        );
      } else {
        return (
          <ClickableText
            onClick={() => handleFileClick?.(params.row)}
            sx={{
              color: theme.palette.blueText.main,
              textDecoration: "underline",
              cursor: "pointer",
              "&:hover": {
                color: theme.palette.blueText.dark,
              },
            }}
          >
            {params.value}
          </ClickableText>
        );
      }
    },
  },
  {
    field: "description",
    headerName: "Description",
    width: 180,
  },
  // {
  //   field: "fileSize",
  //   headerName: "Size",
  //   width: 70,
  //   renderCell: (params) => (
  //     <Typography
  //       sx={{
  //         fontSize: "0.75rem",
  //         display: "flex",
  //         alignItems: "center",
  //         height: "100%",
  //       }}
  //     >
  //       {params.row.type === "link" ? "-" : formatFileSize(params.value)}
  //     </Typography>
  //   ),
  // },
  {
    field: "uploadDate",
    headerName: "Upload Date",
    width: 150,
    renderCell: (params) => (
      <Typography
        sx={{
          fontSize: "0.75rem",
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        {formatDate(params.value)}
      </Typography>
    ),
  },
  ...(canDelete
    ? [
        {
          field: "actions",
          headerName: "",
          width: 50,
          sortable: false,
          renderCell: (params) => (
            <IconButton onClick={() => openDeleteDialog(params.row)}>
              <Delete
                sx={{
                  color: theme.palette.error.main,
                  "&:hover": {
                    color: theme.palette.error.dark,
                  },
                  fontSize: 20,
                }}
              />
            </IconButton>
          ),
        },
      ]
    : []),
];

export { formatFileSize, formatDate };
