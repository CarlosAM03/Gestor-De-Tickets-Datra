import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '@/pages/Login/Login';
import Dashboard from '@/pages/Dashboard/Dashboard';
import TicketsAnalyticsDashboard from '@/pages/Dashboard/TicketsAnalyticsDashboard';

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

import { UserRole } from '@/types/enums';

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
              <RequireRole
                allowedRoles={[
                  UserRole.ADMIN,
                  UserRole.INGENIERO,
                ]}
              >
                <TicketsAnalyticsDashboard />
              </RequireRole>
            }
          />

          {/* =======================
              USERS (ADMIN ONLY)
          ======================= */}
          <Route
            path="users"
            element={
              <RequireRole allowedRoles={[UserRole.ADMIN]}>
                <Users />
              </RequireRole>
            }
          />

          <Route
            path="users/create"
            element={
              <RequireRole allowedRoles={[UserRole.ADMIN]}>
                <UserCreate />
              </RequireRole>
            }
          />

          {/* Vista de usuario (admin o self → validación fina en módulo) */}
          <Route
            path="users/:id"
            element={
              <RequireRole
                allowedRoles={[
                  UserRole.ADMIN,
                  UserRole.INGENIERO,
                  UserRole.TECNICO,
                ]}
              >
                <UserView />
              </RequireRole>
            }
          />

          {/* =======================
              TICKETS
          ======================= */}
          <Route path="tickets" element={<TicketsList />} />

          <Route
            path="tickets/create"
            element={
              <RequireRole
                allowedRoles={[
                  UserRole.ADMIN,
                  UserRole.INGENIERO,
                  UserRole.TECNICO,
                ]}
              >
                <TicketCreate />
              </RequireRole>
            }
          />

          <Route path="tickets/:id" element={<TicketView />} />

          <Route
            path="tickets/:id/edit"
            element={
              <RequireRole
                allowedRoles={[
                  UserRole.ADMIN,
                  UserRole.INGENIERO,
                  UserRole.TECNICO,
                ]}
              >
                <TicketEdit />
              </RequireRole>
            }
          />

          {/* =======================
              HISTORY
          ======================= */}
          <Route
            path="historial"
            element={
              <RequireRole
                allowedRoles={[
                  UserRole.ADMIN,
                  UserRole.INGENIERO,
                ]}
              >
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
