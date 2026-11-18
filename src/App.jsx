import { Navigate, Route, Routes } from 'react-router-dom';

import SiswaListPage from './pages/SiswaListPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SiswaListPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
