import { Form, Button, Spinner } from 'react-bootstrap';
import { UserRole } from '@/types/enums';

export interface UserFormValues {
  name: string;
  email?: string;
  role?: UserRole;
  password?: string;
}

interface Props {
  values: UserFormValues;
  loading?: boolean;

  isAdmin?: boolean;
  isSelf?: boolean;

  submitLabel: string;
  onChange: (values: UserFormValues) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function UserForm({
  values,
  loading,
  isAdmin,
  isSelf,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <Form onSubmit={e => e.preventDefault()}>
      {/* =====================
          NAME
      ===================== */}
      <Form.Group className="mb-3">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          value={values.name}
          disabled={loading}
          onChange={e =>
            onChange({ ...values, name: e.target.value })
          }
        />
      </Form.Group>

      {/* =====================
          EMAIL (ADMIN)
      ===================== */}
      {isAdmin && (
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={values.email ?? ''}
            disabled={loading}
            onChange={e =>
              onChange({ ...values, email: e.target.value })
            }
          />
        </Form.Group>
      )}

      {/* =====================
          ROLE (ADMIN)
      ===================== */}
      {isAdmin && (
        <Form.Group className="mb-3">
          <Form.Label>Rol</Form.Label>
          <Form.Select
            value={values.role}
            disabled={loading}
            onChange={e =>
              onChange({
                ...values,
                role: e.target.value as UserRole,
              })
            }
          >
            {Object.values(UserRole).map(role => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}

      {/* =====================
          PASSWORD (SELF)
      ===================== */}
      {isSelf && (
        <Form.Group className="mb-4">
          <Form.Label>Nueva contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Dejar vacío para no cambiar"
            value={values.password ?? ''}
            disabled={loading}
            onChange={e =>
              onChange({
                ...values,
                password: e.target.value,
              })
            }
          />
        </Form.Group>
      )}

      {/* =====================
          ACTIONS
      ===================== */}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button
          variant="outline-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>

        <Button onClick={onSubmit} disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" className="me-2" />
              Guardando...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </Form>
  );
}
