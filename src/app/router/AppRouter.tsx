import HomePage from '@/pages/HomePage';
import RegionPage from '@/pages/RegionPage';
import { Routes, Route } from 'react-router';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/region/:regionValue" element={<RegionPage />} />
    </Routes>
  );
}
