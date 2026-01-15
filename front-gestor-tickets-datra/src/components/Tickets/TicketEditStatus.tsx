import { useState } from 'react';
import { Card, Button, Spinner, Alert, Form, Modal } from 'react-bootstrap';

import {
  resolveTicket,
  closeTicket,
  cancelTicket,
} from '@/api/tickets.api';

import type { TicketStatus } from '@/types/enums';

/* =============================
   Props
============================= */
interface TicketEditStatusProps {
  ticketId: number;
  status: TicketStatus;
  onActionCompleted?: () => void;
}

/* =============================
   Componente
============================= */
export default function TicketEditStatus({
  ticketId,
  status,
  onActionCompleted,
}: TicketEditStatusProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  /* =============================
     Handlers
  ============================= */
  const handleResolve = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await resolveTicket(ticketId);

      setSuccess('Ticket resuelto correctamente.');
      onActionCompleted?.();
    } catch {
      setError('No fue posible resolver el ticket.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await closeTicket(ticketId);

      setSuccess('Ticket cerrado correctamente.');
      onActionCompleted?.();
    } catch {
      setError('No fue posible cerrar el ticket.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!cancelReason.trim()) {
      setError('Debes indicar un motivo de cancelación.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await cancelTicket(ticketId, cancelReason.trim());

      setSuccess('Ticket cancelado correctamente.');
      setShowCancelModal(false);
      setCancelReason('');
      onActionCompleted?.();
    } catch {
      setError('No fue posible cancelar el ticket.');
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     Render Guards
  ============================= */
  const hasActions =
    status === 'OPEN' || status === 'RESOLVED';

  if (!hasActions) {
    return null;
  }

  /* =============================
     Render
  ============================= */
  return (
    <>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h6 className="mb-3">Acciones del ticket</h6>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <div className="d-flex gap-2 justify-content-end">
            {status === 'OPEN' && (
              <>
                <Button
                  variant="primary"
                  onClick={handleResolve}
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : 'Resolver'}
                </Button>

                <Button
                  variant="danger"
                  onClick={() => setShowCancelModal(true)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </>
            )}

            {status === 'RESOLVED' && (
              <Button
                variant="success"
                onClick={handleClose}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : 'Cerrar'}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* =============================
          Modal Cancelación
      ============================= */}
      <Modal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Cancelar ticket</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group>
            <Form.Label>Motivo de cancelación</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCancelModal(false)}
            disabled={loading}
          >
            Volver
          </Button>

          <Button
            variant="danger"
            onClick={handleCancelConfirm}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : 'Confirmar cancelación'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
