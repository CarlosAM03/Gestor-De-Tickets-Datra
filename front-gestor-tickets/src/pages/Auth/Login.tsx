import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Card } from 'react-bootstrap';
import siteLogo from '../../assets/logo.jpeg';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Requerido'),
  password: Yup.string().min(4, 'Mínimo 4 caracteres').required('Requerido'),
});

export default function Login() {
  const auth = React.useContext(AuthContext)!;
  const nav = useNavigate();

  React.useEffect(() => {
    document.body.classList.add('login-bg');
    return () => {
      document.body.classList.remove('login-bg');
    };
  }, []);

  return (
    <div className="auth-page d-flex justify-content-center align-items-center">
      <div className="auth-layout">
        <div className="auth-left d-flex align-items-center">
          <img src={siteLogo} alt="Datra" className="auth-side-logo" />
          <Card
            style={{ width: 480, background: '#233e83', color: '#ffffff', border: 'none' }}
            className="p-3 mt-0 auth-center-card"
          >
        <h3 className="mb-3">Iniciar sesión</h3>
        <Formik
          initialValues={{ email: 'admin@datra.test', password: 'Pass1234' }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await auth.login(values.email, values.password);
              nav('/');
            } catch {
              setErrors({ email: 'Credenciales inválidas' });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
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
                <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                  Ingresar
                </button>
                <button type="button" className="btn btn-link" onClick={() => nav('/register')}>
                  Crear cuenta
                </button>
              </div>
            </Form>
          )}
        </Formik>
          </Card>
        </div>
      </div>
    </div>
  );
}
