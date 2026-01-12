import { Module } from '@nestjs/common';
import { ServiceContractService } from './service-contract.service';
import { ServiceContractController } from './service-contract.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ServiceContractController],
  providers: [ServiceContractService, PrismaService],
  exports: [ServiceContractService],
})
export class ServiceContractModule {}
