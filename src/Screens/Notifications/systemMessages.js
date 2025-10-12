// Default system messages categorized by user type and event

export const SYSTEM_MESSAGE_TYPES = {
  APPROVAL_REQUEST: "approval_request",
  NOTIFICATION: "notification",
  REMINDER: "reminder",
  ALERT: "alert",
};

export const USER_TYPES = {
  ADMIN: "admin",
  MANAGER: "manager",
  LOAN_OFFICER: "loan_officer",
  STAFF: "staff",
  BORROWER: "borrower",
};

// System message templates
export const SYSTEM_MESSAGES = {
  // Loan approval requests
  LOAN_APPROVAL_REQUEST: {
    type: SYSTEM_MESSAGE_TYPES.APPROVAL_REQUEST,
    userTypes: [USER_TYPES.ADMIN, USER_TYPES.MANAGER],
    template: (data) => ({
      subject: `Loan Approval Required - ${data.borrowerName}`,
      body: `A new loan application requires your approval.

Borrower: ${data.borrowerName}
Loan Amount: ${data.loanAmount}
Loan Product: ${data.loanProduct}
Application Date: ${data.applicationDate}
Loan Officer: ${data.loanOfficer}

Please review the full application details and approve or reject this request.`,
      systemMessageData: {
        loanId: data.loanId,
        borrowerId: data.borrowerId,
        amount: data.loanAmount,
        requiresAction: true,
        actions: ["approve", "reject"],
      },
    }),
  },

  // Branch creation approval
  BRANCH_CREATION_REQUEST: {
    type: SYSTEM_MESSAGE_TYPES.APPROVAL_REQUEST,
    userTypes: [USER_TYPES.ADMIN],
    template: (data) => ({
      subject: `New Branch Creation Request - ${data.branchName}`,
      body: `A new branch creation request requires your approval.

Branch Name: ${data.branchName}
Branch Code: ${data.branchCode}
Location: ${data.location}
Requested By: ${data.requestedBy}
Date: ${data.requestDate}

Please review and approve or reject this request.`,
      systemMessageData: {
        branchId: data.branchId,
        requiresAction: true,
        actions: ["approve", "reject"],
      },
    }),
  },

  // User join approval
  USER_JOIN_REQUEST: {
    type: SYSTEM_MESSAGE_TYPES.APPROVAL_REQUEST,
    userTypes: [USER_TYPES.ADMIN],
    template: (data) => ({
      subject: `New User Access Request - ${data.userName}`,
      body: `A new user is requesting access to the institution.

Name: ${data.userName}
Email: ${data.userEmail}
User Type: ${data.userType}
Date Requested: ${data.requestDate}

Please approve or reject this access request.`,
      systemMessageData: {
        userId: data.userId,
        requiresAction: true,
        actions: ["approve", "reject"],
      },
    }),
  },

  // Expense approval
  EXPENSE_APPROVAL_REQUEST: {
    type: SYSTEM_MESSAGE_TYPES.APPROVAL_REQUEST,
    userTypes: [USER_TYPES.ADMIN, USER_TYPES.MANAGER],
    template: (data) => ({
      subject: `Expense Approval Required - ${data.expenseType}`,
      body: `An expense requires your approval.

Type: ${data.expenseType}
Amount: ${data.amount}
Description: ${data.description}
Submitted By: ${data.submittedBy}
Date: ${data.submissionDate}

Please review and approve or reject this expense.`,
      systemMessageData: {
        expenseId: data.expenseId,
        requiresAction: true,
        actions: ["approve", "reject"],
      },
    }),
  },

  // Payment notifications
  PAYMENT_RECEIVED: {
    type: SYSTEM_MESSAGE_TYPES.NOTIFICATION,
    userTypes: [USER_TYPES.BORROWER, USER_TYPES.LOAN_OFFICER],
    template: (data) => ({
      subject: `Payment Received - ${data.amount}`,
      body: `A payment has been successfully received.

Borrower: ${data.borrowerName}
Amount: ${data.amount}
Payment Method: ${data.paymentMethod}
Date: ${data.paymentDate}
Reference: ${data.referenceNumber}
Remaining Balance: ${data.remainingBalance}

Thank you for your payment.`,
      systemMessageData: {
        paymentId: data.paymentId,
        loanId: data.loanId,
        requiresAction: false,
      },
    }),
  },

  // Payment due reminders
  PAYMENT_DUE_REMINDER: {
    type: SYSTEM_MESSAGE_TYPES.REMINDER,
    userTypes: [USER_TYPES.BORROWER],
    template: (data) => ({
      subject: `Payment Reminder - Due ${data.dueDate}`,
      body: `This is a reminder that your loan payment is due soon.

Loan Account: ${data.loanNumber}
Amount Due: ${data.amountDue}
Due Date: ${data.dueDate}
Days Until Due: ${data.daysUntilDue}

Please ensure payment is made on or before the due date to avoid penalties.`,
      systemMessageData: {
        loanId: data.loanId,
        paymentId: data.paymentId,
        requiresAction: false,
      },
    }),
  },

  // Overdue payment alert
  PAYMENT_OVERDUE_ALERT: {
    type: SYSTEM_MESSAGE_TYPES.ALERT,
    userTypes: [USER_TYPES.BORROWER, USER_TYPES.LOAN_OFFICER],
    template: (data) => ({
      subject: `OVERDUE: Payment Required - ${data.borrowerName}`,
      body: `URGENT: A loan payment is overdue.

Borrower: ${data.borrowerName}
Loan Account: ${data.loanNumber}
Overdue Amount: ${data.overdueAmount}
Days Overdue: ${data.daysOverdue}
Penalty Applied: ${data.penaltyAmount}

Please contact us immediately to arrange payment.`,
      systemMessageData: {
        loanId: data.loanId,
        borrowerId: data.borrowerId,
        requiresAction: false,
      },
    }),
  },

  // Loan disbursement notification
  LOAN_DISBURSED: {
    type: SYSTEM_MESSAGE_TYPES.NOTIFICATION,
    userTypes: [USER_TYPES.BORROWER, USER_TYPES.LOAN_OFFICER],
    template: (data) => ({
      subject: `Loan Disbursed - ${data.loanAmount}`,
      body: `Your loan has been successfully disbursed.

Borrower: ${data.borrowerName}
Loan Amount: ${data.loanAmount}
Loan Product: ${data.loanProduct}
Disbursement Date: ${data.disbursementDate}
First Payment Due: ${data.firstPaymentDate}
Account Number: ${data.accountNumber}

The funds have been transferred to your account. Thank you for choosing our services.`,
      systemMessageData: {
        loanId: data.loanId,
        requiresAction: false,
      },
    }),
  },

  // Loan approval notification
  LOAN_APPROVED: {
    type: SYSTEM_MESSAGE_TYPES.NOTIFICATION,
    userTypes: [USER_TYPES.BORROWER, USER_TYPES.LOAN_OFFICER],
    template: (data) => ({
      subject: `Loan Application Approved - ${data.borrowerName}`,
      body: `Congratulations! Your loan application has been approved.

Borrower: ${data.borrowerName}
Approved Amount: ${data.approvedAmount}
Interest Rate: ${data.interestRate}%
Loan Term: ${data.loanTerm}
Approval Date: ${data.approvalDate}

The loan will be disbursed shortly. Please contact us for any questions.`,
      systemMessageData: {
        loanId: data.loanId,
        requiresAction: false,
      },
    }),
  },

  // Loan rejection notification
  LOAN_REJECTED: {
    type: SYSTEM_MESSAGE_TYPES.NOTIFICATION,
    userTypes: [USER_TYPES.BORROWER, USER_TYPES.LOAN_OFFICER],
    template: (data) => ({
      subject: `Loan Application Status - ${data.borrowerName}`,
      body: `We regret to inform you that your loan application has not been approved at this time.

Borrower: ${data.borrowerName}
Application Date: ${data.applicationDate}
Reason: ${data.rejectionReason}

You may reapply after ${data.reapplyPeriod}. Please contact us if you have any questions.`,
      systemMessageData: {
        loanId: data.loanId,
        requiresAction: false,
      },
    }),
  },

  // Document submission request
  DOCUMENT_REQUIRED: {
    type: SYSTEM_MESSAGE_TYPES.REMINDER,
    userTypes: [USER_TYPES.BORROWER],
    template: (data) => ({
      subject: `Documents Required - ${data.documentType}`,
      body: `Additional documents are required to process your application.

Required Documents:
${data.documentsList}

Deadline: ${data.deadline}

Please submit the required documents as soon as possible to avoid delays.`,
      systemMessageData: {
        borrowerId: data.borrowerId,
        loanId: data.loanId,
        requiresAction: false,
      },
    }),
  },

  // Account status change
  ACCOUNT_STATUS_CHANGE: {
    type: SYSTEM_MESSAGE_TYPES.NOTIFICATION,
    userTypes: [USER_TYPES.BORROWER],
    template: (data) => ({
      subject: `Account Status Update`,
      body: `Your account status has been updated.

Account: ${data.accountNumber}
Previous Status: ${data.previousStatus}
New Status: ${data.newStatus}
Effective Date: ${data.effectiveDate}
Reason: ${data.reason}

Please contact us if you have any questions about this change.`,
      systemMessageData: {
        accountId: data.accountId,
        requiresAction: false,
      },
    }),
  },
};

// Helper function to generate a system message
export const generateSystemMessage = (messageType, data) => {
  const template = SYSTEM_MESSAGES[messageType];
  if (!template) {
    console.error(`Unknown system message type: ${messageType}`);
    return null;
  }

  const message = template.template(data);
  return {
    ...message,
    messageType: "system_message",
    systemMessageType: template.type,
  };
};

// Helper function to check if user type can receive message
export const canReceiveSystemMessage = (messageType, userType) => {
  const template = SYSTEM_MESSAGES[messageType];
  if (!template) return false;
  return template.userTypes.includes(userType);
};
