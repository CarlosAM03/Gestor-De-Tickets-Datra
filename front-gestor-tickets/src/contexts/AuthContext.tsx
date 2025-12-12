import React, { useEffect, useState } from 'react';
import type { User } from '../types';
import { AuthContext } from './authContextData';
import * as mockApi from '../api/mockApi';

const TOKEN_KEY = 'datra_token';
const USER_KEY = 'datra_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(() => {
    const s = localStorage.getItem(USER_KEY);
    return s ? JSON.parse(s) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  const login = async (email: string, password: string) => {
    const res = await mockApi.authLogin(email, password);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (payload: { name: string; email: string; password: string }) => {
    const res = await mockApi.authRegister(payload);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext };

