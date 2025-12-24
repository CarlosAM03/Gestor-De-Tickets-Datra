import { useState } from 'react';
import { Card, Button, Spinner, Alert, Form } from 'react-bootstrap';

import { updateTicketStatus } from '@/api/tickets.api';
import type { TicketStatus } from '@/types/ticket.types';

/* =============================
   Props
============================= */
interface TicketEditStatusProps {
  ticketId: number;
  currentStatus: TicketStatus;
  onStatusUpdated?: (status: TicketStatus) => void;
}

/* =============================
   Constantes
============================= */
const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: 'OPEN', label: 'Abierto' },
  { value: 'IN_PROGRESS', label: 'En progreso' },
  { value: 'ON_HOLD', label: 'En espera' },
  { value: 'RESOLVED', label: 'Resuelto' },
  { value: 'CLOSED', label: 'Cerrado' },
  { value: 'CANCELLED', label: 'Cancelado' },
];

/* =============================
   Componente
============================= */
export default function TicketEditStatus({
  ticketId,
  currentStatus,
  onStatusUpdated,
}: TicketEditStatusProps) {
  const [status, setStatus] = useState<TicketStatus>(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const hasChanges = status !== currentStatus;

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await updateTicketStatus(ticketId, status);

      setSuccess(true);
      onStatusUpdated?.(status);
    } catch {
      setError('No fue posible actualizar el estatus del ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <h6 className="mb-3">Estatus del ticket</h6>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success">
            Estatus actualizado correctamente
          </Alert>
        )}

        {/* ✅ controlId soluciona el error axe */}
        <Form.Group className="mb-3">
          <Form.Label htmlFor="ticket-status-select">
            Nuevo estatus
          </Form.Label>

          <Form.Select
            id="ticket-status-select"
            title="Seleccionar estatus del ticket"
            value={status}
            onChange={e => setStatus(e.target.value as TicketStatus)}
            disabled={loading}
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>


        <div className="d-flex justify-content-end">
          <Button
            variant="primary"
            onClick={handleUpdateStatus}
            disabled={!hasChanges || loading}
          >
            {loading ? <Spinner size="sm" /> : 'Actualizar estatus'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
