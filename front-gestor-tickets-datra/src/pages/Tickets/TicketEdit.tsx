import { useEffect, useState } from 'react';
import { Card, Spinner, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import {
  getTicketById,
  updateTicket,
  requestTicketDeletion,
  approveDeleteTicket,
} from '@/api/tickets.api';

import TicketForm from '@/components/Tickets/TicketForm';
import TicketEditStatus from '@/components/Tickets/TicketEditStatus';

import { useAuth } from '@/auth/useAuth';

import type { Ticket, TicketFormValues, TicketStatus } from '@/types/ticket-types/ticket.types';

export default function TicketEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === 'ADMIN';

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
     INITIAL FORM VALUES
  ============================== */
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
    status: ticket.status ?? 'OPEN',
  };

  /* =============================
     DELETE HANDLERS
  ============================== */
  async function handleRequestDelete() {
    if (!id) return;
    if (!confirm('¿Deseas solicitar la eliminación de este ticket?')) return;

    try {
      setDeleteLoading(true);
      await requestTicketDeletion(Number(id));
      setTicket(prev =>
        prev ? { ...prev, deleteRequested: true } : prev,
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleApproveDelete() {
    if (!id) return;
    if (
      !confirm(
        '⚠️ Esta acción eliminará el ticket definitivamente. ¿Continuar?',
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(true);
      await approveDeleteTicket(Number(id));
      navigate('/tickets');
    } finally {
      setDeleteLoading(false);
    }
  }

  /* =============================
     RENDER
  ============================== */
  return (
    <Card className="p-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Editar Ticket {ticket.code}</h4>
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* =============================
          STATUS EDITOR
      ============================== */}
      <TicketEditStatus
        ticketId={ticket.id}
        currentStatus={ticket.status}
        onStatusUpdated={(status: TicketStatus) =>
          setTicket(prev => (prev ? { ...prev, status } : prev))
        }
      />

      {/* =============================
          DELETE WARNINGS
      ============================== */}
      {ticket.deleteRequested && (
        <Alert variant="warning" className="mt-3">
          ⚠️ Este ticket tiene una solicitud de eliminación pendiente.
        </Alert>
      )}

      {/* =============================
          FORM
      ============================== */}
      <TicketForm
        mode="edit"
        initialValues={initialValues}
        submitting={submitting}
        onSubmit={async values => {
  try {
    setSubmitting(true);
    setError(null);

    // 🔥 FILTRADO CRÍTICO
    const {
      client,     // ❌ backend no acepta
      status,     // ❌ se maneja por endpoint separado
      ...updatePayload
    } = values;

    await updateTicket(ticket.id, updatePayload);

    navigate(`/tickets/${ticket.id}`);
  } catch (err) {
    console.error(err);
    setError('No se pudo actualizar el ticket');
  } finally {
    setSubmitting(false);
  }
}}

      />

      {/* =============================
          DELETE ACTIONS
      ============================== */}
      <hr />

      <div className="d-flex justify-content-end gap-2">
        {!ticket.deleteRequested && (
          <Button
            variant="outline-danger"
            disabled={deleteLoading}
            onClick={handleRequestDelete}
          >
            Solicitar eliminación
          </Button>
        )}

        {isAdmin && ticket.deleteRequested && (
          <Button
            variant="danger"
            disabled={deleteLoading}
            onClick={handleApproveDelete}
          >
            Eliminar definitivamente
          </Button>
        )}
      </div>
    </Card>
  );
}
