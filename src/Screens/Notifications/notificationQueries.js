// GraphQL queries and mutations for notifications

export const LIST_NOTIFICATIONS_QUERY = `
  query ListNotifications($filter: ModelNotificationFilterInput, $limit: Int, $nextToken: String) {
    listNotifications(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        subject
        body
        notificationType
        approvalStatus
        referenceId
        status
        createdAt
        senderUserId
        recipientUserId
        sender {
          id
          firstName
          lastName
          email
        }
        recipient {
          id
          firstName
          lastName
          email
        }
      }
      nextToken
    }
  }
`;
 
export const GET_NOTIFICATION_QUERY = `
  query GetNotification($id: ID!) {
    getNotification(id: $id) {
      id
      subject
      body
      notificationType
      approvalStatus
      referenceId
      status
      createdAt
      senderUserId
      recipientUserId
      sender {
        id
        firstName
        lastName
        email
        userType
      }
      recipient {
        id
        firstName
        lastName
        email
        userType
      }
    }
  }
`;

export const CREATE_NOTIFICATION_MUTATION = `
  mutation CreateNotification($input: CreateNotificationInput!) {
    createNotification(input: $input) {
      id
      subject
      body
      notificationType
      approvalStatus
      referenceId
      status
      createdAt
      senderUserId
      recipientUserId
    }
  }
`;

export const UPDATE_NOTIFICATION_MUTATION = `
  mutation UpdateNotification($input: UpdateNotificationInput!) {
    updateNotification(input: $input) {
      id
      status
      approvalStatus
    }
  }
`;

export const DELETE_NOTIFICATION_MUTATION = `
  mutation DeleteNotification($input: DeleteNotificationInput!) {
    deleteNotification(input: $input) {
      id
    }
  }
`;

export const LIST_USERS_IN_INSTITUTION_QUERY = `
  query ListUsersInInstitution($filter: ModelUserFilterInput, $limit: Int, $nextToken: String) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        firstName
        lastName
        email
        userType
        status
        institutionUsersId
      }
      nextToken
    }
  }
`;

export const SUBSCRIBE_TO_NEW_NOTIFICATIONS = `
  subscription OnCreateNotification($filter: ModelSubscriptionNotificationFilterInput) {
    onCreateNotification(filter: $filter) {
      id
      subject
      body
      notificationType
      approvalStatus
      referenceId
      status
      createdAt
      senderUserId
      recipientUserId
      sender {
        id
        firstName
        lastName
        email
      }
    }
  }
`;
