# Notifications System - Quick Start Guide

## Overview

This guide will help you get the notifications system up and running in your LMS2 application.

## Prerequisites

- Amplify CLI installed and configured
- AWS account with AppSync access
- React development environment set up

## Step 1: Deploy the Schema

The Notification model has been added to your GraphQL schema. Deploy it:

```bash
cd /path/to/lms2
amplify push
```

Select **Yes** when prompted to continue. This will:

- Create the Notification table in DynamoDB
- Generate GraphQL API endpoints
- Set up required indexes (bySender, byRecipient, byInstitution)

**Expected time**: 2-5 minutes

## Step 2: Verify Installation

Check that the notifications route is accessible:

```bash
npm start
```

Navigate to: `http://localhost:3000/notifications`

You should see the notifications interface.

## Step 3: Test Basic Functionality

### View Notifications

1. Notifications appear in the left panel (desktop) or main view (mobile)
2. Click a notification to view the full details
3. For approval notifications, use the Approve/Reject buttons
4. Notifications are automatically marked as read when viewed

### Search Notifications

1. Use the search box in the notification list to filter notifications
2. Search by subject, content, or sender name

## Step 4: Add Navigation Link

Add a link to notifications in your main navigation:

```javascript
// In your navigation component (e.g., Sidebar.jsx)
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge } from "@mui/material";
import { useUnreadNotificationCount } from "./Screens/Notifications/useUnreadNotificationCount";

// In your component
const { unreadCount } = useUnreadNotificationCount();

// Add to your menu items array
{
  text: "Notifications",
  icon: (
    <Badge badgeContent={unreadCount} color="error">
      <NotificationsIcon />
    </Badge>
  ),
  path: "/notifications",
}
```

## Step 5: Integrate with Your Workflows

### Example: Send Loan Approval Request

```javascript
import { sendLoanApprovalRequest } from "./Screens/Notifications/notificationsAPI";

// When a loan is submitted for approval
const handleLoanSubmit = async (loanData) => {
  // ... your loan submission logic ...

  // Get admin user ID
  const adminId = await getAdminUserId();

  // Send approval request
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
    adminId,
    institutionId
  );
};
```

### Example: Send Payment Notification

```javascript
import { sendPaymentReceivedNotification } from "./Screens/Notifications/notificationsAPI";

// After payment is processed
const handlePayment = async (paymentData) => {
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
};
```

## Step 6: Set Up Scheduled Reminders (Optional)

For payment due reminders, set up a scheduled Lambda function:

```javascript
// Lambda function (scheduled daily)
import { sendPaymentDueReminder } from "./notificationsAPI";

export const handler = async () => {
  // Get loans with payments due in next 7 days
  const upcomingPayments = await getUpcomingPayments(7);

  for (const payment of upcomingPayments) {
    await sendPaymentDueReminder(
      {
        loanNumber: payment.loan.id,
        amountDue: `$${payment.amount}`,
        dueDate: payment.dueDate,
        daysUntilDue: calculateDaysUntil(payment.dueDate),
        loanId: payment.loan.id,
        paymentId: payment.id,
      },
      payment.borrowerUserId,
      institutionId
    );
  }
};
```

## Common Issues and Solutions

### Issue: Notifications not appearing

**Solution**: Check that:

1. Schema has been deployed (`amplify push`)
2. Users are in the same institution
3. Both sender and recipient have active status
4. Browser console for any errors

### Issue: Subscription not working

**Solution**:

1. Check network tab for WebSocket connection
2. Verify AppSync API is accessible
3. Check AWS credentials are valid
4. Refresh the page

### Issue: Cannot send notifications

**Solution**: Verify:

1. Notification body is not empty
2. Recipient is selected
3. User has valid institutionId
4. Network connection is working

## Testing Checklist

- [ ] Can view notification list
- [ ] Can select a notification to view details
- [ ] Notifications marked as read automatically
- [ ] Unread count badge updates
- [ ] Search works in notification list
- [ ] Real-time updates work (test with two browsers)
- [ ] Responsive design works on mobile
- [ ] System notifications display correctly
- [ ] Approval buttons work (if implemented)

## Performance Tips

1. **Limit Query Results**: The default limit is 100 notifications. Implement pagination for users with more notifications.

2. **Optimize Subscriptions**: Subscriptions are user-specific, so they scale well.

3. **Debounce Search**: Search is already debounced to reduce re-renders.

## Security Considerations

1. **Institution Scoping**: Always include institutionNotificationsId in queries
2. **User Validation**: Verify user permissions before sending system notifications
3. **Approval Actions**: Implement proper authorization checks in handleApproval
4. **Data Sanitization**: Validate and sanitize all user input

## Available System Notification Types

Use these notification types with `sendNotification()`:

- `approval_request` - Approval needed
- `payment_notification` - Payment related
- `loan_notification` - Loan related
- `user_notification` - User account related
- `system_notification` - General system notifications

## Support and Documentation

- **README.md** - Feature documentation
- **INTEGRATION_EXAMPLES.md** - Practical integration examples
- **IMPLEMENTATION_SUMMARY.md** - Technical details
- **ARCHITECTURE.md** - System architecture and data flow

## Need Help?

Check the console for error messages and refer to the documentation files for detailed information.

## Next Steps

1. Customize system notification templates in `systemMessages.js`
2. Add notification categories (future enhancement)
3. Implement notification preferences (future enhancement)
4. Add push notifications (future enhancement)
5. Set up notification templates (future enhancement)

---

**Happy Notifying! �**
