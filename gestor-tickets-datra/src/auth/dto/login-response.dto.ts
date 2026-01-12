import { UserRole } from '@prisma/client';

export class LoginResponseDto {
  message!: string;
  access_token!: string;
  expires_in!: string;
  user!: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
}
