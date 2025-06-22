import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateCategoryInput, UpdateCategoryInput } from './dto/category.input';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async fetchAllCategories(params: {
    offset: number;
    limit: number;
    showActive?: boolean;
  }) {
    const { offset, limit, showActive } = params;

    return this.prismaService.category.findMany({
      skip: offset,
      take: limit,
      where: { isActive: showActive },
      orderBy: { id: 'asc' },
      include: {
        children: true,
        parent: true,
      },
    });
  }

  async getCategoryById(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
      include: { children: true },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async createCategory(data: CreateCategoryInput) {
    return this.prismaService.category.create({
      data,
      include: { children: true },
    });
  }

  async updateCategory(id: number, data: UpdateCategoryInput) {
    const existing = await this.prismaService.category.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Category not found');

    return this.prismaService.category.update({
      where: { id },
      data,
      include: { children: true },
    });
  }

  async getCategoriesByParentId(parentId: number) {
    return this.prismaService.category.findMany({
      where: { parentId },
      include: { children: true },
    });
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.prismaService.category.findUnique({
      where: { slug },
      include: { children: true },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async countCategories(showActive?: boolean): Promise<number> {
    return this.prismaService.category.count({
      where: {
        isActive: showActive,
      },
    });
  }
}
