# Messaging Platform Architecture

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                      Messaging.jsx                          │
│                   (Main Container)                          │
│  - Manages view state (list/thread/compose)                 │
│  - Responsive layout switching                              │
│  - User directory drawer                                    │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐  ┌────────────────┐  ┌──────────────────┐
│ MessageList   │  │ MessageThread  │  │ MessageComposer  │
│               │  │                │  │                  │
│ - Conversations│  │ - Thread view  │  │ - New message   │
│ - Search      │  │ - Reply input  │  │ - Subject/body   │
│ - Unread count│  │ - Mark as read │  │ - Send action    │
└───────────────┘  └────────────────┘  └──────────────────┘
                            │
                            └────────────────┐
                                            ▼
                                    ┌───────────────┐
                                    │ UserDirectory │
                                    │               │
                                    │ - User list   │
                                    │ - Search      │
                                    │ - Selection   │
                                    └───────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    GraphQL API Layer                        │
│                   (AWS AppSync)                             │
│                                                             │
│  Queries:                    Mutations:                     │
│  - listMessages              - createMessage                │
│  - getMessage                - updateMessage                │
│  - listUsers                 - deleteMessage                │
│                                                             │
│  Subscriptions:                                             │
│  - onCreateMessage (real-time)                              │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            │ GraphQL Operations
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Messaging Queries                         │
│               (messagingQueries.js)                         │
│  - Defines all GraphQL query/mutation strings               │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            │ Uses
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Messaging API                            │
│                 (messagingAPI.js)                           │
│  - sendUserMessage()                                        │
│  - sendSystemMessage()                                      │
│  - sendLoanApprovalRequest()                                │
│  - broadcastMessage()                                       │
│  - ... more helper functions                                │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            │ Calls
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Components Layer                          │
│  - MessageList.jsx                                          │
│  - MessageThread.jsx                                        │
│  - MessageComposer.jsx                                      │
│  - UserDirectory.jsx                                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Uses
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 Utility Functions                           │
│                (messageUtils.js)                            │
│  - formatMessageDate()                                      │
│  - groupMessagesByConversation()                            │
│  - searchMessages()                                         │
│  - ... more utilities                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              System Message Templates                       │
│              (systemMessages.js)                            │
│  - LOAN_APPROVAL_REQUEST                                    │
│  - PAYMENT_RECEIVED                                         │
│  - PAYMENT_DUE_REMINDER                                     │
│  - ... 12 templates total                                   │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema (DynamoDB)

```
┌─────────────────────────────────────────────────────────────┐
│                     Message Table                           │
├─────────────────────────────────────────────────────────────┤
│ PK: id (ID!)                                                │
│                                                             │
│ Fields:                                                     │
│ - subject: String (optional)                                │
│ - body: String! (required)                                  │
│ - messageType: String (user_message / system_message)       │
│ - systemMessageType: String (approval_request, etc.)        │
│ - systemMessageData: AWSJSON (for approval buttons/data)    │
│ - status: String (unread / read)                            │
│ - createdAt: AWSDateTime                                    │
│                                                             │
│ Foreign Keys:                                               │
│ - senderUserId: ID! → User.id                               │
│ - recipientUserId: ID! → User.id                            │
│ - institutionMessagesId: ID                                 │
│                                                             │
│ GSI Indexes:                                                │
│ - bySender: senderUserId                                    │
│ - byRecipient: recipientUserId                              │
│ - byInstitution: institutionMessagesId                      │
└─────────────────────────────────────────────────────────────┘
           │                    │
           │                    │
           ▼                    ▼
┌──────────────────┐   ┌──────────────────┐
│   User Table     │   │   User Table     │
│   (Sender)       │   │   (Recipient)    │
├──────────────────┤   ├──────────────────┤
│ PK: id           │   │ PK: id           │
│ - firstName      │   │ - firstName      │
│ - lastName       │   │ - lastName       │
│ - email          │   │ - email          │
│ - userType       │   │ - userType       │
│ - institution    │   │ - institution    │
└──────────────────┘   └──────────────────┘
```

## Message Flow - User Message

```
1. User opens Messaging
   │
   ├─→ MessageList fetches conversations
   │   (queries sent + received messages)
   │
   ├─→ Groups messages by conversation partner
   │
   ├─→ Subscribes to new messages (real-time)
   │
2. User clicks "New Message"
   │
   ├─→ Opens UserDirectory drawer
   │
   ├─→ Fetches institution users
   │
   ├─→ User selects recipient
   │
3. MessageComposer opens
   │
   ├─→ User types subject (optional) and body
   │
   ├─→ User clicks Send
   │
   ├─→ Calls CREATE_MESSAGE_MUTATION
   │
   ├─→ Message saved to DynamoDB
   │
   ├─→ Subscription triggers update in recipient's MessageList
   │
   └─→ Returns to MessageList with confirmation
```

## Message Flow - System Message

```
1. System event occurs (e.g., loan submitted)
   │
   ├─→ Application calls sendLoanApprovalRequest()
   │   from messagingAPI.js
   │
   ├─→ Function calls generateSystemMessage()
   │   with LOAN_APPROVAL_REQUEST template
   │
   ├─→ Template generates message with:
   │   - Subject: "Loan Approval Required - [Borrower]"
   │   - Body: Formatted details
   │   - systemMessageData: { actions: ["approve", "reject"] }
   │
   ├─→ Calls CREATE_MESSAGE_MUTATION
   │
   ├─→ Message saved to DynamoDB
   │
2. Admin opens Messaging
   │
   ├─→ Sees message in MessageList with "System" chip
   │
   ├─→ Opens MessageThread
   │
   ├─→ Sees message with Approve/Reject buttons
   │
   ├─→ Clicks Approve
   │
   ├─→ handleApproval() processes the action
   │
   ├─→ Updates loan status in database
   │
   ├─→ Marks message as read
   │
   └─→ Optionally sends confirmation message
```

## Integration Points

```
┌─────────────────────────────────────────────────────────────┐
│                  External Systems                           │
└─────────────────────────────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
    ┌──────────┐      ┌──────────┐     ┌──────────┐
    │  Loan    │      │  User    │     │ Payment  │
    │Management│      │Management│     │Processing│
    └──────────┘      └──────────┘     └──────────┘
          │                 │                 │
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                            │ Uses messaging API
                            │
                            ▼
    ┌─────────────────────────────────────────────┐
    │         Messaging Platform                  │
    │         (messagingAPI.js)                   │
    ├─────────────────────────────────────────────┤
    │ - sendLoanApprovalRequest()                 │
    │ - sendPaymentReceivedNotification()         │
    │ - sendUserJoinRequest()                     │
    │ - sendPaymentDueReminder()                  │
    │ - broadcastMessage()                        │
    └─────────────────────────────────────────────┘
                            │
                            │ Creates messages
                            │
                            ▼
    ┌─────────────────────────────────────────────┐
    │         DynamoDB Message Table              │
    └─────────────────────────────────────────────┘
                            │
                            │ Real-time updates
                            │
                            ▼
    ┌─────────────────────────────────────────────┐
    │         User's Message Interface            │
    │         (MessageList + MessageThread)       │
    └─────────────────────────────────────────────┘
```

## Responsive Layout

### Desktop (≥960px)

```
┌─────────────────────────────────────────────────────────┐
│                    Navigation Bar                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐  ┌─────────────────────────────┐ │
│  │                  │  │                             │ │
│  │  MessageList     │  │     MessageThread          │ │
│  │                  │  │                             │ │
│  │  - Conversations │  │  - Messages                 │ │
│  │  - Search        │  │  - Reply box                │ │
│  │  - Unread counts │  │                             │ │
│  │                  │  │  OR                         │ │
│  │  [New Msg FAB]   │  │                             │ │
│  │                  │  │     MessageComposer         │ │
│  │                  │  │                             │ │
│  │                  │  │  - Select recipient         │ │
│  │                  │  │  - Subject                  │ │
│  │                  │  │  - Body                     │ │
│  │                  │  │  - Send                     │ │
│  │                  │  │                             │ │
│  └──────────────────┘  └─────────────────────────────┘ │
│       33% width              67% width                  │
└─────────────────────────────────────────────────────────┘
```

### Mobile (<960px)

```
┌─────────────────────────────┐
│      Navigation Bar         │
├─────────────────────────────┤
│                             │
│      MessageList            │
│                             │
│  - Conversations            │
│  - Search                   │
│  - Unread counts            │
│                             │
│         [FAB]               │
│                             │
└─────────────────────────────┘

        ↓ User taps conversation

┌─────────────────────────────┐
│    [←] Conversation         │
├─────────────────────────────┤
│                             │
│      MessageThread          │
│                             │
│  - Messages                 │
│  - Reply box                │
│                             │
└─────────────────────────────┘

        ↓ User taps New Message

┌─────────────────────────────┐
│ UserDirectory (Drawer)      │
│ 80% height                  │
│                             │
│  - Search users             │
│  - Select recipient         │
│                             │
└─────────────────────────────┘

        ↓ User selects recipient

┌─────────────────────────────┐
│    [X] New Message          │
├─────────────────────────────┤
│                             │
│    MessageComposer          │
│                             │
│  - To: [Selected User]      │
│  - Subject                  │
│  - Body                     │
│  - [Cancel] [Send]          │
│                             │
└─────────────────────────────┘
```

## Security Model

```
┌─────────────────────────────────────────────────────────┐
│                   Institution Boundary                  │
│                                                         │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐           │
│  │ User A  │───>│ Message │───>│ User B  │           │
│  │         │    │         │    │         │           │
│  └─────────┘    └─────────┘    └─────────┘           │
│                      ▲                                 │
│                      │                                 │
│                      │ institutionMessagesId           │
│                      │ filter                          │
│                      │                                 │
│  ┌──────────────────────────────────────────┐         │
│  │  All messages scoped to institution      │         │
│  │  Users can only see:                     │         │
│  │  - Messages they sent                    │         │
│  │  - Messages they received                │         │
│  │  Users in same institution only          │         │
│  └──────────────────────────────────────────┘         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Performance Optimizations

1. **Pagination**: Limit 100 messages per query
2. **Client-side grouping**: No extra queries for conversations
3. **Subscription filtering**: Only new messages for current user
4. **User directory caching**: Cached after first load
5. **Lazy loading**: Components loaded on-demand
6. **Debounced search**: Reduces unnecessary re-renders
7. **Memoized client**: GraphQL client created once per component

## Extension Points

The architecture supports future enhancements:

```
Current:                     Future Enhancements:
┌───────────────┐           ┌───────────────┐
│ Text Messages │ ──add──> │ + Attachments │
└───────────────┘           └───────────────┘
                            ┌───────────────┐
                            │ + Reactions   │
                            └───────────────┘
                            ┌───────────────┐
                            │ + Threading   │
                            └───────────────┘
                            ┌───────────────┐
                            │ + Groups      │
                            └───────────────┘
                            ┌───────────────┐
                            │ + Templates   │
                            └───────────────┘
```

All components are designed with extensibility in mind.
