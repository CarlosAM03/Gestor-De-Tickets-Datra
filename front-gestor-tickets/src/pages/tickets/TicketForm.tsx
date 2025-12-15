import { Formik, Form, Field } from 'formik';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as mockApi from '../../api/mockApi';

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

  return (
    <Card className="p-3 shadow-sm ticket-form">
      <h4>Crear Ticket</h4>

      <Formik
        initialValues={{
          requestedBy: '',
          contact: '',
          clientType: '',
          serviceAffected: '',
          problemDesc: '',
          initialFindings: '',
          actionsTaken: '',
          eventLocation: '',
          impactLevel: '',
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await mockApi.createTicket(values);
            nav('/tickets');
          } catch (err) {
            console.error(err);
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
                Guardar
              </Button>

              <Button
                variant="outline-secondary"
                onClick={() => nav(-1)}
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
