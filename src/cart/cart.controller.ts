import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getAllCarts() {
    return this.cartService.fetchAllCarts();
  }

  @Get(':id')
  async getCartById(@Param('id') id: number) {
    return this.cartService.getCartById(id);
  }

  @Post()
  async createCart(@Body() createCartDto: any) {
    return this.cartService.createCart(createCartDto);
  }

  @Get(':userId')
  async getCartByUserId(@Param('userId') userId: string) {
    return this.cartService.fetchCartByUserId(userId);
  }

  @Post('add')
  async addToCart(@Body() body: { userId: string; productId: number; quantity: number }) {
    return this.cartService.addToCart(body.userId, body.productId, body.quantity);
  }
}