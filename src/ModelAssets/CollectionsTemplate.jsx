import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import CustomSlider from "./CustomSlider";
import CustomDataGrid from "./CustomDataGrid";
import DeleteDialog from "./DeleteDialog";
import PlusButtonMain from "./PlusButtonMain";

// Create context for edit state
const EditClickedContext = React.createContext();

// Export the context so it can be used by child components
export { EditClickedContext };

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
  const [editClicked, setEditClicked] = React.useState(false);
  const formRef = React.useRef();

  const filteredItems = React.useMemo(() => {
    if (!search || !enableSearch) return items;

    return items.filter((item) =>
      searchFields.some((field) =>
        item[field]?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [items, search, searchFields, enableSearch]);

  // Reset editClicked when dialog opens
  React.useEffect(() => {
    if (editDialogOpen) {
      setEditClicked(false);
    }
  }, [editDialogOpen]);

  const handleEditClick = () => {
    setEditClicked(true);
    if (formRef.current && onEditClick) {
      onEditClick(formRef.current);
    }
  };

  return (
    <EditClickedContext.Provider value={{ editClicked, setEditClicked }}>
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
          <PlusButtonMain
            onClick={onCreateClick}
            buttonText={createButtonText}
          />
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
          <CustomSlider
            open={createDialogOpen}
            onClose={onCreateDialogClose}
            title={createDialogTitle}
            showEdit={false}
            showDelete={false}
          >
            <CreateFormComponent {...createFormProps} />
          </CustomSlider>
        )}

        {/* Edit Dialog */}
        {EditFormComponent && editDialogRow && (
          <CustomSlider
            open={editDialogOpen}
            onClose={() => {
              setEditClicked(false);
              onEditDialogClose();
            }}
            title={editDialogRow.name || "Details"}
            onEdit={handleEditClick}
            onDelete={onPopupDeleteClick}
            editMode={editMode}
          >
            <EditFormComponent
              ref={formRef}
              initialValues={editDialogRow}
              {...editFormProps}
            />
          </CustomSlider>
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
    </EditClickedContext.Provider>
  );
}
