import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { PromotionType } from './create-coupon.dto';

@InputType()
export class FilterCouponInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  searchQuery?: string;

  @Field({ nullable: true })
  @IsEnum(PromotionType)
  @IsOptional()
  promotionType?: PromotionType;

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
