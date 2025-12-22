import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Spinner } from 'react-bootstrap';

import { getTicketById } from '@/api/tickets.api';
import type { Ticket, TicketStatus } from '@/types/ticket.types';

/* =============================
   Labels y colores de estado
============================= */
const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En progreso',
  ON_HOLD: 'En espera',
  RESOLVED: 'Resuelto',
  CLOSED: 'Cerrado',
  CANCELLED: 'Cancelado',
};

const STATUS_VARIANTS: Record<TicketStatus, string> = {
  OPEN: 'secondary',
  IN_PROGRESS: 'warning',
  ON_HOLD: 'info',
  RESOLVED: 'success',
  CLOSED: 'dark',
  CANCELLED: 'danger',
};

export default function TicketView() {
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
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h3 className="mb-2">{ticket.code}</h3>
          <Badge bg={STATUS_VARIANTS[ticket.status]}>
            {STATUS_LABELS[ticket.status]}
          </Badge>
        </div>

        <Button
          variant="outline-secondary"
          onClick={() => navigate('/tickets')}
        >
          Volver
        </Button>
      </div>

      <hr />

      {/* Información principal */}
      <p>
        <strong>Descripción del problema:</strong>
      </p>
      <p className="text-muted">
        {ticket.problemDesc || 'Sin descripción'}
      </p>

      <hr />

      <div className="row">
        <div className="col-md-6 mb-2">
          <strong>Impacto:</strong>{' '}
          {ticket.impactLevel || 'No definido'}
        </div>

        <div className="col-md-6 mb-2">
          <strong>Tipo de cliente:</strong>{' '}
          {ticket.clientType || 'No definido'}
        </div>

        <div className="col-md-6 mb-2">
          <strong>Solicitante:</strong>{' '}
          {ticket.requestedBy || 'No especificado'}
        </div>

        <div className="col-md-6 mb-2">
          <strong>Contacto:</strong>{' '}
          {ticket.contact || 'No especificado'}
        </div>
      </div>

      <hr />

      {/* Auditoría básica */}
      <p>
        <strong>Creado por:</strong>{' '}
        {ticket.createdBy.name} ({ticket.createdBy.email})
      </p>

      <small className="text-muted">
        Abierto:{' '}
        {new Date(ticket.openedAt).toLocaleString('es-MX')}
        <br />
        Última actualización:{' '}
        {new Date(ticket.updatedAt).toLocaleString('es-MX')}
      </small>
    </Card>
  );
}
