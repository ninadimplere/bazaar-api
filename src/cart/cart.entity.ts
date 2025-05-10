import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Cart {
  @Field(() => Int)
  id: number;

  @Field()
  userId: string;

  @Field(() => [CartProduct], { nullable: true })
  products?: CartProduct[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class CartProduct {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  cartId: number;

  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  quantity: number;
}