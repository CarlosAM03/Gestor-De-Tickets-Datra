import { http } from './http';

export interface LoginResponse {
  access_token: string;
  expires_in: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'INGENIERO' | 'TECNICO';
  };
}

export const loginRequest = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const { data } = await http.post<LoginResponse>('/auth/login', {
    email,
    password,
  });

  return data;
};
