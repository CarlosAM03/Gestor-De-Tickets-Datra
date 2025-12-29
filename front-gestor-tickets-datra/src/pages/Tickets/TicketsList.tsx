import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Card,
  Badge,
  Form,
  Spinner,
  Alert,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import {
  approveDeleteTicket,
  rejectTicketDeletion,
  getTickets,
} from '@/api/tickets.api';

import { useAuth } from '@/auth/useAuth';

import type {
  Ticket,
  TicketStatus,
  ImpactLevel,
} from '@/types/ticket.types';

import './TicketList.css';

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

const IMPACT_VARIANTS: Record<ImpactLevel, string> = {
  LOW: 'secondary',
  MEDIUM: 'info',
  HIGH: 'warning',
  CRITICAL: 'danger',
  INFO: 'primary',
};

/* =============================
   Componente
============================= */
export default function TicketList() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  /* =============================
     Filtros
  ============================== */
  const [searchCode, setSearchCode] = useState('');
  const [searchRfc, setSearchRfc] = useState('');
  const [status, setStatus] = useState<TicketStatus | ''>('');
  const [impact, setImpact] = useState<ImpactLevel | ''>('');

  /* =============================
     Cargar tickets
  ============================== */
  const loadTickets = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const data = await getTickets({
        scope: user.role === 'ADMIN' ? 'all' : 'mine',
        code: searchCode || undefined,
        rfc: searchRfc || undefined,
        status: status || undefined,
        impact: impact || undefined,
      });

      setTickets(
        user.role === 'ADMIN'
          ? data
          : data.filter(
              (t) =>
                !t.deleteRequested ||
                t.createdBy.id === user.id,
            ),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCode, searchRfc, status, impact]);

  /* =============================
     Acciones ADMIN
  ============================== */
  const handleApprove = async (id: number) => {
    await approveDeleteTicket(id);
    setSuccessMsg('Solicitud de eliminación aprobada');
    loadTickets();
  };

  const handleReject = async (id: number) => {
    await rejectTicketDeletion(id);
    setSuccessMsg('Solicitud de eliminación cancelada');
    loadTickets();
  };

  if (!user) return null;

  return (
    <Card className="ticket-list p-3 shadow-sm">
      {/* Header */}
      <div className="ticket-list-header">
        <h4 className="mb-0">
          {user.role === 'ADMIN'
            ? 'Tickets del Sistema'
            : 'Mis tickets'}
        </h4>

        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            onClick={loadTickets}
          >
            ⟳ Refrescar
          </Button>

          <Button onClick={() => navigate('/tickets/create')}>
            + Nuevo ticket
          </Button>
        </div>
      </div>

      {successMsg && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSuccessMsg(null)}
        >
          {successMsg}
        </Alert>
      )}

      {/* Filtros */}
      <div className="row mb-3">
        <div className="col-md-3 mb-2">
          <Form.Control
            placeholder="Código"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
          />
        </div>

        <div className="col-md-3 mb-2">
          <Form.Control
            placeholder="RFC Cliente"
            value={searchRfc}
            onChange={(e) =>
              setSearchRfc(e.target.value.toUpperCase())
            }
          />
        </div>

        <div className="col-md-3 mb-2">
          <Form.Select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as TicketStatus | '')
            }
          >
            <option value="">Estado</option>
            {Object.entries(STATUS_LABELS).map(
              ([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ),
            )}
          </Form.Select>
        </div>

        <div className="col-md-3 mb-2">
          <Form.Select
            value={impact}
            onChange={(e) =>
              setImpact(e.target.value as ImpactLevel | '')
            }
          >
            <option value="">Impacto</option>
            {Object.keys(IMPACT_VARIANTS).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center text-muted py-4">
          No hay tickets
        </div>
      ) : (
        <Table hover responsive className="ticket-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Impacto</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                data-impact={ticket.impactLevel || undefined}
                className={
                  ticket.deleteRequested
                    ? 'row-delete-requested'
                    : ''
                }
              >
                <td>
                  <strong>{ticket.code}</strong>
                </td>

                <td>{ticket.client?.rfc || '-'}</td>

                <td className="text-truncate">
                  {ticket.problemDesc || 'Sin descripción'}
                </td>

                <td>
                  <Badge
                    bg={STATUS_VARIANTS[ticket.status]}
                  >
                    {STATUS_LABELS[ticket.status]}
                  </Badge>
                </td>

                <td>
                  {ticket.impactLevel ? (
                    <Badge
                      bg={
                        IMPACT_VARIANTS[
                          ticket.impactLevel
                        ]
                      }
                    >
                      {ticket.impactLevel}
                    </Badge>
                  ) : (
                    '-'
                  )}
                </td>

                <td className="text-end">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                    onClick={() =>
                      navigate(`/tickets/${ticket.id}`)
                    }
                  >
                    Ver
                  </Button>

                  {user.role === 'ADMIN' &&
                    ticket.deleteRequested && (
                      <>
                        <Button
                          size="sm"
                          variant="outline-success"
                          className="me-1"
                          onClick={() =>
                            handleApprove(ticket.id)
                          }
                        >
                          Aprobar
                        </Button>

                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() =>
                            handleReject(ticket.id)
                          }
                        >
                          Cancelar
                        </Button>
                      </>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
}

