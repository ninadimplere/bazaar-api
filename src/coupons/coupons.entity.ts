import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Coupon {
  @Field(() => Int)
  id: number;

  @Field()
  code: string;

  @Field(() => Float)
  discountValue: number;

  @Field()
  discountType: string; // 'PERCENTAGE' or 'FIXED'

  @Field({ nullable: true })
  expirationDate?: Date;

  @Field(() => Float, { nullable: true })
  minPurchaseAmount?: number | null; // Allow null values

  @Field(() => Int, { nullable: true })
  maxUsage?: number | null; // Allow null values

  @Field(() => Int, { nullable: true })
  perCustomerLimit?: number | null; // Allow null values

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}