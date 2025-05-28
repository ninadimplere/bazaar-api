import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CustomersResolver } from './customer-list.resolver';
import { CustomersService } from './customer-list.service';

@Module({
  imports: [PrismaModule],
  providers: [CustomersResolver, CustomersService],
})
export class CustomersModule {}
