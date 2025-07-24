import { Resolver, Query, Mutation, Args, InputType, Field, Int, Float } from '@nestjs/graphql';
import { CouponsService } from './coupons.service';
import { Coupon } from './coupons.entity';
import { CreateCouponInput } from './dto/create-coupon.dto';
import { UpdateCouponInput } from './dto/update-coupon.dto';
import { FilterCouponInput } from './dto/filter-coupon.dto';
import { ValidateCouponOutput } from './dto/validate-coupon.dto';
import { SpenderType } from '@prisma/client';

@Resolver(() => Coupon)
export class CouponsResolver {
  constructor(private readonly couponsService: CouponsService) {}

  @Query(() => [Coupon])
  async coupons(
    @Args('filter', { nullable: true }) filter?: FilterCouponInput
  ): Promise<Coupon[]> {
    return this.couponsService.getAllCoupons(filter);
  }

  @Query(() => Coupon)
  async coupon(@Args('id') id: string): Promise<Coupon> {
    return this.couponsService.getCouponById(Number(id));
  }

  @Query(() => [Coupon])
  async couponsBySeller(
    @Args('sellerId') sellerId: string
  ): Promise<Coupon[]> {
    return this.couponsService.getCouponsBySeller(sellerId);
  }

  @Query(() => [Coupon])
  async couponsForProduct(
    @Args('productId', { type: () => Int }) productId: number
  ): Promise<Coupon[]> {
    return this.couponsService.getCouponsForProduct(productId);
  }

  @Query(() => [Coupon])
  async couponsForCategory(
    @Args('categoryId', { type: () => Int }) categoryId: number
  ): Promise<Coupon[]> {
    return this.couponsService.getCouponsForCategory(categoryId);
  }
  @Mutation(() => Coupon)
  async createCoupon(
    @Args('input') createCouponInput: CreateCouponInput
  ): Promise<Coupon> {
    return this.couponsService.createCoupon(createCouponInput);
  }

  @Mutation(() => Coupon)
  async updateCoupon(
    @Args('id') id: string,
    @Args('input') updateCouponInput: UpdateCouponInput
  ): Promise<Coupon> {
    return this.couponsService.updateCoupon(Number(id), updateCouponInput);
  }

  @Mutation(() => Boolean)
  async deleteCoupon(@Args('id') id: string): Promise<boolean> {
    await this.couponsService.deleteCoupon(Number(id));
    return true;
  }

  @Mutation(() => Coupon)
  async toggleCouponStatus(
    @Args('id') id: string,
    @Args('isActive') isActive: boolean
  ): Promise<Coupon> {
    return this.couponsService.toggleCouponStatus(Number(id), isActive);
  }
  @Mutation(() => ValidateCouponOutput)
  async validateCoupon(
    @Args('code') code: string,
    @Args('userId') userId: string,
    @Args('cartTotal', { type: () => Float }) cartTotal: number
  ): Promise<ValidateCouponOutput> {
    return this.couponsService.validateCoupon(code, userId, cartTotal);
  }

  @Mutation(() => Boolean)
  async applyCouponToOrder(
    @Args('couponId', { type: () => Int }) couponId: number,
    @Args('orderId', { type: () => Int }) orderId: number
  ): Promise<boolean> {
    await this.couponsService.applyCouponToOrder(couponId, orderId);
    return true;
  }

  @Query(() => [Coupon])
  async couponsForUserSpenderType(
    @Args('userId') userId: string
  ): Promise<Coupon[]> {
    return this.couponsService.getCouponsForUserSpenderType(userId);
  }

  @Query(() => [Coupon])
  async couponsBySpenderType(
    @Args('spenderType', { type: () => String }) spenderType: SpenderType
  ): Promise<Coupon[]> {
    return this.couponsService.getCouponsBySpenderType(spenderType);
  }
}