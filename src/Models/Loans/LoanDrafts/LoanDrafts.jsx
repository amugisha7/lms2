import React from "react";
import { Box, Typography } from "@mui/material";

export default function LoanDrafts() {
  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 600, textTransform: "uppercase" }}
      >
        Loan Drafts
      </Typography>
      <Typography sx={{ mt: 1 }}>
        This screen will list and manage loan drafts.
      </Typography>
    </Box>
  );
}
