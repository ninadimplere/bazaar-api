import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Prisma, ProductStatus } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProductById(productId: number) {
    return this.prismaService.product.findUnique({
      where: { id: Number(productId) }, // Ensure id is parsed as a number
    });
  }

  async createProduct(createProductDto: CreateProductDto) {
    return this.prismaService.product.create({
      data: {
        ...createProductDto,
      },
    });
  }

  async getFilteredProducts(options: {
    searchString?: string;
    priceMin?: number;
    priceMax?: number;
    productStatus?: ProductStatus;
    pageSize?: number;
    pageOffset?: number;
  }) {
    const {
      searchString,
      priceMin,
      priceMax,
      productStatus,
      pageSize = 10,
      pageOffset = 0,
    } = options;

    // Construct where clause
    const filters: Prisma.ProductWhereInput[] = [];

    if (searchString) {
      filters.push({
        OR: [
          { title: { contains: searchString, mode: 'insensitive' } },
          { description: { contains: searchString, mode: 'insensitive' } },
        ],
      });
    }

    if (priceMin !== undefined) {
      filters.push({ displayPrice: { gte: priceMin } });
    }

    if (priceMax !== undefined) {
      filters.push({ displayPrice: { lte: priceMax } });
    }

    if (productStatus) {
      filters.push({ productStatus });
    }

    return this.prismaService.product.findMany({
      where: filters.length > 0 ? { AND: filters } : undefined,
      skip: pageOffset,
      take: pageSize,
      orderBy: { displayPriority: 'desc' },
    });
  }

  async deleteProduct(productId: number) {
    return this.prismaService.product.delete({
      where: { id: productId },
    });
  }

  async updateProduct(
    productId: number,
    updateData: Partial<CreateProductDto>,
  ) {
    return this.prismaService.product.update({
      where: { id: productId },
      data: updateData,
    });
  }

  async getProductByCategoryId(categoryId: number) {
    return this.prismaService.product.findMany({
      where: { categoryId },
    });
  }
}
