import { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Button,
  Spinner,
  Alert,
  Badge,
  Form,
  Card,
  Row,
  Col,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { getAllClients } from '@/api/clients.api';
import type { Client } from '@/types/clients-types/clients.types';
import { useAuth } from '@/auth/useAuth';
import { UserRole } from '@/types/enums';

export default function ClientsList() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === UserRole.ADMIN;

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ===== Filters ===== */
  const [includeInactive, setIncludeInactive] = useState(false);
  const [search, setSearch] = useState('');

  /* =============================
     Load clients
  ============================= */
  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllClients(
        isAdmin ? includeInactive : false,
      );

      setClients(data);
    } catch (err) {
      console.error('[ClientsList] loadClients error', err);
      setError('No fue posible cargar los clientes');
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     Effects
  ============================= */
  useEffect(() => {
    if (!user) return;
    loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, includeInactive]);

  /* =============================
     Client filtering (UI only)
  ============================= */
  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return clients;

    return clients.filter(c =>
      [
        c.rfc,
        c.companyName,
        c.businessName,
        c.clientNumber,
      ]
        .filter(Boolean)
        .some(value =>
          value!.toLowerCase().includes(q),
        ),
    );
  }, [clients, search]);

  return (
    <Card className="p-3 shadow-sm">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Clientes</h4>

        {isAdmin && (
          <Button onClick={() => navigate('/clients/create')}>
            + Nuevo cliente
          </Button>
        )}
      </div>

      {/* Filters */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            placeholder="Buscar por RFC, nombre o razón social"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Col>

        {isAdmin && (
          <Col
            md={6}
            className="d-flex align-items-center justify-content-end"
          >
            <Form.Check
              type="switch"
              label="Mostrar inactivos"
              checked={includeInactive}
              onChange={e =>
                setIncludeInactive(e.target.checked)
              }
            />
          </Col>
        )}
      </Row>

      {/* States */}
      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && filteredClients.length === 0 && (
        <Alert variant="warning">
          No hay clientes para mostrar
        </Alert>
      )}

      {!loading && filteredClients.length > 0 && (
        <Table hover responsive>
          <thead>
            <tr>
              <th>RFC</th>
              <th>Cliente</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {filteredClients.map(client => (
              <tr key={client.rfc}>
                <td>{client.rfc}</td>

                <td>
                  {client.companyName ||
                    client.businessName ||
                    '—'}
                </td>

                <td>{client.location || '—'}</td>

                <td>
                  <Badge
                    bg={client.active ? 'success' : 'secondary'}
                  >
                    {client.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>

                <td className="text-end">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() =>
                      navigate(`/clients/${client.rfc}`)
                    }
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
