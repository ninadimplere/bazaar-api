import { Module } from '@nestjs/common';
import { BrandCategoryResolver } from './brand-category.resolver';
import { BrandCategoryService } from './brand-category.service';
import { PrismaService } from '@prisma/prisma.service';

@Module({
  providers: [BrandCategoryResolver, BrandCategoryService, PrismaService],
})
export class BrandCategoryModule {}
