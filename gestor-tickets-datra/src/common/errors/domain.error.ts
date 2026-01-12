export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
  }
}

//SUBCLASES

export class ForbiddenDomainError extends DomainError {
  constructor(message = 'Acceso prohibido') {
    super(message, 'FORBIDDEN');
  }
}

export class InvalidStateDomainError extends DomainError {
  constructor(message = 'Estado inválido') {
    super(message, 'INVALID_STATE');
  }
}

export class NotFoundDomainError extends DomainError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 'NOT_FOUND');
  }
}
