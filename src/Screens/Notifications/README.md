# Notifications System

A comprehensive notifications system for the LMS2 application that handles user notifications, approval workflows, and real-time updates.

## Features

- **Notification List**: View all notifications sorted by most recent
- **Notification Thread**: Read notification details and perform actions
- **Approval Workflows**: Support for notifications requiring approval/rejection actions
- **Real-time Updates**: Subscribe to new notifications via GraphQL subscriptions
- **Mobile Responsive**: Optimized for both desktop and mobile views
- **Status Management**: Track read/unread status of notifications
- **Search Functionality**: Search through notifications by content

## Components

### Notifications.jsx

Main notifications component that orchestrates the entire notifications interface. Provides responsive layout for desktop (two-panel) and mobile (single-panel) views.

### NotificationList.jsx

Displays all notifications for the logged-in user with:

- Unread notification count badges
- Notification preview
- Search functionality
- Last notification timestamp
- Real-time updates via subscriptions

### NotificationThread.jsx

Shows the full details of a specific notification:

- Notification content in full
- Approval/rejection buttons for actionable notifications
- Mark notifications as read automatically
- Back navigation to list view

## Utilities

### notificationUtils.js

Helper functions for:

- Date formatting
- Notification filtering
- Notification sorting
- Notification preview generation
- User display name formatting

### notificationQueries.js

GraphQL queries and mutations for:

- Listing notifications
- Getting notification details
- Creating notifications
- Updating notification status
- Real-time subscriptions

### notificationsAPI.js

Helper functions for programmatic notification sending:

- `sendNotification` - Send a general notification
- `sendApprovalRequest` - Send a notification requiring approval
- `sendLoanApprovalRequest` - Send loan approval request to admin
- `sendPaymentReceivedNotification` - Notify about payment receipt
- `sendPaymentDueReminder` - Send payment due reminder
- `sendLoanDisbursedNotification` - Notify about loan disbursement
- `sendUserJoinRequest` - Send user join request to admin

## Usage

### Basic Notifications

```javascript
import Notifications from "./Screens/Notifications/Notifications";

// In your route
<Route path="notifications" element={<Notifications />} />;
```

### Sending System Notifications

```javascript
import { sendLoanApprovalRequest } from "./Screens/Notifications/notificationsAPI";

// Send a loan approval request to admin
await sendLoanApprovalRequest(
  {
    borrowerName: "John Doe",
    loanAmount: "$10,000",
    loanProduct: "Personal Loan",
    applicationDate: "2025-01-15",
    loanOfficer: "Jane Smith",
    loanId: "loan123",
    borrowerId: "borrower456",
  },
  adminUserId,
  institutionId
);
```

### Sending General Notifications

```javascript
import { sendNotification } from "./Screens/Notifications/notificationsAPI";

// Send a simple notification
await sendNotification(
  senderUserId,
  recipientUserId,
  "Payment Received",
  "Your payment of $500 has been received and processed.",
  "payment_notification",
  institutionId
);
```

### Using Notification Utilities

```javascript
import {
  formatNotificationDate,
  getUserDisplayName,
  getNotificationPreview,
  searchNotifications,
} from "./Screens/Notifications/notificationUtils";

// Format a date
const formattedDate = formatNotificationDate("2025-01-15T10:30:00Z");

// Get user display name
const displayName = getUserDisplayName(user);

// Get notification preview
const preview = getNotificationPreview(notification);

// Search notifications
const filteredNotifications = searchNotifications(notifications, searchTerm);
```

## GraphQL Schema

The notifications system uses the `Notification` type in the GraphQL schema:

```graphql
type Notification @model {
  id: ID!
  subject: String
  body: String!
  notificationType: String # e.g., "approval_request", "payment_notification"
  approvalStatus: String # "pending", "approved", "rejected"
  referenceId: String # ID of related entity (loan, payment, etc.)
  status: String # "unread", "read"
  createdAt: AWSDateTime
  sender: User @belongsTo(fields: ["senderUserId"])
  senderUserId: ID! @index(name: "bySender")
  recipient: User @belongsTo(fields: ["recipientUserId"])
  recipientUserId: ID! @index(name: "byRecipient")
  institutionNotificationsId: ID @index(name: "byInstitution")
}
```

## How It Works

### Notification Flow

1. **Creation**: Notifications are created via the `notificationsAPI.js` helper functions or directly through GraphQL mutations
2. **Display**: The `NotificationList` component fetches and displays notifications for the current user
3. **Interaction**: Users can select notifications to view details in the `NotificationThread` component
4. **Actions**: For approval-type notifications, users can approve or reject directly from the thread view
5. **Status Updates**: Notifications are automatically marked as read when viewed, and approval status is updated when actions are taken
6. **Real-time**: New notifications appear instantly via GraphQL subscriptions

### Responsive Design

- **Desktop**: Two-panel layout with notification list on the left and thread on the right
- **Mobile**: Single-panel layout that switches between list and thread views
- **Adaptive**: Layout automatically adjusts based on screen size using Material-UI breakpoints

### Approval Workflows

Notifications can include approval actions for business processes like:

- Loan approvals
- User account approvals
- Expense approvals
- Document submissions
- Branch creation requests

When a notification requires approval, the `NotificationThread` component displays appropriate action buttons that trigger GraphQL mutations to update the approval status.

## Styling

The notifications system uses Material-UI components and follows the existing application theme. All components are responsive and work seamlessly on both desktop and mobile devices.

## Future Enhancements

- Notification categories and filtering
- Bulk notification actions
- Notification preferences
- Push notifications
- Notification archiving
- Advanced search and filtering
- Notification templates
- Snooze functionality
