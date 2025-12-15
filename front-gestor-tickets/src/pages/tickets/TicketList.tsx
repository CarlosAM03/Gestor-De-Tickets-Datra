import { useEffect, useState } from 'react';
import { Table, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as mockApi from '../../api/mockApi';
import type { Ticket } from '../../types';

export default function TicketsList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const load = async () => {
    setLoading(true);
    const res = await mockApi.getTickets();
    setTickets(res);
    setLoading(false);
  };

  useEffect(() => {
    void (async () => {
      await load();
    })();
  }, []);

  return (
    <Card className="p-3">
      <div className="d-flex justify-content-between mb-3">
        <h4>Tickets</h4>
        <div>
          <Button variant="primary" className="me-2 btn-new-ticket" onClick={() => nav('/tickets/new')}>
            Nuevo ticket
          </Button>
          <Button variant="primary" className="btn-refresh" onClick={load}>
            Refrescar
          </Button>
        </div>
      </div>

      {loading ? (
        <div>Cargando...</div>
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
            {tickets.map((t) => (
              <tr key={t.id}>
                <td>{t.code}</td>
                <td>{t.requestedBy}</td>
                <td>{t.eventLocation}</td>
                <td>{t.impactLevel}</td>
                <td>{t.serviceStatus}</td>
                <td>{new Date(t.createdAt || t.openedAt).toLocaleString()}</td>
                <td>
                  <Button size="sm" className="btn-view" onClick={() => nav(`/tickets/${t.id}`)}>
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
