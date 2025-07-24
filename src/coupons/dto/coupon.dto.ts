import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsDate, IsEnum } from 'class-validator';

// These enums are now deprecated and should not be used in new code
// Use the enums from create-coupon.dto.ts instead
export enum PromotionType {
  COUPON = 'COUPON',
  SALE = 'SALE',
  SPECIAL_OFFER = 'SPECIAL_OFFER',
  FLASH_SALE = 'FLASH_SALE',
  BUNDLE = 'BUNDLE',
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
