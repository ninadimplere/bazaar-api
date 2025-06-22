import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { ProductStatus } from '../enum/product-status.enum';

@ObjectType()
export class Product {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Float)
  markedPrice: number;

  @Field(() => Float)
  displayPrice: number;

  @Field(() => Float)
  discountPercentage: number;

  @Field(() => Int, { nullable: true })
  displayPriority?: number;

  @Field(() => Int, { nullable: true })
  categoryId?: number;

  @Field(() => Int, { nullable: true })
  brandId?: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field()
  sellerId: string;

  @Field()
  slug: string;

  @Field(() => ProductStatus)
  productStatus: ProductStatus;

  @Field(() => Int, { nullable: true })
  availableQuantity?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
