import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTheme } from "@mui/material/styles";
import { generateClient } from "aws-amplify/api";
import { UserContext } from "../../../App";
import { useHasPermission } from "../../../ModelAssets/Permissions/permissions";
import DeleteDialog from "../../../ModelAssets/DeleteDialog";
import LoanCommentItem from "./LoanCommentItem";
import {
  LIST_LOAN_COMMENTS,
  CREATE_LOAN_COMMENT,
  DELETE_LOAN_COMMENT,
} from "./loanCommentQueries";
import { sortCommentsByDate } from "./loanCommentHelpers";

const buildCommentAuthorDetails = (userDetails) => {
  const firstName = userDetails?.firstName?.trim?.() || "";
  const lastName = userDetails?.lastName?.trim?.() || "";
  const otherName =
    userDetails?.othername?.trim?.() ||
    userDetails?.otherName?.trim?.() ||
    userDetails?.middleName?.trim?.() ||
    "";
  const email = userDetails?.email?.trim?.() || "";
  const userName = [firstName, lastName, otherName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    userID: userDetails?.id || "",
    employeeID: userDetails?.relatedEmployeeID || "",
    firstName,
    lastName,
    otherName,
    email,
    userName: userName || email || "Unknown",
    displayName: userName || email || "Unknown",
  };
};

const LoanComments = ({ loan, setNotification }) => {
  const theme = useTheme();
  const { userDetails } = useContext(UserContext);
  const client = useMemo(() => generateClient(), []);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newCommentBody, setNewCommentBody] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const currentEmployeeID =
    userDetails?.relatedEmployeeID || userDetails?.id || "";
  const commentAuthorDetails = useMemo(
    () => buildCommentAuthorDetails(userDetails),
    [userDetails],
  );

  const canCreate = useHasPermission("create", "loan");
  const canDelete = useHasPermission("delete", "loan");

  const fetchComments = useCallback(async () => {
    if (!loan?.id) {
      setComments([]);
      return;
    }

    setLoading(true);

    try {
      let allItems = [];
      let nextToken = null;

      do {
        const result = await client.graphql({
          query: LIST_LOAN_COMMENTS,
          variables: {
            loanID: loan.id,
            limit: 500,
            nextToken,
          },
        });

        const items = result?.data?.listLoanComments?.items || [];
        allItems = [...allItems, ...items.filter(Boolean)];
        nextToken = result?.data?.listLoanComments?.nextToken || null;
      } while (nextToken);

      setComments(sortCommentsByDate(allItems));
    } catch (error) {
      console.error("Error fetching loan comments:", error);
      setNotification({
        message: error?.errors?.[0]?.message || "Failed to load comments",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, [client, loan?.id, setNotification]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = useCallback(async () => {
    const body = newCommentBody.trim();

    if (!loan?.id || !body) {
      return;
    }

    setSubmitting(true);

    try {
      const input = {
        loanID: loan.id,
        commentAt: new Date().toISOString(),
        body,
        createdByEmployeeID: currentEmployeeID || null,
        customLoanCommentDetails: JSON.stringify(commentAuthorDetails),
      };

      const result = await client.graphql({
        query: CREATE_LOAN_COMMENT,
        variables: { input },
      });

      const createdComment = result?.data?.createLoanComment;

      if (!createdComment?.id) {
        throw new Error("Comment creation did not return a record");
      }

      setComments((previous) =>
        sortCommentsByDate([createdComment, ...previous]),
      );
      setNewCommentBody("");
      setNotification({ message: "Comment added", color: "green" });
    } catch (error) {
      console.error("Error creating loan comment:", error);
      setNotification({ message: "Failed to add comment", color: "red" });
    } finally {
      setSubmitting(false);
    }
  }, [
    client,
    commentAuthorDetails,
    currentEmployeeID,
    loan?.id,
    newCommentBody,
    setNotification,
  ]);

  const openDeleteDialog = useCallback((comment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteDialogClose = useCallback(() => {
    if (deleteLoading) {
      return;
    }

    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  }, [deleteLoading]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!commentToDelete?.id) {
      return;
    }

    setDeleteLoading(true);

    try {
      await client.graphql({
        query: DELETE_LOAN_COMMENT,
        variables: { input: { id: commentToDelete.id } },
      });

      setComments((previous) =>
        previous.filter((comment) => comment.id !== commentToDelete.id),
      );
      setNotification({ message: "Comment deleted", color: "green" });
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error("Error deleting loan comment:", error);
      setNotification({ message: "Failed to delete comment", color: "red" });
    } finally {
      setDeleteLoading(false);
    }
  }, [client, commentToDelete, setNotification]);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        p: { xs: 2, md: 3 },
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Comments ({comments.length})
      </Typography>

      {canCreate ? (
        <Box sx={{ display: "flex", gap: 1, mb: 3, alignItems: "stretch" }}>
          <TextField
            multiline
            minRows={2}
            maxRows={4}
            fullWidth
            placeholder="Add a comment..."
            value={newCommentBody}
            onChange={(event) => setNewCommentBody(event.target.value)}
            disabled={submitting}
            onKeyDown={(event) => {
              if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                event.preventDefault();
                handleSubmit();
              }
            }}
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting || !newCommentBody.trim()}
            sx={{ alignSelf: "flex-end", minWidth: 120 }}
            startIcon={
              submitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SendIcon />
              )
            }
          >
            {submitting ? "Sending" : "Send"}
          </Button>
        </Box>
      ) : null}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : comments.length === 0 ? (
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          No comments yet
        </Typography>
      ) : (
        comments.map((comment) => (
          <LoanCommentItem
            key={comment.id}
            comment={comment}
            currentEmployeeID={currentEmployeeID}
            canDelete={canDelete}
            onDelete={() => openDeleteDialog(comment)}
          />
        ))
      )}

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        name="this comment"
      />
    </Box>
  );
};

export default LoanComments;
