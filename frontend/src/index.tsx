import React from 'react';
import { createRoot } from 'react-dom/client';
import posthog from 'posthog-js';
import './index.css';
import App from './App';

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
  });
} else {
  console.warn('PostHog key not found. Analytics will be disabled.');
}

const container = document.getElementById('root');

if (!container) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Web Vitals reporting (optional)
// import reportWebVitals from './reportWebVitals';
// reportWebVitals(console.log);
