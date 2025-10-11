# Messaging Platform

A comprehensive messaging system for the LMS2 application with support for user-to-user messaging and system-generated messages.

## Features

- **User Directory**: View and select recipients from within the same institution
- **Message List**: View all conversations sorted by most recent
- **Message Thread**: Read and reply to messages in a conversation view
- **Message Composer**: Create and send new messages
- **System Messages**: Support for system-generated messages with approval actions
- **Real-time Updates**: Subscribe to new messages
- **Mobile Responsive**: Optimized for both desktop and mobile views

## Components

### Messaging.jsx
Main messaging component that orchestrates the entire messaging interface. Provides responsive layout for desktop (two-panel) and mobile (single-panel) views.

### MessageList.jsx
Displays all conversations for the logged-in user, grouped by recipient with:
- Unread message count badges
- Message preview
- Search functionality
- Last message timestamp

### MessageThread.jsx
Shows the full conversation with a specific user:
- All messages in chronological order
- Send replies
- Mark messages as read automatically
- Support for approval/rejection buttons on system messages

### MessageComposer.jsx
Create and send new messages:
- Select recipient
- Optional subject line
- Message body
- Send functionality

### UserDirectory.jsx
Select message recipients:
- Lists all active users in the institution (excluding current user)
- Search by name, email, or user type
- Shows user avatars and roles

## Utilities

### messageUtils.js
Helper functions for:
- Date formatting
- Message filtering
- Message sorting
- Conversation grouping
- Message preview generation

### systemMessages.js
Predefined system message templates for:
- Loan approval requests
- User join requests
- Branch creation requests
- Expense approval requests
- Payment notifications
- Payment reminders
- Overdue alerts
- Loan disbursement notifications
- Document submission requests
- Account status changes

### messagingQueries.js
GraphQL queries and mutations for:
- Listing messages
- Getting message details
- Creating messages
- Updating message status
- Listing users
- Real-time subscriptions

## Usage

### Basic Messaging
```javascript
import { Messaging } from "./Screens/Messaging";

// In your route
<Route path="messages" element={<Messaging />} />
```

### Sending System Messages
```javascript
import { generateSystemMessage } from "./Screens/Messaging/systemMessages";
import { CREATE_MESSAGE_MUTATION } from "./Screens/Messaging/messagingQueries";

// Generate a loan approval request message
const messageData = generateSystemMessage("LOAN_APPROVAL_REQUEST", {
  borrowerName: "John Doe",
  loanAmount: "$10,000",
  loanProduct: "Personal Loan",
  applicationDate: "2025-01-15",
  loanOfficer: "Jane Smith",
  loanId: "loan123",
  borrowerId: "borrower456",
});

// Send the message to admins
await client.graphql({
  query: CREATE_MESSAGE_MUTATION,
  variables: {
    input: {
      subject: messageData.subject,
      body: messageData.body,
      messageType: messageData.messageType,
      systemMessageType: messageData.systemMessageType,
      systemMessageData: JSON.stringify(messageData.systemMessageData),
      status: "unread",
      senderUserId: "system",
      recipientUserId: adminUserId,
      institutionMessagesId: institutionId,
    },
  },
});
```

### Using Message Utilities
```javascript
import {
  formatMessageDate,
  getUserDisplayName,
  groupMessagesByConversation,
} from "./Screens/Messaging/messageUtils";

// Format a date
const formattedDate = formatMessageDate("2025-01-15T10:30:00Z");

// Get user display name
const displayName = getUserDisplayName(user);

// Group messages into conversations
const conversations = groupMessagesByConversation(messages, currentUserId);
```

## GraphQL Schema

The messaging platform uses the `Message` type in the GraphQL schema:

```graphql
type Message @model {
  id: ID!
  subject: String
  body: String!
  messageType: String # "user_message" or "system_message"
  systemMessageType: String # e.g., "approval_request", "notification"
  systemMessageData: AWSJSON # Contains approval details, buttons, etc.
  status: String # "unread", "read"
  createdAt: AWSDateTime
  sender: User @belongsTo(fields: ["senderUserId"])
  senderUserId: ID! @index(name: "bySender")
  recipient: User @belongsTo(fields: ["recipientUserId"])
  recipientUserId: ID! @index(name: "byRecipient")
  institutionMessagesId: ID @index(name: "byInstitution")
}
```

## Styling

The messaging platform uses Material-UI components and follows the existing application theme. All components are responsive and work seamlessly on both desktop and mobile devices.

## Future Enhancements

- File attachments
- Message threading (replies to specific messages)
- Message reactions
- Group messaging
- Message templates
- Read receipts
- Typing indicators
- Push notifications
- Message archiving
- Advanced search and filtering
