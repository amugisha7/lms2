import { useContext } from 'react';
import { UserContext } from '../../App';

// All role values must be lowercase — checkPermission lowercases userType before comparing
const PERMISSIONS = {
  borrower: {
    read: ['any'],
    create: ['admin', 'branchmanager', 'loanofficer'],
    update: ['admin', 'branchmanager', 'loanofficer'],
    delete: ['admin'],
  },
  loan: {
    read: ['any'],
    create: ['admin', 'branchmanager', 'loanofficer'],
    update: ['admin', 'branchmanager', 'loanofficer'],
    delete: ['admin', 'branchmanager'],
  },
  user: {
    read: ['any'],
    create: ['admin'],
    update: ['admin'],
    delete: ['admin'],
  },
  document: {
    read: ['any'],
    create: ['admin', 'branchmanager', 'loanofficer'],
    update: ['admin', 'branchmanager', 'loanofficer'],
    delete: ['admin', 'branchmanager', 'loanofficer'],
  },
  account: {
    read: ['any'],
    create: ['admin', 'branchmanager'],
    update: ['admin', 'branchmanager'],
    delete: ['admin'],
  },
  employee: {
    read: ['any'],
    create: ['admin', 'branchmanager'],
    update: ['admin', 'branchmanager'],
    delete: ['admin'],
  },
  payment: {
    read: ['any'],
    create: ['admin', 'branchmanager', 'loanofficer', 'cashier'],
    update: ['admin', 'branchmanager'],
    delete: ['admin'],
  },
  settings: {
    read: ['any'],
    update: ['admin'],
    delete: ['admin'],
  },
};

// Non-hook utility — use this outside of React components (e.g. filtering menu items)
export const checkPermission = (userDetails, action, resource) => {
  if (!userDetails || userDetails.status?.toLowerCase() !== 'active') return false;
  const userType = userDetails.userType?.toLowerCase();
  const allowed = PERMISSIONS[resource]?.[action];
  if (!allowed) return false;
  return allowed.includes('any') || allowed.includes(userType);
};

export const useHasPermission = (action, resource) => {
  const { userDetails } = useContext(UserContext);
  return checkPermission(userDetails, action, resource);
};
