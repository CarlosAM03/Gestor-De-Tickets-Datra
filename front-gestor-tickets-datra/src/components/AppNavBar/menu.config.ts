// src/layouts/AppNavBar/menu.config.ts
import { UserRole } from '@/types/enums';

export interface MenuItem {
  label: string;
  path: string;
  roles: UserRole[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    roles: [
      UserRole.ADMIN,
      UserRole.INGENIERO,
      UserRole.TECNICO,
    ],
  },
  {
    label: 'Tickets',
    path: '/tickets',
    roles: [
      UserRole.ADMIN,
      UserRole.INGENIERO,
      UserRole.TECNICO,
    ],
  },
  {
    label: 'Usuarios',
    path: '/users',
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Clientes',
    path: '/clients',
    roles: [UserRole.ADMIN], 
  },
];
