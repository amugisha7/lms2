import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useContext,
} from "react";
import { styled } from "@mui/material/styles";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid, Typography } from "@mui/material";
import NumberInput from "../../../../Resources/FormComponents/NumberInput";
import TextInput from "../../../../Resources/FormComponents/TextInput";
import DateInput from "../../../../Resources/FormComponents/DateInput";
import FileLinksUpload from "../../../../Resources/FormComponents/FileLinksUpload";
import { generateClient } from "aws-amplify/api";
import { uploadData as amplifyUploadData } from "aws-amplify/storage";
import {
  CREATE_MONEY_TRANSACTION_MUTATION,
  UPDATE_MONEY_TRANSACTION_MUTATION,
  CREATE_DOCUMENT_MUTATION,
  CREATE_MONEY_TRANSACTION_DOCUMENT_MUTATION,
} from "../moneyTransactionHelpes";
import CreateFormButtons from "../../../../ComponentAssets/CreateFormButtons";
import CustomEditFormButtons from "../../../../ModelAssets/CustomEditFormButtons";
import { EditClickedContext } from "../../../../ModelAssets/CollectionsTemplate";
import { UserContext } from "../../../../App";
import createMoneyTransactionsForm from "./createMoneyTransactionsForm";

const FormGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    paddingRight: "20px",
  },
}));

const CreateMoneyTransaction = forwardRef(function CreateMoneyTransaction(
  {
    onClose,
    onSuccess,
    type,
    account,
    setNotification,
    initialValues: propInitialValues,
    isEditMode = false,
  },
  ref
) {
  const client = React.useMemo(() => generateClient(), []);
  const { userDetails } = useContext(UserContext);
  const [editMode, setEditMode] = useState(!isEditMode);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const editClickedContext = useContext(EditClickedContext);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    toggleEdit: () => {
      setEditMode((prev) => !prev);
    },
    getEditMode: () => editMode,
  }));

  // Respond to editClicked from context
  useEffect(() => {
    if (editClickedContext?.editClicked && isEditMode && !editMode) {
      setEditMode(true);
    }
  }, [editClickedContext?.editClicked, isEditMode, editMode]);

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
      } else if (field.validationType === "array") {
        validator = Yup.array();
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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const input = {
        amount: parseFloat(values.amount),
        description: values.description,
        transactionDate: values.transactionDate,
        referenceNumber: values.referenceNumber,
        notes: values.notes,
        status: "completed",
      };

      // Get ONLY new pending files/links (not existing ones) for upload
      const allFiles = values.attachments || [];
      const pendingFiles = allFiles.filter((f) => !f.isExisting);

      if (isEditMode) {
        input.id = propInitialValues.id;

        console.log("Updating transaction with input:", input);
        const result = await client.graphql({
          query: UPDATE_MONEY_TRANSACTION_MUTATION,
          variables: { input },
        });
        console.log("Update transaction result:", result);

        const updatedTransaction = result.data.updateMoneyTransaction;

        // Upload only NEW files and create document relationships for edit mode
        if (pendingFiles.length > 0) {
          await uploadFilesAndLinkToTransaction(
            pendingFiles,
            updatedTransaction.id
          );
        }

        setSubmitSuccess("Transaction updated!");
        setEditMode(false);
        setTimeout(() => setSubmitSuccess(""), 2000);

        if (setNotification) {
          setNotification({
            message: "Transaction updated successfully!",
            color: "green",
          });
        }

        if (onSuccess)
          onSuccess({ ...propInitialValues, ...values }, pendingFiles);
      } else {
        input.accountMoneyTransactionsId = account.id;
        input.transactionType = type;

        console.log("Creating transaction with input:", input);
        const result = await client.graphql({
          query: CREATE_MONEY_TRANSACTION_MUTATION,
          variables: { input },
        });
        console.log("Create transaction result:", result);

        const newTransaction = result.data.createMoneyTransaction;

        // Upload files and create document relationships
        if (pendingFiles.length > 0) {
          await uploadFilesAndLinkToTransaction(
            pendingFiles,
            newTransaction.id
          );
        }

        setSubmitSuccess("Transaction created!");
        resetForm();

        if (setNotification) {
          setNotification({
            message: `${
              type === "deposit" ? "Deposit" : "Withdrawal"
            } successful!`,
            color: "green",
          });
        }

        if (onSuccess) onSuccess(undefined, pendingFiles);
        if (onClose) onClose();
      }
    } catch (error) {
      console.error("Transaction error:", error);
      setSubmitError(error.message || "Failed to process transaction.");
      if (setNotification) {
        setNotification({
          message: `Error processing transaction: ${error.message}`,
          color: "red",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Upload files to S3 and create Document records linked to the MoneyTransaction
   */
  const uploadFilesAndLinkToTransaction = async (
    pendingFiles,
    transactionId
  ) => {
    for (const fileItem of pendingFiles) {
      try {
        if (fileItem.type === "file" && fileItem.file) {
          // Upload file to S3
          const timestamp = new Date().getTime();
          const s3Key = `transaction-${transactionId}/${timestamp}-${fileItem.fileName}`;

          console.log("Uploading file to S3:", {
            key: s3Key,
            contentType: fileItem.fileType,
          });
          const uploadResult = await amplifyUploadData({
            key: s3Key,
            data: fileItem.file,
            options: {
              contentType: fileItem.fileType,
            },
          });
          console.log("S3 upload result:", uploadResult);

          // Create Document record
          const documentInput = {
            documentName: fileItem.fileName,
            documentDescription: fileItem.description || "",
            documentDate: new Date().toISOString().split("T")[0],
            s3Key: s3Key,
            fileName: fileItem.fileName,
            contentType: fileItem.fileType,
            status: "active",
            branchDocumentsId:
              account?.branchAccountsId || userDetails?.branchUsersId,
            createdByEmployeeID: userDetails?.id,
          };

          console.log("Creating document with input:", documentInput);
          const docResult = await client.graphql({
            query: CREATE_DOCUMENT_MUTATION,
            variables: { input: documentInput },
          });
          console.log("Create document result:", docResult);
          const newDocument = docResult.data.createDocument;

          // Link Document to MoneyTransaction
          console.log("Linking document to transaction:", {
            moneyTransactionId: transactionId,
            documentId: newDocument.id,
          });
          const linkResult = await client.graphql({
            query: CREATE_MONEY_TRANSACTION_DOCUMENT_MUTATION,
            variables: {
              input: {
                moneyTransactionId: transactionId,
                documentId: newDocument.id,
              },
            },
          });
          console.log("Link document result:", linkResult);
        } else if (fileItem.type === "link") {
          // Create Document record for link
          const documentInput = {
            documentName: fileItem.fileName,
            documentDescription: fileItem.description || "",
            documentDate: new Date().toISOString().split("T")[0],
            fileName: fileItem.fileName,
            contentType: "link",
            status: "active",
            branchDocumentsId:
              account?.branchAccountsId || userDetails?.branchUsersId,
            createdByEmployeeID: userDetails?.id,
          };

          console.log("Creating link document with input:", documentInput);
          const docResult = await client.graphql({
            query: CREATE_DOCUMENT_MUTATION,
            variables: { input: documentInput },
          });
          console.log("Create link document result:", docResult);
          const newDocument = docResult.data.createDocument;

          // Link Document to MoneyTransaction
          console.log("Linking link document to transaction:", {
            moneyTransactionId: transactionId,
            documentId: newDocument.id,
          });
          const linkResult = await client.graphql({
            query: CREATE_MONEY_TRANSACTION_DOCUMENT_MUTATION,
            variables: {
              input: {
                moneyTransactionId: transactionId,
                documentId: newDocument.id,
              },
            },
          });
          console.log("Link document result:", linkResult);
        }
      } catch (fileError) {
        console.error("Error uploading file:", fileError);
        // Continue with other files even if one fails
        if (setNotification) {
          setNotification({
            message: `Warning: Failed to upload ${fileItem.fileName}`,
            color: "orange",
          });
        }
      }
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
            {/* Show edit mode header when in edit mode */}
            {isEditMode && editMode ? (
              <CustomEditFormButtons
                formik={formik}
                setEditMode={setEditMode}
                setSubmitError={setSubmitError}
                setSubmitSuccess={setSubmitSuccess}
              />
            ) : null}

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
                  editing: editMode,
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
                } else if (fieldConfig.type === "fileUpload") {
                  fieldComponent = (
                    <FileLinksUpload
                      key={fieldConfig.name}
                      name={fieldConfig.name}
                      label={fieldConfig.label}
                      required={fieldConfig.required}
                      onError={setNotification}
                      editing={editMode}
                      transactionId={isEditMode ? propInitialValues?.id : null}
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

              {/* Only show create buttons when not in isEditMode (i.e., creating new transaction) */}
              {!isEditMode && (
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
                    setEditMode={setEditMode}
                    setSubmitError={setSubmitError}
                    setSubmitSuccess={setSubmitSuccess}
                    submitLabel={type === "deposit" ? "Deposit" : "Withdraw"}
                  />
                </Box>
              )}

              {submitError && (
                <Typography color="error" sx={{ mt: 2, px: 2 }}>
                  {submitError}
                </Typography>
              )}
              {submitSuccess && (
                <Typography color="primary" sx={{ mt: 2, px: 2 }}>
                  {submitSuccess}
                </Typography>
              )}
            </Grid>
          </Box>
        </Form>
      )}
    </Formik>
  );
});

CreateMoneyTransaction.displayName = "CreateMoneyTransaction";

export default CreateMoneyTransaction;
