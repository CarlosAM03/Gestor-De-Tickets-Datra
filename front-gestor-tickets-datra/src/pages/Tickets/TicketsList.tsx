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
// ⬇️ cuando exista
// import { approveDelete, cancelDelete } from '@/api/tickets.admin.api';

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

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  /* =============================
     Filtros
  ============================== */
  const [searchCode, setSearchCode] = useState('');
  const [searchRfc, setSearchRfc] = useState('');
  const [status, setStatus] = useState<TicketStatus | ''>('');
  const [impact, setImpact] = useState<ImpactLevel | ''>('');

  /* =============================
     Simulación de rol
     (luego viene de auth)
  ============================== */
  const role: 'USER' | 'TECH' | 'ENGINEER' | 'ADMIN' = 'ADMIN';

  /* =============================
     Cargar tickets
  ============================== */
  const loadTickets = async () => {
    try {
      setLoading(true);

      const data = await getTickets({
        scope: 'mine',
        code: searchCode || undefined,
        rfc: searchRfc || undefined,
        status: status || undefined,
        impact: impact || undefined,
      });


      setTickets(data);
    } catch (error) {
      console.error(error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCode, searchRfc, status, impact]);

  /* =============================
     Render
  ============================== */
  return (
    <Card className="p-3 shadow-sm">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Mis Tickets</h4>
        <Button onClick={() => navigate('/tickets/create')}>
          + Nuevo ticket
        </Button>
      </div>

      {/* Filtros */}
      <div className="row mb-3">
        <div className="col-md-3 mb-2">
          <Form.Control
            placeholder="Código de ticket"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
          />
        </div>

        <div className="col-md-3 mb-2">
          <Form.Control
            placeholder="RFC del cliente"
            value={searchRfc}
            onChange={(e) => setSearchRfc(e.target.value.toUpperCase())}
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
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
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
          <p className="mt-2">Cargando tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-4 text-muted">
          No hay tickets registrados
        </div>
      ) : (
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Impacto</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className={ticket.deleteRequested ? 'table-warning' : ''}
              >
                <td>
                  <strong>{ticket.code}</strong>
                </td>

                <td>
                  {ticket.client
                    ? `${ticket.client.rfc}`
                    : '-'}
                </td>

                <td className="text-truncate" >
                  {ticket.problemDesc || 'Sin descripción'}
                </td>

                <td>
                  <Badge bg={STATUS_VARIANTS[ticket.status]}>
                    {STATUS_LABELS[ticket.status]}
                  </Badge>
                </td>

                <td>
                  {ticket.impactLevel ? (
                    <Badge bg={IMPACT_VARIANTS[ticket.impactLevel]}>
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

                  {/* =============================
                     ADMIN: Soft delete
                  ============================== */}
                  {role === 'ADMIN' && ticket.deleteRequested && (
                    <>
                      <Button
                        size="sm"
                        variant="outline-success"
                        className="me-1"
                        // onClick={() => approveDelete(ticket.id)}
                      >
                        Aprobar
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        // onClick={() => cancelDelete(ticket.id)}
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
