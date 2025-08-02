import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FactionRoutes from './routes/FactionRoutes';

interface FactionPortalProps {
  basePath?: string; // For integration with main site
  standalone?: boolean; // For standalone deployment
}

/**
 * Main entry point for the Faction Portal
 * Can be deployed standalone or integrated into a larger application
 */
const FactionPortal: React.FC<FactionPortalProps> = ({
  basePath = '',
  standalone = true
}) => {
  // Standalone mode - includes its own BrowserRouter
  if (standalone) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path={`${basePath}/*`} element={<FactionRoutes />} />
        </Routes>
      </BrowserRouter>
    );
  }
  
  // Integration mode - expects to be used within an existing Router
  return <FactionRoutes />;
};

export default FactionPortal;