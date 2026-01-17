import { Card, Alert, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import UserForm, {
  UserFormValues,
} from '@/components/Users/UserForm';
import {
  getUserById,
  updateUserByAdmin,
  updateMyProfile,
} from '@/api/users.api';
import { useAuth } from '@/auth/useAuth';

export default function UserEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const isAdmin = authUser?.role === 'ADMIN';
  const isSelf = authUser?.id === Number(id);

  const [form, setForm] = useState<UserFormValues>({
    name: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    getUserById(Number(id))
      .then(user =>
        setForm({
          name: user.name,
          email: user.email,
          role: user.role,
        }),
      )
      .catch(() =>
        setError('No fue posible cargar el usuario'),
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    try {
      setSaving(true);

      if (isSelf) {
        await updateMyProfile({
          name: form.name,
          password: form.password || undefined,
        });
      } else if (isAdmin) {
        await updateUserByAdmin(Number(id), {
          name: form.name,
          email: form.email,
          role: form.role,
        });
      }

      navigate(`/users/${id}`);
    } catch {
      setError('No fue posible guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner className="d-block mx-auto mt-5" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Card className="p-3 shadow-sm">
      <h4 className="mb-3">Editar usuario</h4>

      <UserForm
        values={form}
        loading={saving}
        isAdmin={isAdmin && !isSelf}
        isSelf={isSelf}
        submitLabel="Guardar cambios"
        onChange={setForm}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </Card>
  );
}
