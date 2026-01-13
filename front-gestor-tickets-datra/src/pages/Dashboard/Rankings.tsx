import { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Alert, Table, Badge } from 'react-bootstrap';
import { getTickets } from '@/api/tickets.api';
import { useAuth } from '@/auth/useAuth';
import type { Ticket } from '@/types/ticket.types';

interface UserStats {
  name: string;
  ticketsCreated: number;
  ticketsResolved: number;
  avgResolutionTime: number;
  delayedTickets: number;
}

interface TicketStats {
  total: number;
  byStatus: Record<string, number>;
  byImpact: Record<string, number>;
  byHour: Record<number, number>;
  byDay: Record<number, number>;
  byUser: Record<string, number>;
}

export default function Rankings() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats[]>([]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener todos los tickets (sin filtros para estadísticas completas)
      const data = await getTickets({ scope: 'all' });
      setTickets(data);

      // Calcular estadísticas
      const calculatedStats = calculateStats(data);
      setStats(calculatedStats);

      const calculatedUserStats = calculateUserStats(data);
      setUserStats(calculatedUserStats);

    } catch (err) {
      setError('Error al cargar datos para rankings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tickets: Ticket[]): TicketStats => {
    const stats: TicketStats = {
      total: tickets.length,
      byStatus: {},
      byImpact: {},
      byHour: {},
      byDay: {},
      byUser: {},
    };

    tickets.forEach(ticket => {
      // Por status
      stats.byStatus[ticket.status] = (stats.byStatus[ticket.status] || 0) + 1;

      // Por impacto
      const impact = ticket.impactLevel || 'UNKNOWN';
      stats.byImpact[impact] = (stats.byImpact[impact] || 0) + 1;

      // Por hora
      const hour = new Date(ticket.createdAt).getHours();
      stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;

      // Por día de la semana (0=domingo, 6=sábado)
      const day = new Date(ticket.createdAt).getDay();
      stats.byDay[day] = (stats.byDay[day] || 0) + 1;

      // Por usuario
      const userName = ticket.createdBy.name;
      stats.byUser[userName] = (stats.byUser[userName] || 0) + 1;
    });

    return stats;
  };

  const calculateUserStats = (tickets: Ticket[]): UserStats[] => {
    const userMap = new Map<string, { tickets: Ticket[], name: string }>();

    tickets.forEach(ticket => {
      const userName = ticket.createdBy.name;
      if (!userMap.has(userName)) {
        userMap.set(userName, { tickets: [], name: userName });
      }
      userMap.get(userName)!.tickets.push(ticket);
    });

    const userStats: UserStats[] = [];

    userMap.forEach(({ tickets: userTickets, name }) => {
      const ticketsCreated = userTickets.length;
      const ticketsResolved = userTickets.filter(t => t.status === 'CLOSED' || t.status === 'RESOLVED').length;

      // Calcular tiempo promedio de resolución
      const resolvedTickets = userTickets.filter(t => t.closedAt);
      const avgResolutionTime = resolvedTickets.length > 0
        ? resolvedTickets.reduce((sum, t) => {
            const created = new Date(t.createdAt).getTime();
            const closed = new Date(t.closedAt!).getTime();
            return sum + (closed - created);
          }, 0) / resolvedTickets.length / (1000 * 60 * 60 * 24) // días
        : 0;

      // Tickets con retraso (abiertos más de 7 días)
      const delayedTickets = userTickets.filter(t => {
        const created = new Date(t.createdAt);
        const now = new Date();
        const daysDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        return (t.status === 'OPEN' || t.status === 'IN_PROGRESS') && daysDiff > 7;
      }).length;

      userStats.push({
        name,
        ticketsCreated,
        ticketsResolved,
        avgResolutionTime: Math.round(avgResolutionTime * 100) / 100,
        delayedTickets,
      });
    });

    return userStats.sort((a, b) => b.ticketsCreated - a.ticketsCreated);
  };

  const getTopProblematicTickets = () => {
    return tickets
      .filter(t => t.impactLevel === 'CRITICAL' || t.impactLevel === 'HIGH')
      .sort((a, b) => {
        const priority = { CRITICAL: 3, HIGH: 2, MEDIUM: 1, LOW: 0, INFO: -1 };
        return (priority[b.impactLevel as keyof typeof priority] || 0) -
               (priority[a.impactLevel as keyof typeof priority] || 0);
      })
      .slice(0, 10);
  };

  const getHourLabels = () => {
    const labels: Record<number, string> = {};
    for (let i = 0; i < 24; i++) {
      labels[i] = `${i}:00`;
    }
    return labels;
  };

  const getDayLabels = () => {
    return {
      0: 'Domingo',
      1: 'Lunes',
      2: 'Martes',
      3: 'Miércoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sábado',
    };
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner />
        <p className="mt-3">Cargando rankings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-4">
        {error}
      </Alert>
    );
  }

  return (
    <div className="rankings-page p-4">
      <h2 className="mb-4">🏆 Rankings y Estadísticas</h2>

      <Row className="g-4">
        {/* Top usuarios más productivos */}
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">👨‍💼 Top Usuarios Más Productivos</h5>
            </Card.Header>
            <Card.Body>
              <Table striped hover size="sm">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Tickets Creados</th>
                    <th>Resueltos</th>
                    <th>Tiempo Promedio (días)</th>
                  </tr>
                </thead>
                <tbody>
                  {userStats.slice(0, 10).map((user, index) => (
                    <tr key={user.name}>
                      <td>
                        {index === 0 && '🥇 '}
                        {index === 1 && '🥈 '}
                        {index === 2 && '🥉 '}
                        {user.name}
                      </td>
                      <td><Badge bg="primary">{user.ticketsCreated}</Badge></td>
                      <td><Badge bg="success">{user.ticketsResolved}</Badge></td>
                      <td>{user.avgResolutionTime}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Top usuarios con más retrasos */}
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">⏰ Top Usuarios con Más Retrasos</h5>
            </Card.Header>
            <Card.Body>
              <Table striped hover size="sm">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Tickets con Retraso</th>
                  </tr>
                </thead>
                <tbody>
                  {userStats
                    .filter(u => u.delayedTickets > 0)
                    .sort((a, b) => b.delayedTickets - a.delayedTickets)
                    .slice(0, 10)
                    .map((user, index) => (
                    <tr key={user.name}>
                      <td>
                        {index === 0 && '🚨 '}
                        {user.name}
                      </td>
                      <td><Badge bg="danger">{user.delayedTickets}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Tickets más problemáticos */}
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">🚨 Tickets Más Problemáticos</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {getTopProblematicTickets().map((ticket) => (
                  <div key={ticket.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                    <div>
                      <strong>{ticket.code}</strong>
                      <div className="text-muted small">{ticket.client?.rfc || '-'}</div>
                    </div>
                    <Badge bg={ticket.impactLevel === 'CRITICAL' ? 'danger' : 'warning'}>
                      {ticket.impactLevel}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* 📊 Tendencias */}
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">📊 Tendencias Generales</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <strong>Total de Tickets:</strong> <Badge bg="info">{stats?.total || 0}</Badge>
              </div>
              <div className="mb-3">
                <strong>Por Estado:</strong>
                <div className="mt-2">
                  {stats && Object.entries(stats.byStatus).map(([status, count]) => (
                    <div key={status} className="d-flex justify-content-between">
                      <span>{status}</span>
                      <Badge bg="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <strong>Por Impacto:</strong>
                <div className="mt-2">
                  {stats && Object.entries(stats.byImpact).map(([impact, count]) => (
                    <div key={impact} className="d-flex justify-content-between">
                      <span>{impact}</span>
                      <Badge bg="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Horas pico */}
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">🕐 Horas Pico de Tickets</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {stats && Object.entries(stats.byHour)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 10)
                  .map(([hour, count]) => (
                  <div key={hour} className="d-flex justify-content-between align-items-center mb-2">
                    <span>{getHourLabels()[parseInt(hour)]}</span>
                    <Badge bg="primary">{count} tickets</Badge>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Días con más carga */}
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">📅 Días con Más Carga</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {stats && Object.entries(stats.byDay)
                  .sort(([,a], [,b]) => b - a)
                  .map(([day, count]) => (
                  <div key={day} className="d-flex justify-content-between align-items-center mb-2">
                    <span>{getDayLabels()[parseInt(day) as keyof ReturnType<typeof getDayLabels>]}</span>
                    <Badge bg="warning">{count} tickets</Badge>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Tipos de tickets más comunes */}
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">🏷️ Tipos de Tickets Más Comunes</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {stats && Object.entries(stats.byImpact)
                  .sort(([,a], [,b]) => b - a)
                  .map(([impact, count]) => (
                  <div key={impact} className="d-flex justify-content-between align-items-center mb-2">
                    <span>{impact}</span>
                    <Badge bg="info">{count} tickets</Badge>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Tiempo promedio por usuario */}
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">⏱️ Tiempo Promedio por Usuario</h5>
            </Card.Header>
            <Card.Body>
              <Table striped hover size="sm">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Tiempo Promedio (días)</th>
                  </tr>
                </thead>
                <tbody>
                  {userStats
                    .filter(u => u.avgResolutionTime > 0)
                    .sort((a, b) => a.avgResolutionTime - b.avgResolutionTime)
                    .slice(0, 10)
                    .map((user) => (
                    <tr key={user.name}>
                      <td>{user.name}</td>
                      <td><Badge bg="secondary">{user.avgResolutionTime}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Tickets por usuario */}
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">📈 Tickets por Usuario</h5>
            </Card.Header>
            <Card.Body>
              <div className="row">
                {stats && Object.entries(stats.byUser)
                  .sort(([,a], [,b]) => b - a)
                  .map(([user, count]) => (
                  <div key={user} className="col-md-4 mb-3">
                    <div className="p-3 border rounded text-center">
                      <div className="h5 mb-1">{count}</div>
                      <div className="text-muted small">{user}</div>
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