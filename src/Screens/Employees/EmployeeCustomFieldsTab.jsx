import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "date", label: "Date" },
  { value: "select", label: "Dropdown" },
  { value: "textarea", label: "Text Area" },
  { value: "checkbox", label: "Checkbox" },
  { value: "url", label: "URL" },
];

const EmployeeCustomFieldsTab = ({ employee, isEditing, onSave, loading }) => {
  const [customFields, setCustomFields] = useState([]);
  const [fieldDialogOpen, setFieldDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [newField, setNewField] = useState({
    key: "",
    label: "",
    type: "text",
    value: "",
    required: false,
    options: [],
  });

  useEffect(() => {
    // Parse existing custom fields data
    if (employee.customFieldsData) {
      try {
        const parsed = JSON.parse(employee.customFieldsData);
        if (Array.isArray(parsed)) {
          setCustomFields(parsed);
        } else if (typeof parsed === "object") {
          // Convert object to array format
          const fields = Object.entries(parsed).map(([key, value]) => ({
            key,
            label: key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase()),
            type: "text",
            value: value,
          }));
          setCustomFields(fields);
        }
      } catch (error) {
        console.error("Error parsing custom fields:", error);
        setCustomFields([]);
      }
    }
  }, [employee.customFieldsData]);

  const handleAddField = () => {
    setEditingField(null);
    setNewField({
      key: "",
      label: "",
      type: "text",
      value: "",
      required: false,
      options: [],
    });
    setFieldDialogOpen(true);
  };

  const handleEditField = (field, index) => {
    setEditingField(index);
    setNewField({ ...field });
    setFieldDialogOpen(true);
  };

  const handleDeleteField = (index) => {
    const updatedFields = customFields.filter((_, i) => i !== index);
    setCustomFields(updatedFields);
  };

  const handleFieldSave = () => {
    let updatedFields;

    if (editingField !== null) {
      updatedFields = customFields.map((field, index) =>
        index === editingField ? newField : field
      );
    } else {
      updatedFields = [...customFields, newField];
    }

    setCustomFields(updatedFields);
    setFieldDialogOpen(false);
    setEditingField(null);
  };

  const handleFieldValueChange = (index, value) => {
    const updatedFields = customFields.map((field, i) =>
      i === index ? { ...field, value } : field
    );
    setCustomFields(updatedFields);
  };

  const handleSaveCustomFields = () => {
    const customFieldsData = JSON.stringify(customFields);
    onSave({ customFieldsData });
  };

  const renderFieldInput = (field, index) => {
    const { type, label, value, options = [] } = field;

    switch (type) {
      case "select":
        return (
          <TextField
            select
            fullWidth
            label={label}
            value={value || ""}
            onChange={(e) => handleFieldValueChange(index, e.target.value)}
            size="small"
            disabled={!isEditing}
          >
            {options.map((option, optIndex) => (
              <MenuItem key={optIndex} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        );

      case "textarea":
        return (
          <TextField
            fullWidth
            multiline
            rows={3}
            label={label}
            value={value || ""}
            onChange={(e) => handleFieldValueChange(index, e.target.value)}
            size="small"
            disabled={!isEditing}
          />
        );

      case "checkbox":
        return (
          <Box>
            <Typography variant="caption" color="textSecondary">
              {label}
            </Typography>
            <Box>
              <Chip
                label={value ? "Yes" : "No"}
                color={value ? "success" : "default"}
                size="small"
                onClick={
                  isEditing
                    ? () => handleFieldValueChange(index, !value)
                    : undefined
                }
                clickable={isEditing}
              />
            </Box>
          </Box>
        );

      case "date":
        return (
          <TextField
            fullWidth
            type="date"
            label={label}
            value={value || ""}
            onChange={(e) => handleFieldValueChange(index, e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            disabled={!isEditing}
          />
        );

      case "number":
        return (
          <TextField
            fullWidth
            type="number"
            label={label}
            value={value || ""}
            onChange={(e) => handleFieldValueChange(index, e.target.value)}
            size="small"
            disabled={!isEditing}
          />
        );

      default:
        return (
          <TextField
            fullWidth
            type={type}
            label={label}
            value={value || ""}
            onChange={(e) => handleFieldValueChange(index, e.target.value)}
            size="small"
            disabled={!isEditing}
          />
        );
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" color="primary">
          Custom Fields
        </Typography>
        {isEditing && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddField}
            size="small"
          >
            Add Field
          </Button>
        )}
      </Box>

      {customFields.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="body2" color="textSecondary">
              No custom fields defined for this employee.
            </Typography>
            {isEditing && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddField}
                sx={{ mt: 2 }}
              >
                Add First Custom Field
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              {customFields.map((field, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ position: "relative" }}>
                    {renderFieldInput(field, index)}
                    {isEditing && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          display: "flex",
                          gap: 0.5,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleEditField(field, index)}
                          sx={{ bgcolor: "background.paper", boxShadow: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteField(index)}
                          sx={{ bgcolor: "background.paper", boxShadow: 1 }}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {isEditing && customFields.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleSaveCustomFields}
            disabled={loading}
            size="large"
          >
            {loading ? "Saving..." : "Save Custom Fields"}
          </Button>
        </Box>
      )}

      {/* Field Configuration Dialog */}
      <Dialog
        open={fieldDialogOpen}
        onClose={() => setFieldDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingField !== null ? "Edit Custom Field" : "Add Custom Field"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Field Key"
                  value={newField.key}
                  onChange={(e) =>
                    setNewField((prev) => ({ ...prev, key: e.target.value }))
                  }
                  helperText="Unique identifier (no spaces)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Display Label"
                  value={newField.label}
                  onChange={(e) =>
                    setNewField((prev) => ({ ...prev, label: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Field Type"
                  value={newField.type}
                  onChange={(e) =>
                    setNewField((prev) => ({ ...prev, type: e.target.value }))
                  }
                >
                  {fieldTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Default Value"
                  value={newField.value}
                  onChange={(e) =>
                    setNewField((prev) => ({ ...prev, value: e.target.value }))
                  }
                />
              </Grid>
              {newField.type === "select" && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Options (comma separated)"
                    value={
                      Array.isArray(newField.options)
                        ? newField.options.join(", ")
                        : ""
                    }
                    onChange={(e) =>
                      setNewField((prev) => ({
                        ...prev,
                        options: e.target.value
                          .split(",")
                          .map((opt) => opt.trim())
                          .filter((opt) => opt),
                      }))
                    }
                    helperText="Enter options separated by commas"
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFieldDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleFieldSave}
            variant="contained"
            disabled={!newField.key || !newField.label}
          >
            {editingField !== null ? "Update" : "Add"} Field
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeCustomFieldsTab;
