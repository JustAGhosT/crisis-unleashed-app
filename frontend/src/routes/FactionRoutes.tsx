import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FactionsHub from '@/pages/FactionsHub';
import SolarisPage from '@/pages/factions/SolarisPage';
import UmbralPage from '@/pages/factions/UmbralPage';
import NeuralisPage from '@/pages/factions/NeuralisPage';
import AeonicPage from '@/pages/factions/AeonicPage';
import InfernalPage from '@/pages/factions/InfernalPage';
import PrimordialPage from '@/pages/factions/PrimordialPage';
import SyntheticPage from '@/pages/factions/SyntheticPage';
import TimelinePage from '@/pages/TimelinePage';

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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default FactionRoutes;