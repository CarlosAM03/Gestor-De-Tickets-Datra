import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '@/pages/Login/Login';
import Dashboard from '@/pages/Dashboard/Dashboard';
import TicketsAnalyticsDashboard from '@/pages/Dashboard/TicketsAnalyticsDashboard';
import Rankings from '@/pages/Dashboard/Rankings';

import Users from '@/pages/Users/Users';
import UserCreate from '@/pages/Users/UserCreate';
import UserView from '@/pages/Users/UserView';

import TicketsList from '@/pages/Tickets/TicketsList';
import TicketView from '@/pages/Tickets/TicketView';
import TicketCreate from '@/pages/Tickets/TicketCreate';
import TicketEdit from '@/pages/Tickets/TicketEdit';

import History from '@/pages/History/History';

import MainLayout from '@/layouts/MainLayout';
import RequireAuth from '@/auth/RequireAuth';
import { RequireRole } from '@/auth/RequireRole';

export default function AppRoutes() {
  return (
    <Routes>
      {/* =======================
          PUBLIC
      ======================= */}
      <Route path="/login" element={<Login />} />

      {/* =======================
          PROTECTED
      ======================= */}
      <Route element={<RequireAuth />}>
        <Route element={<MainLayout />}>
          {/* Entry */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Analytics Dashboard */}
          <Route
            path="dashboard/analytics"
            element={
              <RequireRole allowedRoles={['ADMIN', 'INGENIERO', 'TECNICO']}>
                <TicketsAnalyticsDashboard />
              </RequireRole>
            }
          />

          {/* Rankings Dashboard */}
          <Route
            path="dashboard/rankings"
            element={
              <RequireRole allowedRoles={['ADMIN', 'INGENIERO', 'TECNICO']}>
                <Rankings />
              </RequireRole>
            }
          />

          {/* =======================
              USERS (ADMIN)
          ======================= */}
          <Route
            path="users"
            element={
                <Users />
            }
          />

          <Route
            path="users/create"
            element={
              <RequireRole allowedRoles={['ADMIN']}>
                <UserCreate />
              </RequireRole>
            }
          />

          {/* Vista de usuario */} 
          <Route path="users/:id" element={ <UserView /> } />

          {/* =======================
              TICKETS
          ======================= */}
          <Route path="tickets" element={<TicketsList />} />
          <Route path="tickets/create" element={<TicketCreate />} />
          <Route path="tickets/:id" element={<TicketView />} />
          <Route path="tickets/:id/edit" element={<TicketEdit />} />

          {/* =======================
              HISTORY (ADMIN/ENGINEER)
          ======================= */}
          <Route
            path="historial"
            element={
              <RequireRole allowedRoles={['ADMIN', 'INGENIERO']}>
                <History />
              </RequireRole>
            }
          />
        </Route>
      </Route>

      {/* =======================
          FALLBACK
      ======================= */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
