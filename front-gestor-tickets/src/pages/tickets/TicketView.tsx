import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import * as mockApi from '../../api/mockApi';
import type { Ticket } from '../../types';

export default function TicketView() {
  const { id } = useParams();
  const nav = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await mockApi.getTicketById(Number(id));
        setTicket(res);
      } catch {
        setTicket(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div>Cargando ticket...</div>;
  if (!ticket) return <div>Ticket no encontrado</div>;

  return (
    <Card className="p-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">{ticket.code}</h4>

        <div>
          <Button
            className="btn-datra me-2"
            onClick={() => nav(-1)}
          >
            Volver
          </Button>

          <Button
            className="btn-datra"
            onClick={() => nav('/tickets/new')}
          >
            Nuevo
          </Button>
        </div>
      </div>

      <hr />

      <p><strong>Cliente:</strong> {ticket.requestedBy}</p>
      <p><strong>Contacto:</strong> {ticket.contact}</p>
      <p><strong>Ubicación:</strong> {ticket.eventLocation}</p>
      <p><strong>Servicio afectado:</strong> {ticket.serviceAffected}</p>
      <p><strong>Descripción del problema:</strong> {ticket.problemDesc}</p>

      <hr />

      <p><strong>Diagnóstico inicial:</strong> {ticket.initialFindings}</p>
      <p><strong>Acciones tomadas:</strong> {ticket.actionsTaken}</p>
      <p><strong>Estado:</strong> {ticket.serviceStatus}</p>
    </Card>
  );
}
