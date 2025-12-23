import { useEffect, useState } from 'react';
import { Card, Spinner, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import { getTicketById, updateTicket } from '@/api/tickets.api';
import TicketForm from '@/components/Tickets/TicketForm';

import type { Ticket, TicketFormValues } from '@/types/ticket.types';

export default function TicketEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    getTicketById(Number(id))
      .then(setTicket)
      .catch(() => navigate('/tickets'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <Card className="p-4 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Cargando ticket...</p>
      </Card>
    );
  }

  if (!ticket) return null;

  const initialValues: TicketFormValues = {
    requestedBy: ticket.requestedBy ?? '',
    contact: ticket.contact ?? '',
    clientType: ticket.clientType ?? 'EXTERNO',
    impactLevel: ticket.impactLevel ?? undefined,

    client: ticket.client ?? undefined,

    serviceAffected: ticket.serviceAffected ?? '',
    problemDesc: ticket.problemDesc ?? '',
    eventLocation: ticket.eventLocation ?? '',

    initialFindings: ticket.initialFindings ?? '',
    probableRootCause: ticket.probableRootCause ?? '',

    actionsTaken: ticket.actionsTaken ?? '',
    additionalNotes: ticket.additionalNotes ?? '',
    correctiveAction: ticket.correctiveAction ?? false,
  };

  return (
    <Card className="p-4 shadow-sm">
      <div className="d-flex justify-content-between mb-3">
        <h4>Editar Ticket</h4>
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </div>

      <TicketForm
        mode="edit"
        initialValues={initialValues}
        submitting={submitting}
        onSubmit={async (values) => {
          try {
            setSubmitting(true);
            await updateTicket(Number(id), values);
            navigate(`/tickets/${id}`);
          } finally {
            setSubmitting(false);
          }
        }}
      />
    </Card>
  );
}
