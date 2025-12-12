import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import AppNavbar from './components/AppNavBar';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Regiter';
import Dashboard from './pages/Dashboard';
import TicketsList from './pages/tickets/TicketList';
import TicketView from './pages/tickets/TicketView';
import TicketForm from './pages/tickets/TicketForm';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unautorized';

export default function App() {
  return (
    <>
      <AppNavbar />
      <Container fluid className="pt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <TicketsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/new"
            element={
              <ProtectedRoute>
                <TicketForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute>
                <TicketView />
              </ProtectedRoute>
            }
          />

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </>
  );
}
