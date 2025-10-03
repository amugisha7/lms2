import React from "react";
import { Typography, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import ClickableText from "../../../ComponentAssets/ClickableText";

export const getBorrowerFilesColumns = (theme, handleDownload, openDeleteDialog, formatFileSize, formatDate) => [
  {
    field: "fileName",
    headerName: "File Name",
    width: 300,
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
            onClick={() => handleDownload(params.row)}
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
    width: 205,
  },
  {
    field: "fileSize",
    headerName: "Size",
    width: 70,
    renderCell: (params) => (
      <Typography
        sx={{
          fontSize: "0.75rem",
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        {formatFileSize(params.value)}
      </Typography>
    ),
  },
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
];
