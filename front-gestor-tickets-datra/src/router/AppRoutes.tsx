import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '@/pages/Login/Login';
import Dashboard from '@/pages/Dashboard/Dashboard';
import TicketsAnalyticsDashboard from '@/pages/Dashboard/TicketsAnalyticsDashboard';

import Users from '@/pages/Users/Users';
import UserCreate from '@/pages/Users/UserCreate';
import UserEdit from '@/pages/Users/UserEdit';
import UserView from '@/pages/Users/UserView';

import ClientsList from '@/pages/Clients/ClientsList';
import ClientView from '@/pages/Clients/ClientView';
import ClientCreate from '@/pages/Clients/ClientCreate';
import ClientEdit from '@/pages/Clients/ClientEdit';

import ContractCreate from '@/pages/ContractServices/ContractCreate';
import ContractView from '@/pages/ContractServices/ContractView';

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
  {/* PUBLIC */}
  <Route path="/login" element={<Login />} />

  {/* AUTHENTICATED */}
  <Route element={<RequireAuth />}>
    <Route element={<MainLayout />}>
      <Route index element={<Navigate to="/dashboard" replace />} />

      {/* DASHBOARD */}
      <Route path="dashboard">
        <Route index element={<Dashboard />} />

        <Route
          path="analytics"
          element={
            <RequireRole allowedRoles={[UserRole.ADMIN, UserRole.INGENIERO]}>
              <TicketsAnalyticsDashboard />
            </RequireRole>
          }
        />
      </Route>

      {/* USERS */}
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
      
      <Route
        path="users/:id/edit"
        element={
          <RequireRole allowedRoles={[UserRole.ADMIN]}>
            <UserEdit />
          </RequireRole>
        }
      />

      <Route
        path="users/:id"
        element={
          <RequireRole allowedRoles={[UserRole.ADMIN, UserRole.INGENIERO, UserRole.TECNICO]}>
            <UserView />
          </RequireRole>
        }
      />

      {/* CLIENTS */}
      <Route
        path="clients"
        element={
          <RequireRole allowedRoles={[UserRole.ADMIN, UserRole.INGENIERO, UserRole.TECNICO]}>
            <ClientsList />
          </RequireRole>
        }
      />

      <Route
        path="clients/create"
        element={
          <RequireRole allowedRoles={[UserRole.ADMIN]}>
            <ClientCreate />
          </RequireRole>
        }
      />

      <Route
        path="clients/:rfc"
        element={
          <RequireRole allowedRoles={[UserRole.ADMIN, UserRole.INGENIERO, UserRole.TECNICO]}>
            <ClientView />
          </RequireRole>
        }
      />

      <Route
        path="clients/:rfc/edit"
        element={
          <RequireRole allowedRoles={[UserRole.ADMIN]}>
            <ClientEdit />
          </RequireRole>
        }
      />

      {/* CONTRACTS */}
      <Route
        path="clients/:rfc/contracts/create"
        element={
          <RequireRole allowedRoles={[UserRole.ADMIN]}>
            <ContractCreate />
          </RequireRole>
        }
      />

      <Route
        path="contracts/:id"
        element={
          <RequireRole allowedRoles={[UserRole.ADMIN, UserRole.INGENIERO, UserRole.TECNICO]}>
            <ContractView />
          </RequireRole>
        }
      />


      {/* TICKETS */}
      <Route path="tickets">
        <Route index element={<TicketsList />} />

        <Route
          path="create"
          element={
            <RequireRole allowedRoles={[UserRole.ADMIN, UserRole.INGENIERO, UserRole.TECNICO]}>
              <TicketCreate />
            </RequireRole>
          }
        />

        <Route path=":id" element={<TicketView />} />

        <Route
          path=":id/edit"
          element={
            <RequireRole allowedRoles={[UserRole.ADMIN, UserRole.INGENIERO, UserRole.TECNICO]}>
              <TicketEdit />
            </RequireRole>
          }
        />
      </Route>

      {/* HISTORY */}
      <Route
        path="historial"
        element={
          <RequireRole allowedRoles={[UserRole.ADMIN, UserRole.INGENIERO]}>
            <History />
          </RequireRole>
        }
      />
    </Route>
  </Route>

  {/* FALLBACK */}
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>

  );
}
