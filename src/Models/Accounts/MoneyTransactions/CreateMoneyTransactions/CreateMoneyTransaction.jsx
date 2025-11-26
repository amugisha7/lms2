import React, { useState, useContext } from "react";
import { useTheme, styled } from "@mui/material/styles";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Box,
  Grid,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  ExpandMore,
  CloudUpload,
  Add,
  Delete,
  InsertDriveFile,
  Link as LinkIcon,
} from "@mui/icons-material";
import NumberInput from "../../../../Resources/FormComponents/NumberInput";
import TextInput from "../../../../Resources/FormComponents/TextInput";
import DateInput from "../../../../Resources/FormComponents/DateInput";
import { generateClient } from "aws-amplify/api";
import {
  CREATE_MONEY_TRANSACTION_MUTATION,
  UPDATE_MONEY_TRANSACTION_MUTATION,
} from "../moneyTransactionHelpes";
import CreateFormButtons from "../../../../ComponentAssets/CreateFormButtons";
import createMoneyTransactionsForm from "./createMoneyTransactionsForm";
import UploadDialogBox from "../../../../ModelAssets/UploadDialogBox";
import { UserContext } from "../../../../App";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

export default function CreateMoneyTransaction({
  onClose,
  onSuccess,
  type,
  account,
  setNotification,
  initialValues: propInitialValues,
  isEditMode = false,
}) {
  const theme = useTheme();
  const client = React.useMemo(() => generateClient(), []);
  const { userDetails } = useContext(UserContext);

  // File upload state
  const [filesExpanded, setFilesExpanded] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState("file");
  const [uploadFileData, setUploadFileData] = useState({
    file: null,
    description: "",
  });

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFileData({ ...uploadFileData, file });
    }
  };

  const handleAddFile = (values) => {
    if (uploadMode === "file") {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/tiff",
        "image/svg+xml",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];

      if (!uploadFileData.file) {
        setNotification({
          message: "Please select a file",
          color: "red",
        });
        return;
      }

      if (!allowedTypes.includes(uploadFileData.file.type)) {
        setNotification({
          message:
            "File type not allowed. Please select a document or image file.",
          color: "red",
        });
        return;
      }

      if (uploadFileData.file.size > maxFileSize) {
        setNotification({
          message: "File size exceeds 10MB limit.",
          color: "red",
        });
        return;
      }

      const newFile = {
        id: Date.now().toString(),
        file: uploadFileData.file,
        fileName: uploadFileData.file.name,
        description: values.description?.trim() || "",
        type: "file",
        fileSize: uploadFileData.file.size,
        fileType: uploadFileData.file.type,
      };

      setPendingFiles([...pendingFiles, newFile]);
      setUploadDialogOpen(false);
      setUploadFileData({ file: null, description: "" });
    } else {
      if (!values.url?.trim()) {
        setNotification({
          message: "Please enter a URL",
          color: "red",
        });
        return;
      }

      const newLink = {
        id: Date.now().toString(),
        fileName: values.url.trim(),
        description: values.description?.trim() || "",
        type: "link",
      };

      setPendingFiles([...pendingFiles, newLink]);
      setUploadDialogOpen(false);
      setUploadFileData({ file: null, description: "" });
      setUploadMode("file");
    }
  };

  const handleRemoveFile = (fileId) => {
    setPendingFiles(pendingFiles.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === undefined || bytes === null) return "";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const initialValues =
    propInitialValues ||
    createMoneyTransactionsForm.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    }, {});

  const validationSchema = Yup.object().shape(
    createMoneyTransactionsForm.reduce((acc, field) => {
      let validator;
      if (field.validationType === "number") {
        validator = Yup.number();
        if (field.min !== undefined) validator = validator.min(field.min);
      } else {
        validator = Yup.string();
      }

      if (field.required) {
        validator = validator.required(
          field.validationMessage || `${field.label} is required`
        );
      }

      acc[field.name] = validator;
      return acc;
    }, {})
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const input = {
        amount: parseFloat(values.amount),
        description: values.description,
        transactionDate: values.transactionDate,
        referenceNumber: values.referenceNumber,
        notes: values.notes,
        status: "completed",
      };

      // Include pending files data
      if (pendingFiles.length > 0) {
        input.pendingFiles = pendingFiles;
      }

      if (isEditMode) {
        input.id = values.id;

        await client.graphql({
          query: UPDATE_MONEY_TRANSACTION_MUTATION,
          variables: { input },
        });

        setNotification({
          message: "Transaction updated successful!",
          color: "green",
        });
      } else {
        input.accountMoneyTransactionsId = account.id;
        input.transactionType = type;

        await client.graphql({
          query: CREATE_MONEY_TRANSACTION_MUTATION,
          variables: { input },
        });

        setNotification({
          message: `${
            type === "deposit" ? "Deposit" : "Withdrawal"
          } successful!`,
          color: "green",
        });
      }

      if (onSuccess) onSuccess(isEditMode ? values : undefined, pendingFiles);
      if (onClose) onClose();
    } catch (error) {
      console.error("Transaction error:", error);
      setNotification({
        message: `Error processing transaction: ${error.message}`,
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {(formik) => (
        <Form>
          <Box sx={{ width: "100%" }}>
            <Grid container spacing={1}>
              {createMoneyTransactionsForm.map((fieldConfig) => {
                const commonProps = {
                  label: fieldConfig.label,
                  name: fieldConfig.name,
                  value: formik.values[fieldConfig.name],
                  onChange: formik.handleChange,
                  error:
                    formik.touched[fieldConfig.name] &&
                    Boolean(formik.errors[fieldConfig.name]),
                  helperText:
                    formik.touched[fieldConfig.name] &&
                    formik.errors[fieldConfig.name],
                  required: fieldConfig.required,
                  fullWidth: true,
                  placeholder: fieldConfig.placeholder,
                };

                let fieldComponent;
                if (fieldConfig.type === "number") {
                  fieldComponent = (
                    <NumberInput key={fieldConfig.name} {...commonProps} />
                  );
                } else if (fieldConfig.type === "date") {
                  fieldComponent = (
                    <DateInput key={fieldConfig.name} {...commonProps} />
                  );
                } else if (fieldConfig.type === "textarea") {
                  fieldComponent = (
                    <TextInput
                      key={fieldConfig.name}
                      {...commonProps}
                      multiline
                      rows={fieldConfig.rows}
                    />
                  );
                } else {
                  fieldComponent = (
                    <TextInput key={fieldConfig.name} {...commonProps} />
                  );
                }

                return (
                  <FormGrid
                    size={{ xs: 12, md: fieldConfig.span }}
                    key={fieldConfig.name}
                  >
                    {fieldComponent}
                  </FormGrid>
                );
              })}

              {/* Expandable Files/Links Section */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Accordion
                  expanded={filesExpanded}
                  onChange={() => setFilesExpanded(!filesExpanded)}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: "none",
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: "8px !important",
                    "&:before": { display: "none" },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      borderRadius: "8px",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                      >
                        Attachments ({pendingFiles.length})
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {/* Upload Buttons */}
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={
                          <CloudUpload
                            sx={{ color: theme.palette.blueText.main }}
                          />
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadMode("file");
                          setUploadDialogOpen(true);
                        }}
                        sx={{
                          borderColor: theme.palette.blueText.main,
                          color: theme.palette.blueText.main,
                          backgroundColor: "transparent",
                          "&:hover": {
                            backgroundColor: "transparent",
                            borderColor: theme.palette.blueText.dark,
                            borderWidth: "2px",
                            color: theme.palette.blueText.dark,
                          },
                        }}
                      >
                        Upload File
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={
                          <Add sx={{ color: theme.palette.blueText.main }} />
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadMode("link");
                          setUploadDialogOpen(true);
                        }}
                        sx={{
                          borderColor: theme.palette.blueText.main,
                          color: theme.palette.blueText.main,
                          backgroundColor: "transparent",
                          "&:hover": {
                            backgroundColor: "transparent",
                            borderColor: theme.palette.blueText.dark,
                            borderWidth: "2px",
                            color: theme.palette.blueText.dark,
                          },
                        }}
                      >
                        Add Link
                      </Button>
                    </Box>

                    {/* Files List */}
                    {pendingFiles.length > 0 ? (
                      <List dense sx={{ py: 0 }}>
                        {pendingFiles.map((file) => (
                          <ListItem
                            key={file.id}
                            sx={{
                              backgroundColor: theme.palette.action.hover,
                              borderRadius: "4px",
                              mb: 1,
                              pr: 6,
                            }}
                          >
                            {file.type === "link" ? (
                              <LinkIcon
                                sx={{
                                  mr: 1.5,
                                  color: theme.palette.blueText.main,
                                }}
                              />
                            ) : (
                              <InsertDriveFile
                                sx={{
                                  mr: 1.5,
                                  color: theme.palette.blueText.main,
                                }}
                              />
                            )}
                            <ListItemText
                              primary={file.fileName}
                              secondary={
                                file.type === "link"
                                  ? file.description || "Link"
                                  : `${
                                      file.description || "No description"
                                    } • ${formatFileSize(file.fileSize)}`
                              }
                              primaryTypographyProps={{
                                noWrap: true,
                                sx: {
                                  maxWidth: "250px",
                                  color: theme.palette.text.primary,
                                },
                              }}
                              secondaryTypographyProps={{
                                noWrap: true,
                                sx: { maxWidth: "250px" },
                              }}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                size="small"
                                onClick={() => handleRemoveFile(file.id)}
                                sx={{
                                  color: theme.palette.error.main,
                                  "&:hover": {
                                    backgroundColor:
                                      theme.palette.error.light + "20",
                                  },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          textAlign: "center",
                          py: 2,
                        }}
                      >
                        No files or links added yet
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  pr: 2,
                  justifyContent: { xs: "center", md: "flex-end" },
                  width: "100%",
                }}
              >
                <CreateFormButtons
                  formik={formik}
                  onClose={onClose}
                  setEditMode={() => {}}
                  setSubmitError={() => {}}
                  setSubmitSuccess={() => {}}
                  submitLabel={
                    isEditMode
                      ? "Update"
                      : type === "deposit"
                      ? "Deposit"
                      : "Withdraw"
                  }
                />
              </Box>
            </Grid>
          </Box>

          {/* Upload Dialog */}
          <UploadDialogBox
            open={uploadDialogOpen}
            onClose={() => {
              setUploadDialogOpen(false);
              setUploadFileData({ file: null, description: "" });
            }}
            uploadMode={uploadMode}
            uploadFileData={uploadFileData}
            setUploadFileData={setUploadFileData}
            handleFileSelect={handleFileSelect}
            handleUpload={handleAddFile}
            loading={false}
          />
        </Form>
      )}
    </Formik>
  );
}
