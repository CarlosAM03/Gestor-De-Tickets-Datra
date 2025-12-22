import { useEffect, useState } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import {
  createTicket,
  getTicketById,
  updateTicket,
} from '@/api/tickets.api';

import type {
  Ticket,
  CreateTicketDto,
  UpdateTicketDto,
  ClientType,
  ImpactLevel,
} from '@/types/ticket.types';

/* =============================
   Tipo del formulario
   (alineado al backend)
============================= */
type TicketFormValues = {
  requestedBy?: string;
  contact?: string;
  clientType?: ClientType;
  serviceAffected?: string;
  problemDesc?: string;
  impactLevel?: ImpactLevel;
};

export default function TicketForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);

  /* =============================
     Cargar ticket (edición)
  ============================== */
  useEffect(() => {
    if (!isEditMode || !id) return;

    const loadTicket = async () => {
      try {
        setLoading(true);
        const data = await getTicketById(Number(id));
        setTicket(data);
      } catch {
        navigate('/tickets');
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [id, isEditMode, navigate]);

  /* =============================
     Estado de carga
  ============================== */
  if (isEditMode && loading) {
    return (
      <Card className="p-4 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Cargando ticket...</p>
      </Card>
    );
  }

  /* =============================
     Valores iniciales
  ============================== */
  const initialValues: TicketFormValues = {
    requestedBy: ticket?.requestedBy ?? '',
    contact: ticket?.contact ?? '',
    clientType: ticket?.clientType ?? undefined,
    serviceAffected: ticket?.serviceAffected ?? '',
    problemDesc: ticket?.problemDesc ?? '',
    impactLevel: ticket?.impactLevel ?? undefined,
  };

  /* =============================
     Render
  ============================== */
  return (
    <Card className="p-4 shadow-sm">
      <h4 className="mb-3">
        {isEditMode ? 'Editar Ticket' : 'Crear Ticket'}
      </h4>

      <Formik<TicketFormValues>
        initialValues={initialValues}
        enableReinitialize
        onSubmit={async (
          values: TicketFormValues,
          { setSubmitting }: FormikHelpers<TicketFormValues>,
        ) => {
          try {
            if (isEditMode && id) {
              const payload: UpdateTicketDto = values;
              await updateTicket(Number(id), payload);
              navigate(`/tickets/${id}`);
            } else {
              const payload: CreateTicketDto = values;
              await createTicket(payload);
              navigate('/tickets');
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* SOLICITANTE */}
            <div className="mb-3">
              <label className="form-label">Solicitante</label>
              <Field
                name="requestedBy"
                className="form-control"
                placeholder="Nombre del solicitante"
              />
            </div>

            {/* CONTACTO */}
            <div className="mb-3">
              <label className="form-label">Contacto</label>
              <Field
                name="contact"
                className="form-control"
                placeholder="Correo o teléfono"
              />
            </div>

            {/* TIPO DE CLIENTE */}
            <div className="mb-3">
              <label className="form-label">Tipo de cliente</label>
              <Field name="clientType" as="select" className="form-control">
                <option value="">Seleccionar</option>
                <option value="INTERNO">Interno</option>
                <option value="EXTERNO">Externo</option>
              </Field>
            </div>

            {/* SERVICIO AFECTADO */}
            <div className="mb-3">
              <label className="form-label">Servicio afectado</label>
              <Field
                name="serviceAffected"
                className="form-control"
                placeholder="Ej. Sistema de facturación"
              />
            </div>

            {/* DESCRIPCIÓN */}
            <div className="mb-3">
              <label className="form-label">Descripción del problema</label>
              <Field
                name="problemDesc"
                as="textarea"
                className="form-control"
                rows={4}
              />
            </div>

            {/* NIVEL DE IMPACTO */}
            <div className="mb-4">
              <label className="form-label">Nivel de impacto</label>
              <Field name="impactLevel" as="select" className="form-control">
                <option value="">Seleccionar</option>
                <option value="LOW">Bajo</option>
                <option value="MEDIUM">Medio</option>
                <option value="HIGH">Alto</option>
                <option value="CRITICAL">Crítico</option>
                <option value="INFO">Informativo</option>
              </Field>
            </div>

            {/* BOTONES */}
            <div className="d-flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Guardando...'
                  : isEditMode
                  ? 'Actualizar'
                  : 'Crear'}
              </Button>

              <Button
                variant="outline-secondary"
                onClick={() => navigate('/tickets')}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
