import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async fetchAllOrders(): Promise<any> {
    return this.prismaService.order.findMany();
  }

  async getOrderById(id: number) {
    return this.prismaService.order.findUnique({
      where: { id },
    });
  }

  async createOrder(userId: string, products: { productId: number; quantity: number }[]) {
    return this.prismaService.order.create({
      data: {
        userId: String(userId),
        products: {
          create: products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
          })),
        },
      },
    });
  }
}