import { useEffect, useState, ReactNode } from 'react';
import { AuthContext, AuthStatus } from './AuthContext';
import { loginRequest } from '@/api/auth.api';
import type { AuthUser } from '@/types/auth.types';
import {
  ACCESS_TOKEN_KEY,
  AUTH_USER_KEY,
} from './auth.storage';

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>('checking');

  /* =============================
     Bootstrap de sesión
  ============================== */
  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);

    if (!storedToken || !storedUser) {
      setStatus('unauthenticated');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as AuthUser;

      // Validación mínima de contrato
      if (!parsedUser?.id || !parsedUser?.role) {
        throw new Error('Invalid stored user');
      }

      setToken(storedToken);
      setUser(parsedUser);
      setStatus('authenticated');
    } catch {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      setStatus('unauthenticated');
    }
  }, []);

  /* =============================
     Login
  ============================== */
  const login = async (email: string, password: string) => {
    setStatus('checking');

    const response = await loginRequest(email, password);


    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      response.access_token,
    );
    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify(response.user),
    );

    setToken(response.access_token);
    setUser(response.user);
    setStatus('authenticated');
  };

  /* =============================
     Logout
  ============================== */
  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);

    setUser(null);
    setToken(null);
    setStatus('unauthenticated');
  };

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
