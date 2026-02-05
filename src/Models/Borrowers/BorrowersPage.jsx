import React, { useState } from "react";
import Borrowers from "./Borrowers";

/**
 * BorrowersPage - Wrapper component that renders Borrowers with optional
 * create dialog already open. Used for /addBorrower route to launch
 * create borrower form in CustomSlider immediately.
 */
export default function BorrowersPage({ openCreateDialog = false }) {
  const [createDialogOpen, setCreateDialogOpen] = useState(openCreateDialog);

  return (
    <Borrowers
      initialCreateDialogOpen={createDialogOpen}
      onCreateDialogChange={setCreateDialogOpen}
    />
  );
}
