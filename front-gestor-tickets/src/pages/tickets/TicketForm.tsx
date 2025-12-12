import { Formik, Form, Field } from 'formik';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as mockApi from '../../api/mockApi';

export default function TicketForm() {
  const nav = useNavigate();

  return (
    <Card className="p-3">
      <h4>Crear Ticket</h4>
      <Formik
        initialValues={{
          requestedBy: '',
          contact: '',
          clientType: '',
          serviceAffected: '',
          problemDesc: '',
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
        {({ isSubmitting }) => (
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
              <div className="col-md-6 mb-3">
                <label>Ubicación</label>
                <Field name="eventLocation" className="form-control" />
              </div>
              <div className="col-md-6 mb-3">
                <label>Servicio afectado</label>
                <Field name="serviceAffected" className="form-control" />
              </div>
              <div className="col-12 mb-3">
                <label>Descripción del problema</label>
                <Field name="problemDesc" as="textarea" className="form-control" />
              </div>
            </div>

            <div className="d-flex">
              <Button type="submit" disabled={isSubmitting} className="me-2">
                Guardar
              </Button>
              <Button variant="outline-secondary" onClick={() => nav(-1)}>
                Cancelar
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
