import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsDateString, IsEnum } from 'class-validator';

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export enum PromotionType {
  COUPON = 'COUPON',
  SALE = 'SALE',
  SPECIAL_OFFER = 'SPECIAL_OFFER',
  FLASH_SALE = 'FLASH_SALE',
  BUNDLE = 'BUNDLE',
}

export enum TargetAudience {
  ALL = 'ALL',
  NEW_CUSTOMERS = 'NEW_CUSTOMERS',
  RETURNING_CUSTOMERS = 'RETURNING_CUSTOMERS',
  VIP = 'VIP',
}

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
  @IsEnum(DiscountType)
  discountType: DiscountType;

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

  @Field({ nullable: true })
  @IsEnum(PromotionType)
  @IsOptional()
  promotionType?: PromotionType;

  @Field({ nullable: true })
  @IsEnum(TargetAudience)
  @IsOptional()
  targetAudience?: TargetAudience;

  @Field()
  @IsString()
  createdBy: string;
}
