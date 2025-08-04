import React from 'react';
import FactionPortal from './FactionPortal';

/**
 * This component is for integrating the Faction Portal into your main application
 * Usage example in your main App.tsx:
 * 
 * <Routes>
 *   <Route path="/" element={<HomePage />} />
 *   <Route path="/game" element={<GameInterface />} />
 *   <Route path="/factions/*" element={<FactionPortalIntegration />} />
 *   { Other routes /}
 * </Routes>
 */
const FactionPortalIntegration: React.FC = () => {
  return <FactionPortal standalone={false} basePath="" />;
};

export default FactionPortalIntegration;