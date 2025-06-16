import { Module } from '@nestjs/common';
import { BrandResolver } from './brand.resolver';
import { BrandService } from './brand.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BrandResolver, BrandService],
})
export class BrandModule {}
