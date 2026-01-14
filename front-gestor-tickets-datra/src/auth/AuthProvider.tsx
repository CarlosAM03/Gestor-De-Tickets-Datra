import { useEffect, useState } from 'react';
import { AuthContext, type AuthStatus } from './AuthContext';
import { loginRequest } from '@/api/auth.api';
import type { AuthUser } from '@/types/auth.types';

const USER_STORAGE_KEY = 'auth_user';
const TOKEN_STORAGE_KEY = 'token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>('checking');

  /**
   * LOGIN
   */
  const login = async (email: string, password: string) => {
    const data = await loginRequest(email, password);

    localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));

    setToken(data.access_token);
    setUser(data.user);
    setStatus('authenticated');
  };

  /**
   * LOGOUT
   * Limpieza declarativa (sin redirects duros)
   */
  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);

    setUser(null);
    setToken(null);
    setStatus('unauthenticated');
  };

  /**
   * RESTAURAR SESIÓN
   */
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setStatus('authenticated');
        return;
      } catch {
        localStorage.clear();
      }
    }

    setStatus('unauthenticated');
  }, []);

  /**
   * Evitar render prematuro mientras se verifica sesión
   */
  if (status === 'checking') {
    return null; // luego <SplashScreen />
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        status,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
