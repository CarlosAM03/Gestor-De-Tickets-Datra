import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
} from 'react-bootstrap';

import { getTicketById } from '@/api/tickets.api';
import { useAuth } from '@/auth/useAuth';

import type { Ticket } from '@/types/ticket-types/ticket.types';
import type { TicketStatus } from '@/types/enums';

import siteLogo from '@/assets/datra-logo.png';
import './TicketView.css';

/* =============================
   Labels y colores
============================= */
const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: 'Abierto',
  RESOLVED: 'Resuelto',
  CLOSED: 'Cerrado',
  CANCELLED: 'Cancelado',
};

const STATUS_VARIANTS: Record<TicketStatus, string> = {
  OPEN: 'secondary',
  RESOLVED: 'success',
  CLOSED: 'dark',
  CANCELLED: 'danger',
};

export default function TicketView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, status } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* =============================
     Load ticket
  ============================== */
  useEffect(() => {
    if (status !== 'authenticated' || !id) return;

    setLoading(true);
    setError(null);

    getTicketById(Number(id))
      .then(setTicket)
      .catch(() =>
        setError('No se pudo cargar el ticket'),
      )
      .finally(() => setLoading(false));
  }, [id, status]);

  /* =============================
     Render neutro mientras auth valida
  ============================== */
  if (status !== 'authenticated') {
    return <div className="ticket-view" />;
  }

  if (loading) {
    return (
      <Card className="ticket-view loading text-center p-4">
        <Spinner animation="border" />
        <p className="mt-2">Cargando ticket…</p>
      </Card>
    );
  }

  if (!ticket || !user) {
    return (
      <Card className="ticket-view error p-4">
        <Alert variant="danger">
          {error ?? 'Ticket no encontrado'}
        </Alert>

        <div className="mt-3">
          <Button
            variant="outline-secondary"
            onClick={() => navigate('/tickets')}
          >
            Volver
          </Button>
        </div>
      </Card>
    );
  }

  /* =============================
     Dominio
  ============================== */
  const isTerminal =
    ticket.status === 'CLOSED' ||
    ticket.status === 'CANCELLED';

  const canEdit =
    user.role === 'ADMIN' && !isTerminal;

  /* =============================
     Render
  ============================== */
  return (
    <div className="ticket-view-wrapper">
      {/* ======================
          Acciones
      ====================== */}
      <div className="ticket-view-actions mb-3">
        <Button
          variant="outline-secondary"
          onClick={() => navigate('/tickets')}
        >
          Volver
        </Button>

        {canEdit && (
          <Button
            variant="primary"
            onClick={() =>
              navigate(`/tickets/${ticket.id}/edit`)
            }
          >
            Editar
          </Button>
        )}
      </div>

      <Card className="ticket-view shadow-sm printable-ticket">
        {/* ======================
            Header
        ====================== */}
        <div className="ticket-header">
          <div className="ticket-header-left">
            <img
              src={siteLogo}
              alt="Datra"
              className="ticket-logo"
            />
            <div>
              <strong>DATRA</strong>
              <div className="text-muted">
                Internet & Data Transporting
              </div>
            </div>
          </div>

          <div className="ticket-header-right text-end">
            <h3>{ticket.code}</h3>
            <Badge bg={STATUS_VARIANTS[ticket.status]}>
              {STATUS_LABELS[ticket.status]}
            </Badge>
          </div>
        </div>

        {/* ======================
            Contenido
        ====================== */}
        <div className="ticket-sections-grid">
          <section className="ticket-section">
            <h5>Información general</h5>
            <p>
              <strong>Solicitante:</strong>{' '}
              {ticket.requestedBy ?? '-'}
            </p>
            <p>
              <strong>Contacto:</strong>{' '}
              {ticket.contactInfo ?? '-'}
            </p>
            <p>
              <strong>Impacto:</strong>{' '}
              {ticket.impactLevel}
            </p>
          </section>

          <section className="ticket-section">
            <h5>Cliente</h5>
            <p>
              <strong>RFC:</strong>{' '}
              {ticket.client?.rfc ?? '-'}
            </p>
            <p>
              <strong>Razón social:</strong>{' '}
              {ticket.client?.businessName ?? '-'}
            </p>
          </section>

          <section className="ticket-section">
            <h5>Incidente</h5>
            <p>
              <strong>Ubicación:</strong>{' '}
              {ticket.eventLocation ?? '-'}
            </p>
            <p className="text-muted">
              {ticket.problemDescription}
            </p>
          </section>

          <section className="ticket-section">
            <h5>Diagnóstico</h5>
            <p className="text-muted">
              {ticket.initialFindings ?? '-'}
            </p>
            <p className="text-muted">
              {ticket.probableRootCause ?? '-'}
            </p>
          </section>

          <section className="ticket-section">
            <h5>Cierre</h5>
            <p className="text-muted">
              {ticket.actionsTaken ?? '-'}
            </p>
            <p className="text-muted">
              {ticket.additionalNotes ?? '-'}
            </p>
            <p>
              <strong>Acción correctiva:</strong>{' '}
              {ticket.correctiveAction ? 'Sí' : 'No'}
            </p>
          </section>

          <section className="ticket-section">
            <h5>Auditoría</h5>
            <p>
              <strong>Creado:</strong>{' '}
              {new Date(ticket.createdAt).toLocaleString('es-MX')}
            </p>
            {ticket.closedAt && (
              <p>
                <strong>Cerrado:</strong>{' '}
                {new Date(ticket.closedAt).toLocaleString('es-MX')}
              </p>
            )}
          </section>
        </div>
      </Card>
    </div>
  );
}
