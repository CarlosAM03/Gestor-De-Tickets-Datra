import { useEffect, useState } from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/auth/useAuth';
import { getTickets } from '@/api/tickets.api';
import type { Ticket } from '@/types/ticket.types';

import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRecentTickets = async () => {
      try {
        setLoading(true);

        const data = await getTickets({
          scope: 'all',
        });

        // Ordenar por fecha (más recientes primero)
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        );

        // Mostrar solo los últimos 5
        setTickets(sorted.slice(0, 5));
      } catch (error) {
        console.error('Error cargando tickets recientes', error);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecentTickets();
  }, []);

  if (!user) return null;

  return (
    <div className="dashboard">
      <h2 className="mb-4">Resumen</h2>

      <Row className="g-3">
        {/* ======================
            BIENVENIDA
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
          </Card>
        </Col>

        {/* ======================
            ACTIVIDAD RECIENTE
        ====================== */}
        <Col md={8}>
          <Card className="p-3 shadow-sm h-100">
            <h5>Actividad reciente</h5>

            {loading && (
              <p className="text-muted mb-0">
                Cargando actividad reciente…
              </p>
            )}

            {!loading && tickets.length === 0 && (
              <p className="text-muted mb-0">
                Aún no hay actividad para mostrar.
              </p>
            )}

            {!loading && tickets.length > 0 && (
              <ul className="list-unstyled mb-0">
                {tickets.map((ticket) => (
                  <li
                    key={ticket.id}
                    className="d-flex justify-content-between align-items-center py-2 border-bottom dashboard-recent-item"
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    <div>
                      <strong>{ticket.title}</strong>
                      <br />
                      <small className="text-muted">
                        Creado por {ticket.createdBy.name}
                      </small>
                    </div>

                    <Badge bg="secondary">
                      {ticket.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
