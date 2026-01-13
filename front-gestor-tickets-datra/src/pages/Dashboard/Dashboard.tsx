import { useEffect, useState } from 'react';
import { Row, Col, Card, Badge, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/auth/useAuth';
import { getTickets } from '@/api/tickets.api';

import type {
  Ticket,
  TicketStatus,
  ImpactLevel,
} from '@/types/ticket.types';

import './Dashboard.css';
import vacio from '@/assets/vacio.png';

/* =============================
   LABELS Y COLORES
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

type SortMode = 'recent' | 'oldest' | 'impact';

const IMPACT_PRIORITY: ImpactLevel[] = [
  'CRITICAL',
  'HIGH',
  'MEDIUM',
  'LOW',
  'INFO',
];

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
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('recent');

  /* =============================
     SELECCIÓN MÚLTIPLE
  ============================== */
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);

  /* =============================
     FILTROS UI
  ============================== */
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadTickets = async () => {
      try {
        setLoading(true);

        const data = await getTickets({
          search: rfc || undefined,
          status: status || undefined,
          impact: impactLevel || undefined,
          from: from || undefined,
          to: to || undefined,
        });

        let sorted = [...data];

        switch (sortMode) {
          case 'oldest':
            sorted.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
            );
            break;

          case 'impact':
            sorted.sort(
              (a, b) =>
                IMPACT_PRIORITY.indexOf(a.impactLevel || 'INFO') -
                IMPACT_PRIORITY.indexOf(b.impactLevel || 'INFO'),
            );
            break;

          case 'recent':
          default:
            sorted.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );
        }

        setTickets(sorted.slice(0, 10));
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [user, rfc, status, impactLevel, from, to, sortMode]);

  if (!user) return null;

  const canViewHistory =
    user.role === 'ADMIN' || user.role === 'INGENIERO' || user.role === 'TECNICO';

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedTickets([]);
  };

  const toggleTicketSelection = (ticketId: number) => {
    setSelectedTickets(prev =>
      prev.includes(ticketId)
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const exportSelectedToPdf = () => {
    const selectedTicketData = tickets.filter(ticket => selectedTickets.includes(ticket.id));
    if (selectedTicketData.length === 0) return;

    // Abrir nueva ventana con los tickets seleccionados
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tickets Exportados</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .ticket { border: 1px solid #ccc; padding: 10px; margin-bottom: 20px; page-break-inside: avoid; }
            .ticket-header { font-weight: bold; margin-bottom: 10px; }
            .ticket-info { margin-bottom: 5px; }
          </style>
        </head>
        <body>
          <h1>Tickets Exportados</h1>
          ${selectedTicketData.map(ticket => `
            <div class="ticket">
              <div class="ticket-header">${ticket.code}</div>
              <div class="ticket-info"><strong>Cliente:</strong> ${ticket.client?.rfc || '-'}</div>
              <div class="ticket-info"><strong>Creado por:</strong> ${ticket.createdBy.name}</div>
              <div class="ticket-info"><strong>Estado:</strong> ${ticket.status}</div>
              <div class="ticket-info"><strong>Impacto:</strong> ${ticket.impactLevel || 'N/A'}</div>
              <div class="ticket-info"><strong>Descripción del problema:</strong> ${ticket.problemDesc || 'N/A'}</div>
              <div class="ticket-info"><strong>Fecha de creación:</strong> ${new Date(ticket.createdAt).toLocaleString()}</div>
            </div>
          `).join('')}
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const cancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedTickets([]);
  };

  return (
    <div className="dashboard">
      <h2 className="mb-4">Dashboard</h2>

      <Row className="g-3">
        {/* ======================
            USUARIO + FILTROS
        ====================== */}
        <Col xs={12} md={4}>
          <Card className="p-3 shadow-sm h-100">
            <h5>Bienvenido</h5>
            <p className="mb-1">{user.name}</p>
            <small className="text-muted">{user.email}</small>

            <hr />

            <small className="text-muted">
              Rol: <strong>{user.role}</strong>
            </small>

            <hr />

            {/* Botón Filtros */}
            <button
              className="btn btn-outline-secondary w-100 mb-3"
              onClick={() => setShowFilters(!showFilters)}
            >
              🔍 Filtros {showFilters ? '▲' : '▼'}
            </button>

            {/* Filtros desplegables */}
            {showFilters && (
              <div className="filters-section">
                {/* RFC */}
                <Form.Group className="mb-2">
                  <Form.Label>RFC Cliente</Form.Label>
                  <Form.Control
                    value={rfc}
                    onChange={e => setRfc(e.target.value.toUpperCase())}
                    placeholder="Buscar por RFC"
                  />
                </Form.Group>

                {/* Estado */}
                <Form.Group className="mb-2">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={status}
                    onChange={e =>
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
                <Form.Group className="mb-2">
                  <Form.Label>Impacto</Form.Label>
                  <Form.Select
                    value={impactLevel}
                    onChange={e =>
                      setImpactLevel(e.target.value as ImpactLevel | '')
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

                {/* Fechas */}
                <Form.Group className="mb-2">
                  <Form.Label>Desde</Form.Label>
                  <Form.Control
                    type="date"
                    value={from}
                    onChange={e => setFrom(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Hasta</Form.Label>
                  <Form.Control
                    type="date"
                    value={to}
                    onChange={e => setTo(e.target.value)}
                  />
                </Form.Group>

                {/* Orden */}
                <Form.Group className="mb-3">
                  <Form.Label>Ordenar por</Form.Label>
                  <Form.Select
                    value={sortMode}
                    onChange={e =>
                      setSortMode(e.target.value as SortMode)
                    }
                  >
                    <option value="recent">Más recientes primero</option>
                    <option value="oldest">Más antiguos primero</option>
                    <option value="impact">Prioridad por impacto</option>
                  </Form.Select>
                </Form.Group>
              </div>
            )}

            {canViewHistory && (
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => navigate('/historial')}
              >
                Ver historial
              </button>
            )}

            {canViewHistory && (
              <button
                className="btn btn-outline-primary w-100 mt-2"
                onClick={() => navigate('/dashboard/analytics')}
              >
                📊 Ver análisis
              </button>
            )}

            <button
              className="btn btn-outline-warning w-100 mt-2"
              onClick={() => navigate('/dashboard/rankings')}
            >
              🏆 Rankings
            </button>

            <button
              className="btn btn-outline-info w-100 mt-2"
              onClick={toggleSelectionMode}
            >
              {isSelectionMode ? 'Cancelar selección' : 'Seleccionar'}
            </button>

            <button
              className="btn btn-outline-success w-100 mt-2"
              onClick={() => document.getElementById('csv-file-input')?.click()}
            >
              📄 Importar CSV
            </button>

            <input
              type="file"
              id="csv-file-input"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Aquí iría la lógica de importación
                  alert(`Archivo seleccionado: ${file.name}`);
                }
              }}
            />

            {isSelectionMode && (
              <div className="mt-3">
                <Button
                  variant="success"
                  className="w-100 mb-2"
                  onClick={exportSelectedToPdf}
                  disabled={selectedTickets.length === 0}
                >
                  Exportar como PDF ({selectedTickets.length})
                </Button>
                <Button
                  variant="secondary"
                  className="w-100"
                  onClick={cancelSelection}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </Card>
        </Col>

        {/* ======================
            ACTIVIDAD RECIENTE
        ====================== */}
        <Col xs={12} md={8}>
          <Card className="p-3 shadow-sm h-100">
            <h5>Actividad reciente</h5>

            {loading && (
              <p className="text-muted">Cargando actividad…</p>
            )}

            {!loading && tickets.length === 0 && (
              <><p className="text-muted">
                No hay actividad reciente
              </p><img
                  src={vacio}
                  alt="Datra"
                  className="ticket-vacio" /></>
            )}

            {!loading && tickets.length > 0 && (
              <div className="dashboard-table">
                {tickets.map(ticket => (
                  <div
                    key={ticket.id}
                    className={`dashboard-row ${selectedTickets.includes(ticket.id) ? 'selected' : ''}`}
                    onClick={() => isSelectionMode ? toggleTicketSelection(ticket.id) : navigate(`/tickets/${ticket.id}`)}
                    style={{ cursor: isSelectionMode ? 'pointer' : 'pointer' }}
                  >
                    {isSelectionMode && (
                      <input
                        type="checkbox"
                        checked={selectedTickets.includes(ticket.id)}
                        onChange={() => toggleTicketSelection(ticket.id)}
                        style={{ marginRight: '10px' }}
                      />
                    )}
                    <div>
                      <strong>{ticket.code}</strong>
                      <div className="text-muted small">
                        {ticket.client?.rfc || '-'} ·{' '}
                        {ticket.createdBy.name}
                      </div>
                    </div>

                    <div className="text-end d-flex gap-2">
                      {ticket.impactLevel && (
                        <Badge bg={IMPACT_VARIANTS[ticket.impactLevel]}>
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
