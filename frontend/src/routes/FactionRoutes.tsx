import AeonicPage from '@/pages/factions/AeonicPage';
import InfernalPage from '@/pages/factions/InfernalPage';
import NeuralisPage from '@/pages/factions/NeuralisPage';
import PrimordialPage from '@/pages/factions/PrimordialPage';
import SolarisPage from '@/pages/factions/SolarisPage';
import SyntheticPage from '@/pages/factions/SyntheticPage';
import UmbralPage from '@/pages/factions/UmbralPage';
import { FactionsHub } from '@/pages/FactionsHub';
import TimelinePage from '@/pages/TimelinePage';
import DebugObjectPage from '@/pages/DebugObjectPage';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

/**
 * Faction Portal routing configuration
 * Can be used independently or as part of a larger application
 */
const FactionRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<FactionsHub />} />
      <Route path="/solaris" element={<SolarisPage />} />
      <Route path="/umbral" element={<UmbralPage />} />
      <Route path="/neuralis" element={<NeuralisPage />} />
      <Route path="/aeonic" element={<AeonicPage />} />
      <Route path="/infernal" element={<InfernalPage />} />
      <Route path="/primordial" element={<PrimordialPage />} />
      <Route path="/synthetic" element={<SyntheticPage />} />
      <Route path="/timeline" element={<TimelinePage />} />
      <Route path="/debug" element={<DebugObjectPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default FactionRoutes;