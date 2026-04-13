import HomePage from '@/pages/HomePage';
import { Routes, Route } from 'react-router';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
