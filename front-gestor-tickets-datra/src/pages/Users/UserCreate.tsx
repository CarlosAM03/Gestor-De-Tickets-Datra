// src/pages/Users/UserCreate.tsx
import { useState } from 'react';
import {
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { createUser } from '@/api/users.api';
import { UserRole } from '@/types/enums';

import './Users.css';

export default function UserCreate() {
  const navigate = useNavigate();

  /* =============================
     FORM STATE
  ============================= */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.TECNICO);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =============================
     SUBMIT (ADMIN)
  ============================= */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createUser({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      navigate('/users');
    } catch {
      setError('No fue posible crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="users p-3 shadow-sm">
      <h4 className="mb-3">Nuevo usuario</h4>

      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} noValidate>
        {/* =====================
            NOMBRE
        ===================== */}
        <Form.Group className="mb-3" controlId="user-name">
          <Form.Label id="label-user-name">
            Nombre
          </Form.Label>
          <Form.Control
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nombre completo"
            disabled={loading}
            required
            aria-labelledby="label-user-name"
          />
        </Form.Group>

        {/* =====================
            EMAIL
        ===================== */}
        <Form.Group className="mb-3" controlId="user-email">
          <Form.Label id="label-user-email">
            Email
          </Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="correo@datra.mx"
            disabled={loading}
            required
            aria-labelledby="label-user-email"
          />
        </Form.Group>

        {/* =====================
            PASSWORD
        ===================== */}
        <Form.Group className="mb-3" controlId="user-password">
          <Form.Label id="label-user-password">
            Contraseña
          </Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            disabled={loading}
            required
            aria-labelledby="label-user-password"
          />
        </Form.Group>

        {/* =====================
            ROL (AXE OK)
        ===================== */}
        <Form.Group className="mb-4" controlId="user-role">
          <Form.Label id="label-user-role">
            Rol
          </Form.Label>
          <Form.Select
            value={role}
            onChange={e =>
              setRole(e.target.value as UserRole)
            }
            disabled={loading}
            aria-labelledby="label-user-role"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="INGENIERO">INGENIERO</option>
            <option value="TECNICO">TECNICO</option>
          </Form.Select>
        </Form.Group>

        {/* =====================
            ACTIONS
        ===================== */}
        <div className="d-flex justify-content-end">
          <Button
            variant="outline-secondary"
            className="me-2"
            onClick={() => navigate('/users')}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  size="sm"
                  animation="border"
                  className="me-2"
                />
                Creando...
              </>
            ) : (
              'Crear usuario'
            )}
          </Button>
        </div>
      </Form>
    </Card>
  );
}
