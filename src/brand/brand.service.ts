import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllBrands(categorySlug?: string, featured?: boolean) {
    const brands = await this.prisma.brand.findMany({
      where: categorySlug
        ? {
            brandCategories: {
              some: {
                category: { slug: categorySlug },
                ...(featured !== undefined && { featured }),
              },
            },
          }
        : {},
      include: {
        brandCategories: { include: { category: true } },
      },
    });

    return brands.map((brand) => ({
      ...brand,
      categories: brand.brandCategories.map((bc) => bc.category),
    }));
  }

  async getBrandBySlug(slug: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { slug },
      include: {
        products: true,
        brandCategories: { include: { category: true } },
      },
    });

    if (!brand) return null;

    return {
      ...brand,
      categories: brand.brandCategories.map((bc) => bc.category),
    };
  }

  async getBrandCategories(brandId: number) {
    return this.prisma.brandCategory.findMany({
      where: { brandId },
      include: { category: true },
    });
  }

  async getBrandProducts(brandId: number) {
    return this.prisma.product.findMany({ where: { brandId } });
  }

  async createBrand(data: {
    name: string;
    slug: string;
    logoUrl?: string;
    categoryIds?: number[];
    featuredCategories?: { categoryId: number; featured: boolean }[];
  }) {
    const brand = await this.prisma.brand.create({
      data: {
        name: data.name,
        slug: data.slug,
        logoUrl: data.logoUrl,
        brandCategories: {
          create: data.featuredCategories
            ? data.featuredCategories.map((fc) => ({
                categoryId: fc.categoryId,
                featured: fc.featured,
              }))
            : data.categoryIds?.map((id) => ({ categoryId: id })) || [],
        },
      },
      include: {
        brandCategories: { include: { category: true } },
      },
    });

    return {
      ...brand,
      categories: brand.brandCategories.map((bc) => bc.category),
    };
  }

  async updateBrand(
    id: number,
    data: {
      name?: string;
      slug?: string;
      logoUrl?: string;
    },
  ) {
    return this.prisma.brand.update({
      where: { id },
      data,
    });
  }

  async updateBrandStatus(id: number, isActive: boolean) {
    return this.prisma.brand.update({
      where: { id },
      data: { isActive },
    });
  }

  async deleteBrand(id: number) {
    return this.prisma.brand.delete({
      where: { id },
    });
  }
}
