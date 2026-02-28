import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CustomerApp from './CustomerApp';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';
Amplify.configure(config);

// Suppress benign ResizeObserver loop warnings (common with MUI DataGrid)
// Must use capture phase to intercept before CRA's error overlay
const RESIZE_OBSERVER_MESSAGES = [
  'ResizeObserver loop',
  'ResizeObserver loop completed with undelivered notifications.',
];

const isResizeObserverLoopError = (message) => {
  if (!message || typeof message !== 'string') return false;
  return RESIZE_OBSERVER_MESSAGES.some((m) => message.includes(m));
};

const stopResizeObserverRuntimeNoise = (event) => {
  const message =
    event?.message ||
    event?.error?.message ||
    event?.reason?.message ||
    (typeof event?.reason === 'string' ? event.reason : '');

  if (isResizeObserverLoopError(message)) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
};

window.addEventListener('error', stopResizeObserverRuntimeNoise, true);
window.addEventListener('unhandledrejection', stopResizeObserverRuntimeNoise, true);

const root = ReactDOM.createRoot(document.getElementById('root'));

// Check if this is a customer portal route
const isCustomerPortal = window.location.pathname.startsWith('/client/');

root.render(
  <React.StrictMode>
    {isCustomerPortal ? <CustomerApp /> : <App />}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
