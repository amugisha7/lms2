import { useContext } from 'react';
import { UserContext } from '../../App';

export const useHasPermission = (action, resource) => {
  const { userDetails } = useContext(UserContext);
  if (!userDetails || userDetails.status !== 'active') return false;
  
  const { userType } = userDetails;
  const permissions = {
    borrower: {
      read: ['any'],
      create: ['admin', 'manager', 'loanOfficer'],
      update: ['admin', 'manager', 'loanOfficer'],
      delete: ['admin'],
    },
    user: {
      read: ['any'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin'],
    },
  };
  
  return permissions[resource]?.[action]?.includes(userType.toLowerCase()) || false;
};
