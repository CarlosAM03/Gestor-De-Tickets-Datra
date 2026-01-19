// src/pages/Clients/ClientView.tsx
import { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
  Table,
  Modal,
  Form,
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import {
  getClientByRfc,
  activateClient,
  deactivateClient,
} from '@/api/clients.api';

import {
  getServiceContractsByClient,
  createServiceContract,
} from '@/api/service-contracts.api';

import type { Client } from '@/types/clients-types/clients.types';
import type { ServiceContract } from '@/types/service-contract-types/service-contract.types';
import type { CreateServiceContractPayload } from '@/types/service-contract-types/service-contract.dto';

import { ServiceContractName, UserRole } from '@/types/enums';
import { useAuth } from '@/auth/useAuth';

export default function ClientView() {
  const { rfc } = useParams<{ rfc: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === UserRole.ADMIN;
  const normalizedRfc = rfc?.toUpperCase();

  const [client, setClient] = useState<Client | null>(null);
  const [contracts, setContracts] = useState<ServiceContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [savingContract, setSavingContract] = useState(false);

  const [contractForm, setContractForm] =
    useState<CreateServiceContractPayload>({
      clientRfc: normalizedRfc ?? '',
      name: ServiceContractName.INTERNET_DEDICADO_100_MB,
      priorityLevel: 1,
      slaHours: 24,
    });

  /* =============================
     LOAD DATA
  ============================= */
  const loadData = async () => {
    if (!normalizedRfc) return;

    try {
      setLoading(true);
      setError(null);

      const clientData = await getClientByRfc(normalizedRfc);
      const contractsData =
        await getServiceContractsByClient(normalizedRfc);

      setClient(clientData);
      setContracts(contractsData);
    } catch {
      setError('No fue posible cargar la información del cliente');
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [normalizedRfc]);

  /* =============================
     ACTIVATE / DEACTIVATE CLIENT
  ============================= */
  const toggleActive = async () => {
    if (!client) return;

    const confirmed = window.confirm(
      client.active
        ? `¿Desactivar al cliente ${client.rfc}?`
        : `¿Reactivar al cliente ${client.rfc}?`,
    );

    if (!confirmed) return;

    try {
      setUpdating(true);
      const updated = client.active
        ? await deactivateClient(client.rfc)
        : await activateClient(client.rfc);

      setClient(updated);
    } catch {
      setError('No fue posible actualizar el estado del cliente');
    } finally {
      setUpdating(false);
    }
  };

  /* =============================
     CONTRACT CREATE
  ============================= */
  const handleContractChange: React.ChangeEventHandler<any> = e => {
    const { name, value } = e.target;

    setContractForm(prev => ({
      ...prev,
      [name]:
        name === 'priorityLevel' || name === 'slaHours'
          ? Number(value)
          : value,
    }));
  };

  const handleCreateContract = async () => {
    if (!normalizedRfc) return;

    try {
      setSavingContract(true);
      await createServiceContract({
        ...contractForm,
        clientRfc: normalizedRfc,
      });
      setShowModal(false);
      await loadData();
    } catch {
      alert('No se pudo crear el contrato');
    } finally {
      setSavingContract(false);
    }
  };

  /* =============================
     STATES
  ============================= */
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <Alert variant="danger">
        {error || 'Cliente no encontrado'}
      </Alert>
    );
  }

  return (
    <>
      {/* ================= CLIENT INFO ================= */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <div>
              <h4>
                {client.companyName ||
                  client.businessName ||
                  'Cliente'}
              </h4>
              <div className="text-muted">RFC: {client.rfc}</div>
            </div>

            <Badge bg={client.active ? 'success' : 'secondary'}>
              {client.active ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>

          <div className="mb-2">
            <strong>Número:</strong> {client.clientNumber}
          </div>

          <div className="mb-3">
            <strong>Ubicación:</strong> {client.location || '—'}
          </div>

          <div className="d-flex gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate('/clients')}
            >
              Volver
            </Button>

            {isAdmin && (
              <>
                <Button
                  variant="outline-primary"
                  onClick={() =>
                    navigate(`/clients/${client.rfc}/edit`)
                  }
                >
                  Editar
                </Button>

                <Button
                  variant={
                    client.active
                      ? 'outline-danger'
                      : 'outline-success'
                  }
                  onClick={toggleActive}
                  disabled={updating}
                >
                  {client.active ? 'Desactivar' : 'Reactivar'}
                </Button>
              </>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* ================= CONTRACTS ================= */}
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <h5>Contratos de servicio</h5>

            {isAdmin && (
              <Button size="sm" onClick={() => setShowModal(true)}>
                Agregar servicio
              </Button>
            )}
          </div>

          {contracts.length === 0 ? (
            <Alert variant="warning">
              No hay contratos asociados
            </Alert>
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Prioridad</th>
                  <th>SLA</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map(contract => (
                  <tr
                    key={contract.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      navigate(`/contracts/${contract.id}`)
                    }
                  >
                    <td>{contract.name.replace(/_/g, ' ')}</td>
                    <td>{contract.priorityLevel}</td>
                    <td>{contract.slaHours}</td>
                    <td>
                      <Badge
                        bg={
                          contract.active
                            ? 'success'
                            : 'secondary'
                        }
                      >
                        {contract.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* ================= MODAL ================= */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Nuevo contrato</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de servicio</Form.Label>
              <Form.Select
                name="name"
                value={contractForm.name}
                onChange={handleContractChange}
              >
                {Object.values(ServiceContractName).map(s => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, ' ')}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prioridad</Form.Label>
              <Form.Control
                type="number"
                name="priorityLevel"
                min={1}
                value={contractForm.priorityLevel}
                onChange={handleContractChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>SLA (horas)</Form.Label>
              <Form.Control
                type="number"
                name="slaHours"
                min={1}
                value={contractForm.slaHours}
                onChange={handleContractChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleCreateContract}
            disabled={savingContract}
          >
            {savingContract ? 'Guardando...' : 'Crear'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
