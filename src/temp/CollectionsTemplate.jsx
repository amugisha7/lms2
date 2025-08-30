import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import CustomPopUp from "../ComponentAssets/CustomPopUp";
import CustomDataGrid from "../ComponentAssets/CustomDataGrid";
import DeleteDialog from "../ComponentAssets/DeleteDialog";

export default function CollectionsTemplate({
  title,
  createButtonText = "Create",
  onCreateClick,
  children,
  // Data props
  items = [],
  loading = false,
  columns = [],
  searchFields = [],
  noDataMessage,
  // Create popup props
  createDialogOpen,
  onCreateDialogClose,
  createDialogTitle,
  CreateFormComponent,
  createFormProps = {},
  // Edit popup props
  editDialogOpen,
  editDialogRow,
  onEditDialogClose,
  EditFormComponent,
  editFormProps = {},
  onEditClick,
  onPopupDeleteClick,
  editMode,
  // Delete dialog props
  deleteDialogOpen,
  onDeleteDialogClose,
  onDeleteConfirm,
  deleteLoading,
  deleteError,
  deleteDialogRow,
  // Search props
  enableSearch = true,
  searchPlaceholder = "Search...",
}) {
  const theme = useTheme();
  const [search, setSearch] = React.useState("");
  const formRef = React.useRef();

  const filteredItems = React.useMemo(() => {
    if (!search || !enableSearch) return items;

    return items.filter((item) =>
      searchFields.some((field) =>
        item[field]?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [items, search, searchFields, enableSearch]);

  const handleEditClick = () => {
    if (formRef.current && onEditClick) {
      onEditClick();
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Button
          variant="outlined"
          onClick={onCreateClick}
          sx={{
            borderColor: theme.palette.blueText.main,
            color: theme.palette.blueText.main,
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "transparent",
              borderColor: theme.palette.blueText.main,
              borderWidth: "2px",
            },
          }}
        >
          {createButtonText}
        </Button>
      </Box>

      {/* Default data grid if no children provided */}
      {!children && (
        <Box sx={{ width: "100%" }}>
          {!loading && items.length === 0 && (
            <Typography
              sx={{ mb: 2, color: theme.palette.blueText?.main || "#1976d2" }}
            >
              {noDataMessage}
            </Typography>
          )}
          {loading ? (
            <Typography sx={{ mt: 4 }}>Loading...</Typography>
          ) : (
            <CustomDataGrid
              rows={filteredItems}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={25}
              pageSizeOptions={[25, 50, 100]}
              loading={loading}
            />
          )}
        </Box>
      )}

      {/* Create Dialog */}
      {CreateFormComponent && (
        <CustomPopUp
          open={createDialogOpen}
          onClose={onCreateDialogClose}
          title={createDialogTitle}
          showEdit={false}
          showDelete={false}
          maxWidth="md"
          fullWidth
        >
          <CreateFormComponent {...createFormProps} />
        </CustomPopUp>
      )}

      {/* Edit Dialog */}
      {EditFormComponent && editDialogRow && (
        <CustomPopUp
          open={editDialogOpen}
          onClose={onEditDialogClose}
          title={editDialogRow.name || "Details"}
          onEdit={handleEditClick}
          onDelete={onPopupDeleteClick}
          maxWidth="md"
          fullWidth
          editMode={editMode}
        >
          <EditFormComponent
            ref={formRef}
            initialValues={editDialogRow}
            {...editFormProps}
          />
        </CustomPopUp>
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={onDeleteDialogClose}
        onConfirm={onDeleteConfirm}
        loading={deleteLoading}
        error={deleteError}
        name={deleteDialogRow?.name}
      />
    </Box>
  );
}
