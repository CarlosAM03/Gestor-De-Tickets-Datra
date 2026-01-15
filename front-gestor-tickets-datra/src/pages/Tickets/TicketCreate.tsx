import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { createTicket } from '@/api/tickets.api';
import TicketForm from '@/components/Tickets/TicketForm';

import type { CreateTicketDTO } from '@/types/ticket-types/ticket.dto';
import { ImpactLevel } from '@/types/enums';

export default function TicketCreate() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  /* =============================
     Valores iniciales (DTO)
  ============================== */
  const initialValues: CreateTicketDTO = {
    clientRfc: '',
    serviceContractId: 0,

    impactLevel: ImpactLevel.LOW,
    problemDescription: '',

    eventLocation: '',
    estimatedStart: '',

    requestedBy: '',
    contactInfo: '',
  };

  return (
    <Card className="p-4 shadow-sm">
      {/* =============================
          Header
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

            /* =============================
               Payload FINAL (estricto)
            ============================== */
            const payload = {
              clientRfc: values.clientRfc!,
              serviceContractId: values.serviceContractId!,
              impactLevel: values.impactLevel!,
              problemDescription: values.problemDescription!,
              eventLocation: values.eventLocation || undefined,
              estimatedStart: values.estimatedStart || undefined,
              requestedBy: values.requestedBy || undefined,
              contactInfo: values.contactInfo || undefined,
            };

            await createTicket(payload);
            navigate('/tickets');
          } finally {
            setSubmitting(false);
          }
        }}
      />
    </Card>
  );
}
