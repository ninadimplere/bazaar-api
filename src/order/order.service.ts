import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async fetchAllOrders(): Promise<any> {
    return this.prismaService.order.findMany({
      include: {
        user: true, // Include user details
        seller: true, // Include seller details
        products: {
          include: {
            product: true, // Include product details
          },
        },
        coupons: true, // Include coupon details if needed
        returnRequests: true, // Include return request details if needed
      },
    });
  }

  async getOrderById(id: number) {
    return this.prismaService.order.findUnique({
      where: { id },
      select: {
        id: true,
        user: true,
        seller: true, // Include seller details
        products: true,
        totalPrice: true,
        orderStatus: true,
        paymentStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createOrder(user: { id: string; email: string }, seller: { id: number }, products: any[], totalPrice: number) {
    return this.prismaService.order.create({
      data: {
        user: {
          connect: { id: user.id }, // Use Prisma's nested writes to associate the User object
        },
        seller: {
          connect: { id: seller.id },
        },
        products: {
          create: products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
          })),
        },
        totalPrice,
        orderStatus: 'PENDING',
        paymentStatus: 'PENDING',
      },
    });
  }

  async updateOrderStatus(orderId: number, status: OrderStatus) {
    return this.prismaService.order.update({
      where: { id: orderId },
      data: { orderStatus: status },
    });
  }

  async fetchOrdersWithFilters(filters: any, pagination: { skip: number; take: number }) {
    const { orderStatus, dateRange, paymentStatus } = filters;

    return this.prismaService.order.findMany({
      where: {
        orderStatus: orderStatus ? orderStatus.toUpperCase() : undefined, // Ensure enum compatibility
        paymentStatus: paymentStatus ? paymentStatus.toUpperCase() : undefined, // Ensure enum compatibility
        createdAt: dateRange
          ? {
              gte: dateRange.start,
              lte: dateRange.end,
            }
          : undefined,
      },
      skip: pagination.skip,
      take: pagination.take,
    });
  }

  async getOrderCounts() {
    return {
      total: await this.prismaService.order.count(),
      pending: await this.prismaService.order.count({ where: { orderStatus: 'PENDING' } }),
      shipped: await this.prismaService.order.count({ where: { orderStatus: 'SHIPPED' } }),
      delivered: await this.prismaService.order.count({ where: { orderStatus: 'DELIVERED' } }),
      cancelled: await this.prismaService.order.count({ where: { orderStatus: 'CANCELLED' } }),
      refunded: await this.prismaService.order.count({ where: { orderStatus: 'REFUNDED' } }),
      processing: await this.prismaService.order.count({ where: { orderStatus: 'PROCESSING' } }),
      failed: await this.prismaService.order.count({ where: { orderStatus: 'FAILED' } }),
    };
  }
}