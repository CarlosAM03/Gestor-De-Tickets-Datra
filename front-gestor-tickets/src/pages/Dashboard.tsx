import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';

export default function Dashboard() {
  const auth = React.useContext(AuthContext);
  return (
    <div>
      <h2>Resumen</h2>
      <Row className="g-3">
        <Col md={4}>
          <Card className="p-3">
            <h5>Bienvenido</h5>
            <p>{auth?.user?.name}</p>
            <small>{auth?.user?.email}</small>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="p-3">
            <h5>Actividad reciente</h5>
            <p>Este panel mostrará métricas y resumen de tickets cuando conectes el backend.</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
