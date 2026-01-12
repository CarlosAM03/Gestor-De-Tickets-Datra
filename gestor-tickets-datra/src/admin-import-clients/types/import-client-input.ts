// src/admin-import/types/import-client-input.ts

export interface ImportClientInput {
  rfc: string;
  clientNumber: string;

  companyName?: string;
  businessName?: string;
  location?: string;

  active?: boolean;
}
