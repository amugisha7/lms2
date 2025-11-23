import React, { useState } from "react";
import { Box } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import CollectionsTemplate from "../../../ModelAssets/CollectionsTemplate";
import PlusButtonSmall from "../../../ModelAssets/PlusButtonSmall";
import CustomPopUp from "../../../ModelAssets/CustomPopUp";
import CreateMoneyTransaction from "../MoneyTransactions/CreateMoneyTransactions/CreateMoneyTransaction";
import NotificationBar from "../../../ModelAssets/NotificationBar";

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
    // Notification is handled inside CreateMoneyTransaction or we can do it here if CreateMoneyTransaction doesn't
    // But CreateMoneyTransaction takes setNotification prop.
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
      valueFormatter: (value) => {
        if (value == null) return "";
        return value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
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
          />
        </Box>
        <Box sx={{ width: "120px" }}>
          <PlusButtonSmall
            label="WITHDRAW"
            IconComponent={Remove}
            onClick={handleWithdraw}
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
        <CreateMoneyTransaction
          onClose={handleClose}
          onSuccess={handleSuccess}
          type={transactionType}
          account={account}
          setNotification={setNotification}
        />
      </CustomPopUp>
    </>
  );
}
