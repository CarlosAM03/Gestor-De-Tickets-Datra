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
  TicketPriority,
} from '@/types/ticket.types';

/* =============================
   Tipo del formulario
============================= */
type TicketFormValues = {
  title: string;
  description: string;
  priority: TicketPriority;
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
      } catch (error) {
        console.error(error);
        alert('No se pudo cargar el ticket');
        navigate('/tickets');
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [id, isEditMode, navigate]);

  /* =============================
     Estados de carga
  ============================== */
  if (isEditMode && loading) {
    return (
      <Card className="p-4 shadow-sm text-center">
        <Spinner animation="border" />
        <p className="mt-3">Cargando ticket...</p>
      </Card>
    );
  }

  if (isEditMode && !loading && !ticket) {
    return (
      <Card className="p-4 shadow-sm text-center text-danger">
        Ticket no encontrado
      </Card>
    );
  }

  /* =============================
     Valores iniciales
  ============================== */
  const initialValues: TicketFormValues = {
    title: ticket?.title ?? '',
    description: ticket?.description ?? '',
    priority: ticket?.priority ?? 'MEDIUM',
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
              alert('Ticket actualizado correctamente');
              navigate(`/tickets/${id}`);
            } else {
              const payload: CreateTicketDto = values;
              await createTicket(payload);
              alert('Ticket creado correctamente');
              navigate('/tickets');
            }
          } catch (error) {
            console.error(error);
            alert('Error al guardar el ticket');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* TÍTULO */}
            <div className="mb-3">
              <label className="form-label">Título</label>
              <Field
                name="title"
                className="form-control"
                placeholder="Ej. Error en sistema de facturación"
                required
              />
            </div>

            {/* DESCRIPCIÓN */}
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <Field
                name="description"
                as="textarea"
                className="form-control"
                rows={4}
                required
              />
            </div>

            {/* PRIORIDAD */}
            <div className="mb-4">
              <label className="form-label">Prioridad</label>
              <Field name="priority" as="select" className="form-control">
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
                <option value="CRITICAL">Crítica</option>
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
