import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import MainLayout from './layouts/MainLayout';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Private (temporal, sin guards aún) */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<div>Dashboard</div>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
