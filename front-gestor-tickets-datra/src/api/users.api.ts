// src/api/users.api.ts
import http from './http';
import type { User } from '@/types/user.types';

/* =====================================================
   LISTADO (ADMIN)
===================================================== */
export const getUsers = async () => {
  const { data } = await http.get<User[]>('/users');
  return data;
};

/* =====================================================
   DETALLE (ADMIN o propio)
===================================================== */
export const getUserById = async (id: number) => {
  const { data } = await http.get<User>(`/users/${id}`);
  return data;
};

/* =====================================================
   CREATE (ADMIN)
===================================================== */
export const createUser = async (payload: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) => {
  const { data } = await http.post('/users', payload);
  return data;
};

/* =====================================================
   DELETE (ADMIN)
===================================================== */
export const deleteUser = async (id: number) => {
  const { data } = await http.delete(`/users/${id}`);
  return data;
};
