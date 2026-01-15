import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Card,
  Badge,
  Form,
  Spinner,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { getTickets } from '@/api/tickets.api';
import { useAuth } from '@/auth/useAuth';

import type { Ticket } from '@/types/ticket-types/ticket.types';
import type { TicketStatus, ImpactLevel } from '@/types/enums';

import './TicketList.css';

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
  const { user, status } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  /* =============================
     Filtros
  ============================== */
  const [searchCode, setSearchCode] = useState('');
  const [searchRfc, setSearchRfc] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [impact, setImpact] = useState<ImpactLevel | ''>('');

  /* =============================
     Cargar tickets
  ============================== */
  const loadTickets = async () => {
    if (status !== 'authenticated' || !user) return;

    try {
      setLoading(true);

      const data = await getTickets({
        scope: user.role === 'ADMIN' ? 'all' : 'mine',
        code: searchCode || undefined,
        rfc: searchRfc || undefined,
        status: statusFilter || undefined,
        impact: impact || undefined,
      });

      setTickets(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    // dependencias explícitas para evitar loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, user, searchCode, searchRfc, statusFilter, impact]);

  /**
   * Render neutro mientras se valida sesión
   */
  if (status !== 'authenticated' || !user) {
    return <div className="ticket-list" />;
  }

  return (
    <Card className="ticket-list p-3 shadow-sm">
      {/* ======================
          HEADER
      ====================== */}
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
            disabled={loading}
          >
            ⟳ Refrescar
          </Button>

          <Button onClick={() => navigate('/tickets/create')}>
            + Nuevo ticket
          </Button>
        </div>
      </div>

      {/* ======================
          FILTROS
      ====================== */}
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
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as TicketStatus | '',
              )
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
              setImpact(
                e.target.value as ImpactLevel | '',
              )
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

      {/* ======================
          TABLA
      ====================== */}
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
              <tr key={ticket.id}>
                <td>
                  <strong>{ticket.code}</strong>
                </td>

                <td>{ticket.client?.rfc ?? '-'}</td>

                <td className="text-truncate">
                  {ticket.problemDescription}
                </td>

                <td>
                  <Badge
                    bg={STATUS_VARIANTS[ticket.status]}
                  >
                    {STATUS_LABELS[ticket.status]}
                  </Badge>
                </td>

                <td>
                  <Badge
                    bg={
                      IMPACT_VARIANTS[
                        ticket.impactLevel
                      ]
                    }
                  >
                    {ticket.impactLevel}
                  </Badge>
                </td>

                <td className="text-end">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() =>
                      navigate(`/tickets/${ticket.id}`)
                    }
                  >
                    Ver
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
}
