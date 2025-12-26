import { useEffect, useState } from 'react';
import { Row, Col, Card, Badge, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/auth/useAuth';
import { getTickets } from '@/api/tickets.api';

import type {
  Ticket,
  TicketStatus,
  ImpactLevel,
} from '@/types/ticket.types';

import './Dashboard.css';

/* =============================
   LABELS Y COLORES (CONSISTENTES)
============================= */

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

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  /* =============================
     FILTROS
  ============================== */
  const [rfc, setRfc] = useState('');
  const [status, setStatus] = useState<TicketStatus | ''>('');
  const [impactLevel, setImpactLevel] = useState<ImpactLevel | ''>('');

  useEffect(() => {
    if (!user) return;

    const loadTickets = async () => {
      try {
        setLoading(true);

        const data = await getTickets({
        //  scope: user.role === 'TECNICO' ? 'mine' : 'all',
          search: rfc || undefined,
          status: status || undefined,
          impact: impactLevel || undefined,
        });

        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        );

        setTickets(sorted.slice(0, 10));
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [user, rfc, status, impactLevel]);

  if (!user) return null;

  const canViewHistory =
    user.role === 'ADMIN' || user.role === 'INGENIERO';

  return (
    <div className="dashboard">
      <h2 className="mb-4">Dashboard</h2>

      <Row className="g-3">
        {/* ======================
            USUARIO + FILTROS
        ====================== */}
        <Col md={4}>
          <Card className="p-3 shadow-sm h-100">
            <h5>Bienvenido</h5>
            <p className="mb-1">{user.name}</p>
            <small className="text-muted">{user.email}</small>

            <hr />

            <small className="text-muted">
              Rol: <strong>{user.role}</strong>
            </small>

            <hr />

            {/* RFC */}
            <Form.Group className="mb-2">
              <Form.Label>RFC Cliente</Form.Label>
              <Form.Control
                value={rfc}
                onChange={(e) =>
                  setRfc(e.target.value.toUpperCase())
                }
                placeholder="Buscar por RFC"
              />
            </Form.Group>

            {/* Estado */}
            <Form.Group className="mb-2">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as TicketStatus | '')
                }
              >
                <option value="">Todos</option>
                <option value="OPEN">Abierto</option>
                <option value="IN_PROGRESS">En progreso</option>
                <option value="ON_HOLD">En espera</option>
                <option value="RESOLVED">Resuelto</option>
                <option value="CLOSED">Cerrado</option>
                <option value="CANCELLED">Cancelado</option>
              </Form.Select>
            </Form.Group>

            {/* Impacto */}
            <Form.Group className="mb-3">
              <Form.Label>Impacto</Form.Label>
              <Form.Select
                value={impactLevel}
                onChange={(e) =>
                  setImpactLevel(
                    e.target.value as ImpactLevel | '',
                  )
                }
              >
                <option value="">Todos</option>
                <option value="LOW">Bajo</option>
                <option value="MEDIUM">Medio</option>
                <option value="HIGH">Alto</option>
                <option value="CRITICAL">Crítico</option>
                <option value="INFO">Informativo</option>
              </Form.Select>
            </Form.Group>

            {canViewHistory && (
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => navigate('/history')}
              >
                Ver historial
              </button>
            )}
          </Card>
        </Col>

        {/* ======================
            ACTIVIDAD RECIENTE
        ====================== */}
        <Col md={8}>
          <Card className="p-3 shadow-sm h-100">
            <h5>Actividad reciente</h5>

            {loading && (
              <p className="text-muted">
                Cargando actividad…
              </p>
            )}

            {!loading && tickets.length === 0 && (
              <p className="text-muted">
                No hay actividad reciente
              </p>
            )}

            {!loading && tickets.length > 0 && (
              <div className="dashboard-table">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="dashboard-row"
                    data-impact={ticket.impactLevel || undefined}
                    onClick={() =>
                      navigate(`/tickets/${ticket.id}`)
                    }
                  >
                    <div>
                      <strong>{ticket.code}</strong>
                      <div className="text-muted small">
                        {ticket.client?.rfc || '-'} ·{' '}
                        {ticket.createdBy.name}
                      </div>
                    </div>

                    <div className="text-end d-flex gap-2">

                      {ticket.impactLevel && (
                        <Badge
                          bg={
                            IMPACT_VARIANTS[ticket.impactLevel]
                          }
                        >
                          {ticket.impactLevel}
                        </Badge>
                      )}

                      <Badge bg={STATUS_VARIANTS[ticket.status]}>
                        {ticket.status}
                      </Badge>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
