import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Spinner } from 'react-bootstrap';

import { getTicketById } from '@/api/tickets.api';
import type { Ticket, TicketStatus } from '@/types/ticket.types';

const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En progreso',
  RESOLVED: 'Resuelto',
  CLOSED: 'Cerrado',
};

const STATUS_VARIANTS: Record<TicketStatus, string> = {
  OPEN: 'secondary',
  IN_PROGRESS: 'warning',
  RESOLVED: 'success',
  CLOSED: 'dark',
};

export default function TicketsView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);

  /* =============================
     Cargar ticket
  ============================== */
  useEffect(() => {
    if (!id) return;

    const loadTicket = async () => {
      try {
        setLoading(true);
        const data = await getTicketById(Number(id));
        setTicket(data);
      } catch (error) {
        console.error(error);
        setTicket(null);
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [id]);

  /* =============================
     Estados
  ============================== */
  if (loading) {
    return (
      <Card className="p-4 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Cargando ticket...</p>
      </Card>
    );
  }

  if (!ticket) {
    return (
      <Card className="p-4 text-center text-danger">
        Ticket no encontrado
      </Card>
    );
  }

  /* =============================
     Render
  ============================== */
  return (
    <Card className="p-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h3 className="mb-2">{ticket.title}</h3>
          <Badge bg={STATUS_VARIANTS[ticket.status]}>
            {STATUS_LABELS[ticket.status]}
          </Badge>
        </div>

        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            onClick={() => navigate('/tickets')}
          >
            Volver
          </Button>

          <Button
            variant="warning"
            onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
          >
            Editar
          </Button>
        </div>
      </div>

      <hr />

      <p>
        <strong>Descripción:</strong>
      </p>
      <p className="text-muted">{ticket.description}</p>

      <hr />

      <p>
        <strong>Prioridad:</strong> {ticket.priority}
      </p>

      <p>
        <strong>Creado por:</strong>{' '}
        {ticket.createdBy.name} ({ticket.createdBy.email})
      </p>

      {ticket.assignedTo && (
        <p>
          <strong>Asignado a:</strong>{' '}
          {ticket.assignedTo.name}
        </p>
      )}

      <hr />

      <small className="text-muted">
        Creado: {new Date(ticket.createdAt).toLocaleString('es-MX')}
        <br />
        Última actualización:{' '}
        {new Date(ticket.updatedAt).toLocaleString('es-MX')}
      </small>
    </Card>
  );
}
