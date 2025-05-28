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
    // First find the seller by userId
    const sellerExists = await this.prismaService.seller.findUnique({
      where: { userId: createProductDto.sellerId },
    });

    if (!sellerExists) {
      throw new Error('Seller not found');
    }

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
    isLowStock?: string;
    isOutOfStock?: string;
  }) {
    const {
      searchString,
      priceMin,
      priceMax,
      productStatus,
      pageSize = 10,
      pageOffset = 0,
      isLowStock,
      isOutOfStock,
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

    if (isLowStock) {
      filters.push({
        availableQuantity: {
          lt: 10,
          gt: 0, // Optional: Exclude 0 qty if it's considered out-of-stock instead
        },
      });
    }

    if (isOutOfStock) {
      filters.push({ availableQuantity: 0 });
    }

    return this.prismaService.product.findMany({
      where: filters.length > 0 ? { AND: filters } : undefined,
      skip: pageOffset,
      take: pageSize,
      orderBy: { displayPriority: 'asc' },
      include: {
        category: true,
      },
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

  // product.service.ts

  async getProductCounts() {
    const [
      allProducts,
      activeProducts,
      inactiveProducts,
      draftProducts,
      outOfStockProducts,
      lowStockProducts,
    ] = await Promise.all([
      this.prismaService.product.count(),
      this.prismaService.product.count({
        where: { productStatus: ProductStatus.ACTIVE },
      }),
      this.prismaService.product.count({
        where: { productStatus: ProductStatus.INACTIVE },
      }),
      this.prismaService.product.count({
        where: { productStatus: ProductStatus.DRAFT },
      }),
      this.prismaService.product.count({
        where: { productStatus: ProductStatus.OUTOFSTOCK },
      }),
      this.prismaService.product.count({
        where: {
          availableQuantity: {
            lt: 10,
            gt: 0, // Optional: Exclude 0 qty if it's considered out-of-stock instead
          },
        },
      }),
    ]);

    return {
      allProducts,
      activeProducts,
      inactiveProducts,
      draftProducts,
      outOfStockProducts,
      lowStockProducts,
    };
  }

  async createCategory(body: { name: string; slug?: string; parentId?: number }) {
    const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, '-');
    return this.prismaService.category.create({
      data: {
        name: body.name,
        slug,
        isActive: true,
        parentId: body.parentId
      },
      include: {
        parent: true,
        children: true
      }
    });
  }

  async createBrand(body: { name: string; slug: string }) {
    return this.prismaService.brand.create({
      data: {
        name: body.name,
        slug: body.slug,
      },
    });
  }
}
