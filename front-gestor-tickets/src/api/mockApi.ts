// Simula un backend en memoria. Usa setTimeout para "latencia".
import type { User, Ticket } from '../types/index';

let nextTicketId = 3;
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Admin Datra',
    email: 'admin@datra.test',
    password: 'Pass1234',
    role: 'admin',
    active: true,
  },
  {
    id: 2,
    name: 'Tecnico Demo',
    email: 'tecnico@datra.test',
    password: 'Pass1234',
    role: 'tecnico',
    active: true,
  },
];

const mockTickets: Ticket[] = [
  {
    id: 1,
    code: 'TCK-0001',
    openedAt: new Date().toISOString(),
    requestedBy: 'Empresa A',
    contact: 'Ing. Perez',
    clientType: 'Empresa',
    serviceAffected: 'Internet fibra',
    problemDesc: 'Sin conectividad en sector norte',
    eventLocation: 'Planta 3',
    estimatedStart: new Date().toISOString(),
    impactLevel: 'Alto',
    initialFindings: 'Fallo de ONT',
    probableRootCause: 'Daño físico',
    actionsTaken: 'Reinicio equipo',
    closedAt: null,
    serviceStatus: 'Abierto',
    additionalNotes: '',
    correctiveAction: false,
    createdById: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    code: 'TCK-0002',
    openedAt: new Date().toISOString(),
    requestedBy: 'Institución B',
    contact: 'Lic. Gómez',
    clientType: 'Institución',
    serviceAffected: 'Router core',
    problemDesc: 'Pérdida de paquetes',
    eventLocation: 'Sala NOC',
    estimatedStart: null,
    impactLevel: 'Medio',
    initialFindings: '',
    probableRootCause: '',
    actionsTaken: '',
    closedAt: null,
    serviceStatus: 'En diagnóstico',
    additionalNotes: '',
    correctiveAction: false,
    createdById: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const delay = <T,>(data: T, ms = 400) =>
  new Promise<T>((res) => setTimeout(() => res(data), ms));

export const authLogin = async (email: string, password: string) => {
  const user = mockUsers.find((u) => u.email === email && u.password === password);
  if (!user) {
    return delay(
      Promise.reject({ status: 401, message: 'Credenciales inválidas' }) as never,
      300
    );
  }
  // Simular token simple (no JWT real)
  const token = btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role }));
  return delay({ token, user });
};

export const authRegister = async (payload: { name: string; email: string; password: string }) => {
  if (mockUsers.find((u) => u.email === payload.email)) {
    return delay(Promise.reject({ status: 400, message: 'Email ya registrado' }) as never, 300);
  }
  const newUser: User = {
    id: mockUsers.length + 1,
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: 'tecnico',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  return delay({ user: newUser, token: btoa(JSON.stringify({ id: newUser.id, email: newUser.email })) });
};

export const getTickets = async () => {
  return delay([...mockTickets]);
};

export const getTicketById = async (id: number) => {
  const t = mockTickets.find((x) => x.id === id);
  if (!t) return delay(Promise.reject({ status: 404, message: 'No encontrado' }) as never, 200);
  return delay({ ...t });
};

export const createTicket = async (payload: Partial<Ticket>) => {
  const newTicket: Ticket = {
    id: nextTicketId++,
    code: `TCK-${String(nextTicketId).padStart(4, '0')}`,
    openedAt: new Date().toISOString(),
    serviceStatus: 'Abierto',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...payload,
  } as Ticket;
  mockTickets.unshift(newTicket);
  return delay(newTicket, 300);
};

export const updateTicket = async (id: number, payload: Partial<Ticket>) => {
  const idx = mockTickets.findIndex((t) => t.id === id);
  if (idx === -1) return delay(Promise.reject({ status: 404 }), 200);
  mockTickets[idx] = { ...mockTickets[idx], ...payload, updatedAt: new Date().toISOString() };
  return delay(mockTickets[idx], 300);
};
