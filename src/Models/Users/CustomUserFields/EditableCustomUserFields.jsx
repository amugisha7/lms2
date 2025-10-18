import React from "react";
import { Box, Typography } from "@mui/material";

const EditableCustomUserFields = ({
  customFields = [],
  initialValues = {},
  onUpdateSuccess,
  onUpdateCustomFieldsAPI,
  onCancel,
  setNotification,
}) => {
  // Placeholder for editable custom fields
  // Users don't have custom fields in the current schema

  return (
    <Box>
      <Typography variant="body1">
        Editable custom fields are not currently supported for users.
      </Typography>
    </Box>
  );
};

export default EditableCustomUserFields;
