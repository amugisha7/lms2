import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme, useMediaQuery } from "@mui/material";
import CustomDataGrid from "../../../ModelAssets/CustomDataGrid";
import ClickableText from "../../../ModelAssets/ClickableText";
import PlusButtonSmall from "../../../ModelAssets/PlusButtonSmall";
import { useNavigate } from "react-router-dom";

export default function ListBorrowers({ borrowers, onSelect, onClose }) {
  const [search, setSearch] = React.useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const getBorrowerDisplayName = (borrower) => {
    const fullName = [borrower.firstname, borrower.othername]
      .filter(Boolean)
      .join(" ");
    return fullName
      ? `${fullName}${
          borrower.businessName ? ` (${borrower.businessName})` : ""
        }`
      : borrower.businessName || "Unnamed Borrower";
  };

  const borrowersWithDisplayName = borrowers.map((borrower) => ({
    ...borrower,
    displayName: getBorrowerDisplayName(borrower),
    totalDebt:
      borrower.loans?.items?.reduce(
        (sum, loan) => sum + (loan.principal || 0),
        0
      ) || 0,
  }));

  const filteredBorrowers = borrowersWithDisplayName.filter((borrower) =>
    borrower.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      field: "addLoan",
      headerName: "",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <PlusButtonSmall onClick={() => onSelect(params.row)} />
        </Box>
      ),
    },
    {
      field: "displayName",
      headerName: "Full Name / Business Name",
      width: 300,
      renderCell: (params) => (
        <ClickableText
          onClick={() => navigate(`/borrowers/id/${params.row.id}/view`)}
        >
          {params.value}
        </ClickableText>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "Phone No.",
      width: 140,
      renderCell: (params) => params.value || "",
    },
    {
      field: "totalDebt",
      headerName: "Total Debt",
      width: 120,
      renderCell: (params) => `$${params.value?.toLocaleString() || "0"}`,
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
          initialState={{
            sorting: {
              sortModel: [{ field: "displayName", sort: "asc" }],
            },
          }}
        />
      )}
    </Box>
  );
}
