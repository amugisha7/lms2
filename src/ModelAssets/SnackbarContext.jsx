import React, { createContext, useContext, useState, useCallback } from 'react';
import SnackbarNotification from './SnackbarNotification';

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snack, setSnack] = useState({ message: '', color: 'blue', link: '' });

  const showSnackbar = useCallback((message, color = 'blue', link = '') => {
    setSnack({ message, color, link });
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <SnackbarNotification
        message={snack.message}
        color={snack.color}
        link={snack.link}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);
