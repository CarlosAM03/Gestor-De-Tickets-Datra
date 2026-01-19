// src/api/users.api.ts
import http from './http';
import type { User } from '@/types/user.types';
import type { UserRole } from '@/types/enums';

/* ================================
   API RESPONSE NORMALIZATION
================================ */
interface ApiResponse<T> {
  data: T;
}

/* ================================
   Helpers
================================ */
function unwrapResponse<T>(response: any): T {
  if (response?.data?.data !== undefined) {
    return response.data.data;
  }

  if (response?.data !== undefined) {
    return response.data;
  }

  return response;
}

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
  const response = await http.post<User | ApiResponse<User>>(
    '/users',
    payload,
  );

  return unwrapResponse<User>(response);
};

/* =====================================================
   LIST USERS (ADMIN)
   GET /users
===================================================== */
export const getUsers = async (): Promise<User[]> => {
  const response = await http.get<User[] | ApiResponse<User[]>>(
    '/users',
  );

  return unwrapResponse<User[]>(response);
};

/* =====================================================
   GET MY PROFILE
   GET /users/me
===================================================== */
export const getMyProfile = async (): Promise<User> => {
  const response = await http.get<User | ApiResponse<User>>(
    '/users/me',
  );

  return unwrapResponse<User>(response);
};

/* =====================================================
   GET USER BY ID (ADMIN o SELF)
   GET /users/:id
===================================================== */
export const getUserById = async (
  id: number,
): Promise<User> => {
  const response = await http.get<User | ApiResponse<User>>(
    `/users/${id}`,
  );

  return unwrapResponse<User>(response);
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
  const response = await http.patch<User | ApiResponse<User>>(
    '/users/me',
    payload,
  );

  return unwrapResponse<User>(response);
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
  const response = await http.patch<User | ApiResponse<User>>(
    `/users/${id}`,
    payload,
  );

  return unwrapResponse<User>(response);
};
