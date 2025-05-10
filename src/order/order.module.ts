import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderResolver } from './order.resolver';

@Module({
  imports: [PrismaModule],
  controllers: [OrderController],
  providers: [OrderService, OrderResolver],
})
export class OrderModule {}