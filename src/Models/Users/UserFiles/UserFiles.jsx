import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CloudUpload, Add } from "@mui/icons-material";
import {
  uploadData as amplifyUploadData,
  getUrl,
  remove,
} from "aws-amplify/storage";
import { generateClient } from "aws-amplify/api";
import { updateUser } from "../../../graphql/mutations";
import CustomDataGrid from "../../../ModelAssets/CustomDataGrid";
import DeleteDialog from "../../../ModelAssets/DeleteDialog";
import { UserContext } from "../../../App";
import BorrowerUploadDialog from "../../../ModelAssets/UploadDialogBox"; // Note: reusing BorrowerUploadDialog
import { formatFileSize, formatDate } from "./fileUtils";
import { getUserFilesColumns } from "./userFilesColumns";
import { useHasPermission } from "../../../ModelAssets/Permissions/permissions";

const UserFiles = ({ user, setUser, setNotification }) => {
  const theme = useTheme();
  const { userDetails } = useContext(UserContext);
  const client = React.useMemo(() => generateClient(), []);

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const canCreateUserFiles = useHasPermission("create", "user");
  const canDeleteUserFiles = useHasPermission("delete", "user");

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadFileData, setUploadFileData] = useState({
    file: null,
    description: "",
  });
  const [uploadMode, setUploadMode] = useState("file");

  // Placeholder for user files
  // Users don't have documents in the current schema

  return (
    <Box>
      <Typography variant="body1">
        File management is not currently supported for users.
      </Typography>
    </Box>
  );
};

export default UserFiles;
