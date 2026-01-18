// src/pages/ContractServices/ContractCreate.tsx
import { useState } from 'react';
import {
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import { createServiceContract } from '@/api/service-contracts.api';
import { ServiceContractName } from '@/types/enums';
import type { CreateServiceContractPayload } from '@/types/service-contract-types/service-contract.dto';

export default function ContractCreate() {
  const { rfc } = useParams<{ rfc: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateServiceContractPayload>({
    clientRfc: rfc ?? '',
    name: ServiceContractName.INTERNET_DEDICADO_100_MB,
    priorityLevel: 1,
    slaHours: 24,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =============================
     HANDLERS
  ============================= */

  // React-Bootstrap requires a generic handler here
  const handleChange: React.ChangeEventHandler<any> = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]:
        name === 'priorityLevel' || name === 'slaHours'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.clientRfc) {
      setError('RFC de cliente inválido');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await createServiceContract(form);
      navigate(`/clients/${form.clientRfc}`);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'No se pudo crear el contrato',
      );
    } finally {
      setSaving(false);
    }
  };

  /* =============================
     RENDER
  ============================= */

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h4 className="mb-4">
          Nuevo contrato de servicio
        </h4>

        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* RFC */}
          <Form.Group
            className="mb-3"
            controlId="client-rfc"
          >
            <Form.Label>
              RFC del cliente
            </Form.Label>
            <Form.Control
              value={form.clientRfc}
              disabled
              aria-label="RFC del cliente"
            />
          </Form.Group>

          {/* CONTRACT NAME */}
          <Form.Group
            className="mb-3"
            controlId="contract-name"
          >
            <Form.Label>
              Tipo de servicio
            </Form.Label>
            <Form.Select
              name="name"
              value={form.name}
              onChange={handleChange}
              aria-label="Tipo de servicio"
              required
            >
              {Object.values(ServiceContractName).map(
                contract => (
                  <option
                    key={contract}
                    value={contract}
                  >
                    {contract.replace(/_/g, ' ')}
                  </option>
                ),
              )}
            </Form.Select>
          </Form.Group>

          {/* PRIORITY */}
          <Form.Group
            className="mb-3"
            controlId="priority-level"
          >
            <Form.Label>
              Nivel de prioridad
            </Form.Label>
            <Form.Control
              type="number"
              min={1}
              name="priorityLevel"
              value={form.priorityLevel}
              onChange={handleChange}
              required
              aria-label="Nivel de prioridad"
            />
          </Form.Group>

          {/* SLA */}
          <Form.Group
            className="mb-4"
            controlId="sla-hours"
          >
            <Form.Label>
              SLA (horas)
            </Form.Label>
            <Form.Control
              type="number"
              min={1}
              name="slaHours"
              value={form.slaHours}
              onChange={handleChange}
              required
              aria-label="SLA en horas"
            />
          </Form.Group>

          {/* ACTIONS */}
          <div className="d-flex gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                navigate(`/clients/${form.clientRfc}`)
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
                  Creando...
                </>
              ) : (
                'Crear contrato'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
