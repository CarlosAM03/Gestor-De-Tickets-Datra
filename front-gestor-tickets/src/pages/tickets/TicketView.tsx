// src/pages/tickets/TicketView.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import * as mockApi from '../../api/mockApi';
import type { Ticket } from '../../types';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../contexts/AuthContext';
import { STATUS_LABELS, STATUS_COLORS, type TicketStatus } from '../../constants/ticketStatus';

export default function TicketView() {
  const { id } = useParams();
  const nav = useNavigate();
  const { can } = usePermissions();
  const { user } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await mockApi.getTicketById(Number(id));
        setTicket(res);
      } catch {
        setTicket(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div>Cargando ticket...</div>;
  if (!ticket) return <div>Ticket no encontrado</div>;

  const canEdit = can('editTicket');
  const canDelete = can('approveDelete');
  const canRequestDelete = can('requestDelete');
  const isClosed = ticket.serviceStatus === 'CERRADO' || ticket.serviceStatus === 'CANCELADO';

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este ticket?')) return;
    
    try {
      // Aquí irá la lógica de eliminación
      alert('Ticket eliminado');
      nav('/tickets');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestDelete = () => {
    alert('Solicitud de eliminación enviada al administrador');
  };

  return (
    <Card className="p-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h3 className="mb-2">{ticket.code}</h3>
          <Badge 
            bg={STATUS_COLORS[ticket.serviceStatus as TicketStatus] || 'secondary'}
            className="me-2"
            style={{ fontSize: '0.9rem', padding: '0.5rem 0.8rem' }}
          >
            {STATUS_LABELS[ticket.serviceStatus as TicketStatus] || ticket.serviceStatus}
          </Badge>
          {user?.role && (
            <Badge bg="info">
              {user.role}
            </Badge>
          )}
        </div>

        <div className="d-flex gap-2">
                           <Button variant="outline-secondary" onClick={() => nav('/tickets')}>
                               Volver
                              </Button>

          {/* Botón de editar - siempre visible para debug */}
          <Button
            variant="warning"
            onClick={() => nav(`/tickets/${ticket.id}/edit`)}
          >
            Editar {canEdit ? '✓' : '✗'} {isClosed ? '(Cerrado)' : ''}
          </Button>

          {canDelete && (
            <Button variant="danger" onClick={handleDelete}>
              Eliminar
            </Button>
          )}

          {canRequestDelete && !canDelete && (
            <Button variant="outline-danger" onClick={handleRequestDelete}>
              Solicitar eliminación
            </Button>
          )}
        </div>
      </div>

      <hr />

      <Row>
        <Col md={6}>
          <h5 className="mb-3">Información del Cliente</h5>
          <p><strong>Cliente:</strong> {ticket.requestedBy}</p>
          <p><strong>Contacto:</strong> {ticket.contact}</p>
          <p><strong>Ubicación:</strong> {ticket.eventLocation}</p>
          <p><strong>Tipo:</strong> {ticket.clientType}</p>
        </Col>

        <Col md={6}>
          <h5 className="mb-3">Detalles del Servicio</h5>
          <p><strong>Servicio afectado:</strong> {ticket.serviceAffected}</p>
          <p><strong>Nivel de impacto:</strong> {ticket.impactLevel}</p>
          <p><strong>Estado del servicio:</strong> {STATUS_LABELS[ticket.serviceStatus as TicketStatus] || ticket.serviceStatus}</p>
        </Col>
      </Row>

      <hr />

      <h5 className="mb-3">Descripción del Problema</h5>
      <p className="text-muted">{ticket.problemDesc || 'Sin descripción'}</p>

      <hr />

      <Row>
        <Col md={6}>
          <h5 className="mb-3">Diagnóstico Inicial</h5>
          <p className="text-muted">{ticket.initialFindings || 'Sin diagnóstico'}</p>
        </Col>

        <Col md={6}>
          <h5 className="mb-3">Acciones Tomadas</h5>
          <p className="text-muted">{ticket.actionsTaken || 'Sin acciones registradas'}</p>
        </Col>
      </Row>

      <hr />

      <small className="text-muted">
        Creado: {new Date(ticket.createdAt || ticket.openedAt).toLocaleString('es-MX')}
      </small>
    </Card>
  );
}