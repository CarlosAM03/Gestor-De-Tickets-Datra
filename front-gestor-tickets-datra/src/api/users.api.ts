// src/api/users.api.ts
import http from './http';
import type { User } from '@/types/user.types';
import type { UserRole } from '@/types/enums';

/* =====================================================
   CREATE USER (ADMIN)
   POST /users
===================================================== */
export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export const createUser = async (
  payload: CreateUserPayload,
): Promise<User> => {
  const { data } = await http.post<User>('/users', payload);
  return data;
};

/* =====================================================
   LIST USERS (ADMIN)
   GET /users
===================================================== */
export const getUsers = async (): Promise<User[]> => {
  const response = await http.get('/users');

  // Defensa contra envoltorios futuros
  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (Array.isArray(response.data?.data)) {
    return response.data.data;
  }

  return [];
};

/* =====================================================
   GET MY PROFILE
   GET /users/me
===================================================== */
export const getMyProfile = async (): Promise<User> => {
  const { data } = await http.get<User>('/users/me');
  return data;
};

/* =====================================================
   GET USER BY ID (ADMIN o SELF)
   GET /users/:id
===================================================== */
export const getUserById = async (id: number): Promise<User> => {
  const { data } = await http.get<User>(`/users/${id}`);
  return data;
};

/* =====================================================
   UPDATE SELF
   PATCH /users/me
   (name / password)
===================================================== */
export interface UpdateSelfPayload {
  name?: string;
  password?: string;
}

export const updateMyProfile = async (
  payload: UpdateSelfPayload,
): Promise<User> => {
  const { data } = await http.patch<User>('/users/me', payload);
  return data;
};

/* =====================================================
   ADMIN UPDATE USER
   PATCH /users/:id
   (name / email / role / active)
===================================================== */
export interface AdminUpdateUserPayload {
  name?: string;
  email?: string;
  role?: UserRole;
  active?: boolean;
}

export const updateUserByAdmin = async (
  id: number,
  payload: AdminUpdateUserPayload,
): Promise<User> => {
  const { data } = await http.patch<User>(`/users/${id}`, payload);
  return data;
};
