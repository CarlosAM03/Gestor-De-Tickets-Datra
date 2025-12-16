import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { Card } from 'react-bootstrap';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Requerido'),
  email: Yup.string().email('Email inválido').required('Requerido'),
  password: Yup.string().min(4, 'Mínimo 4 caracteres').required('Requerido'),
});

// --------- TYPE GUARD DEFINITIVO SIN "any" ---------
function isErrorWithMessage(e: unknown): e is { message: string } {
  return (
    typeof e === 'object' &&
    e !== null &&
    'message' in e &&
    typeof (e as { message?: unknown }).message === 'string'
  );
}
// ---------------------------------------------------

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: 640 }} className="p-3 mt-5">
        <h3 className="mb-3">Registro</h3>

        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={RegisterSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await register(values);
              nav('/');
            } catch (err: unknown) {
              let message = 'Error al registrar';

              if (isErrorWithMessage(err)) {
                message = err.message;
              }

              setErrors({ email: message });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label>Nombre</label>
                <Field name="name" className="form-control" />
                <ErrorMessage name="name" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <label>Email</label>
                <Field name="email" className="form-control" />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <label>Contraseña</label>
                <Field name="password" type="password" className="form-control" />
                <ErrorMessage name="password" component="div" className="text-danger" />
              </div>

              <div className="d-flex justify-content-between">
                <button className="btn btn-success" type="submit" disabled={isSubmitting}>
                  Registrar
                </button>
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => nav('/login')}
                >
                  Ya tengo cuenta
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
}
