import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartResolver } from './cart.resolver';

@Module({
  imports: [PrismaModule],
  controllers: [CartController],
  providers: [CartService, CartResolver],
})
export class CartModule {}