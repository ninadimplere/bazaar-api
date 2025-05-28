import { Resolver, Query, Args, Int, Float, Mutation } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './order.entity';

import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
class UserInput {
  @Field()
  id: string;

  @Field()
  email: string;
}

@InputType()
class OrderProductInput {
  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}

@ObjectType()
class OrderProduct {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  orderId: number;

  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;

  @Field(() => Int, { nullable: true })
  sellerOrderId?: number;
}

@InputType()
class SellerInput {
  @Field()
  id: string;
}

@Resolver(() => Order)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Query(() => [Order])
  async orders() {
    return this.orderService.fetchAllOrders();
  }

  @Query(() => Order)
  async order(@Args('id', { type: () => Int }) id: number) {
    return this.orderService.getOrderById(id);
  }
  @Mutation(() => Order)
  async createOrder(
    @Args('user', { type: () => UserInput }) user: UserInput,
    @Args('seller', { type: () => SellerInput }) seller: SellerInput,
    @Args('products', { type: () => [OrderProductInput] }) products: { productId: number; quantity: number; price: number }[],
    @Args('totalPrice', { type: () => Float }) totalPrice: number,
  ) {
    return this.orderService.createOrder(user, seller, products, totalPrice);
  }
}