import { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Spinner,
  Alert,
  Form,
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import {
  getServiceContractById,
  updateServiceContract,
} from '@/api/service-contracts.api';

import type { ServiceContract } from '@/types/service-contract-types/service-contract.types';
import type { UpdateServiceContractPayload } from '@/types/service-contract-types/service-contract.dto';

export default function ContractEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [contract, setContract] =
    useState<ServiceContract | null>(null);
  const [form, setForm] =
    useState<UpdateServiceContractPayload>({
      priorityLevel: 1,
      slaHours: 24,
    });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =============================
     LOAD CONTRACT
  ============================= */
  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError('ID de contrato inválido');
        setLoading(false);
        return;
      }

      try {
        const data = await getServiceContractById(Number(id));
        setContract(data);
        setForm({
          priorityLevel: data.priorityLevel,
          slaHours: data.slaHours,
        });
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            'No se pudo cargar el contrato',
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /* =============================
     HANDLERS
  ============================= */
  const handleChange: React.ChangeEventHandler<
    HTMLInputElement
  > = e => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSave = async () => {
    if (!contract) return;

    try {
      setSaving(true);
      await updateServiceContract(contract.id, form);
      navigate(`/contracts/${contract.id}`);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'No se pudo guardar el contrato',
      );
    } finally {
      setSaving(false);
    }
  };

  /* =============================
     STATES
  ============================= */
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <Alert variant="danger">
        {error || 'Contrato no encontrado'}
      </Alert>
    );
  }

  /* =============================
     RENDER
  ============================= */
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h4 className="mb-3">
          Editar contrato #{contract.id}
        </h4>

        <div className="text-muted mb-4">
          {contract.name.replace(/_/g, ' ')} – Cliente:{' '}
          {contract.clientRfc}
        </div>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Prioridad</Form.Label>
            <Form.Control
              type="number"
              name="priorityLevel"
              min={1}
              value={form.priorityLevel}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>SLA (horas)</Form.Label>
            <Form.Control
              type="number"
              name="slaHours"
              min={1}
              value={form.slaHours}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                navigate(`/contracts/${contract.id}`)
              }
            >
              Cancelar
            </Button>

            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
