import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import FactionPortal from './FactionPortal';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <FactionPortal standalone={true} />
  </React.StrictMode>
);