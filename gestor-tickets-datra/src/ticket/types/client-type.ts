export const CLIENT_TYPES = ['INTERNO', 'EXTERNO'] as const;
export type ClientType = (typeof CLIENT_TYPES)[number];
