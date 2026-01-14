// src/types/clients.types.ts
export interface Client {
  rfc: string;
  clientNumber: string;

  companyName?: string;
  businessName?: string;
  location?: string;

  active: boolean;
}

