import { useMemo, useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import { getTickets } from '@/api/tickets.api';
import type { Ticket } from '@/types/ticket.types';

import './TicketsAnalyticsDashboard.css';

/* =============================
   COMPONENTE PRINCIPAL
============================= */
export default function TicketsAnalyticsDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar tickets reales al montar el componente
  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTickets({ scope: 'all' });
        setTickets(data);
      } catch (err) {
        setError('Error al cargar los tickets. Inténtalo de nuevo.');
        console.error('Error loading tickets:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  // 📊 CÁLCULOS DE MÉTRICAS
  const metrics = useMemo(() => {
    const totalTickets = tickets.length;
    const closedTickets = tickets.filter(t => t.status === 'CLOSED').length;
    const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED').length;
    const openTickets = tickets.filter(t => t.status === 'OPEN').length;
    const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS').length;
    const onHoldTickets = tickets.filter(t => t.status === 'ON_HOLD').length;
    const cancelledTickets = tickets.filter(t => t.status === 'CANCELLED').length;

    // Tickets creados por usuario
    const createdByUser = tickets.reduce((acc, ticket) => {
      const userName = ticket.createdBy.name;
      acc[userName] = (acc[userName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Tickets cerrados por usuario (assignedTo)
    const closedByUser = tickets
      .filter(t => t.status === 'CLOSED' && t.assignedTo)
      .reduce((acc, ticket) => {
        const userName = ticket.assignedTo!.name;
        acc[userName] = (acc[userName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Tickets reasignados (por ahora 0, se puede calcular del historial)
    const totalReassigned = 0; // TODO: Calcular del historial de tickets

    // Tickets reabiertos (por ahora 0, se puede calcular del historial)
    const reopenedTickets = 0; // TODO: Calcular del historial de tickets

    // Tiempos de resolución
    const resolutionTimes = tickets
      .filter(t => t.closedAt)
      .map(ticket => {
        const created = new Date(ticket.openedAt).getTime();
        const closed = new Date(ticket.closedAt!).getTime();
        return (closed - created) / (1000 * 60 * 60); // horas
      });

    const avgResolutionTime = resolutionTimes.length > 0
      ? resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length
      : 0;

    const maxResolutionTime = resolutionTimes.length > 0 ? Math.max(...resolutionTimes) : 0;
    const minResolutionTime = resolutionTimes.length > 0 ? Math.min(...resolutionTimes) : 0;

    // Actividad por día
    const activityByDay = tickets.reduce((acc, ticket) => {
      const date = new Date(ticket.openedAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTickets,
      closedTickets,
      resolvedTickets,
      openTickets,
      inProgressTickets,
      onHoldTickets,
      cancelledTickets,
      createdByUser,
      closedByUser,
      totalReassigned,
      reopenedTickets,
      avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
      maxResolutionTime: Math.round(maxResolutionTime * 10) / 10,
      minResolutionTime: Math.round(minResolutionTime * 10) / 10,
      activityByDay,
    };
  }, [tickets]);

  const formatHours = (hours: number) => {
    if (hours < 24) {
      return `${hours}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return `${days}d ${remainingHours}h`;
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="analytics-dashboard text-center py-5">
        <Spinner animation="border" role="status" className="mb-3">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p>Cargando datos de tickets...</p>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="analytics-dashboard">
        <Alert variant="danger">
          <Alert.Heading>Error al cargar datos</Alert.Heading>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            Verifica que el backend esté ejecutándose y que tengas permisos para ver los tickets.
          </p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <h2 className="mb-4"> Dashboard de Análisis de Tickets</h2>

      {/* ======================
          KPIs PRINCIPALES
      ====================== */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} md={3}>
          <Card className="kpi-card">
            <Card.Body className="text-center">
              <div className="kpi-number">{metrics.totalTickets}</div>
              <div className="kpi-label">Total Tickets</div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card className="kpi-card">
            <Card.Body className="text-center">
              <div className="kpi-number text-success">{metrics.closedTickets}</div>
              <div className="kpi-label">Tickets Cerrados</div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card className="kpi-card">
            <Card.Body className="text-center">
              <div className="kpi-number text-warning">{metrics.resolvedTickets}</div>
              <div className="kpi-label">Tickets Resueltos</div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card className="kpi-card">
            <Card.Body className="text-center">
              <div className="kpi-number text-primary">{metrics.openTickets}</div>
              <div className="kpi-label">Tickets Abiertos</div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card className="kpi-card">
            <Card.Body className="text-center">
              <div className="kpi-number text-info">{metrics.inProgressTickets}</div>
              <div className="kpi-label">En Progreso</div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card className="kpi-card">
            <Card.Body className="text-center">
              <div className="kpi-number text-secondary">{metrics.onHoldTickets}</div>
              <div className="kpi-label">En Espera</div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card className="kpi-card">
            <Card.Body className="text-center">
              <div className="kpi-number text-danger">{metrics.cancelledTickets}</div>
              <div className="kpi-label">Cancelados</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ======================
          MÉTRICAS DE TIEMPO
      ====================== */}
      <Row className="g-3 mb-4">
        <Col xs={12} md={4}>
          <Card className="kpi-card">
            <Card.Body className="text-center">
              <div className="kpi-number">{formatHours(metrics.avgResolutionTime)}</div>
              <div className="kpi-label">Tiempo Promedio de Resolución</div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="kpi-card">
            <Card.Body className="text-center">
              <div className="kpi-number text-danger">{formatHours(metrics.maxResolutionTime)}</div>
              <div className="kpi-label">Tiempo Máximo</div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="kpi-card">
            <Card.Body className="text-center">
              <div className="kpi-number text-success">{formatHours(metrics.minResolutionTime)}</div>
              <div className="kpi-label">Tiempo Mínimo</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ======================
          ESTADÍSTICAS ADICIONALES
      ====================== */}
      <Row className="g-3 mb-4">
        <Col xs={12} md={6}>
          <Card className="kpi-card">
            <Card.Body className="text-center">
              <div className="kpi-number">{metrics.totalReassigned}</div>
              <div className="kpi-label">Total Reasignaciones</div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card className="kpi-card">
            <Card.Body className="text-center">
              <div className="kpi-number text-warning">{metrics.reopenedTickets}</div>
              <div className="kpi-label">Tickets Reabiertos</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ======================
          GRÁFICAS POR USUARIO
      ====================== */}
      <Row className="g-3">
        <Col xs={12} md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0"> Tickets Creados por Usuario</h5>
            </Card.Header>
            <Card.Body>
              {Object.entries(metrics.createdByUser).map(([user, count]) => (
                <div key={user} className="user-stat">
                  <div className="user-name">{user}</div>
                  <div className="user-count">
                    <Badge bg="primary">{count}</Badge>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0"> Tickets Cerrados por Usuario</h5>
            </Card.Header>
            <Card.Body>
              {Object.entries(metrics.closedByUser).map(([user, count]) => (
                <div key={user} className="user-stat">
                  <div className="user-name">{user}</div>
                  <div className="user-count">
                    <Badge bg="success">{count}</Badge>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ======================
          ACTIVIDAD POR DÍA
      ====================== */}
      <Row className="g-3 mt-3">
        <Col xs={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0"> Actividad por Día</h5>
            </Card.Header>
            <Card.Body>
              <div className="activity-grid">
                {Object.entries(metrics.activityByDay)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([date, count]) => (
                    <div key={date} className="activity-item">
                      <div className="activity-date">
                        {new Date(date).toLocaleDateString('es-ES', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short'
                        })}
                      </div>
                      <div className="activity-count">
                        <Badge bg="info">{count}</Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}