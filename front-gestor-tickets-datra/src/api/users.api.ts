// src/api/users.api.ts
import http from './http';
import type { User } from '@/types/user.types';

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
   LISTADO (ADMIN)
===================================================== */

export const getUsers = async (): Promise<User[]> => {
  const { data } = await http.get<User[]>('/users');
  return data;
};

/* =====================================================
   DETALLE (ADMIN o propio)
===================================================== */

export const getUserById = async (id: number): Promise<User> => {
  const { data } = await http.get<User>(`/users/${id}`);
  return data;
};


/* =====================================================
   UPDATE (ADMIN)
===================================================== */
export const updateMyProfile = async (
  payload: Partial<Pick<User, 'name' | 'email'>>,
): Promise<User> => {
  const { data } = await http.patch<User>('/users/me', payload);
  return data;
};

/* =====================================================
   DESACTIVACION (ADMIN)
===================================================== */
export const updateUserByAdmin = async (
  id: number,
  payload: Partial<User>,
): Promise<User> => {
  const { data } = await http.patch<User>(`/users/${id}`, payload);
  return data;
};






