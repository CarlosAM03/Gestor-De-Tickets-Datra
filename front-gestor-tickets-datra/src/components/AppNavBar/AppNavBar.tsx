import { Link, useNavigate } from 'react-router-dom';
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
} from 'react-bootstrap';

import { useAuth } from '@/auth/useAuth';
import { MENU_ITEMS } from './menu.config';

import './AppNavBar.css';

export default function AppNavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <Navbar
      expand="lg"
      className="app-navbar shadow-sm"
      sticky="top"
    >
      <Container fluid>
        {/* ======================
            BRAND
        ====================== */}
        <Navbar.Brand
          as={Link}
          to="/dashboard"
          className="brand"
        >
          <span className="brand-title">DATRA</span>
          <span className="brand-subtitle">
            Gestion de Tickets
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          {/* ======================
              MENÚ PRINCIPAL
          ====================== */}
          <Nav className="me-auto nav-main">
            {MENU_ITEMS.filter(item =>
              item.roles.includes(user.role),
            ).map(item => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
              >
                {item.label}
              </Nav.Link>
            ))}
          </Nav>

          {/* ======================
              USUARIO
          ====================== */}
          <Nav className="nav-user">
            <NavDropdown
              align="end"
              title={
                <span className="user-dropdown-title">
                  {user.name}
                </span>
              }
            >
              <NavDropdown.Item disabled className="user-email">
                {user.email}
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item
                onClick={() =>
                  navigate(`/users/${user.id}`)
                }
              >
                Mi perfil
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item
                onClick={handleLogout}
                className="logout-item"
              >
                Cerrar sesión
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
