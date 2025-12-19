import type { UserRole } from '@/types/user.types';

export interface MenuItem {
  label: string;
  path: string;
  roles: UserRole[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    roles: ['ADMIN', 'INGENIERO', 'TECNICO'],
  },
  {
    label: 'Tickets',
    path: '/tickets',
    roles: ['ADMIN', 'INGENIERO', 'TECNICO'],
  },
  {
    label: 'Usuarios',
    path: '/users',
    roles: ['ADMIN'],
  },
];
