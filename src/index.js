import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CustomerApp from './CustomerApp';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';
Amplify.configure(config);

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
