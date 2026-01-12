export class ClientResponseDto {
  rfc!: string;
  clientNumber!: string;
  companyName?: string;
  businessName?: string;
  location?: string;
  active!: boolean;
}
