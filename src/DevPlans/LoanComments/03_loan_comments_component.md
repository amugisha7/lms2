# Prompt 3: Create LoanComments Main Component

## Context

You are building the main `LoanComments` container component for a React + MUI + AWS Amplify (Gen 1) loan management app. This component fetches comments for a given loan, displays them using `LoanCommentItem`, and provides a text input to create new comments and ability to delete own comments. It follows the same pattern as `src/Models/Loans/LoanFiles/LoanFiles.jsx` — a self-contained component that receives `loan` and `setNotification` as props.

## Reference: Existing Patterns

- **API client:** Use `generateClient()` from `"aws-amplify/api"` for mutations. For the list query you can also use `generateClient()`.
- **Permissions:** Use `useHasPermission` from `"../../../ModelAssets/Permissions/permissions"` with resource `"loan"`. Check `create` for adding comments, `delete` for removing.
- **User context:** `UserContext` from `"../../../App"` provides `userDetails`. The current employee ID is at `userDetails?.relatedEmployeeID` or `userDetails?.id`.
- **Delete confirmation:** Use `DeleteDialog` from `"../../../ModelAssets/DeleteDialog"`.
- **Notification:** Call `setNotification({ message: "...", color: "green" | "red" })` matching the pattern used by `LoanFiles`.

## File to Create: `src/Models/Loans/LoanComments/LoanComments.jsx`

### Requirements

#### 1. Imports

```js
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
import { Send } from "@mui/icons-material";
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
```

#### 2. Component Signature

```jsx
const LoanComments = ({ loan, setNotification }) => { ... };
export default LoanComments;
```

#### 3. State

- `comments` — array of comment objects
- `loading` — boolean, true during initial fetch
- `submitting` — boolean, true while creating a comment
- `newCommentBody` — string, controlled input for the text field
- `deleteDialogOpen` — boolean
- `commentToDelete` — the comment object to delete (or null)
- `deleteLoading` — boolean

#### 4. Memoized Client

```js
const client = useMemo(() => generateClient(), []);
```

#### 5. Employee ID Resolution

Get the current employee ID from UserContext. The employee record may be linked via `userDetails.relatedEmployeeID` or you may need to check if the user has an employee record. Use this pattern:

```js
const { userDetails } = useContext(UserContext);
const currentEmployeeID =
  userDetails?.relatedEmployeeID || userDetails?.id || "";
```

#### 6. Permissions

```js
const canCreate = useHasPermission("create", "loan");
const canDelete = useHasPermission("delete", "loan");
```

#### 7. Fetch Comments

Create a `fetchComments` callback that:

- Guards on `loan?.id` being present
- Sets `loading = true`
- Paginates through all comments using `nextToken` loop (same pattern as LoanFiles)
- Calls `LIST_LOAN_COMMENTS` with `{ loanID: loan.id, limit: 500 }`
- Stores sorted results (newest first) using `sortCommentsByDate`
- Sets `loading = false` in `finally`
- Catches errors and calls `setNotification` with error message

Call `fetchComments` in a `useEffect` on mount.

#### 8. Create Comment

Create a `handleSubmit` async function that:

- Trims `newCommentBody`; if empty, return early
- Sets `submitting = true`
- Builds the input object:
  ```js
  const input = {
    loanID: loan.id,
    commentAt: new Date().toISOString(),
    body: newCommentBody.trim(),
    createdByEmployeeID: currentEmployeeID,
  };
  ```
- Calls `CREATE_LOAN_COMMENT` mutation
- On success: prepends the new comment to the `comments` array (it's newest-first), clears `newCommentBody`, and calls `setNotification({ message: "Comment added", color: "green" })`
- On error: calls `setNotification({ message: "Failed to add comment", color: "red" })`
- Sets `submitting = false` in `finally`

Also support submitting via Ctrl+Enter / Cmd+Enter on the TextField `onKeyDown`.

#### 9. Delete Comment

- `openDeleteDialog(comment)` — sets `commentToDelete` and opens dialog
- `handleDeleteConfirm()` async:
  - Sets `deleteLoading = true`
  - Calls `DELETE_LOAN_COMMENT` with `{ input: { id: commentToDelete.id } }`
  - On success: removes from state, closes dialog, notifies
  - On error: notifies error
  - `deleteLoading = false` in `finally`
- `handleDeleteDialogClose()` — clears state

#### 10. Render Layout

```
┌──────────────────────────────────────────────┐
│ Comments (count)                              │
├──────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────┐ │
│ │ [TextField: multiline, 2-4 rows]        │ │
│ │                           [Send Button] │ │
│ └──────────────────────────────────────────┘ │
├──────────────────────────────────────────────┤
│ [LoanCommentItem] (newest first)             │
│ [LoanCommentItem]                            │
│ [LoanCommentItem]                            │
│ ...                                          │
├──────────────────────────────────────────────┤
│ [DeleteDialog]                               │
└──────────────────────────────────────────────┘
```

**Header:** `Typography variant="h6"` showing `Comments ({count})`

**Input area (only if `canCreate`):**

- Use a `Box` with `display: "flex"`, `gap: 1`, `mb: 3`
- `TextField` with:
  - `multiline`, `minRows={2}`, `maxRows={4}`
  - `fullWidth`
  - `placeholder="Add a comment..."`
  - `value={newCommentBody}`, `onChange` handler
  - `disabled={submitting}`
  - `onKeyDown` handler: if `(e.ctrlKey || e.metaKey) && e.key === "Enter"`, call `handleSubmit()`
  - Standard MUI styling
- `Button` with `Send` icon:
  - `variant="contained"`
  - `onClick={handleSubmit}`
  - `disabled={submitting || !newCommentBody.trim()}`
  - `sx={{ alignSelf: "flex-end" }}`
  - Show `CircularProgress` (size 20) when `submitting`

**Comments list:**

- If `loading`: show `CircularProgress` centered
- If no comments and not loading: show `Typography` "No comments yet"
- Otherwise: map `comments` to `LoanCommentItem` components:
  ```jsx
  {
    comments.map((comment) => (
      <LoanCommentItem
        key={comment.id}
        comment={comment}
        currentEmployeeID={currentEmployeeID}
        canDelete={canDelete}
        onDelete={() => openDeleteDialog(comment)}
      />
    ));
  }
  ```

**Delete Dialog:**

```jsx
<DeleteDialog
  open={deleteDialogOpen}
  onClose={handleDeleteDialogClose}
  onConfirm={handleDeleteConfirm}
  loading={deleteLoading}
  name="this comment"
/>
```

## Verification

- Component mounts and fetches comments for the given loan
- New comment appears at top of list after submission
- Ctrl+Enter submits from the text field
- Delete shows confirmation dialog, removes from list on confirm
- Proper loading states for fetch, submit, and delete
- Permissions are respected (no input if can't create, no delete icon if can't delete)
