import { User } from '@prisma/client';
import { UserResponseDto } from '../dto/user-response.dto';

export function toUserResponseDto(user: User): UserResponseDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,
  };
}
