import http from './http';

/**
 * Roles soportados por el sistema
 */
export type UserRole = 'ADMIN' | 'INGENIERO' | 'TECNICO';

/**
 * Respuesta esperada del backend en /auth/login
 */
export interface LoginResponse {
  access_token: string;
  expires_in?: string;

  /**
   * Opcional: el backend puede o no enviar el usuario
   * dependiendo de la estrategia de auth
   */
  user?: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
}

/**
 * Request de login
 */
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
