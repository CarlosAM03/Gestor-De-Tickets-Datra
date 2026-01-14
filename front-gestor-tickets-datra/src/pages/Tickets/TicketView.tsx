import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';

import { getTicketById } from '@/api/tickets.api';
import { useAuth } from '@/auth/useAuth';

import type { Ticket, TicketStatus } from '@/types/ticket-types/ticket.types';

import './TicketView.css';
import siteLogo from '@/assets/datra-logo.png';

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
  const { user } = useAuth();

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
     Estados base
  ============================= */
  if (loading) {
    return (
      <Card className="ticket-view loading">
        <Spinner animation="border" />
        <p>Cargando ticket...</p>
      </Card>
    );
  }

  if (!ticket || !user) {
    return (
      <Card className="ticket-view error">
        Ticket no encontrado
      </Card>
    );
  }

  /* =============================
     Permisos
  ============================= */
  const isOwner = ticket.createdBy.id === user.id;

  const canEdit =
    user.role === 'ADMIN' ||
    user.role === 'INGENIERO' ||
    (user.role === 'TECNICO' && isOwner);

  /* =============================
     Acciones
  ============================= */
  const handleExportPdf = () => {
    window.print();
  };

  /* =============================
     Render
  ============================= */
  return (
    <div className="ticket-view-wrapper">
      {/* =============================
          ACCIONES SUPERIORES
      ============================= */}
      <div className="ticket-view-actions">
        <div className="left-actions">
          <Button
            variant="outline-secondary"
            onClick={() => navigate('/tickets')}
          >
            Volver
          </Button>

          <Button
            variant="outline-dark"
            onClick={handleExportPdf}
          >
            Exportar PDF
          </Button>
        </div>

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

      {/* =============================
          ALERTA ELIMINACIÓN
      ============================= */}
      {ticket.deleteRequested && (
        <Alert variant="warning" className="mb-3">
          ⚠️ Este ticket tiene una <strong>solicitud de eliminación pendiente</strong>.
        </Alert>
      )}

      {/* =============================
          CARD PRINCIPAL
      ============================= */}
      <Card className="ticket-view shadow-sm printable-ticket">
        {/* =============================
            HEADER
        ============================= */}
        <div className="ticket-header">
          <div className="ticket-header-left">
            <img
              src={siteLogo}
              alt="Datra"
              className="ticket-logo"
            />
            <div className="ticket-brand-text">
              <strong>DATRA</strong>
              <span>Internet & Data Transporting</span>
            </div>
          </div>

          <div className="ticket-header-right">
            <h2>{ticket.code}</h2>
            <Badge bg={STATUS_VARIANTS[ticket.status]}>
              {STATUS_LABELS[ticket.status]}
            </Badge>
          </div>
        </div>

        {/* =============================
              GRID DE SECCIONES
          ============================= */}
          <div className="ticket-sections-grid">
            {/* Fila 1 */}
            <section className="ticket-section">
              <h5>Información general</h5>
              <p><strong>Solicitante:</strong> {ticket.requestedBy || '-'}</p>
              <p><strong>Contacto:</strong> {ticket.contact || '-'}</p>
              <p><strong>Tipo de cliente:</strong> {ticket.clientType || '-'}</p>
              <p><strong>Impacto:</strong> {ticket.impactLevel || '-'}</p>
            </section>

            <section className="ticket-section">
              <h5>Cliente</h5>
              {ticket.client ? (
                <>
                  <p><strong>Razón social:</strong> {ticket.client.companyName}</p>
                  <p><strong>Nombre comercial:</strong> {ticket.client.businessName || '-'}</p>
                  <p><strong>RFC:</strong> {ticket.client.rfc}</p>
                  <p><strong>Ubicación:</strong> {ticket.client.location || '-'}</p>
                </>
              ) : (
                <p className="text-muted">Sin información de cliente</p>
              )}
            </section>

            {/* Fila 2 */}
            <section className="ticket-section">
              <h5>Incidente</h5>
              <p><strong>Servicio afectado:</strong> {ticket.serviceAffected || '-'}</p>
              <p><strong>Ubicación del evento:</strong> {ticket.eventLocation || '-'}</p>
              <p><strong>Descripción:</strong></p>
              <p className="text-muted">{ticket.problemDesc || '-'}</p>
            </section>

            <section className="ticket-section">
              <h5>Diagnóstico</h5>
              <p><strong>Hallazgos iniciales:</strong></p>
              <p className="text-muted">{ticket.initialFindings || '-'}</p>
              <p><strong>Causa raíz probable:</strong></p>
              <p className="text-muted">{ticket.probableRootCause || '-'}</p>
            </section>

            {/* Fila 3 */}
            <section className="ticket-section">
              <h5>Cierre</h5>
              <p><strong>Acciones tomadas:</strong></p>
              <p className="text-muted">{ticket.actionsTaken || '-'}</p>
              <p><strong>Notas adicionales:</strong></p>
              <p className="text-muted">{ticket.additionalNotes || '-'}</p>
              <p><strong>Acción correctiva:</strong> {ticket.correctiveAction ? 'Sí' : 'No'}</p>
            </section>

            <section className="ticket-section">
              <h5>Auditoría</h5>
              <p>
                <strong>Creado por:</strong> {ticket.createdBy.name} ({ticket.createdBy.email})
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
          </div>

      </Card>
    </div>
  );
}
