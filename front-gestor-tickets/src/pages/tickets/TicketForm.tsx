import { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Card, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import * as mockApi from '../../api/mockApi';
import type { Ticket } from '../../types';

/* ==========================================
   UBICACIÓN + GEOCODING INVERSO (OSM)
========================================== */
const getUserLocation = async (setFieldValue: any) => {
  if (!navigator.geolocation) {
    alert('La geolocalización no está soportada por este navegador');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              'User-Agent': 'Gestor-De-Tickets-Datra'
            }
          }
        );

        const data = await res.json();

        if (data?.display_name) {
          setFieldValue('eventLocation', data.display_name);
        } else {
          setFieldValue(
            'eventLocation',
            `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          );
        }
      } catch (error) {
        console.error(error);
        alert('Error al convertir la ubicación');
      }
    },
    () => {
      alert('No se pudo obtener la ubicación');
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    }
  );
};

export default function TicketForm() {
  const nav = useNavigate();
  const { id } = useParams(); // Obtener el ID de la URL
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(id); // Determinar si estamos editando

  // Cargar el ticket si estamos en modo edición
  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true);
      mockApi.getTicketById(Number(id))
        .then((data) => setTicket(data))
        .catch((err) => {
          console.error('Error cargando ticket:', err);
          alert('No se pudo cargar el ticket');
          nav('/tickets');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode, nav]);

  // Mostrar loader mientras carga
  if (isEditMode && loading) {
    return (
      <Card className="p-3 shadow-sm">
        <div className="text-center py-4">Cargando ticket...</div>
      </Card>
    );
  }

  // Si estamos en modo edición pero no hay ticket, mostrar error
  if (isEditMode && !loading && !ticket) {
    return (
      <Card className="p-3 shadow-sm">
        <div className="text-center py-4 text-danger">
          No se encontró el ticket
        </div>
        <Button variant="outline-secondary" onClick={() => nav('/tickets')}>
          Volver a tickets
        </Button>
      </Card>
    );
  }

  // Valores iniciales: vacíos para crear, con datos del ticket para editar
  const initialValues = {
    requestedBy: ticket?.requestedBy || '',
    contact: ticket?.contact || '',
    clientType: ticket?.clientType || '',
    serviceAffected: ticket?.serviceAffected || '',
    problemDesc: ticket?.problemDesc || '',
    initialFindings: ticket?.initialFindings || '',
    actionsTaken: ticket?.actionsTaken || '',
    eventLocation: ticket?.eventLocation || '',
    impactLevel: ticket?.impactLevel || '',
    serviceStatus: ticket?.serviceStatus || 'ABIERTO',
  };

  return (
    <Card className="p-3 shadow-sm ticket-form">
      <h4>{isEditMode ? 'Editar Ticket' : 'Crear Ticket'}</h4>
      {isEditMode && ticket && (
        <p className="text-muted mb-3">Código: <strong>{ticket.code}</strong></p>
      )}

      <Formik
        initialValues={initialValues}
        enableReinitialize={true} // Importante: permite actualizar valores cuando cambia el ticket
        onSubmit={async (values, { setSubmitting }) => {
          try {
            if (isEditMode && id) {
              // Actualizar ticket existente
              await mockApi.updateTicket(Number(id), values);
              alert('Ticket actualizado exitosamente');
              nav(`/tickets/${id}`);
            } else {
              // Crear nuevo ticket
              await mockApi.createTicket(values);
              alert('Ticket creado exitosamente');
              nav('/tickets');
            }
          } catch (err) {
            console.error(err);
            alert('Error al guardar el ticket');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Cliente</label>
                <Field name="requestedBy" className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label>Contacto</label>
                <Field name="contact" className="form-control" />
              </div>

              {/* UBICACIÓN */}
              <div className="col-md-6 mb-3">
                <label>Ubicación</label>
                <div className="d-flex gap-2">
                  <Field
                    name="eventLocation"
                    className="form-control"
                    placeholder="Escribe o usa tu ubicación actual"
                  />
                  <Button
                    type="button"
                    className="btn-datra"
                    onClick={() => getUserLocation(setFieldValue)}
                    title="Usar mi ubicación"
                  >
                    📍
                  </Button>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <label>Servicio afectado</label>
                <Field name="serviceAffected" className="form-control" />
              </div>

              {/* ESTADO DEL SERVICIO */}
              {isEditMode && (
                <div className="col-md-6 mb-3">
                  <label>Estado del servicio</label>
                  <Field as="select" name="serviceStatus" className="form-control">
                    <option value="ABIERTO">Abierto</option>
                    <option value="EN_PROCESO">En Proceso</option>
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="RESUELTO">Resuelto</option>
                    <option value="CERRADO">Cerrado</option>
                    <option value="CANCELADO">Cancelado</option>
                  </Field>
                </div>
              )}

              {/* NIVEL DE IMPACTO */}
              <div className="col-md-6 mb-3">
                <label>Nivel de impacto</label>
                <Field as="select" name="impactLevel" className="form-control">
                  <option value="">Seleccionar...</option>
                  <option value="Bajo">Bajo</option>
                  <option value="Medio">Medio</option>
                  <option value="Alto">Alto</option>
                  <option value="Crítico">Crítico</option>
                </Field>
              </div>

              {/* DESCRIPCIÓN */}
              <div className="col-12 mb-3">
                <label>Descripción del problema</label>
                <Field
                  name="problemDesc"
                  as="textarea"
                  className="form-control textarea-auto"
                  rows={3}
                  onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                    const t = e.currentTarget;
                    t.style.height = 'auto';
                    t.style.height = `${t.scrollHeight}px`;
                  }}
                />
              </div>
            </div>

            {/* OPCIONAL */}
            <hr />
            <small className="text-muted">Opcional</small>

            <div className="row mt-2">
              <div className="col-12 mb-3">
                <label>Diagnóstico inicial</label>
                <Field
                  name="initialFindings"
                  as="textarea"
                  className="form-control textarea-auto"
                  rows={2}
                  onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                    const t = e.currentTarget;
                    t.style.height = 'auto';
                    t.style.height = `${t.scrollHeight}px`;
                  }}
                />
              </div>

              <div className="col-12 mb-3">
                <label>Acciones tomadas</label>
                <Field
                  name="actionsTaken"
                  as="textarea"
                  className="form-control textarea-auto"
                  rows={2}
                  onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                    const t = e.currentTarget;
                    t.style.height = 'auto';
                    t.style.height = `${t.scrollHeight}px`;
                  }}
                />
              </div>
            </div>

            <div className="d-flex">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-datra me-2"
              >
                {isSubmitting ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Guardar'}
              </Button>

              <Button
                variant="outline-secondary"
                onClick={() => nav('/tickets')}
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