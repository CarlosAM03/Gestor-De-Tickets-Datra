import { useEffect, useState } from 'react';
import { Card, Spinner, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import {
  getTicketById,
  updateTicket,
} from '@/api/tickets.api';

import TicketForm from '@/components/Tickets/TicketForm';
import TicketEditStatus from '@/components/Tickets/TicketEditStatus';

import type { Ticket } from '@/types/ticket-types/ticket.types';
import type { UpdateTicketDTO } from '@/types/ticket-types/ticket.dto';
import { TicketStatus } from '@/types/enums';

export default function TicketEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =============================
     LOAD TICKET
  ============================== */
  useEffect(() => {
    if (!id) return;

    getTicketById(Number(id))
      .then(setTicket)
      .catch(() => navigate('/tickets'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  /* =============================
     LOADING
  ============================== */
  if (loading) {
    return (
      <Card className="p-4 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Cargando ticket...</p>
      </Card>
    );
  }

  if (!ticket) return null;

  /* =============================
     INITIAL VALUES (UpdateTicketDTO)
  ============================== */
  const initialValues: UpdateTicketDTO = {
    requestedBy: ticket.requestedBy ?? undefined,
    contactInfo: ticket.contactInfo ?? undefined,

    impactLevel: ticket.impactLevel,
    problemDescription: ticket.problemDescription,

    eventLocation: ticket.eventLocation ?? undefined,
    estimatedStart: ticket.estimatedStart ?? undefined,

    initialFindings: ticket.initialFindings ?? undefined,
    probableRootCause: ticket.probableRootCause ?? undefined,

    actionsTaken: ticket.actionsTaken ?? undefined,
    additionalNotes: ticket.additionalNotes ?? undefined,
    correctiveAction: ticket.correctiveAction ?? undefined,
  };

  const isTerminal =
    ticket.status === TicketStatus.CLOSED ||
    ticket.status === TicketStatus.CANCELLED;

  /* =============================
     RENDER
  ============================== */
  return (
    <Card className="p-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Editar Ticket {ticket.code}</h4>

        <Button
          variant="outline-secondary"
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* =============================
          STATUS ACTIONS
      ============================== */}
      {!isTerminal && (
        <TicketEditStatus
          ticketId={ticket.id}
          status={ticket.status}
          onActionCompleted={() =>
            getTicketById(ticket.id).then(setTicket)
          }
        />
      )}

      {isTerminal && (
        <Alert variant="secondary" className="mt-3">
          Este ticket se encuentra en estado{' '}
          <strong>{ticket.status}</strong> y no admite más
          cambios de estado.
        </Alert>
      )}

      {/* =============================
          FORM
      ============================== */}
      <TicketForm
        mode="edit"
        initialValues={initialValues}
        submitting={submitting || isTerminal}
        onSubmit={async (values: UpdateTicketDTO) => {
          try {
            setSubmitting(true);
            setError(null);

            await updateTicket(ticket.id, values);
            navigate(`/tickets/${ticket.id}`);
          } catch {
            setError('No se pudo actualizar el ticket');
          } finally {
            setSubmitting(false);
          }
        }}
      />
    </Card>
  );
}
