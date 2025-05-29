import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}  async fetchAllOrders(): Promise<any> {
    return this.prismaService.order.findMany({
      include: {
        user: {
          include: {
            UserProfile: true,
            addresses: true
          }
        },
        products: {
          include: {
            product: true,
            SellerOrder: true,
          },
        },
        SellerOrder: {
          include: {
            seller: true,
          },
        },
        coupons: true,
        returnRequests: true,
        cancelRequests: true,
      },
    });
  }  async getOrderById(id: number) {
    return this.prismaService.order.findUnique({
      where: { id },      include: {
        user: {
          include: {
            UserProfile: true,
            addresses: true
          }
        },
        products: {
          include: {
            product: true,
            SellerOrder: true,
          },
        },
        SellerOrder: {
          include: {
            seller: true,
          },
        },
        coupons: true,
        returnRequests: true,
        cancelRequests: true,
      },
    });
  }
  async createOrder(user: { id: string; email: string }, seller: { id: string }, products: any[], totalPrice: number) {
    // Create the main order
    const order = await this.prismaService.order.create({
      data: {
        user: {
          connect: { id: user.id },
        },
        products: {
          create: products.map((product) => ({
            product: { connect: { id: product.productId } },
            quantity: product.quantity,
            price: product.price,
          })),
        },
        totalPrice,
        orderStatus: 'PENDING',
        paymentStatus: 'PENDING',
        shippingCharges: 0, // Add default shipping charges
        // Create corresponding seller order
        SellerOrder: {
          create: {
            sellerId: seller.id,
            status: 'PENDING',
            sellerNote: '',
          }
        }
      },
      include: {
        user: true,
        products: {
          include: {
            product: true
          }
        },
        SellerOrder: true
      }
    });
  }

  async updateOrderStatus(orderId: number, status: OrderStatus) {
    return this.prismaService.order.update({
      where: { id: orderId },
      data: { orderStatus: status },
    });
  }

  // Add new method for bulk order status updates
  async updateMultipleOrderStatuses(orderIds: number[], status: OrderStatus) {
    // Use Prisma transaction to ensure all updates succeed or none do
    return this.prismaService.$transaction(
      orderIds.map(id => 
        this.prismaService.order.update({
          where: { id },
          data: { orderStatus: status },
        })
      )
    );
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