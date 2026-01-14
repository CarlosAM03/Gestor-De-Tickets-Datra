// src/types/clients.dto.ts
export interface CreateClientPayload {
  rfc: string;
  clientNumber: string;
  companyName?: string;
  businessName?: string;
  location?: string;
}

export interface UpdateClientPayload {
  companyName?: string;
  businessName?: string;
  location?: string;
}
