// src/hooks/usePermissions.ts
import { useAuth } from '../contexts/AuthContext';
import { PERMISSIONS, getAllowedStatusesByRole, type Role } from '../contexts/permissions';
import type { TicketStatus } from '../constants/ticketStatus';

type PermissionKey = keyof typeof PERMISSIONS.ADMIN;

export const usePermissions = () => {
  const { user } = useAuth();

  const can = (permission: PermissionKey): boolean => {
    if (!user || !user.role) {
      return false;
    }
    
    const role = user.role.toUpperCase() as Role;
    return PERMISSIONS[role]?.[permission] ?? false;
  };

  const getAllowedStatuses = (): TicketStatus[] => {
    if (!user || !user.role) return ['ABIERTO'];
    
    const role = user.role.toUpperCase() as Role;
    return getAllowedStatusesByRole(role);
  };

  return {
    can,
    getAllowedStatuses,
  };
};