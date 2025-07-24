import { InputType, Field, Int, Float, registerEnumType } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsDateString, IsEnum } from 'class-validator';
import { SpenderType } from '@prisma/client';

// Updated to match Prisma schema PromotionType enum
export enum PromotionTypeEnum {
  PERCENTAGE_DISCOUNT = 'PERCENTAGE_DISCOUNT',
  FLASH_SALE = 'FLASH_SALE',
  COUPON_BASED = 'COUPON_BASED',
  BOGO = 'BOGO',
  FREE_SHIPPING = 'FREE_SHIPPING',
  FLAT_DISCOUNT = 'FLAT_DISCOUNT',
}

// Updated to match Prisma schema CouponType enum
export enum CouponTypeEnum {
  PERCENTAGE_DISCOUNT = 'PERCENTAGE_DISCOUNT',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE_SHIPPING = 'FREE_SHIPPING',
  MINIMUM_PURCHASE_DISCOUNT = 'MINIMUM_PURCHASE_DISCOUNT',
  LIMITED_TIME_DISCOUNT = 'LIMITED_TIME_DISCOUNT',
  BULK_PURCHASE_DISCOUNT = 'BULK_PURCHASE_DISCOUNT',
}

// Register the enums for GraphQL
registerEnumType(PromotionTypeEnum, { name: 'PromotionTypeEnum' });
registerEnumType(CouponTypeEnum, { name: 'CouponTypeEnum' });
registerEnumType(SpenderType, { name: 'SpenderType' });

@InputType()
export class CreateCouponInput {
  @Field()
  @IsString()
  code: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;
  @Field(() => Float)
  @IsNumber()
  discountValue: number;

  @Field()
  @IsDateString()
  validFrom: Date;

  @Field()
  @IsDateString()
  validTo: Date;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  minPurchaseAmount?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  maxUsage?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  perCustomerLimit?: number;

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsOptional()
  applicableProductIds?: number[];

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsOptional()
  applicableCategoryIds?: number[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  // New fields for better differentiation
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isPromotion?: boolean;

  @Field(() => PromotionTypeEnum, { nullable: true })
  @IsEnum(PromotionTypeEnum)
  @IsOptional()
  promotionType?: PromotionTypeEnum;

  @Field(() => CouponTypeEnum, { nullable: true })
  @IsEnum(CouponTypeEnum)
  @IsOptional()
  couponType?: CouponTypeEnum;
  @Field(() => [SpenderType], { nullable: true })
  @IsArray()
  @IsOptional()
  targetSpenderTypes?: SpenderType[];

  @Field()
  @IsString()
  createdBy: string;
}
