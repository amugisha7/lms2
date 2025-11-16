import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme, useMediaQuery } from "@mui/material";
import CustomDataGrid from "../../../ModelAssets/CustomDataGrid";
import ClickableText from "../../../ModelAssets/ClickableText";

export default function ListBorrowers({ borrowers, onSelect, onClose }) {
  const [search, setSearch] = React.useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const filteredBorrowers = borrowers.filter((borrower) =>
    `${borrower.firstname || ""} ${borrower.othername || ""} ${
      borrower.businessName || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = isMobile
    ? [
        {
          field: "name",
          headerName: "Borrower",
          width: 300,
          renderCell: (params) => {
            const name = `${params.row.firstname || ""} ${
              params.row.othername || ""
            } ${params.row.businessName || ""}`.trim();
            return (
              <ClickableText onClick={() => onSelect(params.row)}>
                {name || "Unknown"}
              </ClickableText>
            );
          },
        },
      ]
    : [
        {
          field: "firstname",
          headerName: "First Name",
          width: 150,
          renderCell: (params) => (
            <ClickableText onClick={() => onSelect(params.row)}>
              {params.value || "N/A"}
            </ClickableText>
          ),
        },
        {
          field: "othername",
          headerName: "Other Name",
          width: 150,
          renderCell: (params) => (
            <ClickableText onClick={() => onSelect(params.row)}>
              {params.value || "N/A"}
            </ClickableText>
          ),
        },
        {
          field: "businessName",
          headerName: "Business Name",
          width: 200,
          renderCell: (params) => (
            <ClickableText onClick={() => onSelect(params.row)}>
              {params.value || "N/A"}
            </ClickableText>
          ),
        },
        {
          field: "phoneNumber",
          headerName: "Phone Number",
          width: 150,
          renderCell: (params) => (
            <ClickableText onClick={() => onSelect(params.row)}>
              {params.value || "N/A"}
            </ClickableText>
          ),
        },
        {
          field: "email",
          headerName: "Email",
          width: 200,
          renderCell: (params) => (
            <ClickableText onClick={() => onSelect(params.row)}>
              {params.value || "N/A"}
            </ClickableText>
          ),
        },
      ];

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Search Borrowers"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      {filteredBorrowers.length === 0 ? (
        <Typography sx={{ mt: 4 }}>No borrowers found.</Typography>
      ) : (
        <CustomDataGrid
          rows={filteredBorrowers}
          columns={columns}
          getRowId={(row) => row.id}
          pageSize={25}
          pageSizeOptions={[25, 50, 100]}
          onRowClick={(params) => onSelect(params.row)}
          showToolbar={false}
        />
      )}
    </Box>
  );
}
