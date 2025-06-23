import { Field, ObjectType } from '@nestjs/graphql';
import { Coupon } from '../coupons.entity';

@ObjectType()
export class ValidateCouponOutput {
  @Field()
  valid: boolean;

  @Field(() => Coupon, { nullable: true })
  coupon?: Coupon;

  @Field({ nullable: true })
  message?: string;
}
