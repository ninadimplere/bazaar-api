import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async fetchAllProducts(): Promise<any> {
    return this.prismaService.product.findMany();
  }

  async getProductById(id: number) {
    return this.prismaService.product.findUnique({
      where: { id: Number(id) }, // Ensure id is parsed as a number
    });
  }

  async createProduct(createProductDto: CreateProductDto) {
    const { title, description, markedPrice, displayPrice, discountPercentage, category, slug, sellerId } = createProductDto;
  
    // Validate category
    const existingCategory = await this.prismaService.category.findUnique({
      where: { slug: category },
    });
  
    if (!existingCategory) {
      throw new Error(`Category with slug "${category}" not found`);
    }
  
    // Validate seller
    const existingSeller = await this.prismaService.seller.findUnique({
      where: { id: sellerId },
    });
  
    if (!existingSeller) {
      throw new Error(`Seller with ID "${sellerId}" not found`);
    }
  
    return this.prismaService.product.create({
      data: {
        title,
        description,
        markedPrice,
        displayPrice,
        discountPercentage,
        slug,
        category: {
          connect: { id: existingCategory.id },
        },
        sellerId,
      },
    });
  }
}