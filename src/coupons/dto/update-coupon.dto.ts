import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString, IsEnum, IsArray } from 'class-validator';
import { PromotionTypeEnum, CouponTypeEnum } from './create-coupon.dto';
import { SpenderType } from '@prisma/client';

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
  @IsDateString()
  @IsOptional()
  validFrom?: Date;

  @Field({ nullable: true })
  @IsDateString()
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

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
