import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { Box, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSnackbar } from '../../../ComponentAssets/SnackbarContext'; // <-- Import useSnackbar

// Move this outside the component
function EditableLabelTextField({ value, onChange, autoFocus }) {
  return (
    <TextField
      value={value}
      onChange={onChange}
      size="small"
      variant="standard"
      fullWidth
      autoFocus={autoFocus}
      onKeyDown={(e) => e.stopPropagation()} // <-- Add this line
    />
  );
}

export default function CustomFieldsDataGrid({ rows, loading, hasFetched, onRowUpdate, onRowDelete }) {
    const theme = useTheme();
    const { showSnackbar } = useSnackbar(); // <-- Use the snackbar context
    const [editRowId, setEditRowId] = React.useState(null);
    const [editedRowData, setEditedRowData] = React.useState({});

    const handleEditClick = (id, row) => {
        setEditRowId(id);
        setEditedRowData({ ...row });
    };

    const handleCancelEdit = () => {
        setEditRowId(null);
        setEditedRowData({});
        showSnackbar('Edit cancelled', 'blue');
    };

    const handleSaveClick = async () => {
        if (onRowUpdate) {
            try {
                await onRowUpdate(editedRowData);
                showSnackbar('Field updated successfully', 'green');
            } catch (e) {
                showSnackbar('Failed to update field', 'red');
            }
        }
        setEditRowId(null);
        setEditedRowData({});
    };

    const handleFieldChange = (field, value) => {
        setEditedRowData(prev => ({ ...prev, [field]: value }));
    };
  
  // DataGrid columns
  const columns = [
    {
      field: 'fieldType',
      headerName: 'Field Type',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => params.value === 'select' ? 'dropdown' : params.value
    },
    { 
      field: 'label', 
      headerName: 'Label', 
      flex: 2.5, 
      sortable: false, 
      disableColumnMenu: true,
      renderCell: (params) => {
        if (params.id === editRowId) {
          return (
            <EditableLabelTextField
              value={editedRowData.label || ''}
              onChange={(e) => handleFieldChange('label', e.target.value)}
              autoFocus
            />
          );
        }
        return params.value;
      }
    },
    {
      field: 'required',
      headerName: 'Is Required?',
      flex: 1,
      renderCell: (params) => {
        if (params.id === editRowId) {
          return (
            <Checkbox 
              checked={!!editedRowData.required} 
              onChange={(e) => handleFieldChange('required', e.target.checked)}
            />
          );
        }
        return <Checkbox checked={params.value} disabled />;
      },
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'actions',
      headerName: 'Edit',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (params.id === editRowId) {
          return (
            <Box>
              <IconButton onClick={handleSaveClick} size="small">
                <SaveIcon 
                  fontSize="small"
                  sx={{ color: theme.palette.blueText.main }}
                />
              </IconButton>
              <IconButton onClick={handleCancelEdit} size="small">
                <CancelIcon fontSize="small" />
              </IconButton>
            </Box>
          );
        }
        return (
          <IconButton onClick={() => handleEditClick(params.id, params.row)} size="small">
            <EditIcon 
              fontSize="small"
              sx={{ color: theme.palette.blueText.main }}
            />
          </IconButton>
        );
      }
    },
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 0.6,
      renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <IconButton
              onClick={async () => {
                if (onRowDelete) {
                  try {
                    await onRowDelete(params.id);
                    showSnackbar('Field deleted', 'green');
                  } catch (e) {
                    showSnackbar('Failed to delete field', 'red');
                  }
                }
              }}
              size="small"
            >
              <DeleteIcon 
                fontSize="small"
                sx={{
                    color: theme.palette.error.main 
                }}
              />
            </IconButton>
          </Box>
      ),
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
  ];

  if (loading && !hasFetched) { // Show loading only on initial fetch
    return (
      <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
        Loading custom fields...
      </Typography>
    );
  }

  if (hasFetched && rows.length === 0) {
    return (
      <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
        No custom fields found for this form.
      </Typography>
    );
  }

  if (!hasFetched && !loading) { // If not fetched and not loading (e.g. no form selected yet)
    return (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
            Select a form and click "Load Custom Fields" to see data.
        </Typography>
    );
  }
  
  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Box sx={{ minWidth: 600 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          density="compact"
          getRowId={(row) => row.id}
          loading={loading && hasFetched}
          sx={{
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${theme.palette.primary.gridBottomBorder}`,
            },
            '& .MuiDataGrid-columnHeaders': {
              // borderBottom: '2px solid #bdbdbd',
            },
            '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus': {
              outline: 'none !important',
            },
            '& .MuiDataGrid-row': {
              '&.Mui-selected': {
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}