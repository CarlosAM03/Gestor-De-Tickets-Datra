import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AdminImportClientsService } from './admin-import-clients.service';
import { ClientServiceCsvParser } from './csv/client-service.parser';
import { ClientServiceValidator } from './csv/client-service.validator';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

interface UploadedCsvFile {
  buffer: Buffer;
}

@Controller('admin/import-clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminImportClientsController {
  constructor(private readonly importService: AdminImportClientsService) {}

  // =========================
  // IMPORT CLIENTS (ADMIN)
  // =========================
  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async importClients(@UploadedFile() file: unknown) {
    // =========================
    // File validation (STRICT)
    // =========================
    if (!file || typeof file !== 'object') {
      throw new BadRequestException('CSV file is required');
    }

    if (!('buffer' in file)) {
      throw new BadRequestException('Invalid CSV upload');
    }

    const csvFile = file as UploadedCsvFile;

    if (!Buffer.isBuffer(csvFile.buffer) || csvFile.buffer.length === 0) {
      throw new BadRequestException('Empty CSV file');
    }

    // =========================
    // Parse CSV
    // =========================
    const parsedRows = ClientServiceCsvParser.parse(csvFile.buffer);

    if (parsedRows.length === 0) {
      throw new BadRequestException('CSV contains no data rows');
    }

    // =========================
    // Validate domain
    // =========================
    const validationResult = ClientServiceValidator.validate(parsedRows);

    // =========================
    // Persist valid rows
    // =========================
    let importResult = {
      clientsUpserted: 0,
      serviceContractsUpserted: 0,
    };

    if (validationResult.validRows.length > 0) {
      importResult = await this.importService.importValidatedRows(
        validationResult.validRows,
      );
    }

    // =========================
    // Final response
    // =========================
    return {
      summary: {
        totalRows: parsedRows.length,
        validRows: validationResult.validRows.length,
        invalidRows: validationResult.errors.length,
        ...importResult,
      },
      errors: validationResult.errors,
    };
  }
}
