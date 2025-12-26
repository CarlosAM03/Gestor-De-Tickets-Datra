// src/pages/Users/UserView.tsx
import { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Form,
  Spinner,
  Badge,
  Alert,
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import { getUserById, deleteUser } from '@/api/users.api';
import { useAuth } from '@/auth/useAuth';
import type { User, UserRole } from '@/types/user.types';

/* =============================
   Visual role mapping
============================= */
const ROLE_VARIANTS: Record<UserRole, string> = {
  ADMIN: 'danger',
  INGENIERO: 'primary',
  TECNICO: 'secondary',
};

export default function UserView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =============================
     Permissions
  ============================= */
  const isAdmin = authUser?.role === 'ADMIN';
  const isSelf = authUser?.id === Number(id);

  /* =============================
     Load user
  ============================= */
  useEffect(() => {
    if (!id) return;

    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getUserById(Number(id));
        setUser(data);
      } catch {
        setError('No fue posible cargar la información del usuario');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  /* =============================
     Delete user (ADMIN)
  ============================= */
  const handleDelete = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      `¿Eliminar definitivamente al usuario "${user.name}"?`,
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteUser(user.id);
      navigate('/users');
    } catch {
      setError('No fue posible eliminar el usuario');
    } finally {
      setDeleting(false);
    }
  };

  /* =============================
     States
  ============================= */
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!user) {
    return (
      <Alert variant="warning">
        Usuario no encontrado
      </Alert>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Body>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Perfil de usuario</h4>

          <Badge bg={ROLE_VARIANTS[user.role]}>
            {user.role}
          </Badge>
        </div>

        {/* =============================
            Read-only form
        ============================= */}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control value={user.name} disabled />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control value={user.email} disabled />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Rol</Form.Label>
            <Form.Control value={user.role} disabled />
          </Form.Group>

          <Alert variant="info">
            La edición de usuarios aún no está habilitada.
            <br />
            <small>
              Próximamente:
              <ul className="mb-0">
                <li>ADMIN podrá editar todos los campos</li>
                <li>Usuario podrá editar nombre y contraseña</li>
              </ul>
            </small>
          </Alert>

          {/* =============================
              Actions
          ============================= */}
          <div className="d-flex justify-content-between mt-4">
            <Button
              variant="secondary"
              onClick={() =>
                navigate(isAdmin ? '/users' : '/dashboard')
              }
            >
              Volver
            </Button>

            {isAdmin && !isSelf && (
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting
                  ? 'Eliminando...'
                  : 'Eliminar usuario'}
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
