// GraphQL queries and mutations for messaging

export const LIST_MESSAGES_QUERY = `
  query ListMessages($filter: ModelMessageFilterInput, $limit: Int, $nextToken: String) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        subject
        body
        messageType
        systemMessageType
        systemMessageData
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

export const GET_MESSAGE_QUERY = `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
      id
      subject
      body
      messageType
      systemMessageType
      systemMessageData
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

export const CREATE_MESSAGE_MUTATION = `
  mutation CreateMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id
      subject
      body
      messageType
      systemMessageType
      systemMessageData
      status
      createdAt
      senderUserId
      recipientUserId
    }
  }
`;

export const UPDATE_MESSAGE_MUTATION = `
  mutation UpdateMessage($input: UpdateMessageInput!) {
    updateMessage(input: $input) {
      id
      status
    }
  }
`;

export const DELETE_MESSAGE_MUTATION = `
  mutation DeleteMessage($input: DeleteMessageInput!) {
    deleteMessage(input: $input) {
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

export const SUBSCRIBE_TO_NEW_MESSAGES = `
  subscription OnCreateMessage($recipientUserId: ID!) {
    onCreateMessage(recipientUserId: $recipientUserId) {
      id
      subject
      body
      messageType
      systemMessageType
      systemMessageData
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
