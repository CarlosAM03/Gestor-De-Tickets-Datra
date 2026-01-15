import http from './http';
import type { LoginResponse } from '@/types/auth.types';

/**
 * Respuesta real del backend
 */
interface LoginApiResponse {
  success: boolean;
  data: LoginResponse;
}

/**
 * Request de login
 * Endpoint público
 */
export const loginRequest = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const { data } = await http.post<LoginApiResponse>(
    '/auth/login',
    {
      email,
      password,
    },
  );

  /**
   * Normalizamos contrato:
   * frontend SOLO trabaja con LoginResponse
   */
  return data.data;
};
