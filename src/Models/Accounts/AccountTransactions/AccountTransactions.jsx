import React, { useState, useRef } from "react";
import { Box } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import CollectionsTemplate, {
  EditClickedContext,
} from "../../../ModelAssets/CollectionsTemplate";
import PlusButtonSmall from "../../../ModelAssets/PlusButtonSmall";
import CustomPopUp from "../../../ModelAssets/CustomPopUp";
import CustomSlider from "../../../ModelAssets/CustomSlider";
import MoneyTransactions from "../MoneyTransactions/MoneyTransactions";
import NotificationBar from "../../../ModelAssets/NotificationBar";
import ClickableText from "../../../ComponentAssets/ClickableText";

export default function AccountTransactions({
  transactions,
  account,
  onTransactionSuccess,
}) {
  const [open, setOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("deposit");
  const [notification, setNotification] = useState({
    message: "",
    color: "green",
  });

  // State for viewing/editing transaction details
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editClicked, setEditClicked] = useState(false);
  const formRef = useRef();

  const handleDeposit = () => {
    setTransactionType("deposit");
    setOpen(true);
  };

  const handleWithdraw = () => {
    setTransactionType("withdrawal");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSuccess = () => {
    if (onTransactionSuccess) {
      onTransactionSuccess();
    }
  };

  // Handle clicking on a transaction to view details
  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setViewDialogOpen(true);
    setEditClicked(false);
  };

  // Handle closing the view dialog
  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setSelectedTransaction(null);
    setEditClicked(false);
  };

  // Handle edit click in the slider
  const handleEditClick = () => {
    setEditClicked(true);
    if (formRef.current?.toggleEdit) {
      formRef.current.toggleEdit();
    }
  };

  // Handle successful edit
  const handleEditSuccess = (updatedTransaction) => {
    setEditClicked(false);
    if (onTransactionSuccess) {
      onTransactionSuccess();
    }
  };

  const columns = [
    {
      field: "date",
      headerName: "Date",
      width: 150,
      valueFormatter: (value) => {
        if (!value) return "-";
        return new Date(value).toLocaleDateString();
      },
    },
    {
      field: "description",
      headerName: "Description",
      width: 300,
      flex: 1,
      renderCell: (params) =>
        params.row.description == "Opening Balance" ? (
          "Opening Balance"
        ) : (
          <ClickableText onClick={() => handleTransactionClick(params.row)}>
            {params.value}
          </ClickableText>
        ),
    },
    {
      field: "displayType",
      headerName: "Type",
      width: 150,
      valueFormatter: (value) => {
        if (value) return value.charAt(0).toUpperCase() + value.slice(1);
        return "";
      },
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,
      type: "number",
      renderCell: (params) => {
        if (params.value == null) return "";
        const formatted = params.value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        // Show withdrawals in brackets
        if (params.row.type === "debit") {
          return `(${formatted})`;
        }
        return formatted;
      },
    },
    {
      field: "runningBalance",
      headerName: "Running Balance",
      width: 180,
      type: "number",
      valueFormatter: (value) => {
        if (value == null) return "";
        return value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
  ];

  const isAccountInactive = account?.status?.toLowerCase() === "inactive";

  return (
    <>
      <NotificationBar
        message={notification.message}
        color={notification.color}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Box sx={{ width: "120px" }}>
          <PlusButtonSmall
            label="DEPOSIT"
            IconComponent={Add}
            onClick={handleDeposit}
            disabled={isAccountInactive}
          />
        </Box>
        <Box sx={{ width: "120px" }}>
          <PlusButtonSmall
            label="WITHDRAW"
            IconComponent={Remove}
            onClick={handleWithdraw}
            disabled={isAccountInactive}
          />
        </Box>
      </Box>
      <CollectionsTemplate
        //   title="Transactions"
        items={transactions}
        columns={columns}
        enableSearch={true}
        searchFields={["description", "source", "type"]}
        searchPlaceholder="Search transactions..."
        // No create button needed for transactions view
        onCreateClick={null}
        createButtonText=""
        loading={false}
        noDataMessage="No transactions found."
      />
      <CustomPopUp
        open={open}
        onClose={handleClose}
        title={transactionType === "deposit" ? "Deposit" : "Withdraw"}
        showEdit={false}
        showDelete={false}
      >
        <MoneyTransactions
          type={transactionType}
          account={account}
          onSuccess={() => {
            handleClose();
            handleSuccess();
          }}
          onClose={handleClose}
        />
      </CustomPopUp>

      {/* View/Edit Transaction Slider */}
      <EditClickedContext.Provider value={{ editClicked, setEditClicked }}>
        {selectedTransaction && (
          <CustomSlider
            open={viewDialogOpen}
            onClose={handleViewDialogClose}
            title={selectedTransaction.description || "Transaction Details"}
            onEdit={handleEditClick}
            showEdit={true}
            showDelete={false}
            showPdf={false}
            editMode={editClicked}
          >
            <MoneyTransactions
              transactionId={selectedTransaction.id}
              type={
                selectedTransaction.displayType ||
                selectedTransaction.transactionType
              }
              account={account}
              onSuccess={handleEditSuccess}
              onClose={handleViewDialogClose}
              editMode={editClicked}
            />
          </CustomSlider>
        )}
      </EditClickedContext.Provider>
    </>
  );
}
