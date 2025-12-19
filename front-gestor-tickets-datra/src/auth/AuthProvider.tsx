import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { loginRequest } from '@/api/auth.api';
import type { AuthUser } from '@/types/auth.types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token'),
  );
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const data = await loginRequest(email, password);

    localStorage.setItem('token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  /**
   * En el futuro:
   * - Llamar /auth/me si existe token
   * - Restaurar sesión al refrescar
   */
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    // Placeholder para Sprint 2
    // fetchCurrentUser().then(setUser).finally(() => setLoading(false));

    setLoading(false);
  }, [token]);

  if (loading) {
    return null; // o <SplashScreen />
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
