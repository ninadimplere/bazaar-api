import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Product } from '../product/dto/product.model';
import { Category } from '../category/dto/category.entity';

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
  discountType: string; // 'PERCENTAGE' or 'FIXED'

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

  @Field({ nullable: true })
  promotionType?: string;

  @Field({ nullable: true })
  targetAudience?: string;

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