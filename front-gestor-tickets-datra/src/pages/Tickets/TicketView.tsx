import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Spinner } from 'react-bootstrap';

import { getTicketById } from '@/api/tickets.api';
import type { Ticket, TicketStatus } from '@/types/ticket.types';

import './TicketView.css';

/* =============================
   Labels y colores
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

  useEffect(() => {
    if (!id) return;

    const loadTicket = async () => {
      try {
        setLoading(true);
        const data = await getTicketById(Number(id));
        setTicket(data);
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [id]);

  /* =============================
     Estados
  ============================= */
  if (loading) {
    return (
      <Card className="ticket-view loading">
        <Spinner animation="border" />
        <p>Cargando ticket...</p>
      </Card>
    );
  }

  if (!ticket) {
    return (
      <Card className="ticket-view error">
        Ticket no encontrado
      </Card>
    );
  }

  /* =============================
     Render
  ============================= */
  return (
    <div className="ticket-view-wrapper">
      {/* =============================
          HEADER DE LA VISTA (BOTONES)
      ============================= */}
      <div className="ticket-view-actions">
        <Button
          variant="outline-secondary"
          onClick={() => navigate('/tickets')}
        >
          Volver
        </Button>

        <Button
          variant="primary"
          onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
        >
          Editar
        </Button>
      </div>

      {/* =============================
          CARD DEL TICKET
      ============================= */}
      <Card className="ticket-view shadow-sm">
        {/* =============================
            HEADER DEL TICKET
        ============================= */}
        <div className="ticket-header">

          {/* Branding Datra */}
          <div className="ticket-header-right">
            <img
              src="/src/assets/datra-logo.png"
              alt="Datra"
              className="ticket-logo"
            />
            <div className="ticket-brand-text">
              <strong>DATRA</strong>
              <span>Internet & Data Transporting</span>
            </div>
          </div>

          {/* Código + estado */}
          <div className="ticket-header-left">
            <h2>{ticket.code}</h2>
            <Badge bg={STATUS_VARIANTS[ticket.status]}>
              {STATUS_LABELS[ticket.status]}
            </Badge>
          </div>

        </div>

        {/* =============================
            INFORMACIÓN GENERAL
        ============================= */}
        <section>
          <h5>Información general</h5>
          <p><strong>Solicitante:</strong> {ticket.requestedBy || '-'}</p>
          <p><strong>Contacto:</strong> {ticket.contact || '-'}</p>
          <p><strong>Tipo de cliente:</strong> {ticket.clientType || '-'}</p>
          <p><strong>Impacto:</strong> {ticket.impactLevel || '-'}</p>
        </section>

        {/* =============================
            CLIENTE
        ============================= */}
        <section>
          <h5>Cliente</h5>
          {ticket.client ? (
            <>
              <p><strong>Razón social:</strong> {ticket.client.companyName}</p>
              <p>
                <strong>Nombre comercial:</strong>{' '}
                {ticket.client.businessName || '-'}
              </p>
              <p><strong>RFC:</strong> {ticket.client.rfc}</p>
              <p><strong>Ubicación:</strong> {ticket.client.location || '-'}</p>
            </>
          ) : (
            <p className="text-muted">Sin información de cliente</p>
          )}
        </section>

        {/* =============================
            INCIDENTE
        ============================= */}
        <section>
          <h5>Incidente</h5>
          <p><strong>Servicio afectado:</strong> {ticket.serviceAffected || '-'}</p>
          <p><strong>Ubicación del evento:</strong> {ticket.eventLocation || '-'}</p>

          <p><strong>Descripción:</strong></p>
          <p className="text-muted">{ticket.problemDesc || '-'}</p>
        </section>

        {/* =============================
            DIAGNÓSTICO
        ============================= */}
        <section>
          <h5>Diagnóstico</h5>

          <p><strong>Hallazgos iniciales:</strong></p>
          <p className="text-muted">{ticket.initialFindings || '-'}</p>

          <p><strong>Causa raíz probable:</strong></p>
          <p className="text-muted">{ticket.probableRootCause || '-'}</p>
        </section>

        {/* =============================
            CIERRE
        ============================= */}
        <section>
          <h5>Cierre</h5>

          <p><strong>Acciones tomadas:</strong></p>
          <p className="text-muted">{ticket.actionsTaken || '-'}</p>

          <p><strong>Notas adicionales:</strong></p>
          <p className="text-muted">{ticket.additionalNotes || '-'}</p>

          <p>
            <strong>Acción correctiva:</strong>{' '}
            {ticket.correctiveAction ? 'Sí' : 'No'}
          </p>
        </section>

        {/* =============================
            AUDITORÍA
        ============================= */}
        <section>
          <h5>Auditoría</h5>

          <p>
            <strong>Creado por:</strong>{' '}
            {ticket.createdBy?.name} ({ticket.createdBy?.email})
          </p>

          <p>
            <strong>Fecha apertura:</strong>{' '}
            {new Date(ticket.openedAt).toLocaleString('es-MX')}
          </p>

          {ticket.closedAt && (
            <p>
              <strong>Fecha cierre:</strong>{' '}
              {new Date(ticket.closedAt).toLocaleString('es-MX')}
            </p>
          )}

          <p>
            <strong>Última actualización:</strong>{' '}
            {new Date(ticket.updatedAt).toLocaleString('es-MX')}
          </p>
        </section>
      </Card>
    </div>
  );
}
