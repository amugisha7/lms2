// permissions.js

const userPermissions = {
  Admin: {
    create: true,
    read: true,
    update: true,
    delete: true,
  },
  loanOfficer: {
    create: false,
    read: true,
    update: false,
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
    create: false,
    read: false,
    update: false,
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
    update: false,
    delete: false,
  },
  riskAnalyst: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  itSupport: {
    create: true,
    read: true,
    update: true,
    delete: false,
  },
};

export default userPermissions;