import HomePage from '@/pages/home';
import RegionPage from '@/pages/region';
import { Routes, Route } from 'react-router';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/region/:regionValue" element={<RegionPage />} />
    </Routes>
  );
}
