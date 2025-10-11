# Messaging Platform - Quick Start Guide

## Overview

This guide will help you get the messaging platform up and running in your LMS2 application.

## Prerequisites

- Amplify CLI installed and configured
- AWS account with AppSync access
- React development environment set up

## Step 1: Deploy the Schema

The Message model has been added to your GraphQL schema. Deploy it:

```bash
cd /path/to/lms2
amplify push
```

Select **Yes** when prompted to continue. This will:
- Create the Message table in DynamoDB
- Generate GraphQL API endpoints
- Set up required indexes (bySender, byRecipient, byInstitution)

**Expected time**: 2-5 minutes

## Step 2: Verify Installation

Check that the messaging route is accessible:

```bash
npm start
```

Navigate to: `http://localhost:3000/messages`

You should see the messaging interface.

## Step 3: Test Basic Functionality

### Send a Test Message

1. Click the **floating action button (FAB)** with a + icon
2. Select a recipient from the user directory
3. Type a message
4. Click **Send**

### View Messages

1. Messages appear in the left panel (desktop) or main view (mobile)
2. Click a conversation to view the full thread
3. Type a reply in the text box at the bottom
4. Press Enter or click the send icon

### Search

1. Use the search box in the message list to filter conversations
2. Use the search box in the user directory to find recipients

## Step 4: Add Navigation Link

Add a link to messages in your main navigation:

```javascript
// In your navigation component (e.g., Sidebar.jsx)
import MessageIcon from "@mui/icons-material/Message";
import { Badge } from "@mui/material";

// Add to your menu items array
{
  text: "Messages",
  icon: (
    <Badge badgeContent={unreadCount} color="error">
      <MessageIcon />
    </Badge>
  ),
  path: "/messages",
}
```

## Step 5: Integrate with Your Workflows

### Example: Send Loan Approval Request

```javascript
import { sendLoanApprovalRequest } from "./Screens/Messaging/messagingAPI";

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
import { sendPaymentReceivedNotification } from "./Screens/Messaging/messagingAPI";

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
import { sendPaymentDueReminder } from "./messagingAPI";

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

### Issue: Messages not appearing

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

### Issue: User directory empty

**Solution**: Ensure:
1. Users exist in the database
2. Users have `status: "active"`
3. Users belong to the same institution
4. Current user is excluded (expected)

### Issue: Cannot send messages

**Solution**: Verify:
1. Message body is not empty
2. Recipient is selected
3. User has valid institutionId
4. Network connection is working

## Testing Checklist

- [ ] Can view message list
- [ ] Can open user directory
- [ ] Can select a recipient
- [ ] Can compose a new message
- [ ] Can send a message
- [ ] Can view conversation thread
- [ ] Can reply to messages
- [ ] Messages marked as read automatically
- [ ] Unread count badge updates
- [ ] Search works in message list
- [ ] Search works in user directory
- [ ] Real-time updates work (test with two browsers)
- [ ] Responsive design works on mobile
- [ ] System messages display correctly
- [ ] Approval buttons work (if implemented)

## Performance Tips

1. **Limit Query Results**: The default limit is 100 messages. Implement pagination for users with more messages.

2. **Optimize Subscriptions**: Subscriptions are user-specific, so they scale well.

3. **Cache User Directory**: User list is cached after first load.

4. **Debounce Search**: Search is already debounced to reduce re-renders.

## Security Considerations

1. **Institution Scoping**: Always include institutionMessagesId in queries
2. **User Validation**: Verify user permissions before sending system messages
3. **Approval Actions**: Implement proper authorization checks in handleApproval
4. **Data Sanitization**: Validate and sanitize all user input

## Available System Message Types

Use these message types with `sendSystemMessage()`:

- `LOAN_APPROVAL_REQUEST` - Loan needs approval
- `BRANCH_CREATION_REQUEST` - New branch request
- `USER_JOIN_REQUEST` - User wants to join
- `EXPENSE_APPROVAL_REQUEST` - Expense needs approval
- `PAYMENT_RECEIVED` - Payment confirmation
- `PAYMENT_DUE_REMINDER` - Payment reminder
- `PAYMENT_OVERDUE_ALERT` - Overdue payment alert
- `LOAN_DISBURSED` - Loan disbursement confirmation
- `LOAN_APPROVED` - Loan approval notification
- `LOAN_REJECTED` - Loan rejection notification
- `DOCUMENT_REQUIRED` - Document submission request
- `ACCOUNT_STATUS_CHANGE` - Account status update

## Support and Documentation

- **README.md** - Feature documentation
- **INTEGRATION_EXAMPLES.md** - Practical integration examples
- **IMPLEMENTATION_SUMMARY.md** - Technical details
- **ARCHITECTURE.md** - System architecture and data flow

## Need Help?

Check the console for error messages and refer to the documentation files for detailed information.

## Next Steps

1. Customize system message templates in `systemMessages.js`
2. Add file attachment support (future enhancement)
3. Implement group messaging (future enhancement)
4. Add message templates (future enhancement)
5. Set up push notifications (future enhancement)

---

**Happy Messaging! 📨**
