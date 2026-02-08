import React from "react";
import { generateClient } from "aws-amplify/api";
import WorkingOverlay from "../ModelAssets/WorkingOverlay";

export function useCrudOperations(entityName, listQuery, createMutation, updateMutation, deleteMutation, listQueryKey) {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editDialogRow, setEditDialogRow] = React.useState(null);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteDialogRow, setDeleteDialogRow] = React.useState(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState("");
  const [workingOverlayOpen, setWorkingOverlayOpen] = React.useState(false);
  const [workingOverlayMessage, setWorkingOverlayMessage] = React.useState("Working...");

  const fetchItems = React.useCallback(async (variables = {}) => {
    setLoading(true);
    setWorkingOverlayOpen(true);
    setWorkingOverlayMessage(`Loading ${entityName}s...`);
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: listQuery,
        variables,
      });
      // Use provided listQueryKey or fall back to default pattern
      const key = listQueryKey || `list${entityName}s`;
      setItems(result.data[key]?.items || []);
    } catch (err) {
      console.log(`Error fetching ${entityName}s:`, err);
      setItems([]);
    } finally {
      setLoading(false);
      setWorkingOverlayOpen(false);
    }
  }, [listQuery, entityName, listQueryKey]);

  const handleEditDialogOpen = (row) => {
    setEditDialogRow(row);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditDialogRow(null);
  };

  const handleEditSuccess = (updatedRow) => {
    setItems((prev) =>
      prev.map((row) =>
        row.id === updatedRow.id ? { ...row, ...updatedRow } : row
      )
    );
    handleEditDialogClose();
  };

  const handleDeleteDialogOpen = (row) => {
    setDeleteDialogRow(row);
    setDeleteDialogOpen(true);
    setDeleteError("");
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setDeleteDialogRow(null);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setDeleteError("");
    setWorkingOverlayOpen(true);
    setWorkingOverlayMessage(`Deleting ${entityName}...`);
    try {
      const client = generateClient();
      await client.graphql({
        query: deleteMutation,
        variables: {
          input: { id: deleteDialogRow.id },
        },
      });
      setItems((prev) =>
        prev.filter((row) => row.id !== deleteDialogRow.id)
      );
      handleDeleteDialogClose();
    } catch (err) {
      console.log("Delete error:", err);
      setDeleteError("Failed to delete. Please try again.");
    } finally {
      setDeleteLoading(false);
      setWorkingOverlayOpen(false);
    }
  };

  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  const handleCreateSuccess = (newItem) => {
    setItems((prev) => [...prev, newItem]);
    handleCreateDialogClose();
  };

  return {
    items,
    setItems,
    loading,
    fetchItems,
    editDialogOpen,
    editDialogRow,
    createDialogOpen,
    deleteDialogOpen,
    deleteDialogRow,
    deleteLoading,
    deleteError,
    handleEditDialogOpen,
    handleEditDialogClose,
    handleEditSuccess,
    handleDeleteDialogOpen,
    handleDeleteDialogClose,
    handleDeleteConfirm,
    handleCreateDialogOpen,
    handleCreateDialogClose,
    handleCreateSuccess,
    workingOverlay: (
      <WorkingOverlay open={workingOverlayOpen} message={workingOverlayMessage} />
    ),
    setWorkingOverlayOpen,
    setWorkingOverlayMessage,
  };
}
