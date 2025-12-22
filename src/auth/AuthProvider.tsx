import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { loginRequest } from '@/api/auth.api';
import type { AuthUser } from '@/types/auth.types';

const USER_STORAGE_KEY = 'auth_user';
const TOKEN_STORAGE_KEY = 'token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * LOGIN
   */
  const login = async (email: string, password: string) => {
    const data = await loginRequest(email, password);

    localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));

    setToken(data.access_token);
    setUser(data.user);
  };

  /**
   * LOGOUT
   */
  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);

    setUser(null);
    setToken(null);

    window.location.href = '/login';
  };

  /**
   * RESTAURAR SESIÓN (Sprint 2)
   */
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        // Sesión corrupta
        localStorage.clear();
      }
    }

    setLoading(false);
  }, []);

  /**
   * Evitar render prematuro
   */
  if (loading) {
    return null; // luego podemos usar <SplashScreen />
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
