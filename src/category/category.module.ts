import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryResolver } from './category.resolver';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryResolver],
})
export class CategoryModule {}
