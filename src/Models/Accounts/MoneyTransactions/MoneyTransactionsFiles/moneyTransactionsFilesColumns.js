import React from "react";
import { Typography, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import ClickableText from "../../../../ComponentAssets/ClickableText";

export const getMoneyTransactionsFilesColumns = (theme, handleDownload, openDeleteDialog, formatFileSize, formatDate, canDelete) => [
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
    field: "documentDescription",
    headerName: "Description",
    width: 205,
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
      <IconButton
        onClick={() => openDeleteDialog(params.row)}
        disabled={!canDelete}
      >
        <Delete
          sx={{
            color: canDelete
              ? theme.palette.error.main
              : theme.palette.action.disabled,
            "&:hover": {
              color: canDelete
                ? theme.palette.error.dark
                : theme.palette.action.disabled,
            },
            fontSize: 20,
          }}
        />
      </IconButton>
    ),
  },
];
