import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import {
  AddBrandToCategoryInput,
  UpdateBrandCategoryInput,
} from 'brand/dto/brand-category.input';

@Injectable()
export class BrandCategoryService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.brandCategory.findMany({
      include: {
        brand: true,
        category: true,
      },
    });
  }

  add(input: AddBrandToCategoryInput) {
    return this.prisma.brandCategory.create({
      data: input,
      include: {
        brand: true,
        category: true,
      },
    });
  }

  update(input: UpdateBrandCategoryInput) {
    const { brandId, categoryId, ...data } = input;
    return this.prisma.brandCategory.update({
      where: {
        brandId_categoryId: {
          brandId,
          categoryId,
        },
      },
      data,
      include: {
        brand: true,
        category: true,
      },
    });
  }

  delete(brandId: number, categoryId: number) {
    return this.prisma.brandCategory.delete({
      where: {
        brandId_categoryId: {
          brandId,
          categoryId,
        },
      },
    });
  }
}
