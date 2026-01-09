import { useEffect, useState } from 'react';
import { Card, Badge, Spinner, Alert, Form, Button } from 'react-bootstrap';

import { getTickets, getTicketHistory } from '@/api/tickets.api';
import { useAuth } from '@/auth/useAuth';

import type { Ticket, TicketHistory as TicketHistoryType } from '@/types/ticket.types';

import './History.css';

/* =============================
   LABELS Y COLORES
============================= */
const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Abierto',
  RESOLVED: 'Resuelto',
  CLOSED: 'Cerrado',
};

const STATUS_VARIANTS: Record<string, string> = {
  OPEN: 'danger',
  RESOLVED: 'warning',
  CLOSED: 'success',
};

const ACTION_LABELS: Record<string, string> = {
  CREATE: 'Creado',
  UPDATE: 'Actualizado',
  STATUS_CHANGE: 'Cambio de estado',
  APPROVE_DELETE: 'Eliminación aprobada',
  REJECT_DELETE: 'Eliminación rechazada',
  REQUEST_DELETE: 'Solicitud de eliminación',
};

export default function History() {
  const { user } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [history, setHistory] = useState<TicketHistoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [searchCode, setSearchCode] = useState('');
  const [searchRfc, setSearchRfc] = useState('');

  useEffect(() => {
    if (!user) return;
    loadTickets();
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
      setError('Error al cargar tickets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async (ticket: Ticket) => {
    try {
      setHistoryLoading(true);
      setSelectedTicket(ticket);

      const data = await getTicketHistory(ticket.id);
      setHistory(data);
    } catch (err) {
      setError('Error al cargar historial');
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionDescription = (item: TicketHistoryType) => {
    const action = ACTION_LABELS[item.action] || item.action;

    if (item.fromValue && item.toValue) {
      return `${action}: ${item.fromValue} → ${item.toValue}`;
    }

    if (item.toValue) {
      return `${action}: ${item.toValue}`;
    }

    return action;
  };

  if (!user) return null;

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
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="mb-2"
                />
                <Form.Control
                  placeholder="Buscar por RFC..."
                  value={searchRfc}
                  onChange={(e) => setSearchRfc(e.target.value)}
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

              {/* Lista de tickets */}
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

                {!loading && tickets.map((ticket) => (
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
                      <Badge bg={STATUS_VARIANTS[ticket.status] || 'secondary'}>
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
                  ? `Historial - ${selectedTicket.code}`
                  : 'Historial'
                }
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
                  {history.map((item) => (
                    <div key={item.id} className="history-item">
                      <div className="history-dot"></div>
                      <div className="history-content">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <strong>{getActionDescription(item)}</strong>
                          <small className="text-muted">
                            {formatDate(item.createdAt)}
                          </small>
                        </div>

                        {item.performedBy && (
                          <div className="text-muted small">
                            Por: {item.performedBy.name}
                          </div>
                        )}

                        {item.clientRfc && (
                          <div className="text-muted small">
                            Cliente: {item.clientRfc}
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