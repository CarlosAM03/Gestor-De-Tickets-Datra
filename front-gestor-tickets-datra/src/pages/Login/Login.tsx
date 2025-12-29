import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Alert, Spinner } from 'react-bootstrap';

import { useAuth } from '@/auth/useAuth';
import siteLogo from '@/assets/datra-logo.png';

import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    () => localStorage.getItem('login_email') || '',
  );
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =============================
     Background login
  ============================= */
  useEffect(() => {
    document.body.classList.add('login-bg');
    return () => {
      document.body.classList.remove('login-bg');
    };
  }, []);

  /* =============================
     Submit
  ============================= */
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (loading) return;

  setLoading(true);
  setError(null);

  try {
    await login(email, password);

    // ✔️ Guardar solo email
    localStorage.setItem('login_email', email);

    // ✔️ Navegar SOLO en éxito
    navigate('/', { replace: true });
  } catch (err) {
    // ❗ NO re-lanzar el error
    setError('Credenciales inválidas. Verifica tu email y contraseña.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="auth-page">
      <div className="auth-layout">
        {/* Logo lateral */}
        <div className="auth-left">
          <img
            src={siteLogo}
            alt="Datra"
            className="auth-side-logo"
          />
        </div>

        {/* Card */}
        <Card className="auth-center-card p-4 shadow">
          <h3 className="mb-4">Acceso Datra</h3>

          {error && (
            <Alert
              variant="danger"
              className="py-2"
              onClose={() => setError(null)}
              dismissible
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@datra.mx"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-datra w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    className="me-2"
                  />
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
