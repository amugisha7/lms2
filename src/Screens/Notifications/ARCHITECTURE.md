# Notifications System Architecture

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                     Notifications.jsx                       │
│                   (Main Container)                          │
│  - Manages view state (list/thread)                         │
│  - Responsive layout switching                              │
│  - Handles notification actions                             │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┼───────────┐
                │                       │
                ▼                       ▼
┌──────────────────────┐  ┌──────────────────────┐
│   NotificationList    │  │  NotificationThread  │
│                      │  │                      │
│ - Notification list  │  │ - Notification detail│
│ - Search             │  │ - Approval actions    │
│ - Unread indicators  │  │ - Mark as read       │
│ - Real-time updates  │  │ - Back navigation    │
└──────────────────────┘  └──────────────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    GraphQL API Layer                        │
│                   (AWS AppSync)                             │
│                                                             │
│  Queries:                    Mutations:                     │
│  - listNotifications         - createNotification          │
│  - getNotification           - updateNotification          │
│                                                             │
│  Subscriptions:                                             │
│  - onCreateNotification (real-time)                         │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            │ GraphQL Operations
                            │
┌─────────────────────────────────────────────────────────────┐
│                  Notification Queries                       │
│               (notificationQueries.js)                      │
│  - Defines all GraphQL query/mutation strings               │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            │ Uses
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Notification API                          │
│                 (notificationsAPI.js)                       │
│  - sendNotification()                                       │
│  - sendApprovalRequest()                                    │
│  - sendLoanApprovalRequest()                                │
│  - sendPaymentReceivedNotification()                        │
│  - ... more helper functions                                │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            │ Calls
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Components Layer                          │
│  - NotificationList.jsx                                     │
│  - NotificationThread.jsx                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Uses
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 Utility Functions                           │
│                (notificationUtils.js)                       │
│  - formatNotificationDate()                                 │
│  - getNotificationPreview()                                 │
│  - searchNotifications()                                    │
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
│                   Notification Table                        │
├─────────────────────────────────────────────────────────────┤
│ PK: id (ID!)                                                │
│                                                             │
│ Fields:                                                     │
│ - subject: String (optional)                                │
│ - body: String! (required)                                  │
│ - notificationType: String (approval_request, etc.)         │
│ - approvalStatus: String (pending/approved/rejected)        │
│ - referenceId: String (loan/payment ID)                     │
│ - status: String (unread / read)                            │
│ - createdAt: AWSDateTime                                    │
│                                                             │
│ Foreign Keys:                                               │
│ - senderUserId: ID! → User.id                               │
│ - recipientUserId: ID! → User.id                            │
│ - institutionNotificationsId: ID                           │
│                                                             │
│ GSI Indexes:                                                │
│ - bySender: senderUserId                                    │
│ - byRecipient: recipientUserId                              │
│ - byInstitution: institutionNotificationsId                 │
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

## Notification Flow - General Notification

```
1. User opens Notifications
   │
   ├─→ NotificationList fetches notifications
   │   (queries notifications for current user)
   │
   ├─→ Displays notifications sorted by date
   │
   ├─→ Subscribes to new notifications (real-time)
   │
2. User clicks a notification
   │
   ├─→ Opens NotificationThread
   │
   ├─→ Displays full notification content
   │
   ├─→ Automatically marks as read
   │
   └─→ Shows approval buttons if applicable
```

## Notification Flow - Approval Notification

```
1. System event occurs (e.g., loan submitted)
   │
   ├─→ Application calls sendLoanApprovalRequest()
   │   from notificationsAPI.js
   │
   ├─→ Function generates notification with:
   │   - Subject: "Loan Approval Required - [Borrower]"
   │   - Body: Formatted details
   │   - notificationType: "approval_request"
   │   - referenceId: loan.id
   │
   ├─→ Calls CREATE_NOTIFICATION_MUTATION
   │
   ├─→ Notification saved to DynamoDB
   │
2. Admin opens Notifications
   │
   ├─→ Sees notification in NotificationList
   │
   ├─→ Opens NotificationThread
   │
   ├─→ Sees notification with Approve/Reject buttons
   │
   ├─→ Clicks Approve
   │
   ├─→ handleApproval() processes the action
   │
   ├─→ Updates related entity (loan status)
   │
   ├─→ Updates notification approvalStatus
   │
   └─→ Refreshes notification list
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
                            │ Uses notification API
                            │
                            ▼
    ┌─────────────────────────────────────────────┐
    │         Notification System                 │
    │         (notificationsAPI.js)               │
    ├─────────────────────────────────────────────┤
    │ - sendLoanApprovalRequest()                 │
    │ - sendPaymentReceivedNotification()         │
    │ - sendUserJoinRequest()                     │
    │ - sendPaymentDueReminder()                  │
    └─────────────────────────────────────────────┘
                            │
                            │ Creates notifications
                            │
                            ▼
    ┌─────────────────────────────────────────────┐
    │         DynamoDB Notification Table         │
    └─────────────────────────────────────────────┘
                            │
                            │ Real-time updates
                            │
                            ▼
    ┌─────────────────────────────────────────────┐
    │         User's Notification Interface       │
    │         (NotificationList + NotificationThread) │
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
│  │ NotificationList │  │    NotificationThread       │ │
│  │                  │  │                             │ │
│  │ - Notifications  │  │ - Notification details      │ │
│  │ - Search         │  │ - Approval actions          │ │
│  │ - Unread badges  │  │ - Mark as read              │ │
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
│    NotificationList         │
│                             │
│ - Notifications             │
│ - Search                    │
│ - Unread indicators         │
│                             │
└─────────────────────────────┘

        ↓ User taps notification

┌─────────────────────────────┐
│   [←] Notification          │
├─────────────────────────────┤
│                             │
│   NotificationThread        │
│                             │
│ - Full content              │
│ - Approval buttons          │
│ - Back to list              │
│                             │
└─────────────────────────────┘
```

## Security Model

```
┌─────────────────────────────────────────────────────────┐
│                   Institution Boundary                  │
│                                                         │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐           │
│  │ User A  │───>│Notification│───>│ User B  │           │
│  │         │    │          │    │         │           │
│  └─────────┘    └─────────┘    └─────────┘           │
│                      ▲                                 │
│                      │                                 │
│                      │ institutionNotificationsId      │
│                      │ filter                          │
│                      │                                 │
│  ┌──────────────────────────────────────────┐         │
│  │  All notifications scoped to institution │         │
│  │  Users can only see:                     │         │
│  │  - Notifications they received           │         │
│  │  Users in same institution only          │         │
│  └──────────────────────────────────────────┘         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Performance Optimizations

1. **Pagination**: Limit 100 notifications per query
2. **Subscription filtering**: Only new notifications for current user
3. **Debounced search**: Reduces unnecessary re-renders
4. **Lazy loading**: Components loaded on-demand
5. **Efficient queries**: Only fetch required fields

## Extension Points

The architecture supports future enhancements:

```
Current:                     Future Enhancements:
┌───────────────┐           ┌───────────────┐
│ Text Notifs   │ ──add──> │ + Categories  │
└───────────────┘           └───────────────┘
                            ┌───────────────┐
                            │ + Preferences │
                            └───────────────┘
                            ┌───────────────┐
                            │ + Templates   │
                            └───────────────┘
                            ┌───────────────┐
                            │ + Push Notifs │
                            └───────────────┘
                            ┌───────────────┐
                            │ + Snooze      │
                            └───────────────┘
```

All components are designed with extensibility in mind.

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
