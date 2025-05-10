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
    const { title, description, price, category } = createProductDto;
    return this.prismaService.product.create({
      data: {
        title,
        description,
        price: parseFloat(price), // Ensure price is cast to a float
        category,
        sellerId: 1, // Dummy sellerId
      },
    });
  }
}