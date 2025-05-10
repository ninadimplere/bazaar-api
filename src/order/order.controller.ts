import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getAllOrders() {
    return this.orderService.fetchAllOrders();
  }

  @Get(':id')
  async getOrderById(@Param('id') id: number) {
    return this.orderService.getOrderById(id);
  }

  @Post()
  async createOrder(@Body() body: { userId: string; products: { productId: number; quantity: number }[] }) {
    return this.orderService.createOrder(body.userId, body.products);
  }
}