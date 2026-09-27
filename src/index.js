import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Suppress benign ResizeObserver notifications from triggering webpack error overlay
const errorHandler = (e) => {
  if (
    e?.message?.includes('ResizeObserver') ||
    e?.error?.message?.includes('ResizeObserver')
  ) {
    e.stopImmediatePropagation?.();
    e.preventDefault?.();
    return true;
  }
};

window.addEventListener('error', errorHandler);
window.addEventListener('unhandledrejection', errorHandler);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

