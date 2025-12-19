import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useAuth } from '@/auth/useAuth';
import { MENU_ITEMS } from './menu.config';
import './AppNavBar.css';

export default function AppNavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // Seguridad UX

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <Navbar expand="lg" className="app-navbar shadow-sm">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard" className="brand">
          Datra
          <span className="brand-subtitle">Gestor de Tickets</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          {/* Menú */}
          <Nav className="me-auto">
            {MENU_ITEMS.filter(item =>
              item.roles.includes(user.role),
            ).map(item => (
              <Nav.Link as={Link} to={item.path} key={item.path}>
                {item.label}
              </Nav.Link>
            ))}
          </Nav>

          {/* Usuario */}
          <Nav>
            <NavDropdown title={user.name} align="end">
              <NavDropdown.Item disabled>
                {user.email}
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item onClick={() => navigate('/profile')}>
                Perfil
              </NavDropdown.Item>

              <NavDropdown.Item onClick={handleLogout}>
                Cerrar sesión
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
