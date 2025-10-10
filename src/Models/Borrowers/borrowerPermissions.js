// permissions.js

const borrowerPermissions = {
  Admin: {
    create: true,
    read: true,
    update: true,
    delete: true,
  },
  loanOfficer: {
    create: true,
    read: true,
    update: true,
    delete: false,
  },
  creditCommittee: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  accountant: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  cashier: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  client: {
    create: true,  // self-registration
    read: true,    // view own profile
    update: true,  // edit own info
    delete: false,
  },
  branchManager: {
    create: true,
    read: true,
    update: true,
    delete: false,
  },
  auditor: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  collectionsOfficer: {
    create: false,
    read: true,
    update: true,  // can update borrower contact/status info
    delete: false,
  },
  riskAnalyst: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  itSupport: {
    create: false,
    read: true,
    update: true,  // can perform data corrections
    delete: false,
  },
};


