import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { CouponsService } from './coupons.service';
import { CouponsResolver } from './coupons.resolver';
import { CouponsController } from './coupons.controller';
import { Coupon } from './coupons.entity';

@Module({
  imports: [PrismaModule],
  providers: [CouponsService, CouponsResolver],
  controllers: [CouponsController],
  exports: [CouponsService],
})
export class CouponsModule {}