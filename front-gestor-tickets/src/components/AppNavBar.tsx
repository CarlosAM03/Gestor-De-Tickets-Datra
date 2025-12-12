import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function AppNavbar() {
  const auth = React.useContext(AuthContext);
  const nav = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    nav('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          Datra — Gestor de Tickets (MVP)
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/tickets">
              Tickets
            </Nav.Link>
          </Nav>
          <Nav>
            {auth?.user ? (
              <NavDropdown title={auth.user.name} id="user-menu">
                <NavDropdown.Item disabled>{auth.user.email}</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => nav('/profile')}>Perfil</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>Cerrar sesión</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Button variant="outline-primary" className="me-2" onClick={() => nav('/login')}>
                  Iniciar sesión
                </Button>
                <Button onClick={() => nav('/register')}>Registrarse</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
