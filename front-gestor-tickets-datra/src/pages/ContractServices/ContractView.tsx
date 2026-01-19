// src/pages/ContractServices/ContractView.tsx
import { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import {
  getServiceContractById,
  deactivateServiceContract,
  activateServiceContract,
} from '@/api/service-contracts.api';

import type { ServiceContract } from '@/types/service-contract-types/service-contract.types';
import { useAuth } from '@/auth/useAuth';
import { UserRole } from '@/types/enums';

export default function ContractView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === UserRole.ADMIN;

  const [contract, setContract] =
    useState<ServiceContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

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
     ACTIONS
  ============================= */
  const handleDeactivate = async () => {
    if (!contract) return;

    const confirm = window.confirm(
      '¿Deseas desactivar este contrato?',
    );
    if (!confirm) return;

    setProcessing(true);

    try {
      const updated = await deactivateServiceContract(contract.id);
      setContract(updated);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'No se pudo desactivar el contrato',
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleActivate = async () => {
    if (!contract) return;

    const confirm = window.confirm(
      '¿Deseas reactivar este contrato?',
    );
    if (!confirm) return;

    setProcessing(true);

    try {
      const updated = await activateServiceContract(contract.id);
      setContract(updated);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'No se pudo activar el contrato',
      );
    } finally {
      setProcessing(false);
    }
  };

  /* =============================
     RENDER STATES
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
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h4 className="mb-1">
              Contrato #{contract.id}
            </h4>
            <div className="text-muted">
              {contract.name.replace(/_/g, ' ')}
            </div>
          </div>

          <Badge
            bg={contract.active ? 'success' : 'secondary'}
          >
            {contract.active ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>

        <hr />

        {/* DETAILS */}
        <dl className="row mb-4">
          <dt className="col-sm-4">RFC del cliente</dt>
          <dd className="col-sm-8">{contract.clientRfc}</dd>

          <dt className="col-sm-4">Prioridad</dt>
          <dd className="col-sm-8">{contract.priorityLevel}</dd>

          <dt className="col-sm-4">SLA (horas)</dt>
          <dd className="col-sm-8">{contract.slaHours}</dd>

          <dt className="col-sm-4">Creado</dt>
          <dd className="col-sm-8">
            {new Date(contract.createdAt).toLocaleString()}
          </dd>

          <dt className="col-sm-4">Última actualización</dt>
          <dd className="col-sm-8">
            {new Date(contract.updatedAt).toLocaleString()}
          </dd>
        </dl>

        {/* ACTIONS */}
        <div className="d-flex gap-2 flex-wrap">
          <Button
            variant="secondary"
            onClick={() =>
              navigate(`/clients/${contract.clientRfc}`)
            }
          >
            Volver al cliente
          </Button>

          {isAdmin && (
            <Button
              variant="outline-primary"
              onClick={() =>
                navigate(`/contracts/${contract.id}/edit`)
              }
            >
              Editar
            </Button>
          )}

          {isAdmin && contract.active && (
            <Button
              variant="danger"
              onClick={handleDeactivate}
              disabled={processing}
            >
              {processing
                ? 'Procesando...'
                : 'Desactivar contrato'}
            </Button>
          )}

          {isAdmin && !contract.active && (
            <Button
              variant="success"
              onClick={handleActivate}
              disabled={processing}
            >
              {processing
                ? 'Procesando...'
                : 'Reactivar contrato'}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
