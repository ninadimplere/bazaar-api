import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async fetchAllCategories(): Promise<any> {
    return this.prismaService.category.findMany({
      where: { isActive: true, parentId: null },
      include: { children: true },
    });
  }

  async getCategoryById(id: number) {
    return this.prismaService.category.findUnique({
      where: { id },
      include: { children: true },
    });
  }
}
