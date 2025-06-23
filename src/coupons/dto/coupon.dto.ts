import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsDate, IsEnum } from 'class-validator';

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
  discountType: string;

  @Field()
  @IsDate()
  validFrom: Date;

  @Field()
  @IsDate()
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
  promotionType?: string;

  @Field({ nullable: true })
  @IsEnum(TargetAudience)
  @IsOptional()
  targetAudience?: string;

  @Field()
  @IsString()
  createdBy: string;
}

@InputType()
export class UpdateCouponInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  code?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  discountValue?: number;

  @Field({ nullable: true })
  @IsEnum(DiscountType)
  @IsOptional()
  discountType?: string;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  validFrom?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  validTo?: Date;

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
  promotionType?: string;

  @Field({ nullable: true })
  @IsEnum(TargetAudience)
  @IsOptional()
  targetAudience?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

@InputType()
export class FilterCouponInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  searchQuery?: string;

  @Field({ nullable: true })
  @IsEnum(PromotionType)
  @IsOptional()
  promotionType?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  sellerId?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  productId?: number;

  @Field(() => Int, { defaultValue: 0 })
  @IsNumber()
  @IsOptional()
  skip?: number;

  @Field(() => Int, { defaultValue: 10 })
  @IsNumber()
  @IsOptional()
  take?: number;
}
