import { Controller, Get, Post, Put, Delete, Body, Param, Query, BadRequestException } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { Coupon } from './coupons.entity';
import { CreateCouponInput } from './dto/create-coupon.dto';
import { UpdateCouponInput } from './dto/update-coupon.dto';
import { FilterCouponInput } from './dto/filter-coupon.dto';
import { ValidateCouponOutput } from './dto/validate-coupon.dto';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  async getAllCoupons(@Query() filter?: FilterCouponInput): Promise<Coupon[]> {
    return this.couponsService.getAllCoupons(filter);
  }

  @Get(':id')
  async getCouponById(@Param('id') id: string): Promise<Coupon> {
    return this.couponsService.getCouponById(Number(id));
  }

  @Get('seller/:sellerId')
  async getCouponsBySeller(@Param('sellerId') sellerId: string): Promise<Coupon[]> {
    return this.couponsService.getCouponsBySeller(sellerId);
  }

  @Get('product/:productId')
  async getCouponsForProduct(@Param('productId') productId: string): Promise<Coupon[]> {
    return this.couponsService.getCouponsForProduct(Number(productId));
  }

  @Get('category/:categoryId')
  async getCouponsForCategory(@Param('categoryId') categoryId: string): Promise<Coupon[]> {
    return this.couponsService.getCouponsForCategory(Number(categoryId));
  }
  @Post()
  async createCoupon(@Body() createCouponInput: CreateCouponInput): Promise<Coupon> {
    return this.couponsService.createCoupon(createCouponInput);
  }

  @Put(':id')
  async updateCoupon(
    @Param('id') id: string,
    @Body() updateCouponInput: UpdateCouponInput,
  ): Promise<Coupon> {
    return this.couponsService.updateCoupon(Number(id), updateCouponInput);
  }

  @Delete(':id')
  async deleteCoupon(@Param('id') id: string): Promise<void> {
    return this.couponsService.deleteCoupon(Number(id));
  }

  @Put(':id/status')
  async toggleCouponStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ): Promise<Coupon> {
    return this.couponsService.toggleCouponStatus(Number(id), isActive);
  }
  @Post('validate')
  async validateCoupon(
    @Body('code') code: string,
    @Body('userId') userId: string,
    @Body('cartTotal') cartTotal: number,
  ): Promise<ValidateCouponOutput> {
    if (!code || !userId || cartTotal === undefined) {
      throw new BadRequestException('Missing required parameters');
    }
    return this.couponsService.validateCoupon(code, userId, cartTotal);
  }

  @Post(':couponId/apply/:orderId')
  async applyCouponToOrder(
    @Param('couponId') couponId: string,
    @Param('orderId') orderId: string,
  ): Promise<void> {
    await this.couponsService.applyCouponToOrder(Number(couponId), Number(orderId));
  }
}