import { useEffect, useState } from 'react';
import { Table, Button, Card, Badge, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { getTickets } from '@/api/tickets.api';
import type { Ticket, TicketStatus } from '@/types/ticket.types';

/* =============================
   Labels y colores de estado
============================= */
const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En progreso',
  RESOLVED: 'Resuelto',
  CLOSED: 'Cerrado',
};

const STATUS_VARIANTS: Record<TicketStatus, string> = {
  OPEN: 'secondary',
  IN_PROGRESS: 'warning',
  RESOLVED: 'success',
  CLOSED: 'dark',
};

export default function TicketsList() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TicketStatus | ''>('');

  /* =============================
     Cargar tickets
  ============================== */
  const loadTickets = async () => {
    try {
      setLoading(true);

      const data = await getTickets({
        search: search || undefined,
        status: status || undefined,
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
  }, [search, status]);

  /* =============================
     Render
  ============================== */
  return (
    <Card className="p-3 shadow-sm">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Tickets</h4>
        <Button onClick={() => navigate('/tickets/new')}>
          + Nuevo ticket
        </Button>
      </div>

      {/* Filtros */}
      <div className="row mb-3">
        <div className="col-md-6 mb-2 mb-md-0">
          <Form.Control
            placeholder="Buscar por título o descripción"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <Form.Select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as TicketStatus | '')
            }
          >
            <option value="">Todos los estados</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>

      {/* Tabla / Estados */}
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
              <th>Título</th>
              <th>Creado por</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>
                  <strong>{ticket.title}</strong>
                </td>

                <td>{ticket.createdBy.name}</td>

                <td>
                  <Badge bg={STATUS_VARIANTS[ticket.status]}>
                    {STATUS_LABELS[ticket.status]}
                  </Badge>
                </td>

                <td>{ticket.priority}</td>

                <td className="text-end">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
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
