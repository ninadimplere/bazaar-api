import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { User } from '../users/users.entity';

@ObjectType()
export class Order {
  @Field(() => Int)
  id: number;

  @Field(() => User)
  user: User; // Embedded user details

  @Field(() => [OrderProduct])
  products: OrderProduct[]; // Embedded product details

  @Field()
  sellerId: number;

  @Field(() => Float)
  totalPrice: number; // Total price of the order

  @Field()
  orderStatus: string;

  @Field()
  paymentStatus: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class OrderProduct {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  quantity: number;
}