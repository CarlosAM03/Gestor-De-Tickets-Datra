// src/pages/Clients/ClientCreate.tsx
import { useState } from 'react';
import {
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { createClient } from '@/api/clients.api';
import type {
  CreateClientPayload,
} from '@/types/clients-types/clients.dto';

export default function ClientCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    rfc: '',
    clientNumber: '',
    companyName: '',
    businessName: '',
    location: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    setError(null);
    setLoading(true);

    try {
      const payload: CreateClientPayload = {
        rfc: form.rfc.trim().toUpperCase(),
        clientNumber: form.clientNumber.trim(),
      };

      if (form.companyName.trim()) {
        payload.companyName = form.companyName.trim();
      }

      if (form.businessName.trim()) {
        payload.businessName = form.businessName.trim();
      }

      if (form.location.trim()) {
        payload.location = form.location.trim();
      }

      await createClient(payload);

      navigate(`/clients/${payload.rfc}`);
    } catch (err: any) {
        if (err.code === 'FORBIDDEN' || err.code === 'UNAUTHORIZED') {
            setError('Solo un administrador puede crear clientes');
        } else {
            setError(err.message || 'No fue posible crear el cliente');
        }
    }
    finally {
        setLoading(false);
        }
    };

  /* =============================
     RENDER
  ============================= */
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h4 className="mb-4">Crear cliente</h4>

        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* RFC */}
          <Form.Group className="mb-3">
            <Form.Label>RFC *</Form.Label>
            <Form.Control
              name="rfc"
              value={form.rfc}
              onChange={handleChange}
              required
              minLength={12}
              maxLength={13}
              placeholder="RFC del cliente"
            />
          </Form.Group>

          {/* CLIENT NUMBER */}
          <Form.Group className="mb-3">
            <Form.Label>
              Número de cliente *
            </Form.Label>
            <Form.Control
              name="clientNumber"
              value={form.clientNumber}
              onChange={handleChange}
              required
              placeholder="Identificador interno"
            />
          </Form.Group>

          {/* COMPANY NAME */}
          <Form.Group className="mb-3">
            <Form.Label>
              Razón social
            </Form.Label>
            <Form.Control
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder="Empresa S.A. de C.V."
            />
          </Form.Group>

          {/* BUSINESS NAME */}
          <Form.Group className="mb-3">
            <Form.Label>
              Nombre comercial
            </Form.Label>
            <Form.Control
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              placeholder="Marca / Nombre público"
            />
          </Form.Group>

          {/* LOCATION */}
          <Form.Group className="mb-4">
            <Form.Label>
              Ubicación
            </Form.Label>
            <Form.Control
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Ciudad / Sucursal"
            />
          </Form.Group>

          {/* ACTIONS */}
          <div className="d-flex gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate('/clients')}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    size="sm"
                    animation="border"
                  />{' '}
                  Creando...
                </>
              ) : (
                'Crear cliente'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
