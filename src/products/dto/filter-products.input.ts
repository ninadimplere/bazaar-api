// dto/filter-products.input.ts
import {
  InputType,
  Field,
  Float,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { ProductStatus } from '@prisma/client';

registerEnumType(ProductStatus, { name: 'ProductStatus' });

@InputType()
export class FilterProductsInput {
  @Field({ nullable: true })
  searchString?: string;

  @Field(() => Float, { nullable: true })
  priceMin?: number;

  @Field(() => Float, { nullable: true })
  priceMax?: number;

  @Field(() => ProductStatus, { nullable: true })
  productStatus?: ProductStatus;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  pageSize?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  pageOffset?: number;
}
