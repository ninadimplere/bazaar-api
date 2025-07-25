import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Product } from '../product/dto/product.model';
import { Category } from '../category/dto/category.entity';
import { CouponTypeEnum, PromotionTypeEnum } from './dto/create-coupon.dto';
import { SpenderType } from '@prisma/client';

@ObjectType()
export class Coupon {
  @Field(() => Int)
  id: number;

  @Field()
  code: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;
  @Field(() => Float)
  discountValue: number;

  @Field()
  validFrom: Date;

  @Field()
  validTo: Date;

  @Field(() => Float, { nullable: true })
  minPurchaseAmount?: number | null;

  @Field(() => Int, { nullable: true })
  maxUsage?: number | null;

  @Field(() => Int)
  usageCount: number;

  @Field(() => Int, { nullable: true })
  perCustomerLimit?: number | null;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  imageUrl?: string;

  // New fields for better differentiation
  @Field(() => Boolean)
  isPromotion: boolean;

  @Field(() => PromotionTypeEnum, { nullable: true })
  promotionType?: PromotionTypeEnum;

  @Field(() => CouponTypeEnum, { nullable: true })
  couponType?: CouponTypeEnum;
  @Field(() => [SpenderType], { nullable: true })
  targetSpenderTypes?: SpenderType[];

  @Field()
  createdBy: string;

  @Field(() => [Product], { nullable: true })
  applicableProducts?: Product[];

  @Field(() => [Category], { nullable: true })
  applicableCategories?: Category[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}