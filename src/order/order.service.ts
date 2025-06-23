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
    });  }  async getOrderById(id: number) {
    return this.prismaService.order.findUnique({
      where: { id: id },
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
      active: await this.prismaService.order.count(),
      return: await this.prismaService.returnRequest.count(),
      cancel: await this.prismaService.cancelRequest.count()
    };
  }

  // Create a return request for an order
  async createReturnRequest(orderId: number, reason: string, returnRequestReason: string) {
    // First check if the order exists and is in a valid status for return
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    // Only allow returns for delivered orders
    if (order.orderStatus !== 'DELIVERED') {
      throw new Error(`Order must be in DELIVERED status to request a return. Current status: ${order.orderStatus}`);
    }

    // Create the return request
    const returnRequest = await this.prismaService.returnRequest.create({
      data: {
        order: { connect: { id: orderId } },
        reason,
        returnRequestReason,
        status: 'PENDING',
      },
    });

    // Update the order status
    await this.prismaService.order.update({
      where: { id: orderId },
      data: { orderStatus: 'RETURNED' },
    });

    return returnRequest;
  }

  // Create a cancellation request for an order
  async createCancelRequest(orderId: number, reason: string, cancelRequestReason: string) {
    // First check if the order exists and is in a valid status for cancellation
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    // Only allow cancellations for pending or processing orders
    if (order.orderStatus !== 'PENDING' && order.orderStatus !== 'PROCESSING') {
      throw new Error(
        `Order must be in PENDING or PROCESSING status to request cancellation. Current status: ${order.orderStatus}`
      );
    }

    // Create the cancel request
    const cancelRequest = await this.prismaService.cancelRequest.create({
      data: {
        order: { connect: { id: orderId } },
        reason,
        cancelRequestReason,
        status: 'PENDING',
      },
    });

    // Update the order status
    await this.prismaService.order.update({
      where: { id: orderId },
      data: { orderStatus: 'CANCELLED' },
    });

    return cancelRequest;
  }

  // Get return requests for an order
  async getReturnRequests(orderId: number) {
    return this.prismaService.returnRequest.findMany({
      where: { orderId },
    });
  }

  // Get cancel requests for an order
  async getCancelRequests(orderId: number) {
    return this.prismaService.cancelRequest.findMany({
      where: { orderId },
    });
  }

  // Get return requests for a seller
  async getSellerReturnRequests(sellerId: string) {
    // First get all orders associated with this seller
    const sellerOrders = await this.prismaService.sellerOrder.findMany({
      where: { sellerId },
      select: { orderId: true },
    });

    // Extract the order IDs
    const orderIds = sellerOrders.map(order => order.orderId);

    // Now get all return requests for these orders
    return this.prismaService.returnRequest.findMany({
      where: { 
        orderId: { in: orderIds } 
      },
      include: {
        order: {
          include: {
            user: {
              include: {
                UserProfile: true,
                addresses: true
              }
            },
            products: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });
  }

  // Get cancel requests for a seller
  async getSellerCancelRequests(sellerId: string) {
    // First get all orders associated with this seller
    const sellerOrders = await this.prismaService.sellerOrder.findMany({
      where: { sellerId },
      select: { orderId: true },
    });

    // Extract the order IDs
    const orderIds = sellerOrders.map(order => order.orderId);

    // Now get all cancel requests for these orders
    return this.prismaService.cancelRequest.findMany({
      where: { 
        orderId: { in: orderIds } 
      },
      include: {
        order: {
          include: {
            user: {
              include: {
                UserProfile: true,
                addresses: true
              }
            },
            products: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });
  }
}