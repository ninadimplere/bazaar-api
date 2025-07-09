import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderResolver } from './order.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [OrderController],
  providers: [OrderService, OrderResolver],
})
export class OrderModule {}