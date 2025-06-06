import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

export default function CustomFieldsDataGrid({ rows, loading, hasFetched }) {
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
    { field: 'label', headerName: 'Label', flex: 3, editable: true, sortable: false, disableColumnMenu: true },
    {
      field: 'required',
      headerName: 'Is Required?',
      flex: 1,
      renderCell: (params) => (
        <Checkbox checked={params.value} disabled />
      ),
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'delete',
      headerName: '',
      flex: 1,
      renderCell: (params) => (
          <Box
            sx={{
                pt: 0.5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
              <DeleteIcon 
                sx={{
                    color: 'red'
                }}
              />
          </Box>
      ),
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
  ];

  if (loading) {
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

  if (!hasFetched) {
    return null;
  }

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      disableSelectionOnClick
      autoHeight
      density="compact"
      getRowId={(row) => row.id}
      sx={(theme) => ({
        border: 1,
        borderColor: 'divider',
        '& .MuiDataGrid-cell': {
          borderRight: '1px solid #e0e0e0',
        },
        '& .MuiDataGrid-row': {
          '&:nth-of-type(even)': {
              backgroundColor: theme.palette.action.selected,
            },
        },
        '& .MuiDataGrid-columnHeader': {
            backgroundColor: theme.palette.action.hover,
            borderRight: '1px solid #e0e0e0',
            fontWeight: 'bold', // Make header bold
        },
      })}
    />
  );
}