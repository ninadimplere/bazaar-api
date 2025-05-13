import { Resolver, Query, Mutation, Args, InputType, Field, Int, Float } from '@nestjs/graphql';
import { CouponsService } from './coupons.service';
import { Coupon } from './coupons.entity';

@InputType()
class UpdateCouponInput {
  @Field({ nullable: true })
  code?: string;

  @Field(() => Float, { nullable: true })
  discountValue?: number;

  @Field({ nullable: true })
  discountType?: string;

  @Field({ nullable: true })
  validFrom?: Date;

  @Field({ nullable: true })
  validTo?: Date;

  @Field(() => Float, { nullable: true })
  minPurchaseAmount?: number;

  @Field(() => Int, { nullable: true })
  maxUsage?: number;

  @Field(() => Int, { nullable: true })
  perCustomerLimit?: number;
}

@Resolver(() => Coupon)
export class CouponsResolver {
  constructor(private readonly couponsService: CouponsService) {}

  @Query(() => [Coupon])
  async coupons(): Promise<Coupon[]> {
    return this.couponsService.getAllCoupons();
  }

  @Query(() => Coupon)
  async coupon(@Args('id') id: string): Promise<Coupon> {
    return this.couponsService.getCouponById(Number(id));
  }

  @Mutation(() => Coupon)
async createCoupon(
  @Args('code') code: string,
  @Args('discountValue') discountValue: number,
  @Args('discountType') discountType: string,
  @Args('validFrom') validFrom: Date,
  @Args('validTo') validTo: Date,
  @Args('userId') userId: string, // Add userId as an argument
): Promise<Coupon> {
  return this.couponsService.createCoupon(code, discountValue, discountType, validFrom, validTo, userId);
}

  @Mutation(() => Coupon)
  async updateCoupon(
    @Args('id') id: string,
    @Args('updateData') updateData: UpdateCouponInput,
  ): Promise<Coupon> {
    return this.couponsService.updateCoupon(Number(id), updateData);
  }

  @Mutation(() => Boolean)
  async deleteCoupon(@Args('id') id: string): Promise<boolean> {
    await this.couponsService.deleteCoupon(Number(id));
    return true;
  }
}