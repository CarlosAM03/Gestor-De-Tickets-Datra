import { useState } from 'react';
import { AuthContext } from './AuthContext';
import { loginRequest } from '../api/auth.api';
import type { AuthUser } from '../types/auth.types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token'),
  );

  const login = async (email: string, password: string) => {
    const data = await loginRequest(email, password);

    // Guardar token
    localStorage.setItem('token', data.access_token);
    setToken(data.access_token);

    // Si el backend devuelve el usuario → usarlo
    // Si no → dejarlo en null (se puede cargar luego con /auth/me)
    if (data.user) {
      setUser(data.user);
    } else {
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
