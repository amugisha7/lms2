import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";

export default function AdminPage() {
  const [search, setSearch] = React.useState("");

  // Settings links categorized
  const settingsLinks = [
    {
      category: "Loans",
      links: [
        { label: "Loan Products", href: "/admin/loan-products" },
        { label: "Loan Drafts", href: "/loan-drafts" },
        { label: "Loan Fees", href: "/admin/loan-fees" },
        { label: "Add Loan Fee", href: "/admin/add-loan-fee" },
      ],
    },
    {
      category: "Branches",
      links: [
        { label: "Branches List", href: "/admin/branches" },
        { label: "Add Branch", href: "/admin/add-branch" },
      ],
    },
    {
      category: "Borrowers",
      links: [{ label: "Borrowers", href: "/simpleBorrowers" }],
    },
    {
      category: "General",
      links: [
        { label: "Reports", href: "/reports" },
        { label: "Settings", href: "/settings" },
        { label: "Temp", href: "/temp" }, // Added Temp link
      ],
    },
    {
      category: "Securities",
      links: [
        { label: "Securities List", href: "/admin/securities" },
        { label: "Add Security", href: "/admin/add-security" },
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
              to={link.href}
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 16,
                textDecoration: "none",
                // color: "inherit",
              }}
            >
              {link.label}
            </Link>
          ))}
        </Box>
      ))}
    </Box>
  );
}
