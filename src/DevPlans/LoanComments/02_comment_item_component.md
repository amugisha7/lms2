# Prompt 2: Create LoanCommentItem Component

## Context

You are building a Loan Comments feature in a React + MUI app. This component renders a single comment in a chat-bubble style, showing the author name, timestamp, body text, and optionally a delete button. It follows the visual patterns of the existing codebase (MUI `useTheme()`, dark/light mode support).

## File to Create: `src/Models/Loans/LoanComments/LoanCommentItem.jsx`

### Requirements

1. **Props:**
   - `comment` (object) — The comment record with fields: `id`, `body`, `commentAt`, `createdByEmployee`, `createdByEmployeeID`, `attachments`
   - `currentEmployeeID` (string) — The logged-in employee's ID, used to determine if this is "your" comment
   - `canDelete` (boolean) — Whether to show the delete icon
   - `onDelete` (function) — Callback `(commentId) => void` when delete is clicked

2. **Layout — chat-bubble style:**
   - Use a `Box` with subtle background color, rounded corners (`borderRadius: 2`), and padding
   - "Own" comments (where `comment.createdByEmployeeID === currentEmployeeID`) should have a slightly different background tint to differentiate
   - Header row: employee name (bold, `variant="subtitle2"`) on the left, formatted date on the right (`variant="caption"`, secondary text color)
   - Body: `variant="body2"`, with `whiteSpace: "pre-wrap"` to preserve line breaks
   - If `canDelete` is true and this is the current employee's comment (or user has admin delete permission), show a small `IconButton` with `Delete` icon from `@mui/icons-material` in the top-right area
   - If `attachments` is present and is a non-empty array (parse from JSON string if needed), display a small chip/text below the body showing attachment count (e.g., "2 attachments"). This is metadata only — no download functionality needed for now.

3. **Styling:**
   - Import `useTheme` from `@mui/material/styles`
   - Use `theme.palette.mode` to determine dark/light backgrounds
   - Light mode bubble: `backgroundColor: "#f5f7fa"`, own comment: `backgroundColor: "#e8f4fd"`
   - Dark mode bubble: `backgroundColor: "#1e2228"`, own comment: `backgroundColor: "#1a2733"`
   - Keep spacing tight — `p: 1.5`, `mb: 1`

4. **Imports:**
   - `React` from `"react"`
   - `Box`, `Typography`, `IconButton` from `"@mui/material"`
   - `Delete` from `"@mui/icons-material/Delete"`
   - `useTheme` from `"@mui/material/styles"`
   - `{ formatCommentDate, formatEmployeeName }` from `"./loanCommentHelpers"`

### Example structure:

```jsx
import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { formatCommentDate, formatEmployeeName } from "./loanCommentHelpers";

export default function LoanCommentItem({
  comment,
  currentEmployeeID,
  canDelete,
  onDelete,
}) {
  const theme = useTheme();
  const isOwnComment = comment.createdByEmployeeID === currentEmployeeID;
  const isDark = theme.palette.mode === "dark";

  const bgColor = isOwnComment
    ? isDark
      ? "#1a2733"
      : "#e8f4fd"
    : isDark
      ? "#1e2228"
      : "#f5f7fa";

  // Parse attachments if string
  const attachments = React.useMemo(() => {
    if (!comment.attachments) return [];
    try {
      const parsed =
        typeof comment.attachments === "string"
          ? JSON.parse(comment.attachments)
          : comment.attachments;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [comment.attachments]);

  return (
    <Box
      sx={{
        backgroundColor: bgColor,
        borderRadius: 2,
        p: 1.5,
        mb: 1,
        position: "relative",
      }}
    >
      {/* Header: Name + Date + Delete */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 0.5,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: theme.palette.text.primary }}
        >
          {formatEmployeeName(comment.createdByEmployee)}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary }}
          >
            {formatCommentDate(comment.commentAt)}
          </Typography>
          {canDelete && isOwnComment && (
            <IconButton
              size="small"
              onClick={() => onDelete(comment.id)}
              sx={{ color: theme.palette.error.main, p: 0.25 }}
            >
              <Delete sx={{ fontSize: "1rem" }} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Body */}
      <Typography
        variant="body2"
        sx={{ whiteSpace: "pre-wrap", color: theme.palette.text.primary }}
      >
        {comment.body}
      </Typography>

      {/* Attachments indicator */}
      {attachments.length > 0 && (
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            mt: 0.5,
            display: "block",
          }}
        >
          {attachments.length} attachment{attachments.length > 1 ? "s" : ""}
        </Typography>
      )}
    </Box>
  );
}
```

## Verification

- Component renders without errors when given a minimal `comment` object: `{ id: "1", body: "Test", commentAt: "2026-04-18T10:00:00.000Z", createdByEmployeeID: "emp1", createdByEmployee: { firstName: "John", lastName: "Doe" } }`
- Delete button only appears for own comments when `canDelete` is true
- Dark and light mode backgrounds differ correctly
