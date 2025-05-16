import React, { createContext, useContext, useState, useCallback } from 'react';
import NotificationBar from './NotificationBar'; // Adjust the path as necessary

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ message: '', color: 'blue' });

  const showNotification = useCallback((message, color = 'blue') => {
    setNotification({ message, color });
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <NotificationBar message={notification.message} color={notification.color} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

// You’ll need to import NotificationBar below:
