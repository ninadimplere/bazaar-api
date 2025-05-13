import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Coupon } from './coupons.entity';

@Injectable()
export class CouponsService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Create a new coupon
   */
  async createCoupon(
    code: string,
    discountValue: number,
    discountType: string,
    validFrom: Date,
    validTo: Date,
    createdBy: string, // Add userId as a parameter
  ): Promise<Coupon> {
    return this.prismaService.coupon.create({
      data: {
        code,
        discountValue,
        discountType,
        validFrom,
        validTo,
        createdBy,
      },
    });
  }

  /**
   * Get a coupon by its ID
   */
  async getCouponById(id: number): Promise<Coupon> {
    const coupon = await this.prismaService.coupon.findUnique({
      where: { id },
    });
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
    return coupon;
  }

  /**
   * Get all coupons
   */
  async getAllCoupons(): Promise<Coupon[]> {
    return this.prismaService.coupon.findMany();
  }

  /**
   * Update a coupon
   */
  async updateCoupon(id: number, updateData: Partial<Coupon>): Promise<Coupon> {
    const coupon = await this.getCouponById(id);
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
    return this.prismaService.coupon.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Delete a coupon
   */
  async deleteCoupon(id: number): Promise<void> {
    const coupon = await this.getCouponById(id);
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
    await this.prismaService.coupon.delete({
      where: { id },
    });
  }
}