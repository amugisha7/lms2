# Messaging Platform Integration Examples

This document provides practical examples of integrating the messaging platform with other parts of the LMS application.

## 1. Loan Approval Workflow

When a loan officer submits a loan application for approval, send a message to the admin:

```javascript
// In your loan submission handler
import { sendLoanApprovalRequest } from "../Messaging/messagingAPI";

const handleLoanSubmission = async (loanData) => {
  try {
    // ... your loan submission logic ...

    // Get admin users
    const admins = await getAdminUsers(institutionId);

    // Send approval request to each admin
    for (const admin of admins) {
      await sendLoanApprovalRequest(
        {
          borrowerName: `${borrower.firstName} ${borrower.lastName}`,
          loanAmount: `$${loanData.principal.toLocaleString()}`,
          loanProduct: loanProduct.name,
          applicationDate: new Date().toLocaleDateString(),
          loanOfficer: `${currentUser.firstName} ${currentUser.lastName}`,
          loanId: loan.id,
          borrowerId: borrower.id,
        },
        admin.id,
        institutionId
      );
    }

    console.log("Loan approval request sent to admins");
  } catch (error) {
    console.error("Error in loan submission:", error);
  }
};
```

## 2. Payment Notification

When a payment is received, notify the borrower and loan officer:

```javascript
// In your payment processing handler
import { sendPaymentReceivedNotification } from "../Messaging/messagingAPI";

const handlePaymentReceived = async (paymentData) => {
  try {
    // ... your payment processing logic ...

    const paymentDetails = {
      borrowerName: `${borrower.firstName} ${borrower.lastName}`,
      amount: `$${paymentData.amount.toLocaleString()}`,
      paymentMethod: paymentData.paymentMethod,
      paymentDate: new Date().toLocaleDateString(),
      referenceNumber: paymentData.referenceNumber,
      remainingBalance: `$${remainingBalance.toLocaleString()}`,
      paymentId: payment.id,
      loanId: loan.id,
    };

    // Notify borrower
    if (borrower.relatedUserID) {
      await sendPaymentReceivedNotification(
        paymentDetails,
        borrower.relatedUserID,
        institutionId
      );
    }

    // Notify loan officer
    if (loanOfficer) {
      await sendPaymentReceivedNotification(
        paymentDetails,
        loanOfficer.id,
        institutionId
      );
    }

    console.log("Payment notifications sent");
  } catch (error) {
    console.error("Error sending payment notifications:", error);
  }
};
```

## 3. User Join Request

When a new user signs up, send a join request to admins:

```javascript
// In your user registration handler
import { sendUserJoinRequest } from "../Messaging/messagingAPI";

const handleUserRegistration = async (userData) => {
  try {
    // ... your user registration logic ...

    // Get admin users
    const admins = await getAdminUsers(institutionId);

    // Send join request to each admin
    for (const admin of admins) {
      await sendUserJoinRequest(
        {
          userName: `${userData.firstName} ${userData.lastName}`,
          userEmail: userData.email,
          userType: userData.userType,
          requestDate: new Date().toLocaleDateString(),
          userId: newUser.id,
        },
        admin.id,
        institutionId
      );
    }

    console.log("User join request sent to admins");
  } catch (error) {
    console.error("Error sending join request:", error);
  }
};
```

## 4. Payment Due Reminders (Scheduled)

Set up a scheduled task to send payment reminders:

```javascript
// In your scheduled task or cron job
import { sendPaymentDueReminder } from "../Messaging/messagingAPI";

const sendPaymentReminders = async () => {
  try {
    // Get loans with payments due in the next 7 days
    const upcomingPayments = await getUpcomingPayments(7);

    for (const payment of upcomingPayments) {
      const loan = payment.loan;
      const borrower = loan.borrower;

      if (borrower.relatedUserID) {
        await sendPaymentDueReminder(
          {
            loanNumber: loan.id,
            amountDue: `$${payment.amount.toLocaleString()}`,
            dueDate: payment.dueDate.toLocaleDateString(),
            daysUntilDue: calculateDaysUntilDue(payment.dueDate),
            loanId: loan.id,
            paymentId: payment.id,
          },
          borrower.relatedUserID,
          institutionId
        );
      }
    }

    console.log(`Sent ${upcomingPayments.length} payment reminders`);
  } catch (error) {
    console.error("Error sending payment reminders:", error);
  }
};
```

## 5. Loan Disbursement Notification

When a loan is disbursed, notify the borrower:

```javascript
// In your loan disbursement handler
import { sendLoanDisbursedNotification } from "../Messaging/messagingAPI";

const handleLoanDisbursement = async (loanId) => {
  try {
    // ... your loan disbursement logic ...

    const loanDetails = {
      borrowerName: `${borrower.firstName} ${borrower.lastName}`,
      loanAmount: `$${loan.principal.toLocaleString()}`,
      loanProduct: loanProduct.name,
      disbursementDate: new Date().toLocaleDateString(),
      firstPaymentDate: loan.firstPaymentDate.toLocaleDateString(),
      accountNumber: account.accountNumber,
      loanId: loan.id,
    };

    // Notify borrower
    if (borrower.relatedUserID) {
      await sendLoanDisbursedNotification(
        loanDetails,
        borrower.relatedUserID,
        institutionId
      );
    }

    console.log("Loan disbursement notification sent");
  } catch (error) {
    console.error("Error sending disbursement notification:", error);
  }
};
```

## 6. Broadcast Announcements

Send announcements to all staff members:

```javascript
// In your announcement handler
import { broadcastMessage } from "../Messaging/messagingAPI";

const sendStaffAnnouncement = async (announcement) => {
  try {
    // Get all staff users
    const staffUsers = await getStaffUsers(institutionId);
    const staffIds = staffUsers.map((user) => user.id);

    // Broadcast the announcement
    await broadcastMessage(
      currentUserId,
      staffIds,
      announcement.body,
      announcement.subject,
      institutionId
    );

    console.log(`Announcement sent to ${staffIds.length} staff members`);
  } catch (error) {
    console.error("Error broadcasting announcement:", error);
  }
};
```

## 7. Custom System Message

Create a custom system message for specific scenarios:

```javascript
// In your custom handler
import { sendSystemMessage } from "../Messaging/messagingAPI";

const sendCustomNotification = async (recipientId, data) => {
  try {
    await sendSystemMessage(
      "DOCUMENT_REQUIRED", // Use any of the predefined types
      {
        documentType: data.documentType,
        documentsList: data.documentsList.join("\n- "),
        deadline: data.deadline,
        borrowerId: data.borrowerId,
        loanId: data.loanId,
      },
      recipientId,
      institutionId
    );

    console.log("Custom notification sent");
  } catch (error) {
    console.error("Error sending custom notification:", error);
  }
};
```

## 8. Handling Approval Actions in Message Thread

When a user clicks approve/reject in a message thread:

```javascript
// In MessageThread.jsx - handleApproval function
const handleApproval = async (message, action) => {
  try {
    const data = message.systemMessageData;

    if (message.systemMessageType === "approval_request") {
      if (data.loanId) {
        // Handle loan approval
        await updateLoanStatus(data.loanId, action === "approve" ? "approved" : "rejected");
        
        // Send notification to loan officer
        await sendLoanStatusNotification(data.loanId, action);
      } else if (data.userId) {
        // Handle user join approval
        await updateUserStatus(data.userId, action === "approve" ? "active" : "inactive");
        
        // Send notification to user
        await sendUserStatusNotification(data.userId, action);
      } else if (data.branchId) {
        // Handle branch creation approval
        await updateBranchStatus(data.branchId, action === "approve" ? "active" : "inactive");
      }
    }

    // Mark message as read
    await client.graphql({
      query: UPDATE_MESSAGE_MUTATION,
      variables: {
        input: {
          id: message.id,
          status: "read",
        },
      },
    });

    // Refresh messages
    if (onMessageSent) {
      onMessageSent();
    }
  } catch (error) {
    console.error("Error processing approval:", error);
    alert("Failed to process approval");
  }
};
```

## 9. Adding Messaging Link to Navigation

Add a link to the messaging platform in your navigation menu:

```javascript
// In your navigation component
import MessageIcon from "@mui/icons-material/Message";
import { Badge } from "@mui/material";

// In your menu items
const menuItems = [
  // ... other items ...
  {
    text: "Messages",
    icon: (
      <Badge badgeContent={unreadMessageCount} color="error">
        <MessageIcon />
      </Badge>
    ),
    path: "/messages",
  },
  // ... other items ...
];
```

## Helper Functions

Here are some helper functions you might need:

```javascript
// Get admin users
const getAdminUsers = async (institutionId) => {
  const response = await client.graphql({
    query: LIST_USERS_IN_INSTITUTION_QUERY,
    variables: {
      filter: {
        institutionUsersId: { eq: institutionId },
        userType: { eq: "admin" },
        status: { eq: "active" },
      },
    },
  });
  return response.data.listUsers.items;
};

// Get staff users
const getStaffUsers = async (institutionId) => {
  const response = await client.graphql({
    query: LIST_USERS_IN_INSTITUTION_QUERY,
    variables: {
      filter: {
        institutionUsersId: { eq: institutionId },
        status: { eq: "active" },
      },
    },
  });
  return response.data.listUsers.items;
};

// Calculate days until due
const calculateDaysUntilDue = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
```
