export type HttpErrorCode =
  | 'UNAUTHORIZED'        // 401
  | 'FORBIDDEN'           // 403
  | 'NOT_FOUND'           // 404
  | 'INVALID_STATE'       // 409 (InvalidTicketState / TicketImmutable)
  | 'VALIDATION_ERROR'    // 422 (futuro)
  | 'SERVER_ERROR'        // 5xx
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface HttpError {
  status: number | null;
  code: HttpErrorCode;
  message: string;
  raw?: unknown;
}
