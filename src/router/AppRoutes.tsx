import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '@/pages/Login/Login';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Users from '@/pages/Users/Users';

import TicketsList from '@/pages/Tickets/TicketsList';
import TicketView from '@/pages/Tickets/TicketView';
import TicketCreate from '@/pages/Tickets/TicketCreate';
import TicketEdit from '@/pages/Tickets/TicketEdit';

import MainLayout from '@/layouts/MainLayout';
import RequireAuth from '@/auth/RequireAuth';
import { RequireRole } from '@/auth/RequireRole';

export default function AppRoutes() {
  return (
    <Routes>
      {/* =======================
          PUBLIC ROUTES
      ======================= */}
      <Route path="/login" element={<Login />} />

      {/* =======================
          PROTECTED ROUTES
      ======================= */}
      <Route element={<RequireAuth />}>
        <Route element={<MainLayout />}>
          {/* Entry point */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Usuarios (solo ADMIN) */}
          <Route
            path="users"
            element={
              <RequireRole allowedRoles={['ADMIN']}>
                <Users />
              </RequireRole>
            }
          />

          {/* =======================
              TICKETS (CORE)
          ======================= */}

          {/* Listado */}
          <Route path="tickets" element={<TicketsList />} />

          {/* Crear */}
          <Route path="tickets/create" element={<TicketCreate />} />

          {/* Ver */}
          <Route path="tickets/:id" element={<TicketView />} />

          {/* Editar */}
          <Route path="tickets/:id/edit" element={<TicketEdit />} />
        </Route>
      </Route>

      {/* =======================
          FALLBACK
      ======================= */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
