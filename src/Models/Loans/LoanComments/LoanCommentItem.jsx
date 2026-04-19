import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import { formatCommentDate, formatEmployeeName } from "./loanCommentHelpers";

export default function LoanCommentItem({
  comment,
  currentEmployeeID,
  canDelete,
  onDelete,
}) {
  const theme = useTheme();
  const isOwnComment = comment?.createdByEmployeeID === currentEmployeeID;
  const isDark = theme.palette.mode === "dark";

  const bubbleColor = isOwnComment
    ? isDark
      ? "#1a2733"
      : "#e8f4fd"
    : isDark
      ? "#1e2228"
      : "#f5f7fa";

  const attachments = React.useMemo(() => {
    if (!comment?.attachments) {
      return [];
    }

    try {
      const parsed =
        typeof comment.attachments === "string"
          ? JSON.parse(comment.attachments)
          : comment.attachments;

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [comment?.attachments]);

  return (
    <Box
      sx={{
        backgroundColor: bubbleColor,
        borderRadius: 2,
        p: 1.5,
        mb: 1,
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          mb: 0.5,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: theme.palette.text.primary }}
        >
          {formatEmployeeName(
            comment?.createdByEmployee,
            comment?.customLoanCommentDetails,
          )}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary, textAlign: "right" }}
          >
            {formatCommentDate(comment?.commentAt)}
          </Typography>

          {canDelete && isOwnComment ? (
            <IconButton
              size="small"
              onClick={onDelete}
              sx={{ color: theme.palette.error.main, p: 0.25 }}
            >
              <DeleteIcon sx={{ fontSize: "1rem" }} />
            </IconButton>
          ) : null}
        </Box>
      </Box>

      <Typography
        variant="body2"
        sx={{ whiteSpace: "pre-wrap", color: theme.palette.text.primary }}
      >
        {comment?.body || ""}
      </Typography>

      {attachments.length > 0 ? (
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            mt: 0.5,
            display: "block",
          }}
        >
          {attachments.length} attachment{attachments.length === 1 ? "" : "s"}
        </Typography>
      ) : null}
    </Box>
  );
}
