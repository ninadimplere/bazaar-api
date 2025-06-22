import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { ProductStatus } from '../enum/product-status.enum';

@InputType()
export class CreateProductInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Float)
  markedPrice: number;

  @Field(() => Float)
  displayPrice: number;

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

  @Field(() => Int, { nullable: true })
  availableQuantity?: number;
}

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  markedPrice?: number;

  @Field(() => Float, { nullable: true })
  displayPrice?: number;

  @Field(() => Float, { nullable: true })
  discountPercentage?: number;

  @Field(() => Int, { nullable: true })
  displayPriority?: number;

  @Field(() => Int, { nullable: true })
  categoryId?: number;

  @Field(() => Int, { nullable: true })
  brandId?: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => ProductStatus, { nullable: true })
  productStatus?: ProductStatus;

  @Field(() => Int, { nullable: true })
  availableQuantity?: number;
}
