import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { createTicket } from '@/api/tickets.api';
import TicketForm from '@/components/Tickets/TicketForm';

import type { TicketFormValues } from '@/types/ticket.types';

export default function TicketCreate() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  /* =============================
     Valores iniciales
  ============================== */
  const initialValues: TicketFormValues = {
    requestedBy: '',
    contact: '',
    clientType: 'EXTERNO',
    impactLevel: undefined,

    client: {
      rfc: '',
      companyName: '',
      businessName: '',
      location: '',
    },

    serviceAffected: '',
    problemDesc: '',
    eventLocation: '',

    initialFindings: '',
    probableRootCause: '',

    actionsTaken: '',
    additionalNotes: '',
    correctiveAction: false,
  };

  return (
    <Card className="p-4 shadow-sm">
      {/* =============================
          Header vista
      ============================== */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Crear Ticket</h4>

        <Button
          variant="outline-secondary"
          onClick={() => navigate('/tickets')}
          disabled={submitting}
        >
          Volver
        </Button>
      </div>

      {/* =============================
          Formulario
      ============================== */}
      <TicketForm
        mode="create"
        initialValues={initialValues}
        submitting={submitting}
        onSubmit={async (values) => {
          try {
            setSubmitting(true);
            await createTicket(values);
            navigate('/tickets');
          } finally {
            setSubmitting(false);
          }
        }}
      />
    </Card>
  );
}
