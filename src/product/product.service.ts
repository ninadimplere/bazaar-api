import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateProductInput, UpdateProductInput } from './dto/product.input';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(data: CreateProductInput) {
    const product = await this.prisma.product.create({
      data: {
        ...data,
        discountPercentage: data.markedPrice
          ? 100 * ((data.markedPrice - data.displayPrice) / data.markedPrice)
          : 0,
        productStatus: ProductStatus.DRAFT,
      },
    });

    return {
      success: true,
      message: 'Product created successfully',
      data: product,
    };
  }

  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      return { success: false, message: 'Product not found', data: null };
    }

    return { success: true, message: 'Product found', data: product };
  }

  async fetchAllProducts(filters: {
    categoryId?: number;
    brandId?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) {
    const { categoryId, brandId, minPrice, maxPrice, search } = filters;

    const products = await this.prisma.product.findMany({
      where: {
        productStatus: ProductStatus.ACTIVE,
        ...(categoryId && { categoryId }),
        ...(brandId && { brandId }),
        ...(minPrice !== undefined || maxPrice !== undefined
          ? {
              displayPrice: {
                ...(minPrice !== undefined && { gte: minPrice }),
                ...(maxPrice !== undefined && { lte: maxPrice }),
              },
            }
          : {}),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        reviews: true,
      },
    });

    return {
      success: true,
      message: 'Products fetched with filters',
      data: products,
    };
  }

  async updateProduct(id: number, data: UpdateProductInput) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      return { success: false, message: 'Product not found', data: null };
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data,
    });

    return {
      success: true,
      message: 'Product updated successfully',
      data: updated,
    };
  }

  async countProducts(filters: {
    categoryId?: number;
    brandId?: number;
    productStatus?: ProductStatus;
    sellerId?: string;
  }) {
    const { categoryId, brandId, productStatus, sellerId } = filters;

    const count = await this.prisma.product.count({
      where: {
        ...(categoryId && { categoryId }),
        ...(brandId && { brandId }),
        ...(productStatus && { productStatus }),
        ...(sellerId && { sellerId }),
      },
    });

    return {
      success: true,
      message: 'Product count fetched successfully',
      count,
    };
  }
}
