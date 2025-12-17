import { useEffect, useState } from 'react';
import { Table, Button, Card, Badge, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as mockApi from '../../api/mockApi';
import type { Ticket } from '../../types';
import { STATUS_LABELS, STATUS_COLORS, type TicketStatus } from '../../constants/ticketStatus';
import { usePermissions } from '../../hooks/usePermissions';

export default function TicketsList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const nav = useNavigate();
  const { can } = usePermissions();

  const canCreate = can('createTicket');

  const load = async () => {
    setLoading(true);
    try {
      const res = await mockApi.getTickets();
      setTickets(res);
    } catch (error) {
      console.error('Error cargando tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  // Filtrar tickets
  const filtered = tickets.filter((t) => {
    const matchSearch =
      t.code?.toLowerCase().includes(search.toLowerCase()) ||
      t.requestedBy?.toLowerCase().includes(search.toLowerCase()) ||
      t.eventLocation?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? t.serviceStatus === statusFilter : true;
    return matchSearch && matchStatus;
  });

  return (
    <Card className="p-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Tickets</h4>
        <div className="d-flex gap-2">
          <Button variant="primary" className="btn-new-ticket" onClick={() => nav('/tickets/new')}>
            + Nuevo ticket
          </Button>
          <Button variant="outline-primary" className="btn-refresh" onClick={load}>
            🔄 Refrescar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="row mb-3">
        <div className="col-md-6">
          <Form.Control
            type="text"
            placeholder="Buscar por código, cliente o ubicación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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

      {loading ? (
        <div className="text-center py-4">Cargando tickets...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-4 text-muted">
          {tickets.length === 0 ? 'No hay tickets registrados' : 'No se encontraron tickets con ese criterio'}
        </div>
      ) : (
        <Table responsive striped hover>
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Ubicación</th>
              <th>Impacto</th>
              <th>Estado</th>
              <th>Creado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td><strong>{t.code}</strong></td>
                <td>{t.requestedBy}</td>
                <td>{t.eventLocation || '-'}</td>
                <td>
                  <Badge 
                    bg={
                      t.impactLevel === 'Crítico' ? 'danger' :
                      t.impactLevel === 'Alto' ? 'warning' :
                      t.impactLevel === 'Medio' ? 'info' :
                      'secondary'
                    }
                  >
                    {t.impactLevel || 'Sin definir'}
                  </Badge>
                </td>
                <td>
                  <Badge bg={STATUS_COLORS[t.serviceStatus as TicketStatus] || 'secondary'}>
                    {STATUS_LABELS[t.serviceStatus as TicketStatus] || t.serviceStatus}
                  </Badge>
                </td>
                <td>{new Date(t.createdAt || t.openedAt).toLocaleDateString('es-MX')}</td>
                <td>
                  <Button 
                    size="sm" 
                    variant="outline-primary"
                    className="btn-view" 
                    onClick={() => nav(`/tickets/${t.id}`)}
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