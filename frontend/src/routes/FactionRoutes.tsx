import DebugObjectPage from '@/pages/DebugObjectPage';
import AeonicPage from '@/pages/factions/AeonicPage';
import InfernalPage from '@/pages/factions/InfernalPage';
import NeuralisPage from '@/pages/factions/NeuralisPage';
import PrimordialPage from '@/pages/factions/PrimordialPage';
import SolarisPage from '@/pages/factions/SolarisPage';
import SyntheticPage from '@/pages/factions/SyntheticPage';
import UmbralPage from '@/pages/factions/UmbralPage';
import { FactionsHub } from '@/pages/FactionsHub';
import TimelinePage from '@/pages/TimelinePage';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

/**
 * Faction Portal routing configuration
 * Can be used independently or as part of a larger application
 */
const FactionRoutes: React.FC = () => {
  // List of valid faction routes (lowercase)
  const validFactions = [
    'solaris',
    'umbral',
    'neuralis',
    'aeonic',
    'infernal',
    'primordial',
    'synthetic',
  ];

  // Helper to get correct page component
  const getFactionPage = (faction: string) => {
    switch (faction) {
      case 'solaris': return <SolarisPage />;
      case 'umbral': return <UmbralPage />;
      case 'neuralis': return <NeuralisPage />;
      case 'aeonic': return <AeonicPage />;
      case 'infernal': return <InfernalPage />;
      case 'primordial': return <PrimordialPage />;
      case 'synthetic': return <SyntheticPage />;
      default: return null;
    }
  };

  return (
    <Routes>
      <Route path="/" element={<FactionsHub />} />
      {/* Case-insensitive faction routes */}
      <Route
        path=":faction"
        element={
          <FactionRouteHandler validFactions={validFactions} getFactionPage={getFactionPage} />
        }
      />
      <Route path="/timeline" element={<TimelinePage />} />
      <Route path="/debug" element={<DebugObjectPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Handler for case-insensitive faction routes
import { useParams } from 'react-router-dom';

const FactionRouteHandler: React.FC<{
  validFactions: string[];
  getFactionPage: (faction: string) => React.ReactNode;
}> = ({ validFactions, getFactionPage }) => {
  const { faction } = useParams();
  if (!faction) return <Navigate to="/" replace />;
  const factionLower = faction.toLowerCase();
  if (!validFactions.includes(factionLower)) {
    return <Navigate to="/" replace />;
  }
  return getFactionPage(factionLower);
};

export default FactionRoutes;