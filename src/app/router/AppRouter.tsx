import HomePage from '@/pages/home';
import NotFoundPage from '@/pages/notFound';
import RegionPage from '@/pages/region';
import { Routes, Route } from 'react-router';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/region/:regionValue" element={<RegionPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
