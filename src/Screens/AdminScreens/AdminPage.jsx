import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";

export default function AdminPage() {
  const [search, setSearch] = React.useState("");

  // Settings links categorized
  const settingsLinks = [
    {
      category: "Loans",
      links: [
        { label: "Add Loan Product", href: "/admin/add-loan-product" },
        { label: "Add Loan Fee", href: "/admin/add-loan-fee" },
        { label: "Loan Fees List", href: "/admin/loan-fees" }, // Add this link
      ],
    },
    {
      category: "Borrowers",
      links: [
        { label: "Create Borrower", href: "/addBorrower" },
        { label: "View Borrowers", href: "/allBorrowers" },
        { label: "Custom Fields", href: "/customFields" },
      ],
    },
    {
      category: "General",
      links: [
        { label: "Reports", href: "/reports" },
        { label: "Settings", href: "/settings" },
      ],
    },
  ];

  // Filter links by search
  const filteredLinks = settingsLinks
    .map((cat) => ({
      ...cat,
      links: cat.links.filter((link) =>
        link.label.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.links.length > 0);

  return (
    <Box
      sx={{
        mx: { xs: 0, sm: "auto" },
        mt: { xs: 0, sm: 0 },
        p: { xs: 0, sm: 0 },
        borderRadius: 1,
        display: "flex",
        flexDirection: "column",
        maxWidth: { xs: "100%", md: 800 },
        mx: "auto",
        width: "100%",
        flex: 1,
        mb: 6,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: 600, my: 2, textTransform: "uppercase" }}
      >
        Admin Settings
      </Typography>
      <TextField
        label="Search Settings"
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, maxWidth: 400 }}
      />
      {filteredLinks.map((cat) => (
        <Box key={cat.category} sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            {cat.category}
          </Typography>
          {cat.links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              sx={{ display: "block", mb: 1, fontSize: 16 }}
            >
              {link.label}
            </Link>
          ))}
        </Box>
      ))}
    </Box>
  );
}
