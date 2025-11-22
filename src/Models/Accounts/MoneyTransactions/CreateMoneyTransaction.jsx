import React from "react";
import { useTheme, styled } from "@mui/material/styles";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Grid } from "@mui/material";
import NumberInput from "../../../Resources/FormComponents/NumberInput";
import TextInput from "../../../Resources/FormComponents/TextInput";
import DateInput from "../../../Resources/FormComponents/DateInput";
import { generateClient } from "aws-amplify/api";
import { CREATE_MONEY_TRANSACTION_MUTATION } from "./moneyTransactionHelpes";
import CreateFormButtons from "../../../ComponentAssets/CreateFormButtons";
import createMoneyTransactionsForm from "./createMoneyTransactionsForm";

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
}) {
  const theme = useTheme();
  const client = React.useMemo(() => generateClient(), []);

  const initialValues = createMoneyTransactionsForm.reduce((acc, field) => {
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
        accountMoneyTransactionsId: account.id,
        transactionType: type,
        description: values.description,
        transactionDate: values.transactionDate,
        referenceNumber: values.referenceNumber,
        notes: values.notes,
        status: "completed",
      };

      await client.graphql({
        query: CREATE_MONEY_TRANSACTION_MUTATION,
        variables: { input },
      });

      setNotification({
        message: `${type === "deposit" ? "Deposit" : "Withdrawal"} successful!`,
        color: "green",
      });
      onSuccess(); // This will trigger fetchAccounts in parent
      onClose();
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
    >
      {(formik) => (
        <Form>
          <Box sx={{ width: "100%" }}>
            <Grid container spacing={1}>
              {createMoneyTransactionsForm.map((fieldConfig) => {
                const commonProps = {
                  key: fieldConfig.name,
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
                  fieldComponent = <NumberInput {...commonProps} />;
                } else if (fieldConfig.type === "date") {
                  fieldComponent = <DateInput {...commonProps} />;
                } else if (fieldConfig.type === "textarea") {
                  fieldComponent = (
                    <TextInput
                      {...commonProps}
                      multiline
                      rows={fieldConfig.rows}
                    />
                  );
                } else {
                  fieldComponent = <TextInput {...commonProps} />;
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
                  submitLabel={type === "deposit" ? "Deposit" : "Withdraw"}
                />
              </Box>
            </Grid>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
