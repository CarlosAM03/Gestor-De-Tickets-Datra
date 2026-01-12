import { Module } from '@nestjs/common';
import { AdminImportClientsController } from './admin-import.controller';
import { AdminImportClientsService } from './admin-import-clients.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule, // acceso a PrismaService
  ],
  controllers: [AdminImportClientsController],
  providers: [AdminImportClientsService],
})
export class AdminImportClientsModule {}
