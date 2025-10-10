export const hasPermission = (userDetails, action, resource) => {
  if (!userDetails || userDetails.status !== 'active') return false;
  
  const { userType } = userDetails;
  const permissions = {
    borrower: {
      read: ['admin', 'manager', 'user'],
      create: ['admin', 'manager'],
      update: ['admin', 'manager'],
      delete: ['admin'],
    },
  };
  
  return permissions[resource]?.[action]?.includes(userType.toLowerCase()) || false;
};
