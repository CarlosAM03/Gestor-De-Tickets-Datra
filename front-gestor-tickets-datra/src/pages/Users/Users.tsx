// src/pages/Users/Users.tsx
import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Card,
  Form,
  Spinner,
  Badge,
  Alert,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { getUsers, updateUserByAdmin } from '@/api/users.api';
import type { User } from '@/types/user.types';
import type { UserRole } from '@/types/enums';

import './Users.css';

/* =============================
   Roles visuales
============================= */
const ROLE_VARIANTS: Record<UserRole, string> = {
  ADMIN: 'danger',
  INGENIERO: 'primary',
  TECNICO: 'secondary',
};

export default function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');

  /* =============================
     Load users (ADMIN)
  ============================= */
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getUsers();
      setUsers(data);
    } catch {
      setError('No fue posible cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* =============================
     Deactivate user (ADMIN)
      v2.0.0
  ============================= */
  const handleDeactivate = async (id: number) => {
    const confirm = window.confirm(
      '¿Desactivar este usuario? No podrá iniciar sesión.',
    );

    if (!confirm) return;

    try {
      await updateUserByAdmin(id, { active: false });
      setSuccess('Usuario desactivado correctamente');
      loadUsers();
    } catch {
      setError('No fue posible desactivar el usuario');
    }
  };

  /* =============================
     Filtro local
  ============================= */
  const filteredUsers = users.filter(u => {
    const matchText =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchRole = role ? u.role === role : true;

    return matchText && matchRole;
  });

  return (
    <Card className="users p-3 shadow-sm">
      {/* Header */}
      <div className="users-header">
        <h4 className="mb-0">Usuarios del sistema</h4>

        <Button onClick={() => navigate('/users/create')}>
          + Nuevo usuario
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      {/* Filtros */}
      <div className="row mb-3">
        <div className="col-md-6 mb-2">
          <Form.Control
            placeholder="Buscar por nombre o email"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3 mb-2">
          <Form.Select
            value={role}
            onChange={e =>
              setRole(e.target.value as UserRole | '')
            }
          >
            <option value="">Todos los roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="INGENIERO">INGENIERO</option>
            <option value="TECNICO">TECNICO</option>
          </Form.Select>
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center text-muted py-4">
          No hay usuarios registrados
        </div>
      ) : (
        <Table hover responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map(user => (
              <tr
                key={user.id}
                className={!user.active ? 'table-secondary' : undefined}
              >
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Badge bg={ROLE_VARIANTS[user.role]}>
                    {user.role}
                  </Badge>
                </td>
                <td>
                  <Badge bg={user.active ? 'success' : 'secondary'}>
                    {user.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>

                <td className="text-end">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                    onClick={() =>
                      navigate(`/users/${user.id}`)
                    }
                  >
                    Ver
                  </Button>

                  {user.active && (
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() =>
                        handleDeactivate(user.id)
                      }
                    >
                      Desactivar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
}
