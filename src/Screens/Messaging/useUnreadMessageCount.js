import React, { useContext } from 'react';
import { UserContext } from '../../App';

export const useUnreadMessageCount = () => {
  const { unreadCount } = useContext(UserContext);
  return unreadCount;
};