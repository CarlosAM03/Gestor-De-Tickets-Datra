import http from './http';
import type { LoginResponse } from '@/types/auth.types';

export const loginRequest = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const { data } = await http.post<LoginResponse>('/auth/login', {
    email,
    password,
  });

  return data;
};
