import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { Coupon } from './coupons.entity';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  async getAllCoupons(): Promise<Coupon[]> {
    return this.couponsService.getAllCoupons();
  }

  @Get(':id')
  async getCouponById(@Param('id') id: string): Promise<Coupon> {
    return this.couponsService.getCouponById(Number(id));
  }

  @Post()
  async createCoupon(
    @Body('code') code: string,
    @Body('discountValue') discountValue: number,
    @Body('discountType') discountType: string,
    @Body('validFrom') validFrom: Date,
    @Body('validTo') validTo: Date,
    @Body('createdBy') createdBy: string, // Add userId as a parameter
  ): Promise<Coupon> {
    return this.couponsService.createCoupon(code, discountValue, discountType, validFrom, validTo, createdBy);
  }

  @Put(':id')
  async updateCoupon(
    @Param('id') id: string,
    @Body() updateData: Partial<Coupon>,
  ): Promise<Coupon> {
    return this.couponsService.updateCoupon(Number(id), updateData);
  }

  @Delete(':id')
  async deleteCoupon(@Param('id') id: string): Promise<void> {
    return this.couponsService.deleteCoupon(Number(id));
  }
}