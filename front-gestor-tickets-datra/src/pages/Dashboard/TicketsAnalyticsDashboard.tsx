import { useMemo, useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
//Badge,
  Spinner,
  Alert,
  ButtonGroup,
  Button,
} from 'react-bootstrap';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  format,
  startOfWeek,
  parseISO,
  isValid,
} from 'date-fns';
import { es } from 'date-fns/locale';

import { getTickets } from '@/api/tickets.api';
import type { Ticket } from '@/types/ticket-types/ticket.types';

import './TicketsAnalyticsDashboard.css';

/* =============================
   COMPONENTE PRINCIPAL
============================= */
export default function TicketsAnalyticsDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] =
    useState<'day' | 'week' | 'month'>('day');

  /* =============================
     LOAD DATA
  ============================== */
  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTickets({ scope: 'all' });
        setTickets(data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los tickets.');
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  /* =============================
     MÉTRICAS
  ============================== */
  const metrics = useMemo(() => {
    const totalTickets = tickets.length;

    const closedTickets = tickets.filter(
      t => t.status === 'CLOSED',
    ).length;

    const resolvedTickets = tickets.filter(
      t => t.status === 'RESOLVED',
    ).length;

    const openTickets = tickets.filter(
      t => t.status === 'OPEN',
    ).length;

    const cancelledTickets = tickets.filter(
      t => t.status === 'CANCELLED',
    ).length;

    /* -------- Usuarios -------- */
    const createdByUser = tickets.reduce(
      (acc, t) => {
        const name = t.createdBy?.name ?? 'Sistema';
        acc[name] = (acc[name] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const closedByUser = tickets
      .filter(t => t.status === 'CLOSED' && t.closedBy)
      .reduce((acc, t) => {
        const name = t.closedBy!.name;
        acc[name] = (acc[name] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    /* -------- Tiempos -------- */
    const resolutionTimes = tickets
      .filter(t => t.closedAt)
      .map(t => {
        const start =
          new Date(t.openedAt ?? t.createdAt).getTime();
        const end = new Date(t.closedAt!).getTime();
        return (end - start) / (1000 * 60 * 60);
      })
      .filter(Boolean);

    const avg =
      resolutionTimes.length > 0
        ? resolutionTimes.reduce((a, b) => a + b, 0) /
          resolutionTimes.length
        : 0;

    const max =
      resolutionTimes.length > 0
        ? Math.max(...resolutionTimes)
        : 0;

    const min =
      resolutionTimes.length > 0
        ? Math.min(...resolutionTimes)
        : 0;

    /* -------- Actividad -------- */
    const activityByDay = tickets.reduce(
      (acc, t) => {
        const date = (
          t.openedAt ?? t.createdAt
        ).split('T')[0];
        acc[date] = (acc[date] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalTickets,
      closedTickets,
      resolvedTickets,
      openTickets,
      cancelledTickets,
      createdByUser,
      closedByUser,
      totalReassigned: 0, // pendiente historial
      reopenedTickets: 0, // pendiente historial
      avgResolutionTime: Math.round(avg * 10) / 10,
      maxResolutionTime: Math.round(max * 10) / 10,
      minResolutionTime: Math.round(min * 10) / 10,
      activityByDay,
    };
  }, [tickets]);

  /* =============================
     FORMATEOS
  ============================== */
  const formatHours = (hours: number) => {
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const rest = Math.round(hours % 24);
    return `${days}d ${rest}h`;
  };

  /* =============================
     CHART DATA
  ============================== */
  const chartData = useMemo(() => {
    if (tickets.length === 0) return [];

    const grouped = tickets.reduce((acc, t) => {
      const raw = t.openedAt ?? t.createdAt;
      const date = parseISO(raw);
      if (!isValid(date)) return acc;

      let key: Date;

      if (timePeriod === 'week') {
        key = startOfWeek(date, { weekStartsOn: 1 });
      } else if (timePeriod === 'month') {
        key = new Date(date.getFullYear(), date.getMonth(), 1);
      } else {
        key = new Date(date.toDateString());
      }

      const id = key.toISOString();
      acc[id] = (acc[id] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([iso, count]) => {
        const date = new Date(iso);
        return {
          label:
            timePeriod === 'month'
              ? format(date, 'MMM yyyy', { locale: es })
              : timePeriod === 'week'
              ? `Sem ${format(date, 'II', { locale: es })}`
              : format(date, 'dd/MM', { locale: es }),
          tickets: count,
          date,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [tickets, timePeriod]);

  /* =============================
     LOAD STATES
  ============================== */
  if (loading) {
    return (
      <div className="analytics-dashboard text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2">Cargando datos…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-dashboard">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </div>
    );
  }

  /* =============================
     RENDER
  ============================== */
  return (
    <div className="analytics-dashboard">
      <h2 className="mb-4">Dashboard de Análisis de Tickets</h2>

      {/* KPIs */}
      <Row className="g-3 mb-4">
        <Kpi label="Total Tickets" value={metrics.totalTickets} />
        <Kpi label="Cerrados" value={metrics.closedTickets} color="success" />
        <Kpi label="Resueltos" value={metrics.resolvedTickets} color="warning" />
        <Kpi label="Abiertos" value={metrics.openTickets} color="primary" />
        <Kpi label="Cancelados" value={metrics.cancelledTickets} color="danger" />
      </Row>

      {/* Tiempos */}
      <Row className="g-3 mb-4">
        <Kpi label="Promedio" value={formatHours(metrics.avgResolutionTime)} />
        <Kpi label="Máximo" value={formatHours(metrics.maxResolutionTime)} color="danger" />
        <Kpi label="Mínimo" value={formatHours(metrics.minResolutionTime)} color="success" />
      </Row>

      {/* Gráfica */}
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Tendencia</h5>
          <ButtonGroup size="sm">
            {(['day', 'week', 'month'] as const).map(p => (
              <Button
                key={p}
                variant={timePeriod === p ? 'primary' : 'outline-primary'}
                onClick={() => setTimePeriod(p)}
              >
                {p === 'day' ? 'Día' : p === 'week' ? 'Semana' : 'Mes'}
              </Button>
            ))}
          </ButtonGroup>
        </Card.Header>
        <Card.Body style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tickets"
                stroke="#0d6efd"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>
    </div>
  );
}

/* =============================
   KPI COMPONENT
============================= */
function Kpi({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color?: string;
}) {
  return (
    <Col xs={12} sm={6} md={3}>
      <Card className="kpi-card text-center">
        <Card.Body>
          <div className={`kpi-number text-${color ?? 'dark'}`}>
            {value}
          </div>
          <div className="kpi-label">{label}</div>
        </Card.Body>
      </Card>
    </Col>
  );
}
