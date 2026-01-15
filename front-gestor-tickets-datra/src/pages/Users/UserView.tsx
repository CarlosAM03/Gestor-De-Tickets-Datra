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

import { getUserById, updateUserByAdmin } from '@/api/users.api';
import { useAuth } from '@/auth/useAuth';
import type { User } from '@/types/user.types';
import type { UserRole } from '@/types/enums';

/* =============================
   Visual role mapping
============================= */
const ROLE_VARIANTS: Record<UserRole, string> = {
  ADMIN: 'danger',
  INGENIERO: 'primary',
  TECNICO: 'secondary',
};

export default function UserView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =============================
     Permissions
  ============================= */
  const isAdmin = authUser?.role === 'ADMIN';
  const isSelf = authUser?.id === Number(id);

  /* =============================
     Load user (ADMIN o propio)
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
     Deactivate user (ADMIN)
     Soft delete v2.0.0
  ============================= */
  const handleDeactivate = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      `¿Desactivar al usuario "${user.name}"?\nNo podrá iniciar sesión.`,
    );

    if (!confirmed) return;

    try {
      setUpdating(true);
      await updateUserByAdmin(user.id, { active: false });
      navigate('/users');
    } catch {
      setError('No fue posible desactivar el usuario');
    } finally {
      setUpdating(false);
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

          <div className="d-flex gap-2">
            <Badge bg={ROLE_VARIANTS[user.role]}>
              {user.role}
            </Badge>

            <Badge bg={user.active ? 'success' : 'secondary'}>
              {user.active ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
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

            {isAdmin && !isSelf && user.active && (
              <Button
                variant="outline-danger"
                onClick={handleDeactivate}
                disabled={updating}
              >
                {updating
                  ? 'Desactivando...'
                  : 'Desactivar usuario'}
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
