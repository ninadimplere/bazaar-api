import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getAllOrders() {
    return this.orderService.fetchAllOrders();
  }

  @Get('counts')
  getOrderCounts() {
    return this.orderService.getOrderCounts();
  }

  @Get(':id')
async getOrderById(@Param('id') id: string) {
  return this.orderService.getOrderById(Number(id)); // Convert id to a number
}
  @Post()
  async createOrder(@Body() body: { 
    user: { id: string; email: string }; 
    seller: { id: string }; 
    products: Array<{ 
      productId: number; 
      quantity: number; 
      price: number; 
    }>; 
    totalPrice: number;
  }) {
    return this.orderService.createOrder(body.user, body.seller, body.products, body.totalPrice);
  } 
  
  @Post('status')
  async updateOrderStatus(
    @Body() body: { ids: number[]; status: OrderStatus }
  ) {
    // Use the bulk update method for better performance
    const results = await this.orderService.updateMultipleOrderStatuses(body.ids, body.status);
    return { 
      success: true, 
      updatedCount: results.length,
      ids: body.ids 
    };
  }

  @Get('filtered')
  async getOrdersWithFilters(
    @Query('status') status?: string,
    @Query('paymentStatus') paymentStatus: PaymentStatus = 'PENDING',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    const filters = {
      status,
      paymentStatus,
      dateRange: startDate && endDate ? { start: new Date(startDate), end: new Date(endDate) } : undefined,
    };

    return this.orderService.fetchOrdersWithFilters(filters, { skip: Number(skip), take: Number(take) });
  }

  // Return request endpoints
  @Post(':id/return')
  async createReturnRequest(
    @Param('id') id: string,
    @Body() body: { reason: string; returnRequestReason: string }
  ) {
    return this.orderService.createReturnRequest(
      Number(id),
      body.reason,
      body.returnRequestReason
    );
  }

  @Get(':id/return')
  async getReturnRequests(@Param('id') id: string) {
    return this.orderService.getReturnRequests(Number(id));
  }

  // Cancel request endpoints
  @Post(':id/cancel')
  async createCancelRequest(
    @Param('id') id: string,
    @Body() body: { reason: string; cancelRequestReason: string }
  ) {
    return this.orderService.createCancelRequest(
      Number(id),
      body.reason,
      body.cancelRequestReason
    );
  }

  @Get(':id/cancel')
  async getCancelRequests(@Param('id') id: string) {
    return this.orderService.getCancelRequests(Number(id));
  }

  // Seller-specific return and cancel requests
  @Get('seller/:sellerId/returns')
  async getSellerReturnRequests(@Param('sellerId') sellerId: string) {
    return this.orderService.getSellerReturnRequests(sellerId);
  }

  @Get('seller/:sellerId/cancellations')
  async getSellerCancelRequests(@Param('sellerId') sellerId: string) {
    return this.orderService.getSellerCancelRequests(sellerId);
  }
}