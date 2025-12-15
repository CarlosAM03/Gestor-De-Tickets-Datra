import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';
import vacioImg from '../assets/vacio.png';

export default function Dashboard() {
  const auth = React.useContext(AuthContext);

  // Simulación mientras no hay backend
  const recentTickets: any[] = [];
  const hasRecentTickets = recentTickets.length > 0;

  return (
    <>
      <h2 className="mb-4">Resumen</h2>

      <Row className="g-3">
        {/* BIENVENIDO */}
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h5>Bienvenido</h5>
            <p>{auth?.user?.name}</p>
            <small>{auth?.user?.email}</small>
          </Card>
        </Col>

        {/* ACTIVIDAD RECIENTE */}
        <Col md={8}>
          <Card className="p-3 shadow-sm">
            <h5>Actividad reciente</h5>
            <p className="text-muted">
              Este panel mostrará métricas y resumen de tickets cuando conectes el backend.
            </p>

            {hasRecentTickets && (
              <div>
                {/* Aquí irá la lista real de tickets */}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* IMAGEN DE ESTADO VACÍO (ABAJO, NO AFECTA LO DE ARRIBA) */}
      {!hasRecentTickets && (
        <div className="text-center mt-5">
          <img
            src={vacioImg}
            alt="Sin tickets"
            style={{
              maxWidth: '320px',
              width: '100%',
              opacity: 0.75,
            }}
          />

          <h6 className="text-muted mt-3">
            ---
          </h6>
        </div>
      )}
    </>
  );
}
