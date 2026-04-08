import React from "react";
import { Typography, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import ClickableText from "../../../ModelAssets/ClickableText";

export const getLoanFilesColumns = (
  theme,
  handleDownload,
  openDeleteDialog,
  formatDate,
  canDelete,
) => [
  {
    field: "documentName",
    headerName: "File Name",
    width: 300,
    renderCell: (params) => {
      if (params.row.documentType === "link") {
        const url = params.value?.startsWith("http")
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
      }
      return (
        <ClickableText
          onClick={() => handleDownload(params.row)}
          sx={{
            color: theme.palette.blueText.main,
            textDecoration: "underline",
            cursor: "pointer",
            "&:hover": { color: theme.palette.blueText.dark },
          }}
        >
          {params.value || params.row.fileName}
        </ClickableText>
      );
    },
  },
  {
    field: "documentDescription",
    headerName: "Description",
    width: 205,
  },
  {
    field: "createdAt",
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
                  fontSize: "1.1rem",
                  color: theme.palette.error.main,
                }}
              />
            </IconButton>
          ),
        },
      ]
    : []),
];
