// src/pages/Clients/ClientEdit.tsx
import { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import {
  getClientByRfc,
  updateClient,
} from '@/api/clients.api';

import type { Client } from '@/types/clients-types/clients.types';
import type {
  UpdateClientPayload,
} from '@/types/clients-types/clients.dto';

export default function ClientEdit() {
  const { rfc } = useParams<{ rfc: string }>();
  const navigate = useNavigate();

  const [client, setClient] = useState<Client | null>(null);
  const [form, setForm] =
    useState<UpdateClientPayload>({
      companyName: '',
      businessName: '',
      location: '',
    });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =============================
     LOAD CLIENT
  ============================= */
  useEffect(() => {
    const load = async () => {
      try {
        if (!rfc) return;

        const data = await getClientByRfc(rfc);
        setClient(data);

        setForm({
          companyName: data.companyName ?? '',
          businessName: data.businessName ?? '',
          location: data.location ?? '',
        });
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            'No se pudo cargar el cliente',
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [rfc]);

  /* =============================
     HANDLERS
  ============================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (!rfc) return;

    setSaving(true);
    setError(null);

    try {
      await updateClient(rfc, {
        companyName:
          form.companyName?.trim() || undefined,
        businessName:
          form.businessName?.trim() || undefined,
        location:
          form.location?.trim() || undefined,
      });

      navigate(`/clients/${rfc}`);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'No se pudo actualizar el cliente',
      );
    } finally {
      setSaving(false);
    }
  };

  /* =============================
     RENDER
  ============================= */
  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!client) {
    return (
      <Alert variant="danger">
        Cliente no encontrado
      </Alert>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h4 className="mb-4">
          Editar cliente
        </h4>

        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* RFC (readonly) */}
          <Form.Group className="mb-3">
            <Form.Label>RFC</Form.Label>
            <Form.Control
              value={client.rfc}
              disabled
            />
          </Form.Group>

          {/* Client Number (readonly) */}
          <Form.Group className="mb-3">
            <Form.Label>
              Número de cliente
            </Form.Label>
            <Form.Control
              value={client.clientNumber}
              disabled
            />
          </Form.Group>

          {/* Editable fields */}
          <Form.Group className="mb-3">
            <Form.Label>
              Razón social
            </Form.Label>
            <Form.Control
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Nombre comercial
            </Form.Label>
            <Form.Control
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              Ubicación
            </Form.Label>
            <Form.Control
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                navigate(`/clients/${rfc}`)
              }
              disabled={saving}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner
                    size="sm"
                    animation="border"
                  />{' '}
                  Guardando...
                </>
              ) : (
                'Guardar cambios'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
