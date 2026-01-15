import { useEffect, useState } from 'react';
import { Card, Badge, Spinner, Alert, Form, Button } from 'react-bootstrap';

import { getTickets } from '@/api/tickets.api';
import { getTicketHistory } from '@/api/ticket-history.api';
import { useAuth } from '@/auth/useAuth';

import type { Ticket } from '@/types/ticket-types/ticket.types';
import type { TicketHistory } from '@/types/ticket-history-types/ticket-history-ui.types';
import type { TicketEventType, TicketStatus } from '@/types/enums';

import './History.css';

/* =============================
   LABELS Y COLORES (DOMINIO v2)
============================= */

const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: 'Abierto',
  RESOLVED: 'Resuelto',
  CLOSED: 'Cerrado',
  CANCELLED: 'Cancelado',
};

const STATUS_VARIANTS: Record<TicketStatus, string> = {
  OPEN: 'danger',
  RESOLVED: 'warning',
  CLOSED: 'success',
  CANCELLED: 'secondary',
};

const EVENT_LABELS: Record<TicketEventType, string> = {
  CREATED: 'Ticket creado',
  STATUS_CHANGED: 'Cambio de estado',
  CLOSED: 'Ticket cerrado',
  CANCELLED: 'Ticket cancelado',
  UPDATED: 'Información actualizada',
  COMMENT_ADDED: 'Comentario agregado',
  IMPORTED_FROM_LIBRENMS: 'Importado desde LibreNMS',
};

export default function History() {
  const { user } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [history, setHistory] = useState<TicketHistory[]>([]);

  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =============================
     FILTROS
  ============================== */
  const [searchCode, setSearchCode] = useState('');
  const [searchRfc, setSearchRfc] = useState('');

  /* =============================
     LOAD TICKETS
  ============================== */
  useEffect(() => {
    if (!user) return;
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getTickets({
        search: searchCode || searchRfc || undefined,
      });

      setTickets(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar tickets');
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     LOAD HISTORY
  ============================== */
  const loadHistory = async (ticket: Ticket) => {
    try {
      setHistoryLoading(true);
      setSelectedTicket(ticket);
      setError(null);

      const data = await getTicketHistory(ticket.id);
      setHistory(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar historial');
    } finally {
      setHistoryLoading(false);
    }
  };

  /* =============================
     HELPERS
  ============================== */
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getEventDescription = (item: TicketHistory) => {
    const base = EVENT_LABELS[item.eventType] || item.eventType;

    if (item.fromStatus && item.toStatus) {
      return `${base}: ${item.fromStatus} → ${item.toStatus}`;
    }

    return base;
  };

  if (!user) return null;

  /* =============================
     RENDER
  ============================== */
  return (
    <div className="history-page">
      <h2 className="mb-4">Historial de Tickets</h2>

      <div className="row g-4">
        {/* ======================
            LISTA DE TICKETS
        ====================== */}
        <div className="col-md-4">
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Seleccionar Ticket</h5>
            </Card.Header>

            <Card.Body className="p-3">
              {/* Filtros */}
              <div className="mb-3">
                <Form.Control
                  placeholder="Buscar por código..."
                  value={searchCode}
                  onChange={e => setSearchCode(e.target.value)}
                  className="mb-2"
                />

                <Form.Control
                  placeholder="Buscar por RFC..."
                  value={searchRfc}
                  onChange={e => setSearchRfc(e.target.value)}
                  className="mb-2"
                />

                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={loadTickets}
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? <Spinner size="sm" /> : 'Buscar'}
                </Button>
              </div>

              {/* Lista */}
              <div className="ticket-list">
                {loading && (
                  <div className="text-center py-3">
                    <Spinner size="sm" />
                  </div>
                )}

                {!loading && tickets.length === 0 && (
                  <p className="text-muted text-center py-3">
                    No se encontraron tickets
                  </p>
                )}

                {!loading &&
                  tickets.map(ticket => (
                    <div
                      key={ticket.id}
                      className={`ticket-item ${
                        selectedTicket?.id === ticket.id ? 'active' : ''
                      }`}
                      onClick={() => loadHistory(ticket)}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{ticket.code}</strong>
                          <div className="text-muted small">
                            {ticket.client?.rfc || '-'}
                          </div>
                        </div>

                        <Badge
                          bg={STATUS_VARIANTS[ticket.status] || 'secondary'}
                        >
                          {STATUS_LABELS[ticket.status] || ticket.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* ======================
            HISTORIAL
        ====================== */}
        <div className="col-md-8">
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">
                {selectedTicket
                  ? `Historial — ${selectedTicket.code}`
                  : 'Historial'}
              </h5>
            </Card.Header>

            <Card.Body>
              {!selectedTicket && (
                <div className="text-center py-5 text-muted">
                  <p>Selecciona un ticket para ver su historial</p>
                </div>
              )}

              {selectedTicket && historyLoading && (
                <div className="text-center py-3">
                  <Spinner />
                  <p className="mt-2">Cargando historial...</p>
                </div>
              )}

              {selectedTicket && !historyLoading && history.length === 0 && (
                <div className="text-center py-5 text-muted">
                  <p>No hay historial disponible para este ticket</p>
                </div>
              )}

              {selectedTicket && !historyLoading && history.length > 0 && (
                <div className="history-timeline">
                  {history.map(item => (
                    <div key={item.id} className="history-item">
                      <div className="history-dot" />

                      <div className="history-content">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <strong>{getEventDescription(item)}</strong>
                          <small className="text-muted">
                            {formatDate(item.createdAt)}
                          </small>
                        </div>

                        {item.performedBy && (
                          <div className="text-muted small">
                            Por: {item.performedBy.name}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
