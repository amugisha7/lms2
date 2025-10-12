// Messaging API helper functions for sending messages programmatically

import loggedClient from "../../loggedClient";
import { CREATE_NOTIFICATION_MUTATION } from "./notificationQueries";
import { generateSystemMessage } from "./systemMessages";

const client = loggedClient;

/**
 * Send a user message
 * @param {string} senderUserId - ID of the sender
 * @param {string} recipientUserId - ID of the recipient
 * @param {string} body - Message body
 * @param {string} subject - Optional subject line
 * @param {string} institutionId - Institution ID
 * @returns {Promise} - Created message
 */
export const sendUserMessage = async (
  senderUserId,
  recipientUserId,
  body,
  subject = null,
  institutionId
) => {
  try {
    console.log('API Call: sendUserMessage', { senderUserId, recipientUserId, body, subject, institutionId });
    const response = await client.graphql({
      query: CREATE_NOTIFICATION_MUTATION,
      variables: {
        input: {
          subject: subject,
          body: body,
          notificationType: "user_message",
          status: "unread",
          senderUserId: senderUserId,
          recipientUserId: recipientUserId,
          institutionMessagesId: institutionId,
        },
      },
    });

    return response.data.createMessage;
  } catch (error) {
    console.error("Error sending user message:", error);
    throw error;
  }
};

/**
 * Send a system message
 * @param {string} messageType - Type of system message (e.g., "LOAN_APPROVAL_REQUEST")
 * @param {object} data - Data for the message template
 * @param {string} recipientUserId - ID of the recipient
 * @param {string} institutionId - Institution ID
 * @param {string} senderUserId - ID of the sender (defaults to "system")
 * @returns {Promise} - Created message
 */
export const sendSystemMessage = async (
  messageType,
  data,
  recipientUserId,
  institutionId,
  senderUserId = "system"
) => {
  try {
    const messageData = generateSystemMessage(messageType, data);

    if (!messageData) {
      throw new Error(`Invalid message type: ${messageType}`);
    }

    console.log('API Call: sendSystemMessage', { messageType, recipientUserId, institutionId, senderUserId });
    const response = await client.graphql({
      query: CREATE_NOTIFICATION_MUTATION,
      variables: {
        input: {
          subject: messageData.subject,
          body: messageData.body,
          notificationType: messageData.messageType,
          status: "unread",
          senderUserId: senderUserId,
          recipientUserId: recipientUserId,
          institutionMessagesId: institutionId,
        },
      },
    });

    return response.data.createMessage;
  } catch (error) {
    console.error("Error sending system message:", error);
    throw error;
  }
};

/**
 * Send a loan approval request to admin
 * @param {object} loanData - Loan details
 * @param {string} adminUserId - Admin user ID
 * @param {string} institutionId - Institution ID
 * @returns {Promise} - Created message
 */
export const sendLoanApprovalRequest = async (
  loanData,
  adminUserId,
  institutionId
) => {
  const messageData = {
    borrowerName: loanData.borrowerName,
    loanAmount: loanData.loanAmount,
    loanProduct: loanData.loanProduct,
    applicationDate: loanData.applicationDate,
    loanOfficer: loanData.loanOfficer,
    loanId: loanData.loanId,
    borrowerId: loanData.borrowerId,
  };

  return sendSystemMessage(
    "LOAN_APPROVAL_REQUEST",
    messageData,
    adminUserId,
    institutionId
  );
};

/**
 * Send a payment received notification
 * @param {object} paymentData - Payment details
 * @param {string} recipientUserId - Recipient user ID
 * @param {string} institutionId - Institution ID
 * @returns {Promise} - Created message
 */
export const sendPaymentReceivedNotification = async (
  paymentData,
  recipientUserId,
  institutionId
) => {
  const messageData = {
    borrowerName: paymentData.borrowerName,
    amount: paymentData.amount,
    paymentMethod: paymentData.paymentMethod,
    paymentDate: paymentData.paymentDate,
    referenceNumber: paymentData.referenceNumber,
    remainingBalance: paymentData.remainingBalance,
    paymentId: paymentData.paymentId,
    loanId: paymentData.loanId,
  };

  return sendSystemMessage(
    "PAYMENT_RECEIVED",
    messageData,
    recipientUserId,
    institutionId
  );
};

/**
 * Send a payment due reminder
 * @param {object} reminderData - Reminder details
 * @param {string} borrowerUserId - Borrower user ID
 * @param {string} institutionId - Institution ID
 * @returns {Promise} - Created message
 */
export const sendPaymentDueReminder = async (
  reminderData,
  borrowerUserId,
  institutionId
) => {
  const messageData = {
    loanNumber: reminderData.loanNumber,
    amountDue: reminderData.amountDue,
    dueDate: reminderData.dueDate,
    daysUntilDue: reminderData.daysUntilDue,
    loanId: reminderData.loanId,
    paymentId: reminderData.paymentId,
  };

  return sendSystemMessage(
    "PAYMENT_DUE_REMINDER",
    messageData,
    borrowerUserId,
    institutionId
  );
};

/**
 * Send a loan disbursement notification
 * @param {object} loanData - Loan details
 * @param {string} borrowerUserId - Borrower user ID
 * @param {string} institutionId - Institution ID
 * @returns {Promise} - Created message
 */
export const sendLoanDisbursedNotification = async (
  loanData,
  borrowerUserId,
  institutionId
) => {
  const messageData = {
    borrowerName: loanData.borrowerName,
    loanAmount: loanData.loanAmount,
    loanProduct: loanData.loanProduct,
    disbursementDate: loanData.disbursementDate,
    firstPaymentDate: loanData.firstPaymentDate,
    accountNumber: loanData.accountNumber,
    loanId: loanData.loanId,
  };

  return sendSystemMessage(
    "LOAN_DISBURSED",
    messageData,
    borrowerUserId,
    institutionId
  );
};

/**
 * Send a user join request to admin
 * @param {object} userData - User details
 * @param {string} adminUserId - Admin user ID
 * @param {string} institutionId - Institution ID
 * @returns {Promise} - Created message
 */
export const sendUserJoinRequest = async (
  userData,
  adminUserId,
  institutionId
) => {
  const messageData = {
    userName: userData.userName,
    userEmail: userData.userEmail,
    userType: userData.userType,
    requestDate: userData.requestDate,
    userId: userData.userId,
  };

  return sendSystemMessage(
    "USER_JOIN_REQUEST",
    messageData,
    adminUserId,
    institutionId
  );
};

/**
 * Broadcast a message to multiple recipients
 * @param {string} senderUserId - ID of the sender
 * @param {Array<string>} recipientUserIds - Array of recipient IDs
 * @param {string} body - Message body
 * @param {string} subject - Optional subject line
 * @param {string} institutionId - Institution ID
 * @returns {Promise<Array>} - Array of created messages
 */
export const broadcastMessage = async (
  senderUserId,
  recipientUserIds,
  body,
  subject = null,
  institutionId
) => {
  try {
    const promises = recipientUserIds.map((recipientId) =>
      sendUserMessage(senderUserId, recipientId, body, subject, institutionId)
    );

    return await Promise.all(promises);
  } catch (error) {
    console.error("Error broadcasting message:", error);
    throw error;
  }
};
