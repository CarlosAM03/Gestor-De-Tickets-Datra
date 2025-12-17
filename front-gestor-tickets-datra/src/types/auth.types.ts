export type UserRole = 'ADMIN' | 'INGENIERO' | 'TECNICO';

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  access_token: string;
  expires_in: string;
}
