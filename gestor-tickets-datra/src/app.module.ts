import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ClientsModule } from './clients/clients.module';
import { TicketModule } from './ticket/ticket.module';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { ServiceContractModule } from './service-contract/service-contract.module';
import { TicketHistoryModule } from './tickethistory/ticket-history.module';
import { AdminImportClientsModule } from './admin-import-clients/admin-import-clients.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    ClientsModule,
    ServiceContractModule,
    TicketModule,
    TicketHistoryModule,
    AdminImportClientsModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
  ],
})
export class AppModule {}
