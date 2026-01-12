import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '../errors/domain.error';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.BAD_REQUEST;

    switch (exception.code) {
      case 'FORBIDDEN':
        status = HttpStatus.FORBIDDEN;
        break;
      case 'NOT_FOUND':
        status = HttpStatus.NOT_FOUND;
        break;
      case 'INVALID_STATE':
        status = HttpStatus.CONFLICT;
        break;
    }

    response.status(status).json({
      success: false,
      error: {
        code: exception.code,
        message: exception.message,
      },
    });
  }
}
