# Notifications System Integration Examples

This document provides practical examples of integrating the notifications system with other parts of the LMS application.

## 1. Loan Approval Workflow

When a loan officer submits a loan application for approval, send a notification to the admin:

```javascript
// In your loan submission handler
import { sendLoanApprovalRequest } from "../Notifications/notificationsAPI";

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
import { sendPaymentReceivedNotification } from "../Notifications/notificationsAPI";

const handlePaymentReceived = async (paymentData) => {
  try {
    // ... your payment processing logic ...

    // Notify borrower
    await sendPaymentReceivedNotification(
      {
        borrowerName: borrower.name,
        amount: `$${payment.amount}`,
        paymentMethod: payment.method,
        paymentDate: new Date().toLocaleDateString(),
        referenceNumber: payment.reference,
        remainingBalance: `$${loan.balance}`,
        paymentId: payment.id,
        loanId: loan.id,
      },
      borrowerUserId,
      institutionId
    );

    // Notify loan officer
    if (loanOfficerUserId) {
      await sendPaymentReceivedNotification(
        {
          borrowerName: borrower.name,
          amount: `$${payment.amount}`,
          paymentMethod: payment.method,
          paymentDate: new Date().toLocaleDateString(),
          referenceNumber: payment.reference,
          remainingBalance: `$${loan.balance}`,
          paymentId: payment.id,
          loanId: loan.id,
        },
        loanOfficerUserId,
        institutionId
      );
    }

    console.log("Payment notifications sent");
  } catch (error) {
    console.error("Error sending payment notification:", error);
  }
};
```

## 3. User Join Request

When a new user requests to join the institution, notify admins:

```javascript
// In your user registration handler
import { sendUserJoinRequest } from "../Notifications/notificationsAPI";

const handleUserJoinRequest = async (userData) => {
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
          userId: userData.id,
        },
        admin.id,
        institutionId
      );
    }

    console.log("User join request sent to admins");
  } catch (error) {
    console.error("Error sending user join request:", error);
  }
};
```

## 4. Payment Due Reminders (Scheduled)

Set up a scheduled Lambda function to send payment due reminders:

```javascript
// Lambda function (scheduled daily)
import { sendPaymentDueReminder } from "../Notifications/notificationsAPI";

export const handler = async () => {
  try {
    // Get loans with payments due in next 7 days
    const upcomingPayments = await getUpcomingPayments(7);

    for (const payment of upcomingPayments) {
      const daysUntilDue = calculateDaysUntil(payment.dueDate);

      await sendPaymentDueReminder(
        {
          loanNumber: payment.loan.id,
          amountDue: `$${payment.amount}`,
          dueDate: payment.dueDate,
          daysUntilDue: daysUntilDue,
          loanId: payment.loan.id,
          paymentId: payment.id,
        },
        payment.borrowerUserId,
        institutionId
      );
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
import { sendLoanDisbursedNotification } from "../Notifications/notificationsAPI";

const handleLoanDisbursement = async (loanData) => {
  try {
    // ... your loan disbursement logic ...

    // Notify borrower
    await sendLoanDisbursedNotification(
      {
        borrowerName: `${borrower.firstName} ${borrower.lastName}`,
        loanAmount: `$${loanData.disbursedAmount.toLocaleString()}`,
        loanProduct: loanProduct.name,
        disbursementDate: new Date().toLocaleDateString(),
        loanOfficer: `${currentUser.firstName} ${currentUser.lastName}`,
        loanId: loan.id,
        borrowerId: borrower.id,
      },
      borrowerUserId,
      institutionId
    );

    console.log("Loan disbursement notification sent");
  } catch (error) {
    console.error("Error sending disbursement notification:", error);
  }
};
```

## 6. Custom System Notification

Send a custom notification for any business event:

```javascript
// In your custom business logic
import { sendNotification } from "../Notifications/notificationsAPI";

const sendCustomNotification = async (
  recipientId,
  subject,
  body,
  type = "system_notification"
) => {
  try {
    await sendNotification(
      currentUserId, // sender
      recipientId, // recipient
      subject,
      body,
      type,
      institutionId
    );

    console.log("Custom notification sent");
  } catch (error) {
    console.error("Error sending custom notification:", error);
  }
};

// Example usage
await sendCustomNotification(
  userId,
  "Account Updated",
  "Your account information has been successfully updated.",
  "account_notification"
);
```

## 7. Handling Approval Actions

When a user approves or rejects a notification, handle the business logic:

```javascript
// In your NotificationThread component or approval handler
import { updateLoanStatus } from "../Loans/loanAPI";

const handleApproval = async (notification, action) => {
  try {
    // Update the notification status
    await updateNotificationApproval(notification.id, action);

    // Handle the specific business logic based on notification type
    if (
      notification.notificationType === "approval_request" &&
      notification.referenceId
    ) {
      if (action === "approved") {
        // Approve the related entity (loan, user, etc.)
        await updateLoanStatus(notification.referenceId, "approved");
      } else if (action === "rejected") {
        // Reject the related entity
        await updateLoanStatus(notification.referenceId, "rejected");
      }
    }

    // Send confirmation notification
    await sendNotification(
      currentUserId,
      notification.senderUserId,
      `Loan ${action}`,
      `Your loan approval request has been ${action}.`,
      "system_notification",
      institutionId
    );

    console.log(`Notification ${action}`);
  } catch (error) {
    console.error("Error handling approval:", error);
  }
};
```

## 8. Adding Notifications Link to Navigation

Add a notifications link with unread count badge to your navigation:

```javascript
// In your navigation component (e.g., Sidebar.jsx)
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge } from "@mui/material";
import { useUnreadNotificationCount } from "../Notifications/useUnreadNotificationCount";

const Navigation = () => {
  const { unreadCount } = useUnreadNotificationCount();

  return (
    <List>
      {/* Other navigation items */}
      <ListItem button component={Link} to="/notifications">
        <ListItemIcon>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </ListItemIcon>
        <ListItemText primary="Notifications" />
      </ListItem>
    </List>
  );
};
```

## 9. Bulk Notification Sending

Send notifications to multiple users at once:

```javascript
// Send notification to all users in a group
import { sendNotification } from "../Notifications/notificationsAPI";

const sendBulkNotification = async (
  userIds,
  subject,
  body,
  type = "system_notification"
) => {
  try {
    const notifications = userIds.map((userId) =>
      sendNotification(
        currentUserId,
        userId,
        subject,
        body,
        type,
        institutionId
      )
    );

    await Promise.all(notifications);
    console.log(`Sent notifications to ${userIds.length} users`);
  } catch (error) {
    console.error("Error sending bulk notifications:", error);
  }
};

// Example: Notify all loan officers about a policy change
const loanOfficerIds = await getUsersByType("loan_officer", institutionId);
await sendBulkNotification(
  loanOfficerIds,
  "Policy Update",
  "Please review the updated loan approval policy.",
  "policy_notification"
);
```

## 10. Notification Templates

Create reusable notification templates:

```javascript
// notificationTemplates.js
export const NOTIFICATION_TEMPLATES = {
  LOAN_APPROVED: {
    subject: "Loan Approved",
    body: (data) =>
      `Congratulations! Your loan application for ${data.amount} has been approved.`,
    type: "loan_notification",
  },

  LOAN_REJECTED: {
    subject: "Loan Application Update",
    body: (data) =>
      `We regret to inform you that your loan application for ${data.amount} could not be approved at this time.`,
    type: "loan_notification",
  },

  PAYMENT_OVERDUE: {
    subject: "Payment Overdue",
    body: (data) =>
      `Your payment of ${data.amount} for loan ${data.loanId} is ${data.daysOverdue} days overdue.`,
    type: "payment_notification",
  },
};

// Usage
import { sendNotification } from "../Notifications/notificationsAPI";
import { NOTIFICATION_TEMPLATES } from "./notificationTemplates";

const sendTemplatedNotification = async (templateKey, data, recipientId) => {
  const template = NOTIFICATION_TEMPLATES[templateKey];
  if (!template) throw new Error(`Template ${templateKey} not found`);

  const subject = template.subject;
  const body =
    typeof template.body === "function" ? template.body(data) : template.body;

  await sendNotification(
    currentUserId,
    recipientId,
    subject,
    body,
    template.type,
    institutionId
  );
};

// Example
await sendTemplatedNotification(
  "LOAN_APPROVED",
  { amount: "$10,000" },
  borrowerId
);
```

## 11. Notification Preferences

Allow users to manage their notification preferences:

```javascript
// In user settings component
import { sendNotification } from "../Notifications/notificationsAPI";

const updateNotificationPreferences = async (userId, preferences) => {
  try {
    // Store user preferences (this would be saved to user profile)
    await updateUserPreferences(userId, { notifications: preferences });

    // Send confirmation
    await sendNotification(
      systemUserId,
      userId,
      "Notification Preferences Updated",
      "Your notification preferences have been successfully updated.",
      "system_notification",
      institutionId
    );
  } catch (error) {
    console.error("Error updating notification preferences:", error);
  }
};
```

## 12. Error Handling and Logging

Implement proper error handling for notification sending:

```javascript
// Enhanced notification sending with error handling
import { sendNotification } from "../Notifications/notificationsAPI";

const sendNotificationWithRetry = async (
  senderId,
  recipientId,
  subject,
  body,
  type,
  institutionId,
  maxRetries = 3
) => {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await sendNotification(
        senderId,
        recipientId,
        subject,
        body,
        type,
        institutionId
      );
      console.log(`Notification sent successfully to ${recipientId}`);
      return;
    } catch (error) {
      attempt++;
      console.error(`Notification attempt ${attempt} failed:`, error);

      if (attempt >= maxRetries) {
        // Log to error tracking system
        await logError({
          type: "NOTIFICATION_SEND_FAILED",
          recipientId,
          subject,
          error: error.message,
          attempts: attempt,
        });
        throw error;
      }

      // Wait before retry (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
};
```

## Best Practices

1. **Always include institutionId**: Ensure all notifications are scoped to the correct institution
2. **Handle errors gracefully**: Don't let notification failures break your main business logic
3. **Use appropriate notification types**: Choose types that help with filtering and organization
4. **Keep notification content concise**: Users should quickly understand what the notification is about
5. **Test notification flows**: Verify that notifications appear correctly and actions work as expected
6. **Monitor notification delivery**: Track success/failure rates for critical notifications
7. **Respect user preferences**: Allow users to opt-out of certain notification types
8. **Use reference IDs**: Link notifications to specific entities for proper action handling

## Available Notification Types

- `approval_request` - Requires user approval/rejection
- `payment_notification` - Payment-related information
- `loan_notification` - Loan status updates
- `user_notification` - User account changes
- `system_notification` - General system messages
- `policy_notification` - Policy or procedural updates

## Integration Checklist

- [ ] Import notification API functions
- [ ] Add notification calls to business logic
- [ ] Handle approval actions appropriately
- [ ] Add notifications link to navigation
- [ ] Test notification delivery
- [ ] Implement error handling
- [ ] Consider user preferences
- [ ] Monitor notification performance

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

````

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
````

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
        await updateLoanStatus(
          data.loanId,
          action === "approve" ? "approved" : "rejected"
        );

        // Send notification to loan officer
        await sendLoanStatusNotification(data.loanId, action);
      } else if (data.userId) {
        // Handle user join approval
        await updateUserStatus(
          data.userId,
          action === "approve" ? "active" : "inactive"
        );

        // Send notification to user
        await sendUserStatusNotification(data.userId, action);
      } else if (data.branchId) {
        // Handle branch creation approval
        await updateBranchStatus(
          data.branchId,
          action === "approve" ? "active" : "inactive"
        );
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
