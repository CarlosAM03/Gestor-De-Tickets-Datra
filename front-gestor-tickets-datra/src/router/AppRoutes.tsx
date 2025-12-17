import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '@/pages/Login/Login';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Users from '@/pages/Users/Users';

import MainLayout from '@/layouts/MainLayout';
import RequireAuth from '@/auth/RequireAuth';
import {RequireRole} from '@/auth/RequireRole';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route element={<RequireAuth />}>
          <Route element={<MainLayout />}>
            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />

            {/* ADMIN only */}
            <Route
              path="/users"
              element={
                <RequireRole allowedRoles={['ADMIN']}>
                  <Users />
                </RequireRole>
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
