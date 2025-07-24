import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { CouponTypeEnum, PromotionTypeEnum } from './create-coupon.dto';
import { SpenderType } from '@prisma/client';

@InputType()
export class FilterCouponInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  searchQuery?: string;

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

  @Field(() => SpenderType, { nullable: true })
  @IsEnum(SpenderType)
  @IsOptional()
  spenderType?: SpenderType;

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
