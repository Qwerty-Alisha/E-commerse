import React from 'react';
import { createRoot } from 'react-dom/client'; // FIX: Import from /client
import { Provider } from 'react-redux';
import { store } from './app/store.js';
import './index.css';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container); // FIX: Use the new createRoot syntax

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

