import { ObjectType, Field } from '@nestjs/graphql';
import { Product } from './product.model';

@ObjectType()
export class ProductResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => Product, { nullable: true })
  data?: Product;
}

@ObjectType()
export class ProductListResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => [Product], { nullable: true })
  data?: Product[];
}
