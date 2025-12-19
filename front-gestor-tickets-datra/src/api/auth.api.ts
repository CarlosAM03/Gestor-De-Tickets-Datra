import http from './http';
import type { AuthUser } from '@/types/auth.types';

export interface LoginResponse {
  access_token: string;
  expires_in?: string;
  user: AuthUser;
}

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
